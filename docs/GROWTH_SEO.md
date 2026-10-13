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
- **Dominio**: `lookfit.app`, **en el aire** `[X]` verificado 2026-10-13 sobre el dominio
  real: certificado emitido, apex 307 → `/es`, y los cinco idiomas sirviendo su `<html
  lang>` y su H1 traducidos. A `@` → `216.198.79.1`; sin registro en `www` (se borró el
  CNAME de la parking page, que bajo la precarga HSTS de `.app` habría dado error de
  certificado) → [D-024](DECISION_LOG.md#d-024).
- **Cómo se publica**: push a `main` → build automático en Vercel. `prebuild` descarga los
  activos de MediaPipe (~41 MB), por eso `public/mediapipe/` no está en git.
- **Idiomas**: cinco, con prefijo de ruta — `/es`, `/en`, `/it`, `/pt`, `/de`; la raíz
  redirige 307 a `/es`. `hreflang` recíproco en las cinco y `x-default` → `/en`
  → [D-026](DECISION_LOG.md#d-026). **Ninguna traducción la ha revisado una persona
  nativa**, y eso es un bloqueante de G0, no un detalle.
- **Sitemaps / robots.txt**: ya existen (`app/sitemap.ts`, `app/robots.ts`), pero
  `robots.txt` **prohíbe todo** y las páginas siguen en `noindex, nofollow`, en
  coherencia. El SEO está a cero **por decisión, no por accidente**. `llms.txt` pendiente.
- **Search Console**: propiedad **sin crear** y cuenta de servicio pendiente. Pasos en
  [growth/README.md](../growth/README.md). Sin el secret `GSC_SA_KEY`, el tracker corre
  igual pero solo con la parte de competidores.

## 3. Keywords objetivo

Pendiente de la primera ronda de research. Lo que hay hasta ahora es **Google Trends, que
no es volumen de búsqueda** — §23 Paso 1 lo prohíbe expresamente como sustituto.

Cinco grupos en ES, ya cargados en [tracker.config.json](../growth/tracker.config.json).
**Volumen `[?]` en todos** hasta la ronda 1 de Keyword Planner: lo que hay es criterio, no
datos.

| Grupo | Keywords | Intención | Encaje negocio |
|---|---|---|---|
| `es_forma` | wayfarer · aviador · redondas · cuadradas · rectangulares | Comparar | **Alto** — es el cluster B de §18.2 y donde el catálogo da para escribir |
| `es_modelo_talla` | rb3025 · rb2140 · rb2132 · rb3016 · tallas · aviator o wayfarer | Transaccional | **Alto** — long-tail de entidad, la señal temprana |
| `es_probador` | probar gafas online · probador (virtual) de gafas · simulador | Transaccional | **Alto**, pero la SERP la ocupan proveedores B2B `[T]` |
| `es_cara` | cara redonda · cara cuadrada · qué gafas me favorecen | Informacional | **Medio** — §1.2 ya avisó de que es más débil de lo que parece |
| `es_medidas` | números de las gafas · medidas · ancho · talla | Informacional | **Medio** — barata de ganar y buena para citas en buscadores de IA |

Los cuatro idiomas restantes están en `keywordsPlanned`, que el script ignora: sus grupos se
mueven a `keywords` el día que el idioma abra.

Criterio de prioridad: **volumen × encaje con el cliente ideal**. Una keyword de alto
volumen y mal encaje vale menos que una de volumen medio que coincide con quien compra.

## 4. Registro de acciones (append-only, más reciente arriba)

| Fecha | Acción | Resultado / siguiente paso |
|---|---|---|
| 2026-10-13 | **Primeras tres guías implementadas en español** (`/es/guias/tallas-ray-ban`, `.../ray-ban-wayfarer-vs-new-wayfarer`, `.../probar-gafas-online`) más su índice, con `Article` + `BreadcrumbList` + `FAQPage` desde un único array, canonical propio y **sin `hreflang`**: existen solo en español. Arreglado el fallo que señaló el agente: `sitemap.ts` emitía toda ruta en los cinco idiomas y ahora cada una declara en cuáles existe. **Corrección de hechos antes de publicar**: el contenido entregado describía un «esquema a escala sobre tu foto» que **ya no existe** —`computeFrameOverlay` se eliminó— y se reescribió por lo que el producto hace hoy | Siguen en `noindex`. Pendiente del fundador: verificar la tabla de tallas en la ficha oficial, decidir la firma, y las 17 monturas sin medidas que bloquean las páginas de forma |
| 2026-10-13 | **Web publicada en los cinco idiomas** (es · en · it · pt · de): rutas con prefijo, `hreflang` recíproco con `x-default` → `/en`, canonical por idioma, `sitemap.xml` y `robots.txt`, selector de idioma sin redirección automática, y un test que falla si una clave se queda sin traducir. Decisión del fundador **contra la recomendación de abrir uno solo** → [D-026](DECISION_LOG.md#d-026) | El `noindex` sigue puesto: la web está en cinco idiomas, pero **no es indexable** hasta G0. Pendiente: revisor nativo por idioma, contenido real y retailer de destino por mercado |
| 2026-10-11 | **Plan de posicionamiento multilingüe trazado** (pendiente de ratificar). Diagnóstico `[X]`: `lookfit.app` sin registro A en el servidor autoritativo y `www` NXDOMAIN; `robots.txt` y `sitemap.xml` 404; `noindex` global; VisuTry cubre 9 idiomas **sin italiano**, ~109 URLs por idioma y localización superficial (H1 en inglés). Propuesta: publicar **solo ES**, fontanería i18n para los cinco, segundo idioma por gate G1. `tracker.config.json` aplicado | Siguiente: crear A `@` y CNAME `www`; crear `sc-domain:lookfit.app`; ronda 1 de Keyword Planner en ES; decidir quién firma las guías y quién revisa italiano |
| 2026-10-11 | Sistema de growth instalado (agente `growth-seo-expert` + tracker semanal + workflows) | Nada que medir todavía: sin dominio resuelto, sin Search Console y con el sitio en `noindex` |

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
- `[X] 2026-10-13` **El contenido se escribe sobre el producto que existe, no sobre el del plan.** Las tres guías entregadas describían una previsualización a escala sobre la foto; esa función se había eliminado semanas antes a petición del fundador y lo que queda es una lectura de anchura en palabras. Nadie lo habría notado leyendo el texto: era coherente y estaba bien escrito. **Antes de publicar una página que describe el producto, hay que abrir el código y comprobar qué hace hoy.** Prometer una función que no existe es la misma clase de error que RULE #1 persigue, solo que en la dirección contraria.
- `[T] 2026-10-13` **Un mismo calibre no es una misma talla.** Cruzando seis referencias Ray-Ban con puente y varilla, la talla 55 va de un índice de anchura de 124 (Aviator) a 131 (Clubmaster), porque el puente va de 14 a 21 mm. Es lo único propio que sostiene la guía de tallas: si una medida cambia, hay que recalcular el índice.
- `[T] 2026-10-13` **Antes de llamar «conflicto» a un dato, comprobar si son tallas distintas.** La nota del catálogo sobre la RB2132 («52/55 frente a 58») no era un desacuerdo entre fuentes: las tres tallas existen.
- `[X] 2026-10-13` **El cuello de botella del contenido son los datos, no la infraestructura.** Solo 6 de 23 monturas tienen medidas, y las seis son Ray-Ban, así que hoy lo único escribible es de Ray-Ban. Regla de corte adoptada: una categoría con menos de tres monturas con medidas verificadas no merece página.
- `[X] 2026-10-12` **VisuTry bloquea a GitHub Actions, y eso deja ciego el tripwire.** El
  primer snapshot devolvió **403 en sus ocho URLs**, incluida `visutry.com/it`, que desde un
  navegador normal da 404. Es bloqueo por rango de datacenter: desde una IP doméstica
  responden. Consecuencia práctica: **el tripwire de Italia no sirve tal cual** — un 403 no
  distingue «sigue sin existir» de «ya existe». Hay que comprobar `/it` a mano cada semana
  hasta resolverlo, o el día que entren en Italia nos enteraremos tarde. Chilli Beans y
  Warby Parker hacen lo mismo. Lección general: **un competidor que no se deja rastrear no
  es un competidor sin cambios**, y un informe lleno de 403 se lee como calma cuando es
  ceguera.
- `[X] 2026-10-11` **«Sin propagar» puede ser «sin registro».** Antes de esperar a la
  propagación, preguntar al **servidor autoritativo**:
  `nslookup -type=A lookfit.app dns1.registrar-servers.com`. Para `lookfit.app` no había ni
  A ni `www`: no había nada que propagar, había que crearlos.
- `[X] 2026-10-11` **VisuTry no está en italiano y su localización es superficial.** Nueve
  idiomas en su sitemap (en, id, ar, ru, de, ja, es, pt, fr), `/it` → 404, ~109 URLs por
  idioma — pero el H1 de `/es/try-on/glasses` sigue en inglés y `/es/brand/oakley` titula
  «Oakley Virtual Try-On Guide». La SERP de «probar gafas online» en ES, IT, DE y PT la
  ocupan proveedores B2B y herramientas genéricas, no contenido de consumidor `[T]`. La
  diferenciación real por idioma es **localizar de verdad, no traducir**.
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

Gates propuestos **antes** de ver datos, para no acomodarlos al resultado. Son hipótesis, no
verdades. Lectura de cualquiera: nunca por debajo de 10 impresiones por query.

| ID | Hipótesis | Métrica | Abandono |
|---|---|---|---|
| E-01 | Las páginas de forma con datos y diagramas propios (wayfarer, aviador, redondas, cuadradas) se indexan en ≤6 semanas | % de URLs indexadas (`index-check`) y queries con ≥10 impresiones | <50 % indexadas a las 16 semanas desde G0, o cero queries con ≥10 impresiones |
| E-02 | Las fichas de talla (RB3025, RB2140 vs RB2132) son la señal temprana de long-tail | Impresiones por tallo (`rb3025`, `rb2132`) | Sin impresiones a las 10 semanas |
| E-03 | Las guías de cara redonda y cuadrada hacen hueco frente a VisuTry porque la SERP ES es débil | Impresiones y posición en «gafas de sol cara redonda» | Ninguna página >10 impresiones a las 12 semanas |
| E-04 | `/guias/probar-gafas-online` captura el cluster E **sin prometer fidelidad** | Impresiones en «probador» / «probar gafas online» | Sin impresiones a las 12 semanas |
| E-05 | La previsualización gratuita convierte tráfico orgánico | `preview_completed` por sesión orgánica, 4 semanas | <20 en 4 semanas con tráfico suficiente: revisar el CTA antes de abrir idiomas |
| E-06 | El segundo idioma se elige por datos (IT por defecto, EN si gana el desempate) | Tramo de volumen de anclas · `serp_owners` débiles · revisor con nombre | Sin revisor, no abre |
| E-07 | LATAM es una variante léxica, no un idioma nuevo (`es-mx`) | % de impresiones ES desde MX, AR, CO, CL | <25 % durante 4 semanas: no se abre |
| E-08 | GEO: las páginas de medidas y de mecanismo se citan en buscadores de IA | Auditoría mensual, 10 preguntas reales en ES, cita sí/no por fuente | Sin citas tras 3 auditorías: revisar formato, no abandonar |
| E-09 | pt-BR como apuesta tardía y contraestacional | Impresiones desde BR | Solo si G2 se cumple |

### Oportunidades descartadas, para que conste que se valoraron

- **«Probar Ray-Ban / Oakley / Persol online»** — las keywords de más intención del nicho.
  Exigen presentar una generación como ese modelo y `GENERATIVE_FIDELITY_VERIFIED = false`.
  Reabre solo tras GT-1 ≥70 %. Mientras tanto se atacan con «previsualiza el tamaño sobre tu
  cara», que es lo que sí hacemos.
- **«Poner gafas a una foto con IA»** (Fotor, insMind, Dreamina) — volumen de
  entretenimiento. Choca con la regla 19: no somos un generador de imágenes genérico.
- **Páginas «modelo × forma de cara × género»** al estilo VisuTry, ~109 por idioma.
  Prohibidas por §0 y por la política de contenido escalado de Google `[D]`.
- **Keywords de precio, outlet o «comprar Ray-Ban barato»** — no vendemos, y
  [D-019](DECISION_LOG.md#d-019) prohíbe precios.
- **Logotipos o lenguaje de «tienda oficial»** — sin acuerdo no hay partner
  → [D-021](DECISION_LOG.md#d-021).

## 8. Baseline (antes de empezar)

**Cero, y conviene que quede escrito.** A 2026-10-13: el dominio **no resuelve** (no hay
registro A), no hay propiedad de Search Console, y aunque ya existen sitemap, robots y
cinco idiomas, **ni una sola página es indexable** y no hay contenido más allá de la
interfaz. Cualquier número futuro se mide contra este cero.

## 9. Métricas norte

- Posición media del grupo de keywords principal — meta pendiente de fijar con el baseline.
- **Try-ons completados/semana desde orgánico** — es la conversión, no las sesiones
  ([CLAUDE.md §32 Experimento F](../CLAUDE.md): no optimizar solamente sesiones).
- Clics salientes al retailer por try-on completado.
- Citas en buscadores de IA — revisar mensualmente.
