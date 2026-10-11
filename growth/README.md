# growth/ — rank tracker y vigilancia de competidores

Scripts en Node 18+ **sin dependencias**. Los ejecuta GitHub Actions; también se pueden
correr a mano con `node growth/tracker.mjs`.

| Archivo | Para qué |
|---|---|
| `tracker.mjs` | Posiciones de Search Console + vigilancia de competidores → `snapshots/{fecha}/REPORT.md` |
| `indexcheck.mjs` | Cobertura de indexación de las URLs de los sitemaps (URL Inspection API) |
| `sitemap-submit.mjs` | Reenvía los sitemaps a Search Console para empujar la indexación |
| `tracker.config.json` | Dominio, marca, sitemaps, keywords y competidores |

La configuración **la cura el agente** `growth-seo-expert`: añadir o quitar keywords y
competidores es editar ese JSON. El documento vivo del sistema es
[docs/GROWTH_SEO.md](../docs/GROWTH_SEO.md).

Lanzar el agente: `/growth-seo <tarea>`, o sin texto para que proponga la siguiente acción
de mayor impacto del backlog.

## Conectar Search Console (una sola vez)

Sin esto el tracker funciona igual, pero **solo con la parte de competidores**: la tabla de
posiciones sale vacía.

1. [console.cloud.google.com](https://console.cloud.google.com) → proyecto → «APIs y
   servicios» → habilitar **Google Search Console API**.
2. «Credenciales» → **Cuenta de servicio** → «Claves» → crear clave **JSON**.
3. Search Console → la propiedad → Ajustes → **Usuarios y permisos** → añadir el email de
   la cuenta de servicio con permiso **Completo**. El reenvío de sitemaps lo exige; para
   solo leer bastaría «Restringido».
4. GitHub → repo → Settings → Secrets and variables → Actions → secret **`GSC_SA_KEY`** con
   el contenido íntegro del JSON.

La clave JSON es una credencial: **no se versiona**, no se pega en un chat y no sale del
gestor de secretos.

## Workflows

| Workflow | Cuándo | Qué deja |
|---|---|---|
| `growth-tracker` | Lunes 05:00 UTC, o a mano | `growth/snapshots/{fecha}/REPORT.md`, commiteado |
| `index-check` | A mano | `growth/snapshots/index-{fecha}.md` (cuota ~2.000 URLs/día) |
| `gsc-sitemap-submit` | A mano, tras publicar páginas nuevas | Reenvía los sitemaps de la config |

## Procedencia

Kit exportado de otro proyecto (PadeLock, 2026) y adaptado aquí el 2026-10-11: el documento
vivo se movió a `docs/` para no abrir una cuarta carpeta de documentación, y el agente se
reescribió con las líneas rojas de [CLAUDE.md](../CLAUDE.md) — RULE #1, nada de páginas
programáticas vacías y ninguna marca presentada como partner.
