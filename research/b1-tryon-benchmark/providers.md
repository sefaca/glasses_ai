# B1 · Entregable A — Tabla comparativa de proveedores

> Investigación realizada el 2026-09-25. Fuentes al final.
> **Todo lo marcado como «declarado» proviene del material del proveedor y NO está verificado.** Verificarlo es precisamente el objeto del benchmark.

---

## 0. El hallazgo que cambia el planteamiento

El mercado no es «varios proveedores de lo mismo más caros o más baratos». Son **dos tecnologías distintas con modelos de coste opuestos**, y la pregunta de B1 cambia según cuál se elija:

| | **Clase A — 3D / AR** | **Clase B — Generativo** |
|---|---|---|
| Qué es la montura | Un **modelo 3D real** (digitalizado o generado desde fotos del producto) | **Píxeles** que el modelo dibuja siguiendo una imagen de referencia |
| Fidelidad | Garantizada **por construcción**: es el producto | **Probabilística**: es el riesgo entero del proyecto |
| Coste | **Suscripción** por nº de productos y usuarios únicos | **Por generación**, 0,02–0,24 $/imagen |
| Coste marginal por try-on | ≈ 0 | Lineal: cada try-on cuesta |
| Escala con | **Usuarios** (malo para tráfico viral que no compra) | **Try-ons** (malo para usuarios muy activos) |
| Latencia | Tiempo real | Segundos |
| Requisito previo | Tener el asset 3D de cada montura | Tener una buena foto del producto |
| Riesgo principal | **Licencia**: ¿nos dejan mostrar marcas que no son nuestras? | **Fidelidad**: ¿es esa montura o una parecida? |

La consecuencia operativa es que **el gate de fidelidad (G1) es casi automático en Clase A y es el 100 % del riesgo en Clase B**. Por tanto B1 no es «cuál puntúa mejor», sino:

1. ¿La Clase B alcanza fidelidad suficiente? Si sí, tenemos libertad total de catálogo y coste variable.
2. Si no, ¿la Clase A nos deja existir? Su licencia y su precio están diseñados para **un retailer que vende su propio catálogo**, no para un agregador independiente multi-marca. Ese es el punto que hay que verificar, y no se verifica mirando imágenes.

---

## 1. Clase A — Proveedores especializados (3D / AR)

| | **Fittingbox** | **Jeeliz** | **Banuba TINT** | **Perfect Corp** |
|---|---|---|---|---|
| **Cómo recibe la imagen del usuario** | Cámara en vivo **y foto subida desde galería** (declarado explícitamente) | Cámara en vivo (live). Modo foto **sin confirmar** | Cámara / foto | Cámara / foto |
| **Cómo recibe la montura** | Catálogo propio ya digitalizado + digitalización a medida | **Genera el 3D automáticamente desde las fotos de la ficha de producto** (tecnología Vree) | Assets 3D que hay que preparar | Catálogo + assets |
| **¿Trabaja desde una imagen real del producto?** | No la necesita: usa su modelo 3D | **Sí — es exactamente su propuesta** | Requiere asset previo | Requiere asset previo |
| **¿Conserva la geometría?** | Sí, por construcción | Sí, si la digitalización es buena ← **esto sí hay que medirlo** | Sí | Sí |
| **Tamaño de catálogo** | **195.000+ referencias, 1.200+ marcas** (declarado) | Auto-digitaliza, sin catálogo cerrado | n/d | n/d |
| **Latencia** | Tiempo real | Tiempo real, «3× más ligero que la competencia» (declarado) | Tiempo real | Tiempo real |
| **Precio publicado** | Desde **$59/mes** (Bronze: 10 productos, 500 usuarios únicos/mes); Silver $99 (50 prod / 1.500 usr); Gold $199 | **Discovery gratis (3 productos)**; Pro $39/mes (40); Premium $99 (200); Ultimate $199 (500) | Easy VTO desde **$49/mes**; Shopify $319–1.599/mes; SDK a medida por MAU/try-ons | No publicado |
| **Uso comercial** | Contrato. Free trial disponible | Snippet integrable en cualquier web | Contrato | Contrato |
| **API / SDK** | API + widget, guías técnicas públicas | API + snippet copy-paste | SDK web y móvil | SDK / API |
| **¿Probable sin contrato, hoy?** | Free trial | **Sí — plan gratuito de 3 productos** | Demo | «Try for free» |

