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

**No existe. Cero líneas de código, y es intencionado.** Fase 0 — validación.

Flujo que define el producto cuando exista: foto → análisis → 6 recomendaciones explicadas → try-on → comparar → click al retailer.

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

Estado: **ninguna pieza verificada.** No hay programa de afiliación confirmado, ni comisión, ni ticket medio, ni permiso de uso de imagen. → [affiliate-programs](../research/monetization/affiliate-programs.md).

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

## Invalidated

- **La Clase A es peor en privacidad.** Es al revés: procesa en el navegador, mientras la Clase B exige enviar la cara a un servidor de terceros → [D-013](DECISION_LOG.md#d-013).
- **Los precios de las apps de Shopify (39–199 $/mes) son los precios directos de Clase A.** No lo son → [D-006](DECISION_LOG.md#d-006).
- **La demanda está en las long-tail de face-shape.** Google Trends [T] apunta a que no, pero es **indicativo, no concluyente**: Trends no mide volumen absoluto → [D-008](DECISION_LOG.md#d-008).

## Open Questions

1. **¿Puede representarse una montura real e identificable?** GT-1. Sin esto no hay nada.
2. **¿Nos deja alguna licencia montar un agregador multi-marca afiliado?** GC-1…GC-3, y sobre todo **¿quién responde si una marca reclama?** GC-4.
3. **¿El try-on es una obra derivada de la imagen oficial del producto?** → [D-015](DECISION_LOG.md#d-015). Nadie lo había preguntado hasta ahora y puede reordenar el plan entero.
4. **¿Hay razón real para usar nuestro agregador en vez de ir a la marca?** GP-1. H-M2.
5. **¿Aprueban los programas de afiliación un sitio sin tráfico?** GA-3.
6. **¿Existe un cluster de keywords abordable en ES?** GK-1.
7. **¿Hay un retailer español multimarca que ya ocupe este espacio?** La fila vacía de [competitors §2](../research/market/competitors.md).

## Active Experiments

**Ninguno en ejecución.**

B1 está **escrito y sin ejecutar**: protocolo completo, cinco tracks, gates y presupuesto en [b1-tryon-benchmark](../research/b1-tryon-benchmark/). B3, B4 y B5 tienen la estructura y los gates propuestos, sin datos.

Distinguir siempre: **PROPOSAL ≠ IMPLEMENTED ≠ TESTED ≠ VERIFIED.** Hoy todo está en PROPOSAL.

## Current Decisions

15 entradas en [DECISION_LOG.md](DECISION_LOG.md). En vigor y sin validar: D-001 a D-007, D-011, D-014. Aplazadas: D-010 (dominio y marca), D-012 (foto vs cámara). Descartadas: D-009 (nombres). Validada: D-013.

**D-001 a D-014 están transcritas del repositorio, pendientes de ratificación del fundador.**

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

**No instalada.** Previsto: Next.js App Router · TypeScript · Tailwind · Supabase (Postgres + Storage privado) · Vercel · Stripe cuando haya monetización.

Abstracciones que deben existir desde el primer día: `FaceProfile` · `FrameProfile` · `ScoringEngine` · `TryOnProvider` · `CatalogSource` · `ImageStore` · `Analytics` · `Outbound/affiliate`.

`TryOnProvider` no es opcional: el riesgo de cambiar de proveedor es alto y el dominio no puede diseñarse alrededor de uno → [CLAUDE.md §10.1](../CLAUDE.md).

## Current Metrics

**Ninguna. No hay producto, no hay tráfico, no hay datos.**

Las que decidirán cuando exista: `upload_rate` · `analysis_completion` · `try_on_start_rate` · `try_on_completion_rate` · `second_try_on_rate` · `product_click_rate` · `affiliate_conversion` · `revenue_per_active_user` · `cost_per_active_user` · `contribution_per_active_user`.

El MVP no es la web: **es el experimento que produce estas cifras.**

## Immediate Next Steps

1. **Ratificar o corregir D-001…D-014.** Son una lectura del repo, no decisiones firmadas.
2. **Enviar el Track 0 de B1** — las 10 preguntas a Fittingbox, Jeeliz, Banuba y Perfect Corp. Es el **camino crítico**: 2–5 días de latencia que corren en paralelo a todo lo demás. Incluir la pregunta de [D-015](DECISION_LOG.md#d-015) en el mismo email.
3. Recoger inputs de B1: consentimiento por escrito y 10 fotos de 5 personas, fotos de producto de M1–M6 y distractores.
4. Ronda 1 de criba del Track B (8 casos × 5 modelos, ≈2 €).

No: dominio, marca, logo, anuncios, Supabase, Next.js, herramientas de SEO ni suscripciones.

## Blockers

| Blocker | Efecto | Salida |
|---|---|---|
| **Track 0 sin enviar** | Bloquea el bloque comercial entero de B1 | Enviarlo hoy; la latencia no se recupera |
| **[D-015](DECISION_LOG.md#d-015) sin respuesta** | Puede invalidar la ruta generativa sobre imagen oficial y reordenar B1 a favor de Clase A | Preguntarlo por escrito en el Track 0 y a las redes de afiliación |
| **H-M2 sin un solo dato** | Es la hipótesis que sostiene el proyecto | Track D, pero depende de tener try-ons válidos |
| **Sin volumen de búsqueda real** | Cualquier plan de contenidos es opinión | B5, y sin gastar en herramientas |

## Last Updated

**2026-09-25** — creación del archivo. Estado: Fase 0, B1 escrito y sin ejecutar, ninguna cifra de producto ni de negocio validada.
