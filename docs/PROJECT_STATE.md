# Project State

> **Estado vivo del proyecto. No es un diario.** Representa exclusivamente dónde estamos **ahora**.
>
> **Regla de actualización:** se toca únicamente cuando hay **evidencia nueva** o una **decisión real** que cambia el estado. No se apuntan intenciones, ideas ni conversaciones. Si algo cambia aquí, tiene que existir la entrada correspondiente en [DECISION_LOG.md](DECISION_LOG.md).

Las tres capas de documentación, y no deben mezclarse:

| Documento | Responde |
|---|---|
| [CLAUDE.md](../CLAUDE.md) | **Cómo** debe trabajar el agente |
| **PROJECT_STATE.md** (este) | **Dónde** estamos ahora |
| [DECISION_LOG.md](DECISION_LOG.md) | **Qué** decidimos y con qué evidencia |
| [research/](../research/) | **Por qué** hemos llegado hasta aquí |

Niveles de evidencia en todo el repo: **[D]** documentación oficial · **[M]** marketing del proveedor · **[T]** tercero · **[?]** no publicado · **[X]** medido por nosotros.

---

## Current Thesis

Interceptar la intención de compra que **ya existe** aguas arriba (gafas de sol, formas, marcas) y añadirle una capa de personalización:

```
DESCUBRIR → RECOMENDAR → PROBAR → COMPARAR → COMPRAR
```

El try-on es **una pieza**, no el producto. El producto candidato es la **lista corta de recomendaciones**: reducir el espacio de decisión de alguien que no sabe qué gafas comprar.

