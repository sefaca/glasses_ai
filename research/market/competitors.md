# B4 · Competidores — quién ocupa ya el espacio

> **Estado:** PENDIENTE · **Investigación a:** — · **Cierra:** ¿existe un hueco real para un agregador multi-marca, y frente a quién?

El análisis narrativo de partida está en [CLAUDE.md §3](../../CLAUDE.md). Este documento no lo repite: lo convierte en una matriz verificable y **le añade la categoría que falta** (§1).

Regla de método: no describir landings. Una landing dice qué quiere vender el competidor, no cómo le funciona el negocio.

---

## 1. Tres tipos de competidor, y el tercero es el que decide

[CLAUDE.md §3](../../CLAUDE.md) mezcla productos B2C con proveedores de tecnología. Separarlos cambia las conclusiones, porque **un proveedor de try-on no compite con nosotros: nos vende la pieza**.

| Tipo | Definición | Qué nos quita | Ejemplos |
|---|---|---|---|
| **P · Producto** | Hace el mismo trabajo para el mismo usuario | Usuarios y posicionamiento | VisuTry, SpecFit, VirtualGlassesTryOn.ai |
| **T · Técnico** | Vende la tecnología. Rival solo si decide ir a B2C | Nada hoy. **Posible proveedor o socio** | Fittingbox, Jeeliz, Banuba, Perfect Corp, Looksy |
| **C · Canal** | Es dueño de la demanda y ya tiene try-on propio | **La razón de existir** | Ray-Ban/Luxottica, Oakley, Hawkers, Meller, Sunglass Hut, Amazon |

La amenaza real no es que VisuTry crezca. Es la pregunta de [Project Brain §5](../../.claude/agents/project-brain.md):

> **¿Por qué alguien usaría nuestro agregador en vez de entrar directamente en Ray-Ban, que ya tiene probador virtual, catálogo completo y fotos oficiales?**

Nuestra única respuesta candidata es **multi-marca + recomendación + comparación**, y no está demostrada: es lo que mide el Track D de B1 ([multi-brand-test.md](../b1-tryon-benchmark/multi-brand-test.md), gates GP-1…GP-4). Por eso este bloque va **después** de B1: si GP-1 falla, la ficha competitiva más completa del mundo no cambia nada.

---

## 2. Matriz

Clasificación preliminar tomada de [CLAUDE.md §3](../../CLAUDE.md) (nivel [T], sin verificar). Todo lo demás está sin investigar.

| Competidor | Tipo | URL | Try-on | ¿Cuenta obligatoria? | Pricing | Multi-marca | Enlace de compra | Países / idiomas |
|---|:-:|---|---|---|---|---|---|---|
| VisuTry | **P** | visutry.com | Desde foto [T] | [?] | Créditos [T] | [?] | [?] | [?] |
| SpecFit | **P** | specfit.app | Foto/scan, foco iPhone [T] | [?] | Créditos [T] | [?] | Sí [T] | [?] |
| VirtualGlassesTryOn.ai | **P** | virtualglassestryon.ai | Desde foto [T] | [?] | [?] | [?] | [?] | [?] |
| Fotor | Adyacente | fotor.com | Generativo genérico [T] | [?] | [?] | No aplica | No | [?] |
| Dreamina (CapCut) | Adyacente | dreamina.capcut.com | Generativo genérico [T] | [?] | [?] | No aplica | No | [?] |
| Mew Design | Adyacente | mew.design | Generativo genérico [T] | [?] | [?] | No aplica | No | [?] |
| Looksy | **T** | looksy.tech | B2B eyewear [T] | — | [?] | — | — | [?] |
| Banuba | **T** | banuba.com | SDK 3D/AR | — | Ver [providers.md](../b1-tryon-benchmark/providers.md) | — | — | — |
| Fittingbox | **T** | fittingbox.com | API 3D, foto y cámara [D] | — | [?] Track 0 | — | — | — |
| Jeeliz | **T** | — | 3D desde fotos de producto | — | [?] Track 0 | — | — | — |
| Ray-Ban (Luxottica) | **C** | — | [?] | — | — | No, monomarca | Propio | [?] |
| Hawkers · Meller · Oakley | **C** | — | [?] | — | — | No, monomarca | Propio | [?] |
| 3–5 retailers ES multimarca | **C** | [?] | [?] | [?] | — | **Sí** | Propio | ES |

