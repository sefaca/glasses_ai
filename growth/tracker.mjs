#!/usr/bin/env node
/**
 * Growth rank tracker semanal (kit exportable).
 *
 * 1. Posiciones propias: consulta la API de Search Console (si GSC_SA_KEY está
 *    definida) y guarda queries/página/posición de los últimos 7 días útiles.
 * 2. Vigilancia de competidores: descarga las URLs de tracker.config.json,
 *    extrae title/meta/H1/H2/nº palabras + hash, y compara con el snapshot
 *    anterior para detectar cambios de contenido.
 *
 * Salida: growth/snapshots/YYYY-MM-DD/{gsc.json, competitors.json, REPORT.md}
 * Sin dependencias: Node 18+ (fetch y crypto nativos).
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { createHash, createSign } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const CONFIG = JSON.parse(readFileSync(join(ROOT, 'tracker.config.json'), 'utf8'));
const SNAP_ROOT = join(ROOT, 'snapshots');
const TODAY = new Date().toISOString().slice(0, 10);
const OUT_DIR = join(SNAP_ROOT, TODAY);

// ---------- utilidades ----------
const strip = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const pick = (html, re) => {
  const m = html.match(re);
  return m ? strip(m[1]).slice(0, 300) : null;
};

const pickAll = (html, re, max = 8) => {
  const out = [];
  let m;
  while ((m = re.exec(html)) && out.length < max) {
    const t = strip(m[1]).slice(0, 200);
    if (t) out.push(t);
  }
  return out;
};

function previousSnapshotDir() {
  if (!existsSync(SNAP_ROOT)) return null;
  const dirs = readdirSync(SNAP_ROOT)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && d < TODAY)
    .sort();
  return dirs.length ? join(SNAP_ROOT, dirs[dirs.length - 1]) : null;
}

function loadJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

// ---------- 1. competidores ----------
async function fetchCompetitor({ name, url }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
        'Accept-Language': 'es-ES,es;q=0.9',
      },
    });
    const html = res.ok ? await res.text() : '';
    const text = strip(html);
    return {
      name,
      url,
      status: res.status,
      finalUrl: res.url !== url ? res.url : undefined,
      title: pick(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
      metaDescription: pick(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i),
      h1: pickAll(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi, 3),
      h2: pickAll(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi, 12),
      wordCount: text ? text.split(' ').length : 0,
      contentHash: text ? createHash('sha256').update(text).digest('hex').slice(0, 16) : null,
    };
  } catch (e) {
    return { name, url, status: 0, error: String(e.message || e) };
  } finally {
    clearTimeout(timer);
  }
}

function diffCompetitors(current, previous) {
  if (!previous) return [];
  const prevByUrl = new Map(previous.map((c) => [c.url, c]));
  const changes = [];
  for (const c of current) {
    const p = prevByUrl.get(c.url);
    if (!p) {
      changes.push({ url: c.url, name: c.name, change: 'NUEVA URL vigilada' });
      continue;
    }
    if (c.status !== p.status) changes.push({ url: c.url, name: c.name, change: `status ${p.status} → ${c.status}` });
    if (c.title && p.title && c.title !== p.title)
      changes.push({ url: c.url, name: c.name, change: 'TITLE cambiado', before: p.title, after: c.title });
    if (c.contentHash && p.contentHash && c.contentHash !== p.contentHash) {
      const delta = p.wordCount ? Math.round(((c.wordCount - p.wordCount) / p.wordCount) * 100) : 0;
      changes.push({
        url: c.url,
        name: c.name,
        change: `CONTENIDO cambiado (${c.wordCount} palabras, ${delta >= 0 ? '+' : ''}${delta}%)`,
      });
    }
  }
  return changes;
}

// ---------- 2. Search Console ----------
async function gscToken(sa) {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const input = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = createSign('RSA-SHA256').update(input).sign(sa.private_key, 'base64url');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}&assertion=${input}.${signature}`,
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`token: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function fetchGsc() {
  if (!process.env.GSC_SA_KEY) return { skipped: 'GSC_SA_KEY no definida (ver README, paso 4)' };
  let sa;
  try {
    sa = JSON.parse(process.env.GSC_SA_KEY);
  } catch {
    return { error: 'GSC_SA_KEY no es un JSON válido de service account' };
  }
  const token = await gscToken(sa);
  const end = new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10);
  const start = new Date(Date.now() - 10 * 86400000).toISOString().slice(0, 10);
  const errors = [];
  for (const site of CONFIG.gscSites) {
    const res = await fetch(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate: start, endDate: end, dimensions: ['query', 'page'], rowLimit: 2000 }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      return {
        site,
        startDate: start,
        endDate: end,
        rows: (data.rows || []).map((r) => ({
          query: r.keys[0],
          page: r.keys[1],
          clicks: r.clicks,
          impressions: r.impressions,
          position: Math.round(r.position * 10) / 10,
        })),
      };
    }
    errors.push(`${site}: ${data.error?.message || res.status}`);
  }
  return { error: `Ninguna propiedad accesible. ${errors.join(' | ')}` };
}

function keywordReport(gsc, prevGsc) {
  if (!gsc?.rows) return [];
  const all = Object.values(CONFIG.keywords).flat(); // cualquier número de grupos
  const prevRows = prevGsc?.rows || [];
  const best = (rows, kw) => {
    const hit = rows
      .filter((r) => r.query === kw || r.query.includes(kw))
      .sort((a, b) => b.impressions - a.impressions)[0];
    return hit || null;
  };
  return all.map((kw) => {
    const now = best(gsc.rows, kw);
    const before = best(prevRows, kw);
    return {
      keyword: kw,
      position: now?.position ?? null,
      prevPosition: before?.position ?? null,
      clicks: now?.clicks ?? 0,
      impressions: now?.impressions ?? 0,
      page: now?.page ?? null,
    };
  });
}

// ---------- 3. informe ----------
function buildReport({ gsc, keywords, competitors, changes, prevDir }) {
  const L = [];
  L.push(`# Snapshot growth · ${TODAY}`, '');
  L.push(`Comparado con: ${prevDir ? prevDir.split(/[\\/]/).pop() : 'ninguno (primer snapshot)'}`, '');

  L.push('## Posiciones propias (GSC)', '');
  if (gsc?.rows) {
    L.push(`Propiedad: \`${gsc.site}\` · ventana ${gsc.startDate} → ${gsc.endDate} · ${gsc.rows.length} filas`, '');
    L.push('| Keyword objetivo | Posición | Anterior | Clicks | Impresiones |');
    L.push('|---|---|---|---|---|');
    for (const k of keywords) {
      const pos = k.position === null ? 'sin datos' : k.position;
      const prev = k.prevPosition === null ? '—' : k.prevPosition;
      L.push(`| ${k.keyword} | ${pos} | ${prev} | ${k.clicks} | ${k.impressions} |`);
    }
    L.push('');
    const top = gsc.rows.filter((r) => !new RegExp(CONFIG.brandRegex || '^$', 'i').test(r.query)).sort((a, b) => b.impressions - a.impressions).slice(0, 15);
    if (top.length) {
      L.push('Top queries no-marca por impresiones:', '');
      L.push('| Query | Página | Posición | Impresiones |', '|---|---|---|---|');
      for (const r of top) L.push(`| ${r.query} | ${r.page.replace(CONFIG.siteUrl || '', '')} | ${r.position} | ${r.impressions} |`);
      L.push('');
    }
  } else {
    L.push(`_${gsc?.skipped || gsc?.error || 'sin datos'}_`, '');
  }

  L.push('## Competidores vigilados', '');
  L.push('| Competidor | Status | Palabras | Title |', '|---|---|---|---|');
  for (const c of competitors) L.push(`| ${c.name} | ${c.status} | ${c.wordCount ?? '—'} | ${c.title ?? c.error ?? '—'} |`);
  L.push('');

  L.push('## Cambios detectados desde el último snapshot', '');
  if (!changes.length) L.push(prevDir ? '_Sin cambios relevantes._' : '_Primer snapshot: nada que comparar._');
  for (const ch of changes) {
    L.push(`- **${ch.name}** (${ch.url}): ${ch.change}`);
    if (ch.before) L.push(`  - antes: ${ch.before}`);
    if (ch.after) L.push(`  - ahora: ${ch.after}`);
  }
  L.push('');
  L.push('---');
  L.push('_Generado por growth/tracker.mjs. Análisis y acciones: lanzar `/growth-seo` con este informe._');
  return L.join('\n');
}

// ---------- main ----------
const prevDir = previousSnapshotDir();
const prevCompetitors = prevDir ? loadJson(join(prevDir, 'competitors.json')) : null;
const prevGsc = prevDir ? loadJson(join(prevDir, 'gsc.json')) : null;

const competitors = [];
for (const c of CONFIG.competitors) {
  competitors.push(await fetchCompetitor(c));
  console.log(`[competidor] ${c.name}: ${competitors[competitors.length - 1].status}`);
}
const changes = diffCompetitors(competitors, prevCompetitors);

const gsc = await fetchGsc().catch((e) => ({ error: String(e.message || e) }));
console.log(`[gsc] ${gsc.rows ? `${gsc.rows.length} filas (${gsc.site})` : gsc.skipped || gsc.error}`);
const keywords = keywordReport(gsc, prevGsc);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'competitors.json'), JSON.stringify(competitors, null, 2));
writeFileSync(join(OUT_DIR, 'gsc.json'), JSON.stringify(gsc, null, 2));
writeFileSync(join(OUT_DIR, 'REPORT.md'), buildReport({ gsc, keywords, competitors, changes, prevDir }));
console.log(`[ok] snapshot escrito en growth/snapshots/${TODAY}/`);