**Notas críticas:**

- **Ditto ya no existe como proveedor independiente:** fue adquirida por Fittingbox en 2023. Si aparece en alguna comparativa, es información obsoleta.
- **Fittingbox resuelve dos problemas a la vez.** 195k monturas de 1.200 marcas ya digitalizadas no es solo try-on: es el catálogo. Si su licencia lo permitiera, colapsaría B1 y buena parte del Sprint de catálogo. Es la conversación comercial más valiosa del sprint.
- **Jeeliz es el único probable hoy a coste cero** y su tecnología (3D desde foto de producto) es justo lo que necesita un agregador que no posee las monturas.
- **El límite de «usuarios únicos/mes» de Fittingbox (500 en el plan de entrada) es una bomba** para un producto de tráfico social. Ese eje de precio, no el de productos, es el que hay que negociar.

---

## 2. Clase B — Modelos generativos (edición imagen-a-imagen)

Precios oficiales a 2026-09-25, por imagen de salida:

| Modelo | Vía | Precio/imagen | Batch | Observaciones |
|---|---|---|---|---|
| **Gemini 3 Pro Image** (Nano Banana Pro) | Gemini API | **$0,134** (1K/2K) · $0,24 (4K) | −50 % | Mejor consistencia con imágenes de referencia. Input de imagen $0,0011/img |
| **Gemini 3.1 Flash Image** (Nano Banana 2) | Gemini API / fal | $0,045 (0,5K) · **$0,067** (1K) · $0,101 (2K) | −50 % | Acepta hasta 14 referencias. Buen punto de equilibrio |
| **Gemini 3.1 Flash Lite Image** | Gemini API | **$0,0336** (1K) | −50 % | El más barato de Google |
| **FLUX.1 Kontext [pro]** | fal / BFL | **$0,04** | — | Edición dirigida por instrucción |
| **FLUX.2 [pro] Edit** | fal | $0,03/MP (~$0,032 @1024²) | — | |
| **Qwen Image Edit** | fal | $0,02/MP (**~$0,021** @1024²) | — | El más barato del conjunto |

**Limitación documentada que coincide exactamente con nuestro modo de fallo:** en estos modelos «la fidelidad de detalle en casos límite como **accesorios**, patrones y texto pierde nitidez», y FLUX Kontext Max «tiene dificultades con los detalles finos». Nuestro producto depende justo de los detalles finos: **grosor de la montura, forma del puente, terminales de las patillas, doble puente del aviador**. No asumir que «consistencia de personaje» equivale a «fidelidad de producto»: son problemas distintos, y el marketing de estos modelos habla del primero.

**Nota sobre agregadores:** fal y Replicate son intermediarios, no los creadores del modelo; se paga un margen sobre el acceso directo. Para Gemini conviene ir a la API de Google directamente. Para el benchmark el margen es irrelevante; para producción, no.

**No existe** —según esta investigación— un modelo específico de try-on de gafas en fal ni Replicate. Los modelos de virtual try-on de esas plataformas son de **prendas de ropa**, no de accesorios faciales. Es un dato relevante: nadie ha especializado un modelo generativo para esto.

---

## 3. Clase C — Open source / autoconstruido

| Proyecto | Qué resuelve | Qué NO resuelve | Licencia |
|---|---|---|---|
| `jeeliz/jeelizGlassesVTOWidget` | Widget WebGL de try-on en vivo, tracking robusto | **Legacy, descontinuado** por el propio Jeeliz | **Licencia comercial Jeeliz — NO es software libre.** Cuidado: aparece en GitHub y parece gratis |
| MediaPipe Face Landmarker + three.js (`bensonruan`, `rohitjaiswal2001`, `alperenuzun`) | Tracking facial 3D en navegador, gratis y resuelto | El modelo 3D de cada montura | Abiertas |
| `mahsamb/virtual-glasses-tryon-kaggle` | MediaPipe + rembg + warp OpenCV | Calidad 2.5D, no comercial | Abierta |

