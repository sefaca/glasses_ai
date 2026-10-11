// Chequeador de indexación: lee los sitemaps commiteados en public/ y consulta
// la URL Inspection API de GSC (cuota 2000/día). Uso (GitHub Actions o local):
//   GSC_SA_KEY='<json service account>' node growth/indexcheck.mjs [--max 1500]
// Salida: growth/snapshots/index-YYYY-MM-DD.md con cobertura y no-indexadas.
import { createSign } from 'node:crypto';
import { writeFileSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const CONFIG = JSON.parse(readFileSync(new URL('./tracker.config.json', import.meta.url), 'utf8'));
const SITE = CONFIG.site;
// OJO: sin --max, indexOf da -1 y argv[0] es la ruta de node (Number → NaN,
// y slice(0, NaN) = lista vacía — el bug de los runs verdes de 23s del 17/18-jul).
const maxIdx = process.argv.indexOf('--max');
const MAX = maxIdx > -1 ? Number(process.argv[maxIdx + 1]) || 1900 : 1900;

const sa = JSON.parse(process.env.GSC_SA_KEY || '{}');
if (!sa.client_email) { console.error('Falta GSC_SA_KEY'); process.exit(1); }

async function token() {
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const unsigned = b64({ alg: 'RS256', typ: 'JWT' }) + '.' + b64({
    iss: sa.client_email, scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
  });
  const s = createSign('RSA-SHA256'); s.update(unsigned);
  const jwt = unsigned + '.' + s.sign(sa.private_key, 'base64url');
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  return (await r.json()).access_token;
}

// Los sitemaps viven commiteados en public/ (el hosting los sirve tal cual):
// se leen del checkout — cero red (el edge bloquea las IPs de GitHub Actions).
function urlsFromRepo() {
  const acc = [];
  const files = readdirSync(CONFIG.sitemapsDir || 'public', { recursive: true })
    .map(String)
    .filter((f) => /sitemap[^\\\/]*\.xml$/i.test(f));
  for (const f of files) {
    const xml = readFileSync(join(CONFIG.sitemapsDir || 'public', f), 'utf8');
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      if (!m[1].endsWith('.xml')) acc.push(m[1]);
    }
  }
  return acc;
}

let tk = await token();
let urls = [...new Set(urlsFromRepo())];
console.log(`URLs en sitemaps del repo: ${urls.length} (node ${process.version}, MAX ${MAX})`);
if (urls.length === 0) {
  console.error('CERO URLs — sitemaps que ve el runner:');
  try {
    console.error(readdirSync(CONFIG.sitemapsDir || 'public', { recursive: true }).map(String).filter((f) => /sitemap/i.test(f)).join('\n') || '(ninguno)');
  } catch (e) { console.error('readdir falló:', e.message); }
  process.exit(1);
}
urls = urls.slice(0, MAX);

const buckets = {};
const detail = [];
for (let i = 0; i < urls.length; i++) {
  const u = urls[i];
  try {
    let r = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tk}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inspectionUrl: u, siteUrl: SITE }),
    });
    if (r.status === 401) {
      // El token OAuth dura 1h y el run puede superarla (18-jul: 466 llamadas
      // en 401 tras ~548 buenas). Renovar y reintentar esta misma URL una vez.
      tk = await token();
      r = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
        method: 'POST',
        headers: { Authorization: `Bearer ${tk}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ inspectionUrl: u, siteUrl: SITE }),
      });
    }
    const j = await r.json();
    const st = j.inspectionResult?.indexStatusResult;
    const key = st?.coverageState || `error ${r.status}`;
    buckets[key] = (buckets[key] || 0) + 1;
    // Indexada = "Submitted and indexed" o "Indexed, not submitted...". El filtro
    // antiguo descartaba tambien "Discovered/Crawled - currently NOT indexed"
    // (bug 22/7: el informe omitia justo las 85 candidatas a solicitud manual).
    const isIndexed = /^(submitted and indexed|indexed)/i.test(key) && !/not indexed/i.test(key);
    if (!isIndexed) detail.push(`- ${u} → ${key}`);
  } catch { buckets['fetch-error'] = (buckets['fetch-error'] || 0) + 1; }
  if (i % 50 === 49) console.log(`  ${i + 1}/${urls.length}`);
  await new Promise((r) => setTimeout(r, 250));
}

const day = new Date().toISOString().slice(0, 10);
mkdirSync('growth/snapshots', { recursive: true });
const lines = [
  `# Cobertura de indexación · ${day}`, '',
  `URLs inspeccionadas: ${urls.length}`, '',
  '| Estado | Páginas |', '|---|---|',
  ...Object.entries(buckets).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`),
  '', '## No indexadas (para priorizar solicitudes manuales)', '', ...detail,
];
writeFileSync(`growth/snapshots/index-${day}.md`, lines.join('\n'));
console.log(`OK → growth/snapshots/index-${day}.md`);
