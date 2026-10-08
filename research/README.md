# research/ — índice y convenciones

`research/` es **la evidencia**: el *por qué* hemos llegado hasta aquí. Todo documento de investigación que genere Claude (Code o Project Brain) vive aquí. **Este repositorio es la fuente de verdad.** Cualquier copia en un Proyecto de chat, en Drive o en un adjunto es un espejo: si divergen, manda el repo.

Las otras tres capas **no** viven aquí:

| Documento | Responde |
|---|---|
| [CLAUDE.md](../CLAUDE.md) | **Cómo** debe trabajar el agente |
| [docs/PROJECT_STATE.md](../docs/PROJECT_STATE.md) | **Dónde** estamos ahora |
| [docs/DECISION_LOG.md](../docs/DECISION_LOG.md) | **Qué** decidimos y con qué evidencia |
| `research/` | **Por qué** — la evidencia larga |

Regla de oro: **un documento de investigación sin fecha y sin nivel de evidencia no sirve para decidir.** Ver §3.

---

## 1. Mapa

| Carpeta | Pregunta que responde | Estado |
|---|---|---|
| [b1-tryon-benchmark/](b1-tryon-benchmark/) | ¿Puede representarse una montura real e identificable? ¿Con qué licencia y a qué coste? | Protocolo escrito, **sin ejecutar** |
| [market/](market/) | ¿Dónde está la demanda y quién ocupa ya el espacio? | Vacío |
| [monetization/](monetization/) | ¿Se puede monetizar la intención de compra sin suscripción obligatoria? | Vacío |

El orden de ejecución no es el orden alfabético. Es el de [README.md § Fase 0](../README.md): **B1 → B3 (afiliación y catálogo) → B4 (competidores y entrevistas) → B5 (keywords y social)**. Adelantar B5 porque es la más cómoda de investigar desde un chat es exactamente el error que [CLAUDE.md §23](../CLAUDE.md) intenta evitar.

```
research/
├── README.md                       ← este archivo: convenciones
├── b1-tryon-benchmark/
│   ├── README.md · providers.md · rubric.md · multi-brand-test.md
│   ├── frames/ · templates/ · prompts/ · results/
│   └── faces/ · outputs/                       [NO versionado]
├── market/
│   ├── keyword-research.md
│   ├── competitors.md
│   ├── data/keywords.csv
│   ├── assets/                                 screenshots, PDFs de fuente
│   └── raw/                                    [NO versionado]
└── monetization/
    ├── affiliate-programs.md
    ├── unit-economics.md
    ├── assets/
    └── raw/                                    [NO versionado]
```

---

## 2. Dónde va cada cosa

| Material | Destino | ¿Git? |
|---|---|---|
| Documento de investigación, análisis, informe | `<área>/*.md` | Sí |
| Screenshot de Google Trends, Keyword Planner, SERP | `market/assets/` | Sí |
| Screenshot o PDF de **pricing** de un proveedor | `<área>/assets/` + cifra citada en el `.md` con fecha | Sí |
| Hoja de cálculo | **CSV** en `<área>/data/` | Sí |
| `.xlsx` original, si hace falta conservarlo | `<área>/raw/` | **No** |
| Resultados de un test o benchmark | `b1-tryon-benchmark/results/` | Sí (sin imágenes) |
| Outputs de imagen del benchmark | `b1-tryon-benchmark/outputs/` | **No** |
| Fotos de personas | `b1-tryon-benchmark/faces/` | **No** |
| **Notas anonimizadas** de entrevista (P1, P2…) | `<área>/*.md` o `results/` | Sí |
| Grabación, transcripción literal o consentimiento firmado | `<área>/raw/` | **No** |
| Propuesta comercial o presupuesto de un proveedor | `<área>/raw/` + condiciones resumidas en el `.md` | **No** |
| Email de un proveedor (Track 0) | Respuestas volcadas en `results/licence-matrix.md` | Sí (sin firmas ni datos de contacto) |

### Lo que nunca se versiona

`.gitignore` ya excluye `research/**/faces/`, `research/**/outputs/` y `research/**/raw/`. Las tres categorías que van a `raw/`:

1. **Datos personales.** Grabaciones, transcripciones con nombres, consentimientos firmados, emails con datos de contacto. Al repo solo llega la versión anonimizada: `P1 … P5`, sin nombre, edad exacta ni ciudad.
2. **Material confidencial de terceros.** Presupuestos, propuestas y todo lo recibido bajo NDA. Del `.md` sale el dato que necesitamos para decidir (precio, tope, condición), no el documento.
3. **Originales binarios pesados** que ya están representados por un CSV o un screenshot.

> Antes del primer commit de una sesión de investigación con material nuevo: `git status`. Si aparece una foto, una grabación o un PDF de proveedor, **está mal colocado**, no hace falta un `.gitignore` nuevo.

### Nombres de archivo