**La conclusión de esta clase es la más importante de todo el informe:**

> El tracking facial es un problema **resuelto y gratuito**. MediaPipe da 468–486 landmarks 3D en el navegador sin coste.
> El cuello de botella no es colocar unas gafas en una cara: **es tener un modelo 3D fiel de cada montura**.
> Eso es precisamente lo que venden Fittingbox (195k digitalizadas a mano) y Jeeliz (generación automática desde foto).

Si la Clase B falla, la pregunta real no es «¿qué proveedor de try-on contratamos?» sino «¿podemos conseguir o generar modelos 3D de 30 monturas?». Y si Jeeliz/Vree hace eso automáticamente desde una foto de producto, la ruta autoconstruida (MediaPipe + nuestros propios 3D) vuelve a estar sobre la mesa a medio plazo, con coste marginal cero.

---

## 4. Lo que la investigación NO puede responder y hay que preguntar por email

Ninguna de estas preguntas se contesta mirando una web. Son el **bloque 0** del protocolo y se envían a primera hora del día 1, porque la latencia de respuesta comercial (2–5 días) es el verdadero camino crítico del sprint:

1. ¿La licencia permite que **un tercero independiente** muestre monturas de marcas con las que no tiene relación comercial?
2. ¿Existe **modo foto** (imagen subida) además de cámara en vivo, y está expuesto por API?
3. ¿El precio escala por **usuarios únicos** o por **try-ons**? ¿Hay tramo para tráfico alto y conversión baja?
4. ¿La digitalización automática desde foto de producto (Jeeliz/Vree) está disponible **por API**, o solo dentro de su widget?
5. ¿Qué ocurre con **la foto del usuario**: se procesa en cliente, se envía a su servidor, se almacena, dónde, cuánto tiempo? (RGPD)
6. ¿Podemos usar sus resultados en **material de marketing** (redes, share cards)?
7. Fittingbox concreto: ¿es accesible su **catálogo de 195k monturas** para un publisher que no es retailer?

---

## 5. Fuentes

- Fittingbox — FAQ de tecnología: https://fittingbox.com/en/resources/faq-eyewear-virtual-try-on-technology
- Fittingbox — try-on para ecommerce: https://fittingbox.com/en/glasses-virtual-try-on
- Fittingbox — app Shopify (precios): https://apps.shopify.com/glasses-virtual-try-on-by-fittingbox
- Jeeliz: https://jeeliz.com/
- Jeeliz — app Shopify (precios): https://apps.shopify.com/jeeliz-live-virtual-try-on
- Jeeliz — widget legacy y licencia: https://github.com/jeeliz/jeelizGlassesVTOWidget
- Banuba — guía de precios TINT: https://www.banuba.com/blog/banuba-tint-virtual-try-on-pricing-guide
- Banuba — comparativa de proveedores de eyewear: https://www.banuba.com/blog/best-virtual-try-on-platforms-eyewear-brands
- Perfect Corp — eyewear: https://www.perfectcorp.com/business/showcase/eye-wear
- Comparativa independiente 2026: https://auglio.com/en/best-virtual-try-on-eyewear-2026
- Adquisición de Ditto por Fittingbox: https://en.wikipedia.org/wiki/DITTO
- Gemini API — precios oficiales: https://ai.google.dev/gemini-api/docs/pricing
- fal — precios y modelos de edición: https://pricepertoken.com/fal-ai-pricing
- Comparativa Nano Banana / FLUX Kontext y límites de detalle: https://www.fotor.com/blog/google-nano-banana-vs-flux-kontext-max/
- MediaPipe + three.js (ejemplos): https://github.com/bensonruan/Virtual-Glasses-Try-on · https://github.com/rohitjaiswal2001/Eye-Glass-Track-on
