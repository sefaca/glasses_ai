# GROWTH_SEO — lookfit.app

> **Documento VIVO y auto-alimentado.** Es la memoria del sistema de growth: posicionamiento
> SEO/GEO y captación. **Regla**: cada acción de growth (cambio SEO, contenido nuevo,
> experimento, dato de Search Console…) añade una línea al §4, y cada aprendizaje validado
> baja al §5. Si no está aquí, no existe. Lo mantiene el agente `growth-seo-expert`.
>
> Relación con el resto: [CLAUDE.md](../CLAUDE.md) manda sobre todo lo de aquí.
> [PROJECT_STATE.md](PROJECT_STATE.md) dice qué está construido;
> [DECISION_LOG.md](DECISION_LOG.md), por qué. Este documento es **solo el canal de
> adquisición**.

---

## 1. Objetivo y estrategia

**Objetivo**: capturar la intención de compra que ya existe alrededor de *gafas de sol* —
categoría, forma y marca— y convertirla en try-ons completados y clics salientes al
retailer. No perseguir «qué gafas me quedan bien»: [CLAUDE.md §1.2](../CLAUDE.md) ya
estableció que esa long-tail es mucho más débil de lo que parecía.

**Ciclo de negocio**: búsqueda de categoría/forma/marca → landing SEO → subir foto →
recomendación → try-on → clic saliente → comisión de afiliado. La monetización está
**bloqueada** (GA-3, [D-016](DECISION_LOG.md#d-016)), así que de momento la métrica que
cuenta es el try-on completado, no el ingreso.

**Ventaja competitiva a demostrar**: comparación **multi-marca** sobre la misma cara. Es la
hipótesis H-M2 y no tiene todavía ni un dato. Si falla, el SEO solo trae tráfico a una
interfaz bonita sobre una decisión ya tomada.

**Restricciones (líneas rojas)**: RULE #1 ([CLAUDE.md §0](../CLAUDE.md)); nada de páginas
programáticas vacías; ninguna marca es partner sin acuerdo firmado; ni una cifra inventada
sin nivel de evidencia; nada de contenido facial en material de marketing; no somos B2B.

## 2. Arquitectura técnica

- **Hosting real**: Vercel. Proyecto `lookfit`, producción en `lookfit-brown.vercel.app`
  `[X]` verificado 2026-10-11 (200, ~0,6 s).
- **Dominio**: `lookfit.app` (Namecheap, registro A → Vercel). **DNS sin propagar** a fecha
  de hoy. Todo el TLD `.app` está en precarga HSTS → sin certificado el dominio no carga
  → [D-024](DECISION_LOG.md#d-024).
- **Cómo se publica**: push a `main` → build automático en Vercel. `prebuild` descarga los
  activos de MediaPipe (~41 MB), por eso `public/mediapipe/` no está en git.
- **Sitemaps / robots.txt / llms.txt**: **no existen todavía.** El sitio entero está en
  `noindex, nofollow` `[X]` verificado 2026-10-11, que es lo correcto mientras no haya
  contenido, pero significa que **el SEO está a cero por decisión, no por accidente**.
- **Search Console**: propiedad **sin crear** y cuenta de servicio pendiente. Pasos en
  [growth/README.md](../growth/README.md). Sin el secret `GSC_SA_KEY`, el tracker corre
  igual pero solo con la parte de competidores.

## 3. Keywords objetivo

Pendiente de la primera ronda de research. Lo que hay hasta ahora es **Google Trends, que
no es volumen de búsqueda** — §23 Paso 1 lo prohíbe expresamente como sustituto.

| Grupo | Keywords | Intención | Encaje negocio |
|---|---|---|---|
| — | pendiente de GK-1 | — | — |

Criterio de prioridad: **volumen × encaje con el cliente ideal**. Una keyword de alto
volumen y mal encaje vale menos que una de volumen medio que coincide con quien compra.

## 4. Registro de acciones (append-only, más reciente arriba)

| Fecha | Acción | Resultado / siguiente paso |
|---|---|---|
| 2026-10-11 | Sistema de growth instalado (agente `growth-seo-expert` + tracker semanal + workflows) | Nada que medir todavía: sin dominio propagado, sin Search Console y con el sitio en `noindex` |

## 5. Aprendizajes validados

Los seis primeros vienen de otro proyecto (PadeLock, 2026) y **no están validados aquí**.
Se marcan como heredados hasta que los confirme un dato nuestro.

- `[heredado]` **Un push no garantiza producción.** Tras cada cambio SEO, comprueba la
  página publicada (curl del título, robots.txt, sitemap) antes de tocar Search Console. Un
  200 puede ser el catch-all de una SPA.
- `[heredado]` **Diagnostica el hosting por cabeceras**, no por lo que crees que hay.
- `[heredado]` **Long tail primero.** Las páginas de entidad concreta rankean semanas antes
  que las de categoría. Son la señal temprana de que la siembra funciona.
- `[heredado]` **Volumen bajo = ruido.** No reaccionar por debajo de ~10 impresiones.
- `[heredado]` **No dupliques páginas.** Si existe y no rankea, el problema es autoridad:
  enlazado interno desde las páginas que ya rankean.
- `[heredado]` **Gatillos explícitos con la competencia.** Decide de antemano qué movimiento
  del rival justifica reaccionar; el churn de ±1-2 % no lo es.
- `[X] 2026-10-11` **El `.com` internacional de este nicho está agotado.** ~190 dominios
  comprobados por RDAP, cero libres con raíz inglesa → [D-024](DECISION_LOG.md#d-024). Afecta
  al SEO de marca: la búsqueda «lookfit» competirá con lo que haya en `lookfit.com`.
- `[X] 2026-10-11` **Verificar disponibilidad por RDAP, nunca por DNS.** Hay resolvers que
  secuestran NXDOMAIN, y RDAP puede devolver 200 con cuerpo vacío al limitar peticiones:
  hay que comprobar que venga `ldhName`. Dos informes míos de «0 libres» fueron falsos por
  esto → [D-023](DECISION_LOG.md#d-023).

## 6. Playbooks (recetas)

### Análisis semanal (lunes)
1. El workflow genera `growth/snapshots/{fecha}/REPORT.md` a primera hora.
2. `/growth-seo haz el análisis semanal de los lunes`.
3. Aplicar lo aprobado y registrarlo en §4.

### Revisión frente a competidores
`/growth-seo revisión semanal frente a los competidores` (usa la sección de competidores del
último snapshot y la compara con las anteriores).

### Empujar la indexación tras publicar páginas nuevas
Actions → `gsc-sitemap-submit` → Run workflow (reenvía los sitemaps de la config).

### Comprobar cobertura de indexación
Actions → `index-check` (URL Inspection API, cuota ~2.000/día) → `growth/snapshots/index-{fecha}.md`.

## 7. Backlog de experimentos (priorizado)

Pendiente del plan que trace el agente.

## 8. Baseline (antes de empezar)

**Cero, y conviene que quede escrito.** A 2026-10-11: sin dominio propagado, sin propiedad
de Search Console, sin sitemap, sin una sola página indexable y sin contenido. Cualquier
número futuro se mide contra este cero.

## 9. Métricas norte

- Posición media del grupo de keywords principal — meta pendiente de fijar con el baseline.
- **Try-ons completados/semana desde orgánico** — es la conversión, no las sesiones
  ([CLAUDE.md §32 Experimento F](../CLAUDE.md): no optimizar solamente sesiones).
- Clics salientes al retailer por try-on completado.
- Citas en buscadores de IA — revisar mensualmente.
