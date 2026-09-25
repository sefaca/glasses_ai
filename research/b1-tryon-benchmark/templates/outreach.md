# Track 0 — Emails y consentimiento

> Se envía **el día 1 a primera hora, antes de generar ninguna imagen.** La latencia comercial (2–5 días) es el camino crítico del sprint, no nuestro tiempo de ejecución.

---

## Las 7 preguntas que hay que contestar

Ninguna se responde leyendo una web. Están ordenadas por capacidad de invalidar el proyecto:

1. **Licencia multi-marca.** ¿Permite su licencia que un tercero independiente, que no es retailer ni óptica, muestre monturas de marcas con las que no tiene relación comercial?
2. **Modo foto.** ¿Existe try-on a partir de una foto subida, además de cámara en vivo? ¿Está expuesto por API o solo dentro del widget?
3. **Eje de precio.** ¿Escala por usuarios únicos o por try-ons? ¿Hay tramo para tráfico alto con conversión baja?
4. **Digitalización por API.** ¿La generación automática de 3D desde foto de producto es accesible por API, o solo dentro de su producto?
5. **RGPD.** ¿Dónde se procesa la foto del usuario — cliente o servidor? ¿Se almacena? ¿Dónde y cuánto tiempo? ¿Firman DPA?
6. **Marketing.** ¿Podemos usar los resultados en redes sociales y material promocional?
7. **Catálogo** (solo Fittingbox). ¿Es accesible su base de 195.000 monturas digitalizadas para un publisher que no es retailer?

---

## Email base

> Asunto: **Technical evaluation — independent eyewear discovery platform**
>
> Hello,
>
> We are building an independent, multi-brand eyewear discovery platform for consumers in Spain. Users upload a photo, receive a small set of recommended frames, try them on virtually, compare the results and click through to the retailer's own store. We are not a retailer and we do not sell eyewear ourselves — we send qualified traffic to the brands and shops that do.
>
> We are currently running a technical evaluation of virtual try-on providers and would like to confirm a few points before going further:
>
> 1. Does your licence allow an independent third party — not a retailer or an optician — to display frames from brands it has no commercial relationship with?
> 2. Do you support try-on from a **user-uploaded photo**, in addition to live camera? Is that available through an API, or only inside your widget?
> 3. Is your pricing based on unique users or on try-ons? We expect high traffic with a low conversion rate, so this distinction matters a great deal to us.
> 4. Where is the user's photo processed — on device or on your servers? Is it stored, where, and for how long? Do you sign a GDPR data processing agreement?
> 5. Can the generated results be used in our own marketing and social media?
>
> *[Jeeliz]* 6. Is your automatic 3D generation from product images available through an API, so that we could digitise frames programmatically as our catalogue grows?
>
> *[Fittingbox]* 6. Is your database of digitised frames accessible to a publisher that is not itself a retailer?
>
> We would rather understand the commercial boundaries now than after building on top of the technology. Happy to jump on a short call.
>
> Best regards,
> Sergio

**Enviar a:** Fittingbox · Jeeliz · Banuba · Perfect Corp.

**Cómo registrar la respuesta:** una fila por proveedor en `results/findings.md`, con la respuesta literal a la pregunta 1. Si es ambigua, repreguntar: para G4 solo cuenta un **sí por escrito**.

---

<a id="consentimiento"></a>

## Consentimiento para las fotos

Las 5 personas deben aceptar **por escrito** antes de hacer ninguna foto. Vale un mensaje de WhatsApp con el texto aceptado.

> Voy a hacer una prueba técnica interna de una tecnología que superpone gafas sobre fotos de personas.
>
> **Qué necesito:** dos fotos tuyas de la cara.
>
> **Qué voy a hacer con ellas:** enviarlas a varios proveedores de IA (Google, fal.ai y alguno más) que generarán imágenes tuyas con distintas gafas puestas. Esas imágenes las vamos a puntuar para decidir si la tecnología sirve.
>
> **Quién las va a ver:** solo yo y las 1–2 personas que puntúen los resultados.
>
> **Cuánto tiempo:** se borran en cuanto termine la prueba, como máximo en 30 días. No se publican en ningún sitio, no se suben a internet, no se usan para entrenar nada y no se usan en marketing.
>
> **Tus derechos:** puedes decirme que las borre en cualquier momento, sin dar explicaciones y sin que haga falta motivo.
>
> ¿Me confirmas que estás de acuerdo?

**Obligaciones que esto nos impone:**

- las fotos viven solo en `research/b1-tryon-benchmark/faces/`, que está excluido de git;
- se borran al cerrar B1 — paso 20 del protocolo;
- si alguien pide el borrado, se borran también los outputs generados a partir de sus fotos;
- si más adelante queremos usar algún resultado como ejemplo público, hay que **volver a pedir permiso** específicamente para eso. Este consentimiento no lo cubre.
