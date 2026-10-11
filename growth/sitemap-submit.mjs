// Reenvía los sitemaps a Google Search Console (Sitemaps API) para empujar la
// cola de indexación (p. ej. tras publicar una ola de páginas nuevas).
// Uso (GitHub Actions o local): GSC_SA_KEY='<json service account>' node growth/sitemap-submit.mjs
// Requiere que la service account tenga permiso COMPLETO (no restringido) en la
// propiedad — si devuelve 403, reenviar a mano desde la UI de GSC.
import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';

const CONFIG = JSON.parse(readFileSync(new URL('./tracker.config.json', import.meta.url), 'utf8'));
const SITE = CONFIG.site;
const SITEMAPS = CONFIG.sitemaps;

const sa = JSON.parse(process.env.GSC_SA_KEY || '{}');
if (!sa.client_email) { console.error('Falta GSC_SA_KEY'); process.exit(1); }

async function token() {
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const unsigned = b64({ alg: 'RS256', typ: 'JWT' }) + '.' + b64({
    iss: sa.client_email, scope: 'https://www.googleapis.com/auth/webmasters',
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

const tk = await token();
let fallos = 0;
for (const sm of SITEMAPS) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/sitemaps/${encodeURIComponent(sm)}`;
  const r = await fetch(url, { method: 'PUT', headers: { Authorization: `Bearer ${tk}` } });
  console.log(`${r.status === 204 || r.ok ? 'OK ' : 'FALLO'} ${r.status} ← ${sm}`);
  if (!r.ok && r.status !== 204) { fallos++; console.log('  ' + (await r.text()).slice(0, 300)); }
}
process.exit(fallos ? 1 : 0);