- Documentos y carpetas: `kebab-case`, sin fechas en el nombre (la fecha va en la cabecera del documento).
- Assets: `{fuente}_{tema}_{ámbito}_{YYYY-MM-DD}.{ext}` → `trends_gafas-de-sol_es_2026-09-25.png`, `jeeliz_pricing_2026-09-25.png`.
- Un asset sin fecha en el nombre es inservible a los tres meses: los precios y las SERP caducan.

---

## 3. Cabecera y niveles de evidencia — obligatorio

Todo `.md` de esta carpeta abre con:

```markdown
> **Estado:** PENDIENTE | EN CURSO | CERRADO · **Investigación a:** YYYY-MM-DD · **Cierra:** <gate o pregunta>
```

Y toda afirmación que dependa de un dato externo lleva etiqueta. Convención establecida en [b1-tryon-benchmark/providers.md §0](b1-tryon-benchmark/providers.md) y **común a todo `research/`**:

| | Significado |
|---|---|
| **[D]** | Documentación oficial, términos o pricing del proveedor. **Verificado** |
| **[M]** | Material de marketing del proveedor. Declarado, **no verificado** |
| **[T]** | Tercero: comparativas, prensa, agregadores. **No verificado** |
| **[?]** | **No publicado.** Requiere pregunta directa o herramienta de pago |
| **[X]** | Medido por nosotros |

Y la distinción que pide [Project Brain §8](../.claude/agents/project-brain.md): **dato observado · dato estimado · hipótesis · opinión**. Una estimación se marca como tal y se explica de dónde sale el cálculo.

**Ninguna cifra se inventa.** Un `[?]` es un resultado de investigación legítimo y mucho más útil que un número plausible sin fuente: dice exactamente qué hay que ir a preguntar.

---

## 4. Relación con el Proyecto de Project Brain

El flujo previsto, para que nadie tenga que hacer de mensajero entre los dos agentes:

```
repo (research/ + docs/) ──► PROJECT BRAIN ──► decisiones ──► CLAUDE CODE ──► resultados ──┐
        ▲                                                                                   │
        └───────────────────────────────────────────────────────────────────────────────────┘
```

El bucle se cierra **por el repositorio, no por el chat**. Claude Code escribe el resultado en `research/` y la decisión en [docs/DECISION_LOG.md](../docs/DECISION_LOG.md); Project Brain lo lee de ahí en la siguiente conversación. Si el resultado solo existe en un chat, el bucle está roto.

Tres avisos:

- **Un adjunto no se sincroniza.** Un archivo subido a un Proyecto es una copia congelada. Cuando un `.md` cambie aquí, hay que volver a subirlo o el Proyecto razonará con una versión vieja sin avisar. Si el Proyecto puede conectarse al repositorio, esa conexión es preferible al adjunto; con repo privado hay que autorizarla explícitamente.
- **No subir al Proyecto nada de `raw/`, `faces/` ni `outputs/`.** Son las tres carpetas que están fuera de git precisamente por eso: fotos de personas, grabaciones, consentimientos y material bajo NDA. Que un adjunto sea cómodo no cambia la base jurídica.
- **Hay una segunda instancia del mismo cerebro dentro de Claude Code**: el subagente [project-brain](../.claude/agents/project-brain.md). Lee el repo directamente, así que ahí no hay mensajero ni copias. Las dos instancias solo se mantienen coherentes si ambas leen `PROJECT_STATE.md` y `DECISION_LOG.md` antes de opinar.

### Qué adjuntar en cada conversación

Siempre: [CLAUDE.md](../CLAUDE.md), [PROJECT_STATE.md](../docs/PROJECT_STATE.md), [DECISION_LOG.md](../docs/DECISION_LOG.md). Encima, solo el área que se esté discutiendo — cargar las tres áreas completas en cada chat diluye el contexto en vez de mejorarlo.

| Conversación | Añadir |
|---|---|
| 00 · Estrategia | nada más |
| 01 · Market research | [market/](market/) |
| 02 · Try-on technology | [b1-tryon-benchmark/](b1-tryon-benchmark/) |
| 03 · Producto | [multi-brand-test.md](b1-tryon-benchmark/multi-brand-test.md) + CLAUDE.md §8 |
| 04 · Growth | [keyword-research.md](market/keyword-research.md) |
| 05 · Monetización | [monetization/](monetization/) |
| 06 · Review de Claude Code | el diff o el informe concreto |

---

## 5. Cuando un documento cambia una decisión

No basta con editar el `.md`. Hay que abrir o actualizar la entrada correspondiente en [docs/DECISION_LOG.md](../docs/DECISION_LOG.md) y, si contradice una hipótesis anterior, **decirlo explícitamente** con el ID: «esto invalida D-008». Si además cambia el estado del proyecto, actualizar [docs/PROJECT_STATE.md](../docs/PROJECT_STATE.md).

Un hallazgo que no llega al log no existe: en la siguiente conversación nadie lo recuerda.
