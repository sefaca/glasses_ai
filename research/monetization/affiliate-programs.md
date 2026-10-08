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

### 5.1. GA-2 · Obra derivada — **respondido, y es NO** [D] · 2026-10-08

La pregunta de §1 ya no es una hipótesis abierta. Los términos estándar de publisher de las dos vías principales **prohíben expresamente modificar la imagen del anunciante**, y no hace falta preguntar a nadie para saberlo: están publicados.

**Awin** (y ShareASale, con la misma redacción):

| Cláusula | Texto |
|---|---|
| 2.1 · definición | «Advertiser Materials» = «any trade marks, advertising content, images, text, video, data or other material provided by or on behalf of an Advertiser» |
| 10.1 · licencia | sublicencia revocable y no exclusiva «to publish Advertiser Materials, **without modification**, on the Publisher Service» |
| 9.2.10 / 9.2.11 · garantía | el publisher garantiza que «all Advertiser Materials will be **accurately and faithfully reproduced**» |
| 9.3 · indemnidad | el publisher «will indemnify, defend and hold harmless AWIN» por cualquier incumplimiento de esas garantías |

*(La numeración de la garantía cambia según versión: 9.2.10 en 2017 y en el tripartito US de 2019; 9.2.11 en ENG 2019 y UK 2020. Awin además declina revisar los materiales: el riesgo de exactitud es del publisher, no de la red.)*

**Amazon Associates:**

| Cláusula | Texto |
|---|---|
| §6(a) | «You will not add to, delete from, or **otherwise alter any Program Content in any way**» |
| §6(a) · única excepción | redimensionar una imagen «in a manner that maintains the original proportions» |
| §3 · reserva | «Other than the limited licenses expressly set forth herein, we reserve all right, title and interest» |
| §3 · consecuencia inesperada | si modificas Program Content, esa modificación es «Your Submission» y **«you assign to us all right, title, and interest in and to Your Submission»** |

**Lectura.** Un try-on generativo no es una reproducción fiel de la imagen de producto: **es una imagen nueva** construida a partir de ella. Eso choca de frente con la licencia «without modification» y con la garantía de reproducción fiel, y en Awin el incumplimiento viene con indemnidad a cargo nuestro. En Amazon es peor que una prohibición: la imagen derivada —que contiene **la cara de un usuario nuestro**— quedaría cedida a Amazon por el §3.

> **GA-2 falla sobre los términos estándar.** No es `[?]`, es `[D]`. Lo que queda abierto es si **algún programa concreto lo autoriza por excepción escrita**, no si los términos por defecto lo permiten: no lo permiten.

### 5.2. La consecuencia que reordena el plan

El riesgo de licencia estaba mal atribuido. Lo habíamos puesto en la Clase A; **es de la Clase B**:

| | Qué asset se muestra | ¿Modifica «Advertiser Materials»? |
|---|---|---|
| **Clase B · generativo** | Imagen nueva derivada de la foto oficial del retailer | **Sí. Es el problema** |
| **Clase A · 3D/AR** | Modelo 3D licenciado por el proveedor de try-on | **No.** No reproduce ni altera la imagen del anunciante |

En Clase A el enlace de afiliado vuelve a ser lo único que toca al anunciante: un enlace, que es exactamente lo que la licencia sí cubre.

Y esto **reencuadra el catálogo de Fittingbox**: sus ~200.000 monturas de 1.200 marcas [D] no son un atajo cómodo de catálogo, son la única vía donde **los derechos de derivación ya están resueltos aguas arriba** por quien digitalizó la montura con una relación con la marca. Ese es su valor real, y no lo habíamos visto.

**El reverso, y hay que decirlo:** si usamos Jeeliz para digitalizar una montura a partir de una foto de producto que **nosotros** aportamos sin derechos, no hemos resuelto el problema — lo hemos movido un eslabón. Por eso **GC-4** («¿quién responde si una marca reclama?») sigue siendo la pregunta correcta del Track 0, y hay que añadir: *¿de dónde salen los derechos de las monturas de su base?*

### 5.3. GA-3 · Aprobación como agregador — abierto, con señal negativa [T]

El modelo comparador/agregador **no está garantizado** como método promocional: CJ se reserva aprobar toda actividad promocional «in its sole discretion», y Rakuten remite a «Affiliate Link Policies» fijadas por anunciante. Las plantillas del sector listan habitualmente como restringidas las páginas de comparación y los agregadores. Hay que preguntarlo, programa por programa.

### 5.4. Primer programa real localizado [T]

**Hawkers tiene programa de afiliación activo en Awin España** (perfil de anunciante 19686): feed de productos en varios idiomas, generador de enlaces a modelos concretos y, según la ficha, más de 400 modelos por temporada.

Dos cautelas: la fuente es nota de prensa y ficha de 2020–2021, así que comisión, catálogo y países **hay que reverificarlos**; y un feed con imágenes no resuelve GA-2 — resuelve GA-1 y, si trae medidas, GA-4.

### 5.5. Estado de los gates

| Gate | Estado | Evidencia |
|---|---|---|
| **GA-1** · derecho a mostrar | PARCIAL — 1 programa localizado con feed | [T] Hawkers en Awin ES |
| **GA-2** · obra derivada | **NO sobre términos estándar** | **[D]** Awin 10.1 y 9.2.10 · Amazon §6(a) y §3 |
| **GA-3** · aprobación sin tráfico | ABIERTO, señal negativa | [T] CJ discrecional, agregadores restringidos |
| **GA-4** · datos de montura | ABIERTO | Hawkers tiene feed; falta saber si trae calibre, puente y varilla |
| **GA-5** · economía | ABIERTO | sin comisión ni ticket medio verificados |

### 5.6. Fuentes

- Awin · términos de publisher 2017 (HTML, cláusulas citadas): https://www.awin.com/us/terms-and-conditions/publisher-terms-and-conditions-2017
- Awin · términos de publisher UK 2020 (PDF): https://s3.amazonaws.com/docs.awin.com/Legal/Publisher+Terms/2020/UK_EN_Awin+Ltd+Publisher+terms.pdf
- Awin · términos 2019 ENG (PDF): https://s3.amazonaws.com/docs.awin.com/Legal/Publisher+terms+and+conditions+2019+ENG.pdf
- Amazon Associates · Operating Agreement y políticas: https://affiliate-program.amazon.com/help/operating/policies
- Rakuten Advertising · Publisher Membership Agreement: https://rakutenadvertising.com/legal-notices/publisher-membership-agreement/
- CJ · Publisher Service Agreement (SEC, 2007 — antiguo): https://www.sec.gov/Archives/edgar/data/1408690/000104746907006278/a2179190zex-10_32.htm
- Hawkers en Awin ES · perfil de anunciante: https://ui.awin.com/merchant-profile/19686
- Hawkers y Awin · nota de prensa 2021: https://www.awin.com/es/noticias-y-eventos/noticias/programa-hawkers-afiliacion

Pendiente al cerrar B3: una fila por programa con las 10 respuestas de §2 y los cinco gates con cifras.
