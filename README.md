# AI Eyewear Finder (nombre provisional)

Web B2C para descubrir gafas de sol que encajen contigo, probártelas virtualmente sobre tu propia foto y llegar al sitio donde comprarlas.

> **Estado actual: Fase 0 — validación. No hay código todavía, y es intencionado.**
> No se escribe una línea de aplicación hasta que el Sprint 0 pase los criterios GO de abajo.

---

## Qué es esto

Una capa independiente de descubrimiento de eyewear, multi-marca. No es una óptica, no es un plugin de ecommerce y no es un generador de imágenes genérico.

El flujo que define el producto:

```
foto -> análisis -> 6 recomendaciones explicadas -> try-on -> comparar -> click al retailer
```

El contexto completo de producto, negocio, arquitectura y reglas está en [CLAUDE.md](CLAUDE.md). Ese es el documento maestro: si algo de este README y de CLAUDE.md se contradice, manda CLAUDE.md.

## Qué NO es

- No es una app nativa.
- No es un producto B2B para ópticas ni retailers.
- No es un SaaS de suscripción.
- No es «una IA que analiza caras». La IA es el mecanismo; lo que compra el usuario es confianza para elegir.

---

## Fase 0 — validación

El objetivo no es construir: es matar o confirmar el proyecto rápido y barato, en este orden.

```
B1  Benchmark técnico + licencia      ← AQUÍ ESTAMOS
      ↓  ¿try-on fiel y licencia válida?
B3  Afiliación y catálogo real
      ↓  ¿podemos monetizar la intención de compra?
B4  Competidores y entrevistas
      ↓  ¿la comparación multi-marca aporta valor?
B5  Keyword research y social
      ↓
MVP
```

Nada de dominio, marca, anuncios ni infraestructura hasta que B1 esté cerrado.

### B1 — el paso actual

Protocolo completo en [research/b1-tryon-benchmark/](research/b1-tryon-benchmark/). Responde a **tres preguntas independientes**, cada una con su propio GO/NO-GO:

| | Pregunta | Gates |
|---|---|---|
| **T · Tecnología** | ¿Puede representarse una montura real e **identificable** sobre la foto de una persona? | GT-1…GT-6 |
| **C · Comercial** | ¿Alguna tecnología permite un **agregador multi-marca afiliado** con licencia válida y coste razonable? | GC-1…GC-6 |
| **P · Producto** | ¿Hay razón real para usar **nuestro agregador** en vez de ir a la marca? | GP-1…GP-4 |

Los tres umbrales que más deciden:

- **GT-1 · Identidad:** ≥70 % de acierto en un test ciego de 3 opciones (azar = 33 %).
- **GC-4 · Riesgo de marca:** los proveedores no prohíben mostrar marcas ajenas — **nos trasladan el riesgo**. Hay que saber quién responde si una marca reclama.
- **GP-1 · Descubrimiento cruzado:** ≥3 de 5 participantes eligen una marca que no habían nombrado antes. Si no, somos una interfaz bonita sobre una decisión ya tomada.

Presupuesto autorizado de B1: **~15,50 €**. Ninguna suscripción.

---

## Stack previsto (aún no instalado)

Next.js (App Router) · TypeScript · Tailwind · Supabase (Postgres + Storage privado) · Vercel · Stripe cuando haya monetización · proveedor de try-on detrás de un adapter intercambiable.

Decisión de privacidad que condiciona la arquitectura: **los landmarks faciales se calculan en el navegador**. La foto solo sale del dispositivo si el usuario pide un try-on, va a un bucket privado con TTL corto y se borra después. Es una decisión de arquitectura, **no una conclusión jurídica** — ver PRIVACY RULE en [CLAUDE.md §14](CLAUDE.md).

## Estructura actual

Cuatro capas de documentación, y no deben mezclarse: **cómo** se trabaja, **dónde** estamos, **qué** decidimos y **por qué**.

```
.
├── CLAUDE.md                      # CÓMO: documento maestro de producto y arquitectura
├── README.md                      # este archivo
├── .claude/agents/
│   └── project-brain.md           # subagente de estrategia (piensa; no implementa)
├── docs/
│   ├── PROJECT_STATE.md           # DÓNDE: estado vivo del proyecto
│   └── DECISION_LOG.md            # QUÉ: decisiones con evidencia y estado
└── research/                      # POR QUÉ: la evidencia
    ├── README.md                  # convenciones: dónde va cada cosa, niveles de evidencia
    ├── b1-tryon-benchmark/        # protocolo de B1, sin ejecutar
    │   ├── README.md              # protocolo, coste, gates, ejecución
    │   ├── providers.md           # proveedores en 2 dimensiones, con evidencia
    │   ├── rubric.md              # rúbrica 0-3 + test ciego
    │   ├── multi-brand-test.md    # validación de producto
    │   ├── frames/ · templates/
    │   └── faces/ · outputs/      # no versionados
    ├── market/                    # B5 keywords · B4 competidores
    └── monetization/              # B3 afiliación · unit economics
```

Reglas de la estructura: `PROJECT_STATE.md` es estado, **no un diario** — se toca solo cuando hay evidencia o decisión real. Todo dato externo lleva nivel de evidencia `[D][M][T][?][X]`. Fotos, grabaciones, consentimientos y material bajo NDA van a `faces/`, `outputs/` y `raw/`, fuera de git. Detalle en [research/README.md](research/README.md).

---

## Privacidad

Se manejan fotografías faciales. Reglas no negociables desde el día 1: bucket privado, signed URLs con expiración, borrado duro por TTL, sin reconocimiento de identidad, sin inferencia de atributos sensibles, sin entrenar modelos con las fotos, y sin fotos ni contenido facial en logs ni en analytics.

**No asumir que unas medidas faciales derivadas quedan fuera de la normativa de protección de datos por el hecho de calcularse en cliente.** La clasificación jurídica se revisa con asesoramiento profesional antes de producción, especialmente por la combinación de foto facial + proveedor de IA de terceros.

## Licencia

Privado. Todos los derechos reservados.
