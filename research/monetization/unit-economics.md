# Unit economics — contribución por usuario activo

> **Estado:** PENDIENTE · **Investigación a:** 2026-09-25 (solo la parte de coste) · **Cierra:** ¿puede ser positivo el margen unitario **sin suscripción obligatoria**?

La unidad de análisis es el **usuario activo**, no la sesión ni la visita. Un usuario activo es quien completa un análisis y al menos un try-on: es el primer punto donde hemos gastado dinero de verdad.

**Ninguna cifra de ingreso de este documento está rellena, y no se va a rellenar con estimaciones.** Lo único acotable hoy es el coste.

---

## 1. El modelo

```
INGRESO/usuario activo
    = afiliación:  r_click × p_buy × AOV × c_comm
    + créditos:    p_pay × ticket_credito

COSTE/usuario activo
    = n_tryon × coste_tryon        ← coste variable de IA
    + coste_infra                  ← hosting, storage, egress
    + coste_pago × p_pay           ← comisión de Stripe, solo sobre los que pagan

CONTRIBUCIÓN/usuario activo = INGRESO − COSTE
MARGEN DE CONTRIBUCIÓN con CAC = CONTRIBUCIÓN − CAC
```

Separar siempre, como pide [Project Brain §14](../../.claude/agents/project-brain.md):

- **Revenue** — lo que entra.
- **Gross margin** — revenue menos coste directo de servir (IA + infra + comisión de pago).
- **Contribution margin** — gross margin menos adquisición. **Es el único que dice si el negocio existe.**

Un margen bruto excelente con CAC por encima de él no es un negocio rentable con un problema de marketing: es un negocio que pierde dinero por cada usuario que consigue.

---

## 2. Variables

| Variable | Definición | Unidad | Valor | Fuente / bloque que lo resuelve |
|---|---|---|---|---|
| `n_tryon` | Try-ons por usuario activo | nº | **[?]** | MVP · evento `try_on_completed` |
| `coste_tryon` | Coste del proveedor por try-on completado | € | **acotado, §3** | B1 Track B [D] / Track 0 [?] |
| `r_click` | Clicks de salida por usuario activo | nº | **[?]** | MVP · `outbound_product_click` |
| `p_buy` | Probabilidad de compra tras el click | % | **[?]** | Red de afiliación, post-lanzamiento |
| `AOV` | Ticket medio de la compra | € | **[?]** | B3 · red o retailer |
| `c_comm` | Comisión sobre la venta | % | **[?]** | B3 · [affiliate-programs.md](affiliate-programs.md) GA-5 |
| `p_pay` | Usuarios activos que compran créditos | % | **[?]** | Experimento E de [CLAUDE.md §32](../../CLAUDE.md) |
| `ticket_credito` | Importe medio del pack | € | **[?]** | Precio a testear, no decidido |
| `coste_infra` | Infra variable por usuario activo | € | **[?]** | Medible solo con tráfico real |
| `coste_pago` | Comisión de pasarela por transacción | € + % | **[?]** | Pricing oficial de Stripe, sin consultar |
| `CAC` | Coste de adquisición por usuario activo | € | **[?]** | B5 · social orgánico vs paid |

Once variables. **Una acotada, diez desconocidas.** Esa proporción es el estado real del análisis económico hoy, y conviene tenerla delante antes de hacer cualquier proyección: cualquier cifra de contribución que se calcule ahora sería una opinión con formato de hoja de cálculo.

---

## 3. El único lado que sí podemos acotar: el coste

Datos ya investigados en [b1-tryon-benchmark/providers.md](../b1-tryon-benchmark/providers.md), precios oficiales por imagen [D] a 2026-09-25:

| Modelo | €/imagen |
|---|---:|
| Qwen Image Edit | 0,018 € |
| Gemini 3.1 Flash Lite Image (1K) | 0,029 € |
| FLUX.1 Kontext [pro] | 0,034 € |
| Gemini 3.1 Flash Image (1K) | 0,057 € |
| Gemini 3 Pro Image (1K/2K) | 0,114 € |

