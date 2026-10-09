# Paleta de color en eyewear — evidencia

> Investigación a 2026-10-09 · Cierra: ¿qué colores funcionan en webs de gafas y por qué?
> Decisión resultante: [D-018](../../docs/DECISION_LOG.md#d-018) · Guía vinculante: [DESIGN_SYSTEM.md](../../docs/DESIGN_SYSTEM.md)

---

## 0. Advertencia sobre la calidad de la evidencia

**La mayoría de webs de marca de gafas bloquean el scraping** (Brandfetch, Ace & Tate, Cubitts, Warby Parker y Encycolorpedia devolvieron 403). Y los agregadores de «brand colors» **se contradicen entre sí**: para Oakley, una fuente da `#8B254C`, otra `#000000`, otra `#FF0000`; varias admiten literalmente que «these color values have not been given explicitly in the brand guidelines».

Por tanto:

- **No se usa ningún hex de marca de tercero como referencia.** No son fiables y además copiar la paleta de una marca del sector sería un error de posicionamiento, no un acierto.
- La conclusión se apoya en **una fuente de sector específica de eyewear** `[T]`, en el **patrón estructural** que sí es consistente entre fuentes, y en una observación directa de una web que no bloqueó.

---

## 1. La fuente más útil: guía de color de eyewear 2026/2027 `[T]`

De una guía mayorista de septiembre de 2026 — es la única fuente encontrada que habla de color **en esta categoría** y no de «tendencias web» genéricas:

| Hallazgo | Implicación para nosotros |
|---|---|
| Pantone 2026 Color of the Year: **Cloud Dancer** (11-4201), «an airy white», que el sector traduce a **marfil translúcido, crema cálido, beige claro, gris pálido, champán** | El fondo correcto es un off-white **cálido y claro** |
| **El blanco opaco puro es más difícil de vender** en eyewear; se recomienda marfil translúcido o off-white cálido | Descarta el blanco puro como fondo |
| **El núcleo comercial de la venta diaria es marrón transparente, tortoise y negro.** Los colores vivos funcionan en imagen de campaña, no como core | **El acento debe salir de ahí, no de un naranja o un azul** |
| **Energy Orange** aparece clasificado como el color de **mayor riesgo** de la temporada | Corrige directamente mi elección anterior |
| Regla de reparto propuesta: **60 % core · 30 % estacional · 10 % experimental** | En UI: neutro dominante, un acento, cero experimental |

Fuente: https://eyewear-suppliers.com/2026-2027-glasses-color-guide/

---

## 2. El patrón estructural: dos categorías, no una

Esto sí es consistente entre todas las fuentes, aunque los hex concretos no lo sean.

### Cadenas de óptica — **color de marca fuerte en la UI**

| | Color de marca aproximado `[T]` |
|---|---|
| Specsavers | verde ~`#00693c` / `#009552` |
| Alain Afflelou | rojo ~`#C70C0F` |
| Warby Parker | pizarra `#414b56` + cerúleo `#00a2e1`, sobre off-white `#fcfbf9` |

Venden **confianza, cobertura y precio**. El verde y el azul son los colores del retail sanitario. Funcionan para lo que hacen.

### Eyewear de moda — **la UI no tiene color de marca**

- **Hawkers** (observación directa, única web que no bloqueó): fondo neutro claro, texto oscuro, logo blanco sobre cabecera oscura. **No hay color de acento en la interfaz**: el énfasis lo ponen etiquetas promocionales («2X1», «BEST SELLER») y el color lo ponen los productos, con nombres como `CAREY GOLD TERRACOTA` u `OCEAN BLUE DENIM`.
- **Mykita** se describe como «a pure yet radical aesthetic» — identidad restringida.
- **Oliver Peoples**, clásico y vintage. **Gentle Monster**, el caso contrario: su audacia vive en las instalaciones de tienda, no en una paleta de web.
- Ray-Ban: marca roja sobre blanco y negro, pero el rojo es el logotipo, no la interfaz.

---

## 3. Conclusión

> **En eyewear de moda el color de marca no está en la interfaz. El producto pone el color y la UI es un escenario neutro.**

Las paletas con color protagonista pertenecen a las **cadenas de óptica**, y nosotros hemos decidido explícitamente no ser eso ([D-001](../../docs/DECISION_LOG.md#d-001)). Copiar el verde de Specsavers nos haría parecer una óptica; copiar el cerúleo de Warby Parker nos haría parecer su clon.

Lo que funciona para nuestro caso:

1. **Escenario neutro cálido**, no blanco puro ni beige de revista.
2. **Un solo acento, derivado del núcleo comercial del producto**: tortoise, coñac, marrón. No naranja, no azul.
3. **Casi monocromo**, para que las monturas —hoy glifos, mañana fotos— sean lo único con color propio.
4. **Los dos temas importan**, porque tortoise y lente transparente se leen distinto sobre fondo claro y oscuro.

### Qué cambia respecto a lo que había

La investigación **valida la dirección** y corrige dos cosas concretas. No es una reescritura, es una calibración:

| | Antes | Ahora | Por qué |
|---|---|---|---|
| Fondo | `#f4f1ea` | `#f7f5f1` | Era beige editorial. El sector apunta a marfil claro, más neutro |
| Acento | `#a84a14` naranja quemado | `#7e4420` coñac/tortoise | El anterior estaba cerca de *Energy Orange*, el color de mayor riesgo. El nuevo sale del núcleo comercial de la categoría |

Lo demás —casi monocromo, un acento, dos temas, el producto poniendo el color— ya estaba bien y se mantiene.

---

## 4. Lo que esta investigación NO respalda

- Ningún hex de ninguna marca como referencia a imitar.
- Que estos colores vendan más: **no hay dato de conversión**, solo coherencia de categoría y legibilidad.
- La paleta es una **hipótesis de diseño**. Se valida con comportamiento real cuando haya tráfico, igual que los pesos del scoring.

## 5. Fuentes

- Guía de color de eyewear 2026/2027: https://eyewear-suppliers.com/2026-2027-glasses-color-guide/
- Hawkers (observación directa): https://www.hawkersco.com/
- Specsavers, colores de logo `[T]`: https://encycolorpedia.com/companies/uk/specsavers
- Alain Afflelou `[T]`: https://brandfetch.com/afflelou.com
- Warby Parker `[T]`, con fuentes en desacuerdo: https://www.brandcolorcode.com/warby-parker
- Ray-Ban `[T]`, la fuente admite que no son valores oficiales: https://www.schemecolor.com/ray-ban-logo-colors.php
- Oakley `[T]`, fuentes en desacuerdo: https://brandpalettes.com/oakley-inc-color-codes/
- Mykita, posicionamiento: https://www.linkedin.com/company/mykita-gmbh
- Herramientas de eyewear ecommerce: https://fittingbox.com/en/resources/blog/eyewear-ecommerce-website-7-tools-to-stand-out