**El hueco de la tabla que más importa es la última fila.** Un retailer español multimarca con probador propio y catálogo real de varias marcas ocuparía casi exactamente nuestra propuesta, con ventaja de inventario y sin problema de licencia de imagen. Identificarlos es la primera tarea de este bloque, antes de perfilar a VisuTry.

Las filas **T** no se investigan aquí: viven en [b1-tryon-benchmark/providers.md](../b1-tryon-benchmark/providers.md), que ya las cubre en dos dimensiones.

---

## 3. Ficha por competidor (solo tipo P y C relevantes)

Copiar y rellenar. Un `[?]` explícito vale más que una suposición.

```markdown
### <Nombre> · tipo P|C · investigado YYYY-MM-DD

**Propuesta de valor** (su frase, literal):
**Funnel** — pasos exactos desde la home hasta un resultado:  1. … 2. …
**Nº de pasos hasta ver valor:**        **¿Requiere cuenta antes del primer resultado?**
**Try-on** — tecnología aparente · foto o cámara · latencia medida [X] · fidelidad de la montura [X]
**Recomendación** — ¿existe? ¿es análisis facial, filtros o nada? ¿explica por qué?
**Catálogo** — nº de modelos · marcas reales o genéricas · ¿de dónde salen las imágenes?
**Modelo de negocio** — créditos, suscripción, afiliación, B2B, licencias
**Pricing** [D] con fecha y screenshot en assets/
**Afiliación** — ¿enlaza a retailers? ¿con tag de afiliado? (inspeccionar el enlace de salida)
**Privacidad** — ¿qué dice del borrado de la foto? ¿procesa en cliente o en servidor?
**Velocidad** [X] — tiempo real hasta el primer resultado, en móvil
**SEO** — páginas indexadas, clusters que ataca, si rankea por marca ajena
**Social** — canales, seguidores, formato que le funciona
**Fricciones observadas** [X] — lo que me hizo abandonar
**Fuerte · Débil**
**Replicable en semanas · Difícil de replicar y por qué**
```

Dos campos que no suelen mirarse y son los que más informan:

- **¿Requiere cuenta antes del primer resultado?** Es la métrica de fricción más comparable entre competidores y la que predice mejor su tasa de activación.
- **El enlace de salida.** Si lleva tag de afiliado, el modelo de negocio está confirmado [X] sin preguntar a nadie. Si lleva a la home de la marca en vez de a la ficha, su monetización de compra no funciona.

---

## 4. Criterios de decisión — propuestos, sin validar

| Gate | Métrica | Propuesta de GO |
|---|---|---|
| **GB-1 · Hueco multi-marca** | Nº de competidores tipo P **y** C que ofrezcan recomendación + comparación entre ≥4 marcas reales con enlace de compra | **0 o 1** → hay hueco |
| **GB-2 · Fidelidad ajena** | Fidelidad de montura de los tipo P, medida con nuestra propia [rúbrica](../b1-tryon-benchmark/rubric.md) [X] | Si todos fallan la rúbrica, la fidelidad es diferenciación real |
| **GB-3 · Fricción** | Pasos y cuenta obligatoria hasta el primer resultado | Si ≥2 exigen cuenta, el flujo anónimo es diferenciación |

**GB-2 es el único gate de este bloque que produce un dato propio y no una descripción.** Probar los competidores con la misma rúbrica que usamos en B1 convierte «parece que no es muy fiel» en una cifra comparable. Coste: cero o el de sus créditos gratuitos.

**Si GB-1 sale ≥2**, el espacio está ocupado por gente que ya hace exactamente lo que proponemos, y la conversación pasa a ser de ejecución y distribución, no de producto. Sería el desenlace más incómodo y hay que estar dispuesto a escribirlo.

---

## 5. Resultados

Vacío. Al cerrar: matriz completa, fichas de los tipo P y de los retailers multimarca ES, los tres gates con cifras, y respuesta explícita y por escrito a la pregunta de §1.