`coste_tryon` **no es el precio por imagen**: es `€/imagen ÷ tasa de éxito`. Con la `TASA_VALIDOS` mínima que exige GT-2 de B1 (≥70 %), un try-on entregable cuesta en torno a 1,4 veces el precio de lista, y eso antes de contar los reintentos que no se cobran al usuario ([regla 11 de CLAUDE.md §30](../../CLAUDE.md)). El benchmark tiene que devolver el coste real por try-on **entregado**, no por llamada.

### Las dos clases tienen economía invertida

De [b1-tryon-benchmark/README.md §1](../b1-tryon-benchmark/README.md):

| | Clase A — 3D/AR | Clase B — generativo |
|---|---|---|
| Estructura | Suscripción mensual con topes | Pago por generación |
| Coste marginal | ≈ 0 | Lineal |
| Barata cuando | Hay volumen | Hay poco volumen |

El punto de cruce estimado está en **~1.800 usuarios activos/mes** (estimación propia, no dato de proveedor). Consecuencia operativa: **el gate de coste hay que evaluarlo al volumen del mes 1–3, no en régimen.** Una suscripción de cientos de euros al mes repartida entre los primeros 50 usuarios da un coste por usuario que ningún ingreso de afiliación cubre, aunque a 10.000 usuarios sea imbatible.

El umbral ya fijado en B1 es **GC-5: coste por usuario activo ≤ 0,10 €** al volumen del mes 1–3.

---

## 4. La asimetría que hay que asumir

El coste se conoce antes de lanzar. **El ingreso solo se conoce después.**

`p_buy` es la variable que más manda en el ingreso de afiliación y la única que no se puede investigar: no la publica ninguna red de forma fiable para un caso como el nuestro, y depende de nuestro propio producto. Hasta que haya clicks reales medidos, cualquier revenue proyectado es ficción.

Lo que sí se puede hacer ahora, y es la forma honesta de usar este documento:

> **En lugar de estimar la contribución, calcular qué tendría que ser cierto para que fuera positiva.**

Es decir: fijar el coste acotado del §3 y despejar el `p_buy × AOV × c_comm` mínimo necesario. Eso devuelve un **umbral** —no una predicción— y ese umbral se puede comparar con las comisiones reales que devuelva B3. Si el umbral exige una tasa de compra que ninguna red considera plausible, el modelo de afiliación pura está muerto **antes** de escribir código, y los créditos pasan de secundarios a imprescindibles.

Ese cálculo se rellena en §6 cuando B3 devuelva `c_comm` y `AOV`. No antes: sin esos dos, despejar es aritmética sobre aire.

---

## 5. Criterios de decisión — propuestos, sin validar

| Gate | Métrica | Propuesta de GO |
|---|---|---|
| **GE-1 · Coste servible** | `n_tryon × coste_tryon` al volumen del mes 1–3 | ≤0,10 €/usuario activo (= GC-5 de B1) |
| **GE-2 · Umbral alcanzable** | `p_buy` mínimo necesario para contribución ≥0 sin créditos | Comparable con lo que B3 devuelva como plausible |
| **GE-3 · Contribución sin suscripción** | Contribución/usuario activo con afiliación + créditos | >0 € |

Los créditos no son solo ingreso: son **el control de coste**. Un try-on gratis por sesión anónima acota `n_tryon` y por tanto el único coste variable relevante. Si `n_tryon` se dispara por usuarios entusiastas que nunca compran, el paywall deja de ser monetización y pasa a ser supervivencia — y eso es una decisión de arquitectura del rate limiting, no de marketing.

---

## 6. Cálculo

Vacío. Se rellena con: `coste_tryon` real medido en B1 [X], `c_comm` y `AOV` de B3, y el umbral de `p_buy` despejado según §4.