La tesis explícitamente descartada: «existe gran demanda de gente buscando qué gafas le quedan bien» → [D-008](DECISION_LOG.md#d-008).

## Current Product

**En construcción desde el 2026-10-08** → [D-017](DECISION_LOG.md#d-017). Se construye todo **excepto** lo que depende de un gate sin resolver.

Flujo que define el producto: foto → análisis → 6 recomendaciones explicadas → try-on → comparar → click al retailer.

| Pieza | Estado |
|---|---|
| Esqueleto Next.js 16 + React 19 + Tailwind 4 + TS estricto | **HECHO** |
| Design system con paleta investigada y contrastes AA verificados | **HECHO** → [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) |
| Landing mobile-first `/` | **HECHO** |
| Base de i18n `es` + `en`, textos fuera de componentes | **HECHO** |
| `FaceProfile` + clasificación de forma por pertenencia difusa | **HECHO** |
| `ScoringEngine` determinista con pesos en configuración | **HECHO** |
| Explicaciones por plantilla, sin afirmar medidas | **HECHO** |
| Catálogo con derechos en el tipo + 17 monturas sintéticas propias | **HECHO** |
| `TryOnProvider` + `MockTryOnProvider` | **HECHO** |
| Selector `/probar` con las 6 recomendaciones en perfil neutro | **HECHO** |
| Páginas legales honestas, sin texto de plantilla | **HECHO** |
| 39 tests · build, typecheck y lint en verde | **HECHO** |
| Upload + quality check + landmarks reales (MediaPipe) | pendiente |
| Comparación 2–4 resultados | pendiente |
| Analítica del embudo y outbound clicks | pendiente |
| Supabase, rate limiting, deploy | pendiente |
| **Proveedor real de try-on** | **bloqueado** — [D-016](DECISION_LOG.md#d-016) |
| **Imágenes y marcas de terceros** | **bloqueado** — GA-1, [D-015](DECISION_LOG.md#d-015) |
| **URLs de afiliado** | **bloqueado** — GA-3 |

Restricciones en vigor: B2C, web-first, multi-marca, sin app nativa, sin B2B, sin suscripción obligatoria → [D-001](DECISION_LOG.md#d-001). Gafas de sol primero → [D-003](DECISION_LOG.md#d-003).

## Current Market Hypotheses

| | Hipótesis | Estado | La resuelve |
|---|---|---|---|
| **H-M1** | La demanda está en categoría/forma/marca, no en face-shape | VALIDATING | GK-1 · [keyword-research](../research/market/keyword-research.md) |
| **H-M2** | **Multi-marca + recomendación + comparación** da una razón para no ir directo a Ray-Ban | **SIN CONTRASTAR** | GP-1…GP-4 · [multi-brand-test](../research/b1-tryon-benchmark/multi-brand-test.md) |
| **H-M3** | España primero por idioma y coste de localización | SIN CONTRASTAR | B5 |

**H-M2 es la hipótesis que sostiene el proyecto entero** y la que no tiene ni un dato. Si falla, somos una interfaz bonita sobre una decisión ya tomada.

## Current Technology Hypotheses

Dos tecnologías con **riesgos opuestos**, no varios proveedores de lo mismo:

| | Clase A — 3D/AR | Clase B — generativo |
|---|---|---|
| La montura es | Modelo 3D real | Píxeles dibujados desde una referencia |
| Fidelidad | Por construcción | **Probabilística — todo el riesgo** |
| Coste | Suscripción con topes | Por generación |
| Barata cuando | Hay volumen | Hay poco volumen |
| Riesgo principal | **Licencia** | **Fidelidad** |

- **H-T1** · La fidelidad de montura es medible y hay al menos una tecnología que la alcanza → GT-1 (test ciego ≥70 %). **SIN CONTRASTAR.**
- **H-T2** · Los landmarks faciales pueden calcularse en el navegador y la foto solo sale para el try-on → [D-007](DECISION_LOG.md#d-007). Decisión de arquitectura, **no conclusión jurídica**.
- **H-T3** · El cuello de botella de la ruta autoconstruida no es el tracking (MediaPipe, resuelto y gratis) sino **tener un 3D fiel por montura**. SIN CONTRASTAR (Track C).

## Current Business Model

Principal: **afiliación**. Secundario: **créditos/micropagos**, que sirven además como control de coste y de abuso. Sin suscripción obligatoria.

Estado: **sin comisión ni ticket medio verificados.** Un programa localizado (Hawkers en Awin ES [T], sin reverificar) y **una pieza resuelta en contra**: los términos estándar no autorizan el try-on generativo sobre la imagen oficial → [D-015](DECISION_LOG.md#d-015). Gates en [affiliate-programs §5.5](../research/monetization/affiliate-programs.md).

## Current Acquisition Hypotheses

- **H-A1** · SEO es canal de **medio plazo**, no de lanzamiento. Un dominio nuevo no rankea por «gafas de sol». SIN CONTRASTAR.
- **H-A2** · El canal inicial puede ser social/vídeo (TikTok, Reels, Shorts, Pinterest) por la ventaja visual del antes/después. **SIN CONTRASTAR y sin coste conocido.**

Nada de esto se ha probado. No hay CAC, ni un vídeo publicado, ni una cuenta abierta.

## Current Monetization Hypotheses

- **H-B1** · La contribución por usuario activo puede ser positiva **sin** suscripción. SIN CONTRASTAR → GE-3.
- **H-B2** · El coste de IA por usuario activo puede mantenerse ≤0,10 € al volumen del mes 1–3 → GC-5 / GE-1.
- **H-B3** · Un sitio nuevo sin tráfico será aceptado en algún programa de afiliación → GA-3. **Si falla, los créditos pasan de secundarios a únicos.**

Asimetría que hay que asumir: **el coste se conoce antes de lanzar; el ingreso solo después.** `p_buy` (compra tras click) no la publica nadie de forma fiable. → [unit-economics](../research/monetization/unit-economics.md).

## Validated

Solo hechos documentales. **Del producto y del negocio, nada.**

- **[D]** Precios oficiales por imagen de los modelos generativos, a 2026-09-25: Qwen 0,018 € · Gemini 3.1 Flash Lite 0,029 € · FLUX.1 Kontext pro 0,034 € · Gemini 3.1 Flash 0,057 € · Gemini 3 Pro 0,114 €.
- **[D]** Fittingbox soporta try-on **por foto subida** y por cámara, y procesa la imagen **en el navegador**.
- **[D]** Jeeliz publica Starter 299 $/mes y Advanced 499 $/mes; su mes gratuito es «para marcas establecidas».
- **[D]** Banuba **no prohíbe** mostrar marcas de terceros: traslada la responsabilidad por contrato.
- **[D]** Las condiciones comerciales de Fittingbox y Jeeliz **no son públicas**. Eso ya es información: el bloque comercial no se resuelve leyendo webs.
- **[D]** **Los términos estándar de afiliación prohíben el try-on generativo sobre la imagen oficial.** Awin cl. 10.1 licencia publicar «without modification» y cl. 9.2.10/9.2.11 exige reproducción «accurately and faithfully», con indemnidad del publisher en 9.3. Amazon §6(a) prohíbe alterar Program Content salvo redimensionar, y §3 cede a Amazon cualquier modificación que hagamos → [D-015](DECISION_LOG.md#d-015), [affiliate-programs §5.1](../research/monetization/affiliate-programs.md).
- **[T]** **Hawkers tiene programa de afiliación activo en Awin España** (anunciante 19686), con feed de productos multiidioma y generador de enlaces a modelos concretos. Fuente de 2020–21: comisión y catálogo **sin reverificar**.

## Invalidated

- **La Clase A es peor en privacidad.** Es al revés: procesa en el navegador, mientras la Clase B exige enviar la cara a un servidor de terceros → [D-013](DECISION_LOG.md#d-013).
- **Los precios de las apps de Shopify (39–199 $/mes) son los precios directos de Clase A.** No lo son → [D-006](DECISION_LOG.md#d-006).
- **La demanda está en las long-tail de face-shape.** Google Trends [T] apunta a que no, pero es **indicativo, no concluyente**: Trends no mide volumen absoluto → [D-008](DECISION_LOG.md#d-008).
- **La Clase B generativa es «libre: sin licencia de por medio».** Falso, y el error estaba escrito en `providers.md §6`. El riesgo de licencia es **de la Clase B**, no de la Clase A: la generativa modifica la imagen del anunciante; la 3D muestra un modelo licenciado por el proveedor y solo toca al anunciante con el enlace → [D-016](DECISION_LOG.md#d-016).

## Open Questions

1. **¿Puede representarse una montura real e identificable?** GT-1. Sin esto no hay nada.
2. **¿Nos deja alguna licencia montar un agregador multi-marca afiliado?** GC-1…GC-3, y sobre todo **¿quién responde si una marca reclama?** GC-4, ampliado con **¿de dónde salen los derechos de las monturas de la base del proveedor?**
3. ~~¿El try-on es una obra derivada de la imagen oficial?~~ **RESPONDIDO el 2026-10-08: sí, y los términos estándar lo prohíben** → [D-015](DECISION_LOG.md#d-015). Lo que sigue abierto es si **algún anunciante lo autoriza por excepción escrita** (GA-2).
3b. **¿Se reordena B1 a favor de la Clase A?** Decisión pendiente del fundador → [D-016](DECISION_LOG.md#d-016). Invierte D-004 en su tramo técnico.
4. **¿Hay razón real para usar nuestro agregador en vez de ir a la marca?** GP-1. H-M2.
5. **¿Aprueban los programas de afiliación un sitio sin tráfico?** GA-3.
6. **¿Existe un cluster de keywords abordable en ES?** GK-1.
7. **¿Hay un retailer español multimarca que ya ocupe este espacio?** La fila vacía de [competitors §2](../research/market/competitors.md).

## Active Experiments

**Ninguno en ejecución.** Construir no es validar → [D-017](DECISION_LOG.md#d-017).

B1 está **escrito y sin ejecutar**: protocolo completo, cinco tracks, gates y presupuesto en [b1-tryon-benchmark](../research/b1-tryon-benchmark/). B3, B4 y B5 tienen la estructura y los gates propuestos, sin datos.

Distinguir siempre: **PROPOSAL ≠ IMPLEMENTED ≠ TESTED ≠ VERIFIED.** El código está IMPLEMENTED y TESTED; ninguna **hipótesis de producto o de negocio** ha pasado de PROPOSAL. Tener la plataforma no aporta una sola cifra de mercado.

Nota de método: cuando el upload esté hecho, la plataforma pasa a ser el instrumento con el que se ejecuta el Track D de B1 — con producto real en vez de láminas montadas a mano.

## Current Decisions

19 entradas en [DECISION_LOG.md](DECISION_LOG.md). En vigor y sin validar: D-001 a D-007, D-011, D-014, D-017, **D-018** (paleta), **D-019** (sin precios). Aplazadas: D-010 (dominio y marca), D-012 (foto vs cámara). Descartadas: D-009 (nombres). Validadas: D-013, D-015, D-016.

D-019 deja sin efecto el «precio aproximado» que [CLAUDE.md §8.6](../CLAUDE.md) lista entre los campos de la card.

**D-001 a D-014 están transcritas del repositorio, pendientes de ratificación del fundador.** D-016 además contiene una **decisión pendiente** sobre el orden de B1.

## Current Providers

Ninguno contactado. Ninguno contratado. **Track 0 sin enviar.**

| | Clase | Estado |
|---|---|---|
| Fittingbox | A · 3D/AR, API, foto y cámara [D] | Condiciones [?] |
| Jeeliz | A · 3D generado desde fotos de producto | Precio [D], modo foto [?] |
| Banuba TINT | A · SDK web y móvil [D] | Términos públicos, riesgo trasladado |
| Perfect Corp | A | [?] |
| Gemini · FLUX · Qwen | B · generativo | Precio [D], fidelidad [?] |

## Current Competitors

Tres tipos, y el tercero es el que decide → [competitors](../research/market/competitors.md).

- **Producto:** VisuTry, SpecFit, VirtualGlassesTryOn.ai. Clasificación [T], sin verificar.
- **Técnico** (posible proveedor, no rival): Fittingbox, Jeeliz, Banuba, Perfect Corp, Looksy.
- **Canal** (dueño de la demanda, con try-on propio): Ray-Ban/Luxottica, Oakley, Hawkers, Meller, Sunglass Hut, Amazon. **Sin investigar, y es la amenaza real.**

## Current Architecture

**Instalada:** Next.js 16.4 (App Router, Turbopack, cacheComponents) · React 19.3 · TypeScript estricto · Tailwind 4 · Vitest. Pendientes: Supabase, Vercel, Stripe.

```
app/          rutas: / · /probar · /legal/{privacidad,terminos,cookies}
components/   ui/FrameGlyph · recommendations/FrameCard
lib/face/     types · classify · neutral
lib/catalog/  types · rights ← el muro de gates · seed · index
lib/recommendations/  weights · score · explain
lib/tryon/    provider · mock
lib/i18n/     types · es · en
tests/        rights · classify · score · tryon-mock
```

Abstracciones ya existentes: `FaceProfile` · `FrameProfile` · `ScoringEngine` · `TryOnProvider`. Pendientes: `ImageStore` · `Analytics` · `Outbound`.

Dos propiedades del diseño que conviene no perder:

- **Los derechos son una precondición, no un campo informativo.** `FrameProfile.rights` obliga a declararlos y `isPubliclyListable()` / `canTryOn()` niegan por defecto. Una montura sin derechos verificados no se lista ni se prueba aunque esté en el catálogo. Es [D-002](DECISION_LOG.md#d-002) y [D-015](DECISION_LOG.md#d-015) en el sistema de tipos, con tests que lo custodian.
- **El scoring degrada con honestidad.** Un componente sin datos se marca `available: false` y reparte su peso, en vez de inventarse un 0,5. Y lo que se calcula con una aproximación se marca `estimated`, lo que impide que la explicación afirme medidas → [CLAUDE.md §9.4](../CLAUDE.md).

`TryOnProvider` no es opcional: las dos clases de tecnología se cruzan en coste alrededor de los ~1.800 usuarios activos/mes, así que cambiar de proveedor es un cuándo, no un si → [D-016](DECISION_LOG.md#d-016).

## Current Metrics

**Ninguna. No hay producto, no hay tráfico, no hay datos.**

Las que decidirán cuando exista: `upload_rate` · `analysis_completion` · `try_on_start_rate` · `try_on_completion_rate` · `second_try_on_rate` · `product_click_rate` · `affiliate_conversion` · `revenue_per_active_user` · `cost_per_active_user` · `contribution_per_active_user`.

El MVP no es la web: **es el experimento que produce estas cifras.**

## Immediate Next Steps

1. **Enviar el Track 0 de B1** — las 10 preguntas a Fittingbox, Jeeliz, Banuba y Perfect Corp, más *«¿de dónde salen los derechos de las monturas de su base?»*. Es el **camino crítico** y lleva 13 días parado. La latencia no se recupera.
2. **Decidir sobre [D-016](DECISION_LOG.md#d-016):** ¿se reordena B1 a favor de la Clase A? Condiciona todo lo que viene después, incluido si la ronda 1 del Track B merece la pena.
3. **Abrir cuenta de publisher en Awin ES** y leer los términos del programa de Hawkers desde dentro. Es gratis, responde GA-1, GA-3 y GA-4 de golpe y no depende de que nadie contexte un email.
4. **Ratificar o corregir D-001…D-014.** Son una lectura del repo, no decisiones firmadas.
5. Recoger inputs de B1: consentimiento por escrito y 10 fotos de 5 personas, fotos de producto de M1–M6 y distractores.
6. Ronda 1 de criba del Track B (8 casos × 5 modelos, ≈2 €) — **solo si D-016 se resuelve a favor de seguir con Clase B**.

No: dominio, marca, logo, anuncios, Supabase, Next.js, herramientas de SEO ni suscripciones.

## Blockers

| Blocker | Efecto | Salida |
|---|---|---|
| **Track 0 sin enviar, 13 días después** | Bloquea el bloque comercial entero de B1. Es el único blocker cuya latencia no se recupera | Enviar los 4 emails. Nada más del proyecto depende tan poco de esfuerzo y tanto de calendario |
| **[D-016](DECISION_LOG.md#d-016) sin ratificar** | B1 sigue escrito priorizando la Clase B, que es la ruta que los términos de afiliación no permiten | Decisión del fundador: reordenar B1 a favor de Clase A, o seguir con Clase B asumiendo que necesita excepción escrita por anunciante |
| **H-M2 sin un solo dato** | Es la hipótesis que sostiene el proyecto | Track D, pero depende de tener try-ons válidos |
| **Sin volumen de búsqueda real** | Cualquier plan de contenidos es opinión | B5, y sin gastar en herramientas |

**Blocker resuelto:** [D-015](DECISION_LOG.md#d-015) ya no espera respuesta. Se contestó con términos publicados, sin preguntar a nadie y sin coste.

## Last Updated

**2026-10-09** — paleta investigada y fijada como guía vinculante ([D-018](DECISION_LOG.md#d-018), [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)): escenario neutro cálido más un acento coñac derivado del núcleo comercial de la categoría, con contrastes AA calculados en ambos temas. Y se retiran los precios de la interfaz ([D-019](DECISION_LOG.md#d-019)): parecían nuestros, y no vendemos nosotros. 50 tests. Sin cambios en validación: el Track 0 sigue sin enviar.

**2026-10-08 (2)** — arranca la construcción con muro de gates → [D-017](DECISION_LOG.md#d-017). Esqueleto, design system, landing, i18n, clasificación facial, motor de recomendación, catálogo con derechos en el tipo, adaptador de try-on y 39 tests. Seis rutas. Ninguna hipótesis de negocio validada: el Track 0 sigue sin enviar.

**2026-10-08** — GA-2 respondido con términos publicados: los términos estándar de afiliación **no autorizan** el try-on generativo sobre la imagen oficial ([D-015](DECISION_LOG.md#d-015)), y el riesgo de licencia resulta ser de la Clase B, no de la Clase A ([D-016](DECISION_LOG.md#d-016)). Primer programa de afiliación localizado. Sin cambios en producto: sigue sin ejecutarse ningún experimento y el Track 0 sigue sin enviar.

**2026-09-25** — creación del archivo. Estado: Fase 0, B1 escrito y sin ejecutar, ninguna cifra de producto ni de negocio validada.
