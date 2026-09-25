# Track 0 — Emails y consentimiento

> Se envía **el día 1 a primera hora, antes de generar ninguna imagen.** La latencia comercial (2–5 días) es el camino crítico del sprint, no nuestro tiempo de ejecución.

---

## Las 10 preguntas que hay que contestar

Ninguna se responde leyendo una web. **Ni Fittingbox ni Jeeliz publican condiciones comerciales** — la página «Terms» de Fittingbox es solo privacidad y Jeeliz no tiene página legal — así que el bloque C de B1 no se cierra sin estas respuestas.

Ordenadas por capacidad de invalidar el proyecto:

1. **Uso comercial.** ¿Podemos usarlo comercialmente, siendo un tercero que no es marca, retailer ni óptica?
2. **Multi-marca.** ¿Podemos mostrar monturas de varias marcas en el mismo producto?
3. **Productos que no vendemos.** ¿Podemos mostrar monturas que no vendemos nosotros?
4. **Sus assets 3D.** ¿Podemos usar monturas de su base de datos que no sean nuestras? *(la pregunta de las 200.000 de Fittingbox)*
5. **Tráfico saliente y afiliación.** ¿Podemos enlazar a tiendas externas y monetizar por afiliación?
6. **Riesgo de marca.** ¿Hay restricciones de trademark? **¿Quién responde si una marca reclama: ustedes o nosotros?**
7. **Límites.** ¿El precio escala por usuarios únicos, sesiones o try-ons? ¿Hay tramo para tráfico alto con conversión baja?
8. **Modo foto.** ¿Existe try-on desde foto subida además de cámara en vivo? ¿Expuesto por API o solo en el widget?
9. **UI propia y API.** ¿Podemos construir nuestra interfaz, o hay que usar su widget?
10. **RGPD y prueba.** ¿Dónde se procesa la foto — cliente o servidor? ¿Se almacena, dónde y cuánto? ¿Firman DPA? ¿Hay trial real para quien no es una marca establecida?

> **La 6 es la que más importa y la menos evidente.** Banuba, el único que publica sus términos, **no prohíbe** mostrar marcas de terceros: lo que hace es trasladarnos toda la responsabilidad —«You agree to defend, indemnify and hold harmless Banuba … from … Your Content»—. Lo más probable no es un «no», sino **«adelante, y si Luxottica reclama, es asunto tuyo»**. Preguntar solo por el sí/no deja pasar eso.

---

## Email base

> Asunto: **Technical evaluation — independent eyewear discovery platform**
>
> Hello,
>
> We are building an independent, multi-brand eyewear discovery platform for consumers in Spain. Users upload a photo, receive a small set of recommended frames, try them on virtually, compare the results and click through to the retailer's own store. We are not a retailer and we do not sell eyewear ourselves — we send qualified traffic to the brands and shops that do.
>
> We are currently evaluating virtual try-on providers and would like to understand the commercial boundaries before we build anything on top of the technology. We could not find these answers in your published documentation:
>
> 1. Does your licence allow an independent third party — not a brand, retailer or optician — to use your technology commercially?
> 2. Can we display frames from **several different brands** in the same experience?
> 3. Can we display frames that we do **not** sell ourselves?
> 4. Can we use frames from **your database** that are not ours?
> 5. Can we link out to external shops and monetise those clicks through **affiliate programmes**?
> 6. Are there trademark restrictions on the brands we display — and **if a brand objects, who is responsible, you or us?**
> 7. Does your pricing scale by unique users, sessions or try-ons? We expect high traffic with a low conversion rate, so this distinction matters a great deal to us.
> 8. Do you support try-on from a **user-uploaded photo** as well as live camera? Is that available through an API, or only inside your widget?
> 9. Can we build our own interface on top of your API, rather than using your widget?
> 10. Where is the user's photo processed — on device or on your servers? Is it stored, where, and for how long? Do you sign a GDPR data processing agreement? And is there a trial available to a company that is not yet an established brand?
>
> Question 6 is the one we most need a clear answer to. Happy to jump on a short call.
>
> Best regards,
> Sergio

**Enviar a:** Fittingbox · Jeeliz · Banuba · Perfect Corp. A Jeeliz, preguntar además por su **programa de resellers** para agencias: es la única vía publicada por la que alguien que no es marca ni retailer entra en su ecosistema.

**Cómo registrar la respuesta:** una fila por proveedor en `results/licence-matrix.md`, con la respuesta **literal** a las preguntas 2, 3 y 6. Para los gates GC-1, GC-2 y GC-3 solo cuenta un **sí por escrito**; una respuesta ambigua cuenta como no, y se repregunta.

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
