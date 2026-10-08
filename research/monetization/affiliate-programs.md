# B3 · Afiliación y catálogo legal

> **Estado:** PENDIENTE · **Investigación a:** — · **Cierra:** ¿existe una vía legal para mostrar productos reales de varias marcas y cobrar por el click que compra?

Es el **bloque siguiente a B1** y el que decide si hay negocio, no solo producto. Un try-on perfecto sin derecho a mostrar el producto ni a cobrar la venta es una demo.

Aquí no se investiga «qué comisión paga cada marca». Se investiga algo más básico y menos evidente: **si un agregador sin tráfico tiene derecho a usar las imágenes de producto y a ser aprobado en los programas.**

---

## 1. La pregunta que hay que resolver primero

La monetización y el catálogo son el mismo problema, no dos. La cadena entera:

```
feed o web del retailer
  → imagen oficial del producto          ¿tenemos licencia para mostrarla?
  → try-on: imagen derivada de esa imagen  ¿la licencia cubre una obra derivada?
  → ficha nuestra con marca y modelo      ¿uso de marca permitido?
  → click de salida con tag de afiliado   ¿aprobado como agregador?
  → comisión                              ¿y cuánto, y cuándo?
```

**El eslabón débil es el segundo, y casi nunca está contemplado en ningún contrato.** Una licencia de feed de afiliación típica autoriza *mostrar* la imagen para promocionar el producto. Nuestro try-on no la muestra: **crea una imagen nueva a partir de ella y de la cara de un usuario.** Que eso sea una «obra derivada» no autorizada es una **hipótesis con riesgo alto**, no un hecho — y no se resuelve leyendo webs, igual que el Track 0 de B1. Hay que preguntarlo por escrito.

Esta pregunta se conecta directamente con **GC-4 de B1** (¿quién responde si una marca reclama?) y con [RULE #1](../../CLAUDE.md): la regla nos obliga a usar la montura real, es decir, nos obliga a entrar en este riesgo. No hay versión del producto que lo esquive bajando la fidelidad, porque bajar la fidelidad está prohibido por la regla.

> Nota de método: esto es una identificación de riesgo, **no asesoramiento jurídico**. Antes de producción hay que validarlo con un profesional, igual que el bloque de privacidad.

---

## 2. Qué preguntar a cada programa

Las diez que no contesta ninguna landing. Por escrito, y una respuesta ambigua cuenta como no.

| # | Pregunta | Por qué decide |
|---|---|---|
| 1 | ¿Existe programa de afiliación? ¿Directo o vía red? | — |
| 2 | ¿Aprueban un sitio **nuevo y sin tráfico**? ¿Qué exigen exactamente? | Si todos exigen tráfico previo, la afiliación no puede financiar el arranque y el orden del plan cambia |
| 3 | ¿Permiten el modelo **comparador/agregador**? ¿Está excluido como los cupones o el cashback? | Muchos programas excluyen categorías enteras de publisher |
| 4 | ¿Hay **feed de producto**? ¿Incluye imágenes, medidas (calibre, puente, varilla), color y material? | Sin medidas no hay scoring de encaje; sin imagen no hay try-on |
| 5 | ¿La licencia del feed permite **mostrar** las imágenes en nuestro sitio? | Base del catálogo |
| 6 | **¿Permite crear una imagen derivada** (composición del producto sobre la foto de un usuario) y mostrarla? | **El gate crítico. Ver §1** |
| 7 | ¿Uso de la **marca** en URLs, títulos y metadatos? | Condiciona todo el cluster C de SEO |
| 8 | **Comisión**: %, base de cálculo (con o sin IVA y envío), y si varía por categoría | — |
| 9 | **Cookie window**, atribución y política de devoluciones | Una compra de gafas de sol puede tardar días; una ventana de 24 h cambia la economía |
| 10 | Países, moneda, mínimo de pago y plazo real de cobro | Condiciona el orden de mercados de [CLAUDE.md §21](../../CLAUDE.md) |

La 6 es la que hay que hacer **primero** y con el texto exacto del caso de uso delante. Si la respuesta es no, el resto de la tabla da igual para esa marca.

---

## 3. Dónde buscar

**Nada de esto está confirmado.** Es una lista de sitios donde mirar, no una afirmación de que estas marcas tengan programa ni de que acepten agregadores.

| Candidato | Vía a comprobar | Estado |
|---|---|---|
| Ray-Ban / Oakley / Persol (Luxottica) | Programa directo o red; verificar quién gestiona cada marca | [?] |
| Sunglass Hut | Retailer multimarca del mismo grupo | [?] |
| Hawkers | Programa directo o red | [?] |
| Meller | Programa directo o red | [?] |
| Polaroid Eyewear (Safilo) | Programa directo o red | [?] |
| Retailers ES multimarca | Los mismos que hay que identificar en [competitors.md §2](../market/competitors.md) | [?] |
| Amazon Associates | Cobertura de catálogo enorme; comisión y cookie window históricamente bajas [T] | [?] |
| Redes: Awin · Tradedoubler · CJ · Rakuten · Impact | Buscar la categoría eyewear y filtrar por país ES | [?] |

Orden de trabajo: **primero las redes**, no las marcas. Una red da de golpe el catálogo de programas disponibles en España, sus condiciones de publisher y si aceptan comparadores, sin depender de que una marca responda un email.

Screenshot con fecha de cada condición en [assets/](assets/). Propuestas y presupuestos a `raw/` ([research/README.md §2](../README.md)).

---

## 4. Criterios de decisión — propuestos, sin validar

| Gate | Métrica | Propuesta de GO |
|---|---|---|
| **GA-1 · Derecho de imagen** | Programas que autorizan **mostrar** la imagen de producto | ≥4 marcas distintas |
| **GA-2 · Obra derivada** | Programas que autorizan la **composición try-on**, o que no la prohíben y acotan el riesgo | ≥1 por escrito, **o** decisión consciente de asumirlo |
| **GA-3 · Aprobación sin tráfico** | Programas que aprueban un sitio nuevo | ≥3 |
| **GA-4 · Datos de montura** | Programas con feed que incluya medidas | ≥2 → el scoring puede usar medidas reales y no solo forma |
| **GA-5 · Economía** | Comisión × ticket medio de la categoría | Ingreso por compra suficiente para el modelo de [unit-economics.md](unit-economics.md) |

**GO de B3:** GA-1 y GA-3 ✅ y GA-2 resuelto de forma explícita (sí, o no con riesgo asumido y documentado en el log).

Desenlaces:

- **GA-2 ❌ en todos** → el try-on generativo sobre imagen oficial no es defendible. Quedan dos salidas: **Clase A 3D** (donde el activo es un modelo 3D licenciado por el proveedor, no una imagen del retailer) o negociar con marcas una a una. Ambas son mucho más lentas y caras. **Esto reordenaría B1 entero a favor de la Clase A.**
- **GA-3 ❌** → hay que generar tráfico antes de poder monetizarlo. Los créditos pasan de monetización secundaria a **única** durante los primeros meses, y eso cambia el modelo de [unit-economics.md](unit-economics.md).
- **GA-4 ❌** → el scoring del MVP no puede prometer encaje por medidas; solo por forma y estilo. Afecta a lo que la UI puede afirmar sin mentir.

---

## 5. Resultados

Vacío. Al cerrar: una fila por programa con las 10 respuestas, los cinco gates con cifras, y la respuesta por escrito a §1.
