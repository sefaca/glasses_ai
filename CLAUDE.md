# CLAUDE.md — AI Eyewear Finder / Virtual Try-On

> Documento maestro para Claude Code. Este archivo define el contexto del producto, la hipótesis de negocio, el alcance del MVP, la arquitectura, las decisiones técnicas y las reglas de producto que deben respetarse durante el desarrollo.
>
> Fecha de referencia: 2026-09-25.

---

## 0. INSTRUCCIÓN PRINCIPAL PARA CLAUDE

Estamos construyendo un producto **B2C, web-first y globalizable** para ayudar a una persona a encontrar gafas que le sienten bien y probar virtualmente modelos reales antes de comprarlos.

La experiencia central es:

1. El usuario entra en la web.
2. Sube una foto de su cara.
3. El sistema analiza proporciones faciales y preferencias de estilo.
4. Le muestra una selección pequeña de gafas/modelos que podrían encajar con sus características.
5. Puede probarse virtualmente una o varias.
6. Puede comparar resultados.
7. Puede pulsar para comprar el modelo en el retailer/brand correspondiente.
8. La monetización futura combina afiliación + créditos/try-ons premium, sin depender de una suscripción obligatoria.

### Restricciones de producto NO negociables

- NO construir una app nativa en esta fase.
- NO construir B2B como negocio principal.
- NO convertir el proyecto en una herramienta para ópticas o retailers.
- NO empezar por un catálogo gigantesco.
- NO construir un complejo sistema de recomendación basado únicamente en un LLM.
- NO depender del SEO de la query exacta «qué gafas me quedan bien».
- NO almacenar fotos de usuarios indefinidamente por defecto.
- NO afirmar que una recomendación es objetivamente «la que mejor te queda» como si fuera una medición científica.
- NO generar páginas SEO vacías o programáticas sin contenido/valor real.
- NO bloquear la primera experiencia detrás de registro obligatorio.

### Principio rector

El producto no debe venderse mentalmente como «una IA que analiza caras».

Debe resolverse como:

> **«Descubre qué gafas te pueden quedar bien, pruébatelas en tu propia cara y encuentra dónde comprarlas.»**

La IA es el mecanismo. El resultado que compra el usuario es **confianza para elegir**.

---

# 1. CONTEXTO DE NEGOCIO

## 1.1. Hipótesis original

La idea inicial era crear una experiencia en la que una persona pudiera subir una foto y recibir recomendaciones personalizadas de gafas según su cara, con prueba virtual generada por IA.

La intuición era que existe fricción al comprar gafas online:

- no sé qué forma me favorece;
- no sé si una montura me quedará grande/pequeña;
- me gusta el modelo pero no sé cómo se verá en mi cara;
- las fotografías de ecommerce muestran a modelos, no a mí;
- comparo muchas gafas pero no tengo una forma objetiva de reducir opciones.

## 1.2. Corrección importante después de revisar Google Trends

Las búsquedas long-tail explícitas relacionadas con «qué gafas me quedan bien» fueron mucho más débiles en Google Trends de lo esperado, especialmente en España.

Esto NO significa que haya cero búsquedas: Google Trends normaliza los datos y las consultas de muy bajo volumen pueden aparecer como 0. Pero sí significa que **no debemos asumir que existe una enorme demanda SEO alrededor de esa frase exacta**.

La demanda visible es mucho más fuerte alrededor de:

- gafas;
- gafas de sol;
- gafas de sol hombre/mujer;
- gafas Ray-Ban y otras marcas;
- estilos concretos;
- gafas rectangulares;
- gafas cuadradas;
- gafas aviador;
- gafas ovaladas/redondas;
- tendencias de gafas;
- modelos concretos.

Por tanto, el negocio debe capturar una intención de compra ya existente y añadir encima la capa de personalización.

### Nueva hipótesis

> **Existe demanda para descubrir/comprar gafas; la oportunidad consiste en convertir esa demanda genérica en una experiencia de selección personalizada + prueba virtual + click de compra.**

No debemos construir la empresa suponiendo que la gente entra en Google buscando únicamente «gafas según forma de cara».

---

# 2. INVESTIGACIÓN DE MERCADO ACTUAL QUE DEBE GUIAR EL PRODUCTO

## 2.1. Señales de demanda

En Google Trends, a escala mundial, «sunglasses» domina claramente frente a las consultas de nicho de face shape.

En España, «gafas de sol» tiene un interés muy superior al de muchas long-tails de análisis facial.

Las consultas relacionadas y tendencias observadas incluyen categorías como:

- gafas de sol mujer;
- gafas de sol hombre;
- gafas de sol tendencia 2026;
- gafas rectangulares;
- gafas cuadradas;
- gafas aviador;
- gafas de sol cool;
- gafas de sol modernas;
- Ray-Ban;
- Oakley;
- Meller.

Conclusión de producto:

**El SEO y el acquisition funnel deben empezar por producto/estilo/marca y llevar al usuario hacia la personalización.**

Ejemplo:

`Google -> gafas de sol rectangulares -> nuestra landing -> selección de modelos -> «Pruébatelas en tu cara» -> recomendación personalizada -> retailer.
`

No:

`Google -> qué gafas me quedan bien -> toda la estrategia depende de esa keyword.`

## 2.2. Mercado español

España sigue siendo importante como mercado inicial por:

- idioma nativo;
- menor necesidad de localización inicial;
- capacidad de generar contenido SEO de calidad en español;
- facilidad para probar adquisición orgánica/social;
- posibilidad de extender después al resto de mercados hispanohablantes.

Pero la arquitectura debe ser internacional desde el día 1.

### Mercado objetivo inicial recomendado

1. España.
2. México.
3. Colombia.
4. Argentina.
5. Chile/Perú.
6. USA hispano + mercado anglófono cuando el funnel esté validado.

No se debe traducir el producto a 10 idiomas antes de demostrar que el funnel funciona.

---

# 3. COMPETENCIA: ACTUALIZACIÓN IMPORTANTE

La investigación reciente demuestra que el espacio está más competido de lo que parecía inicialmente.

## 3.1. VisuTry

VisuTry ya ofrece en navegador:

- análisis de forma facial;
- recomendaciones personalizadas;
- virtual try-on desde foto;
- comparación de monturas;
- créditos;
- experiencia web/mobile;
- privacidad como parte del posicionamiento.

Esto es muy cercano a nuestra idea y debe considerarse **competidor directo**.

Referencia: https://www.visutry.com/

### Implicación

No podemos considerar diferenciador suficiente:

> «Somos una web en lugar de una app que analiza la cara y prueba gafas.»

Eso ya existe.

Necesitamos una propuesta más concreta.

## 3.2. SpecFit

SpecFit tiene una propuesta muy cercana, centrada en:

- selfie/face scan;
- try-on fotorealista;
- estilos;
- enlaces de tienda;
- créditos;
- medición PD;
- experiencia principalmente en iPhone/app.

Referencia: https://specfit.app/

También existe como app en App Store.

### Implicación

El enfoque web-first sigue siendo válido, pero no puede ser la única diferenciación.

## 3.3. Fotor / Dreamina / Mew Design

Existen herramientas generativas que permiten crear o probar virtualmente gafas a partir de una foto y un prompt/product image.

Ejemplos:

- Fotor: https://www.fotor.com/ai-image-generator/virtual-glasses-try-on/
- Dreamina: https://dreamina.capcut.com/ai-image/glasses-ai-try-on
- Mew Design: https://mew.design/create/ai-glasses-try-on

### Problema de estos enfoques

En general, la propuesta es una herramienta generativa muy amplia.

Nuestra oportunidad no debe ser «generar cualquier imagen con gafas», sino resolver la decisión de compra:

> qué modelos concretos debo probar -> cómo se ven en mi cara -> cuál compro -> dónde.

## 3.4. VirtualGlassesTryOn.ai

Existe una web centrada en probar gafas virtualmente desde una foto y seleccionar estilos.

Referencia: https://virtualglassestryon.ai/

Esto confirma que el concepto tiene demanda de producto, pero también que la barrera de entrada técnica está descendiendo.

## 3.5. Looksy

Looksy está orientado principalmente a retailers/ecommerce y ofrece virtual try-on de eyewear desde foto.

Referencia: https://looksy.tech/eyewear

No queremos copiar el modelo B2B. Sirve como evidencia de que el problema comercial de «no sé cómo me queda una montura» es reconocido por el mercado.

## 3.6. Banuba / Fittingbox

Hay proveedores especializados de virtual try-on para eyewear.

Banuba ofrece try-on web de gafas, tracking facial y soluciones específicas de eyewear.

Referencia: https://www.banuba.com/glasses-virtual-try-on

Fittingbox ofrece un ecosistema especializado de eyewear virtual try-on, incluyendo API/integración y un catálogo de monturas digitalizadas.

Referencia: https://fittingbox.com/en/resources/faq-eyewear-virtual-try-on-technology

### Implicación técnica

No debemos asumir que tenemos que desarrollar desde cero el motor de tracking/3D.

Debemos abstraer el proveedor de try-on y comparar:

- calidad;
- coste por generación/sesión;
- latencia;
- calidad de colocación;
- fidelidad del producto;
- cobertura de navegadores/dispositivos;
- facilidad para incorporar nuestros modelos;
- licencia comercial;
- condiciones de almacenamiento y tratamiento de imágenes.

---

# 4. POSICIONAMIENTO DEL PRODUCTO

## 4.1. Posicionamiento principal

Opciones iniciales:

> **Encuentra las gafas que mejor encajan contigo. Pruébatelas en tu propia cara.**

> **Descubre gafas que te favorecen y pruébatelas antes de comprar.**

> **Sube una foto. Descubre tus estilos. Pruébate gafas reales.**

La marca no debe quedar limitada a «face shape» porque en el futuro debe poder incorporar:

- estilo;
- color;
- tamaño;
- ocasión;
- presupuesto;
- marca;
- tendencia;
- gafas graduadas;
- gafas de sol.

## 4.2. Propuesta de valor

El producto debe combinar 4 capas:

### Capa 1 — Discovery

«No sé qué gafas elegir.»

### Capa 2 — Personalización

«Estas opciones parecen encajar conmigo.»

### Capa 3 — Visualización

«Ahora veo cómo quedan en mi cara.»

### Capa 4 — Compra

«Ya sé qué modelo quiero y dónde comprarlo.»

La capa 4 es económicamente fundamental.

---

# 5. DIFERENCIACIÓN QUE DEBEMOS PROBAR

La diferenciación recomendada no es una única feature; es la combinación:

## 5.1. Independent eyewear discovery

No somos una óptica, no somos una sola marca y no somos un plugin para ecommerce.

Somos una capa independiente de descubrimiento.

El usuario puede descubrir productos de distintas marcas/retailers.

## 5.2. Recommendation first, try-on second

No obligar al usuario a saber qué modelo quiere.

Ejemplo:

1. «Quiero gafas de sol.»
2. Analizamos.
3. Mostramos 6 modelos.
4. El usuario prueba 3.
5. Compara.
6. Compra.

Esto es mejor que presentar una caja vacía que dice «sube cualquier imagen de gafas».

## 5.3. Product fidelity

Cuando mostramos una marca/modelo real, la montura debe seguir siendo reconocible.

No sacrificar producto real por una imagen bonita.

## 5.4. Shopping intent

Cada recomendación debe poder acabar en:

`Pruébatelas -> Ver producto -> Comprar`

## 5.5. URL/image input como feature futura

Una feature potencialmente diferenciadora:

> «He encontrado estas Ray-Ban en una tienda. Pásame el enlace y pruébatelas.»

El sistema extrae:

- imagen;
- marca;
- modelo;
- precio;
- URL;
- atributos.

Esta feature puede ser más potente que simplemente ofrecer presets.

No es MVP obligatorio, pero la arquitectura debe permitirla.

---

# 6. PÚBLICO OBJETIVO

## Primario

Personas de 18–45 años con intención de comprar gafas online, especialmente gafas de sol.

Perfil:

- compra por ecommerce;
- usa Instagram/TikTok/Pinterest;
- compara modelos;
- valora estética;
- puede pagar entre ~€20 y €300+ dependiendo de marca;
- tiene dudas sobre ajuste visual/estilo;
- acepta subir una selfie si obtiene un beneficio claro.

## Secundario

Usuarios que simplemente quieren probar estilos por entretenimiento/social sharing.

Este segmento puede generar viralidad aunque no compre inmediatamente.

## No objetivo inicial

- profesionales ópticos;
- ópticas como clientes B2B;
- integraciones Shopify;
- empresas de moda;
- marcas como clientes SaaS;
- software empresarial;
- app nativa.

---

# 7. MVP REAL

El MVP no debe intentar resolver «todo el eyewear internet».

Debe resolver de forma excelente:

> **subo foto -> me das 6 opciones razonables -> puedo probar 1-3 -> puedo comparar -> puedo comprar.**

## 7.1. Tipos de producto iniciales

Empezar exclusivamente con:

- gafas de sol;
- gafas graduadas/ópticas básicas solo cuando el pipeline esté estable.

Prioridad: **gafas de sol**.

Razones:

- fuerte intención comercial;
- componente fashion alto;
- decisión muy visual;
- menor complejidad médica;
- mayor potencial de contenido social;
- menos restricciones de prescripción en la primera versión.

## 7.2. Catálogo inicial

No crear 5000 productos.

Objetivo inicial:

**20–50 modelos reales**.

Distribuir por:

- rectangular;
- square;
- round;
- oval;
- aviator;
- cat-eye;
- wayfarer/classic;
- geometric/oversized.

Con 3–8 modelos por categoría es suficiente para validar comportamiento.

## 7.3. Marcas iniciales

No asumir afiliación ni partnership.

Crear una base de productos que podamos vincular legalmente mediante fuentes permitidas/afiliación cuando exista.

Para pruebas internas podemos utilizar modelos de marcas conocidas como referencia, pero para producción deben revisarse:

- derechos de uso de imágenes;
- términos del retailer;
- afiliación;
- trademarks;
- feeds/API disponibles;
- políticas de scraping.

Marcas/categorías a investigar:

- Ray-Ban;
- Hawkers;
- Meller;
- Oakley;
- Persol;
- Polaroid Eyewear;
- marcas de ecommerce españolas/europeas;
- modelos asequibles.

No presentar una marca como partner si no existe acuerdo.

---

# 8. UX DETALLADA DEL MVP

## 8.1. LANDING

Objetivo: explicar el beneficio en <5 segundos.

Hero:

**«Descubre qué gafas te quedan bien. Pruébatelas en tu cara con IA.»**

Subheadline:

«Sube una foto, descubre estilos que encajan contigo y compara modelos antes de comprar.»

CTA principal:

**«Probar gratis»**

CTA secundaria:

«Explorar estilos»

Mostrar ejemplos reales de:

- foto original;
- recomendación;
- try-on;
- enlace a producto.

## 8.2. SELECTOR INICIAL

Antes o después de subir foto:

«¿Qué buscas?»

Opciones:

- Gafas de sol
- Gafas graduadas

Luego:

«¿Qué estilo te interesa?»

Opciones:

- No lo sé — recomiéndame
- Clásicas
- Modernas
- Oversized
- Minimalistas
- Retro
- Deportivas

Opcional:

Presupuesto:

- <50 €
- 50–100 €
- 100–200 €
- 200 €+

No pedir demasiadas preguntas antes de mostrar valor.

## 8.3. UPLOAD

Aceptar:

- JPG;
- JPEG;
- PNG;
- WEBP.

Recomendaciones visibles:

- cara frontal;
- buena iluminación;
- ojos visibles;
- sin filtros;
- preferiblemente sin gafas actuales;
- una sola persona.

El sistema debe hacer validación automática de calidad.

## 8.4. QUALITY CHECK

Antes de ejecutar IA cara/try-on:

- detectar si existe una cara;
- comprobar una única cara;
- comprobar orientación razonable;
- comprobar que ojos están visibles;
- comprobar resolución mínima;
- comprobar si existe oclusión fuerte.

Si falla:

«Necesitamos una foto más frontal y con mejor luz.»

Nunca enviar imágenes claramente inservibles al proveedor caro.

## 8.5. FACE ANALYSIS

Extraer principalmente geometría/atributos visuales útiles para monturas:

- ratio ancho/alto de cara;
- anchura relativa de mandíbula;
- anchura relativa de pómulos;
- anchura de frente;
- posición de ojos;
- distancia interpupilar aproximada cuando sea técnicamente viable;
- inclinación de cabeza;
- simetría aproximada;
- contorno/shape estimado.

Clasificación orientativa:

- oval;
- round;
- square;
- oblong/long;
- heart;
- diamond;
- unknown/mixed.

### Importante

La clasificación debe presentarse como **orientativa**.

No decir:

«Tu cara es objetivamente X.»

Preferir:

«Tu rostro parece encajar principalmente con X, con algunas características de Y.»

## 8.6. RESULTADO

Mostrar inmediatamente:

### Tu perfil de estilo

Ejemplo:

«Rostro predominantemente ovalado»

«Suelen funcionar bien monturas equilibradas y ligeramente estructuradas.»

Luego:

### Gafas que probaría primero

Mostrar 6 cards.

Cada card:

- imagen producto;
- marca;
- modelo;
- precio aproximado;
- forma;
- ancho;
- score interno no visible o etiqueta «Buena combinación»;
- explicación de una línea;
- CTA «Probarme».

## 8.7. TRY-ON

Al pulsar «Probarme»:

1. mostrar loading claro;
2. indicar que la imagen se está procesando;
3. generar el resultado;
4. mostrar comparación original/result;
5. permitir probar otro modelo.

Estados:

- queued;
- processing;
- completed;
- failed.

Nunca bloquear la UI esperando un request largo sin feedback.

## 8.8. COMPARACIÓN

Permitir comparar 2–4 resultados.

Vista:

- mismo recorte/foto;
- modelos side-by-side;
- botón «Elegir»;
- botón «Ver producto».

## 8.9. CTA DE COMPRA

Debe existir:

**«Ver dónde comprar»**

Puede abrir retailer externo.

Registrar el outbound click.

No sustituir la compra en ecommerce propio en MVP.

---

# 9. MODELO DE RECOMENDACIÓN

No utilizar un LLM como juez principal de los productos.

La lógica inicial debe ser determinista y explicable.

## 9.1. Datos del usuario

`FaceProfile`

Campos conceptuales:

- face_shape_primary;
- face_shape_secondary;
- face_width_height_ratio;
- jaw_width_ratio;
- cheekbone_width_ratio;
- forehead_width_ratio;
- eye_distance_ratio;
- head_tilt;
- confidence;
- preferences;
- budget;
- gender/preference solo si el usuario lo aporta y es útil para el catálogo, nunca inferirlo por la cara.

## 9.2. Datos de una montura

`FrameProfile`

- brand;
- model;
- product_url;
- image_url;
- price;
- currency;
- category;
- shape;
- width;
- bridge_width;
- temple_length;
- lens_height;
- frame_thickness;
- color;
- color_family;
- material;
- style_tags;
- gender_tag solo si viene de producto/fuente, no inferido.

## 9.3. Score inicial configurable

El score debe ser configurable en DB/config y no hardcodeado en múltiples componentes.

Ejemplo inicial:

- 35% compatibility with face geometry;
- 25% relative frame scale;
- 15% user style preference;
- 10% color/contrast compatibility;
- 15% category/trend/other fit.

No tratar estos pesos como científicamente validados.

Son **hipótesis de producto** que deben calibrarse con datos reales.

## 9.4. Explicaciones

La explicación puede ser templated:

«La montura rectangular añade líneas más definidas y tiene un ancho equilibrado respecto a tu rostro.»

Más adelante un LLM puede enriquecer el lenguaje, pero nunca debe inventar medidas o características del producto.

---

# 10. TRY-ON: ARQUITECTURA

## 10.1. Regla fundamental

Crear una abstracción `TryOnProvider`.

No acoplar toda la aplicación a un único proveedor.

Interfaz conceptual:

```ts
interface TryOnProvider {
  createTryOn(input: {
    userImageUrl: string
    frameImageUrl: string
    frameMetadata?: FrameMetadata
  }): Promise<TryOnJob>

  getJob(jobId: string): Promise<TryOnResult>
}
```

## 10.2. Proveedores a evaluar

### Opción especializada

- Banuba
- Fittingbox

Ventaja: eyewear específico y potencialmente mejor fidelidad/AR/fit.

### Opción generativa

Evaluar proveedores generativos capaces de imagen-a-imagen/edición.

Ejemplos a investigar:

- Gemini image generation/editing;
- fal.ai con modelos comerciales;
- otros proveedores especializados.

No asumir que un modelo generativo generalista conservará perfectamente una montura real.

## 10.3. Estrategia de MVP

Antes de cerrar proveedor, hacer benchmark real sobre 10–20 fotos y 10 modelos.

Matriz:

| Criterio | Peso | Evaluación |
|---|---:|---|
| Fidelidad de montura | 30% | manual |
| Colocación/alineación | 25% | manual |
| Realismo | 15% | manual |
| Latencia | 10% | medido |
| Coste | 10% | €/try-on |
| Integración web | 5% | técnico |
| Privacidad/retención | 5% | contractual/técnico |

Estos pesos son para priorización interna, no un ranking público del proveedor.

## 10.4. Fallback

Si el proveedor generativo falla:

- permitir reintento;
- no cobrar el try-on fallido;
- registrar error provider-specific;
- evitar consumir créditos múltiples por retries automáticos sin control.

---

# 11. ARQUITECTURA TÉCNICA RECOMENDADA

## Stack

- Next.js + React + TypeScript;
- App Router;
- Tailwind CSS;
- componentes accesibles y simples;
- Supabase PostgreSQL;
- Supabase Storage;
- Vercel para deployment;
- Stripe para pagos cuando se active monetización;
- proveedor externo de try-on detrás de adapter server-side.

Next.js encaja porque necesitamos:

- SEO fuerte;
- páginas públicas indexables;
- SSR/metadata;
- API/server actions;
- experiencia web mobile-first.

Vercel soporta deployment directo de Next.js y escalado global.

## No usar en MVP salvo necesidad real

- microservicios;
- Kubernetes;
- vector DB;
- event streaming complejo;
- Redis obligatorio;
- CMS complejo;
- app nativa;
- backend Python separado.

La arquitectura debe ser modular, no distribuida.

---

# 12. ESTRUCTURA DE PROYECTO SUGERIDA

```text
/
  app/
    page.tsx
    try/
      page.tsx
    results/
      page.tsx
    styles/
      page.tsx
    brands/
      [brand]/
        page.tsx
    products/
      [slug]/
        page.tsx
    api/
      analyze/
        route.ts
      try-on/
        route.ts
      analytics/
        route.ts
      outbound/
        route.ts
    legal/
      privacy/page.tsx
      terms/page.tsx
      cookies/page.tsx
  components/
    upload/
    analysis/
    recommendations/
    try-on/
    compare/
    product/
    ui/
  lib/
    face/
    recommendations/
    tryon/
      provider.ts
      banuba.ts
      fittingbox.ts
      generative.ts
    catalog/
    analytics/
    privacy/
    stripe/
  supabase/
    migrations/
  public/
    images/
  tests/
  CLAUDE.md
```

La estructura real puede ajustarse al framework/versiones actuales, pero deben mantenerse estas separaciones conceptuales.

---

# 13. DATA MODEL INICIAL

## users

No obligatorio para anonymous users.

Campos futuros:

- id;
- email;
- created_at;
- locale;
- marketing_consent.

## anonymous_sessions

- id;
- anonymous_id;
- created_at;
- expires_at;
- locale;
- source;
- campaign;

## face_analyses

- id;
- session_id;
- user_id nullable;
- status;
- face_shape_primary;
- face_shape_secondary;
- measurements_json;
- confidence;
- created_at;
- expires_at;

No guardar imagen aquí.

## uploaded_images

- id;
- session_id;
- storage_path;
- mime_type;
- byte_size;
- created_at;
- expires_at;
- purpose;
- deleted_at;

Configurar expiración corta.

## frames

- id;
- brand_id;
- slug;
- model_name;
- product_url;
- affiliate_url nullable;
- price;
- currency;
- image_url;
- width nullable;
- bridge_width nullable;
- temple_length nullable;
- shape;
- category;
- color;
- material;
- style_tags;
- active;
- source;
- updated_at.

## brands

- id;
- name;
- slug;
- logo_url;
- website_url;
- active;

## recommendations

- id;
- analysis_id;
- frame_id;
- score;
- score_breakdown_json;
- position;
- explanation;

## try_on_jobs

- id;
- session_id;
- frame_id;
- provider;
- provider_job_id;
- status;
- cost_estimate;
- result_path;
- error_code;
- created_at;
- completed_at;
- expires_at;

## outbound_clicks

- id;
- session_id;
- frame_id;
- retailer;
- destination_domain;
- created_at;

## purchases/credits future

No implementar hasta que el uso gratuito esté demostrado.

---

# 14. PRIVACIDAD / RGPD

Este apartado es crítico porque se manejan fotografías faciales.

Una fotografía de una persona puede ser un dato personal cuando la persona es identificable. El RGPD define como dato biométrico el dato obtenido mediante tratamiento técnico específico relativo a características físicas/fisiológicas/conductuales que permitan o confirmen la identificación única de una persona. Esto significa que no debemos asumir automáticamente que cualquier análisis de forma facial es «dato biométrico de categoría especial», pero sí debemos tratar la fotografía y el pipeline como tratamiento de datos personales y diseñarlo con minimización desde el principio.

Referencia RGPD: https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=celex%3A32016R0679

AEPD: las medidas de protección deben establecerse en función del riesgo, y la protección de datos por defecto exige minimizar cantidad, alcance, plazo y accesibilidad del tratamiento.

Referencias:

- https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/medidas-de-cumplimiento/seguridad-de-los-tratamientos
- https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/medidas-de-cumplimiento/proteccion-de-datos-por-defecto

## Regla técnica

**No guardar la foto indefinidamente.**

Arquitectura preferida:

1. Upload a bucket privado.
2. Procesamiento.
3. Generación de resultado.
4. Mostrar al usuario.
5. Borrar original y derivados después de un periodo corto, salvo que el usuario haya creado explícitamente una cuenta/historial y exista base jurídica/información adecuada.

Usar signed URLs con expiración.

Supabase soporta signed URLs temporales para archivos privados.

## No hacer

- no entrenar modelos con las fotos sin consentimiento específico;
- no vender datos;
- no hacer reconocimiento de identidad;
- no buscar quién es una persona;
- no generar perfiles de identidad;
- no inferir atributos sensibles;
- no usar la cara para publicidad personalizada sin justificación/legal basis adecuada;
- no guardar la cara «por si acaso».

## Consentimiento/información

Antes del upload debe existir una explicación clara de:

- para qué se usa la foto;
- qué proveedor puede procesarla;
- cuánto tiempo se conserva;
- cuándo se elimina;
- si se utiliza almacenamiento;
- derechos del usuario;
- tratamiento internacional cuando proceda.

Antes de producción debe revisarse el flujo legal con asesoramiento profesional, especialmente por la combinación de fotografía facial + proveedores de IA.

---

# 15. SEGURIDAD

## Storage

Bucket privado.

Nunca exponer permanentemente URLs de imágenes de usuarios.

## API keys

Nunca poner claves de proveedores de IA en frontend.

Toda llamada a proveedor debe pasar por server-side.

## Rate limiting

Obligatorio desde el primer día para endpoints caros:

- analyze;
- try-on;
- image processing.

Limitar por:

- anonymous session;
- IP cuando proceda;
- device/session token;
- abuse signals.

No utilizar IP como único mecanismo de identidad.

## Upload security

Validar:

- MIME;
- extensión;
- tamaño;
- dimensiones;
- contenido real;
- decodificación de imagen;
- límite de megapíxeles.

Re-encodear la imagen tras upload si es necesario.

---

# 16. MONETIZACIÓN

No lanzar con un paywall duro antes de demostrar engagement.

## Fase inicial

Gratis:

- análisis;
- una primera experiencia de try-on.

Después:

**pack de créditos**, no necesariamente suscripción.

Ejemplo a testear:

- 1 try-on gratis;
- 10 try-ons por 2,99 €;
- 25 try-ons por 5,99 €.

No considerar estos precios como definitivos.

La intención es medir disposición a pagar.

## Afiliación

Modelo potencialmente más importante a medio plazo.

Cada modelo puede tener:

- URL directa;
- affiliate URL;
- retailer;
- tracking source.

Ingresos:

`click -> retailer -> compra -> comisión`

No asumir una comisión concreta hasta verificar programas reales por retailer/país.

## Orden de prioridad

1. Engagement.
2. Try-ons por usuario.
3. Clicks a producto.
4. Conversiones afiliadas.
5. Pago por créditos.

El producto no necesita ser un SaaS de suscripción para funcionar.

---

# 17. ANALYTICS — OBLIGATORIO DESDE EL MVP

El objetivo del MVP es aprender, no solamente tener una web bonita.

## Eventos mínimos

```text
landing_view
click_try_free
upload_started
upload_completed
upload_failed
face_detected
face_analysis_completed
recommendations_viewed
recommendation_clicked
try_on_started
try_on_completed
try_on_failed
compare_opened
compare_frame_selected
outbound_product_click
credit_paywall_viewed
checkout_started
checkout_completed
```

Añadir metadata no sensible:

- locale;
- device type;
- source;
- campaign;
- referrer;
- landing page;
- category;
- frame id.

No incluir la fotografía ni contenido facial bruto en analytics.

## Funnel principal

```text
Visit
  ↓
Upload
  ↓
Analysis complete
  ↓
Recommendation viewed
  ↓
Try-on started
  ↓
Try-on completed
  ↓
Second try-on
  ↓
Product click
  ↓
Purchase / affiliate conversion
```

## KPIs prioritarios

### Activation

`analysis_completed / unique_landing_sessions`

### Try-on adoption

`try_on_started / analysis_completed`

### Try-on completion

`try_on_completed / try_on_started`

### Repeat exploration

`users_with_2+_tryons / users_with_1+_tryon`

### Shopping intent

`outbound_click / try_on_completed`

### Monetization

`paid_users / activated_users`

### Cost economics

`AI_cost / completed_tryon`

Y especialmente:

`affiliate_revenue_per_active_user`

---

# 18. SEO STRATEGY

## 18.1. Principio

No atacar solamente «qué gafas me quedan bien».

Crear páginas donde ya existe intención de producto/estilo.

## 18.2. Clusters

### Cluster A — categoría

- gafas de sol;
- gafas;
- gafas de sol hombre;
- gafas de sol mujer;
- gafas de ver.

### Cluster B — forma

- gafas rectangulares;
- gafas cuadradas;
- gafas redondas;
- gafas ovaladas;
- gafas aviador;
- gafas cat-eye;
- gafas geométricas;
- gafas oversized.

### Cluster C — marca

- gafas Ray-Ban;
- gafas Oakley;
- gafas Meller;
- etc.

### Cluster D — problema

- gafas para cara redonda;
- gafas para cara cuadrada;
- gafas para cara alargada;
- qué gafas me favorecen;
- etc.

Estas páginas existen como long-tail complementaria, no como columna vertebral del acquisition model.

### Cluster E — try-on

- probar gafas online;
- probar gafas de sol;
- gafas virtuales;
- probador de gafas;
- gafas con IA;
- virtual try-on glasses.

## 18.3. Páginas iniciales

```text
/
/gafas-de-sol
/gafas-de-sol/rectangulares
/gafas-de-sol/cuadradas
/gafas-de-sol/redondas
/gafas-de-sol/aviador
/gafas-de-sol/oversized
/gafas-de-sol/cat-eye
/marcas/ray-ban
/marcas/meller
/marcas/oakley
```

No generar cientos automáticamente al principio.

Primero construir 10–20 páginas excelentes.

## 18.4. Product pages

Cuando exista un producto real en catálogo:

```text
/productos/ray-ban-wayfarer-...
```

Incluir:

- producto;
- marca;
- atributos;
- precio vigente cuando esté verificado;
- imágenes;
- estilos compatibles;
- CTA try-on;
- CTA retailer.

Google documenta que `Product` structured data puede hacer que las páginas de producto sean elegibles para experiencias de merchant listing/product snippets cuando se cumplen los requisitos.

Referencias:

- https://developers.google.com/search/docs/appearance/structured-data/product
- https://developers.google.com/search/docs/appearance/structured-data/merchant-listing

## 18.5. Google Images

El producto es visual.

Optimizar:

- filenames descriptivos;
- alt text;
- titles;
- páginas indexables;
- imágenes accesibles a Googlebot;
- contexto textual relevante.

Referencia: https://developers.google.com/search/docs/appearance/google-images

---

# 19. CONTENIDO

No montar un blog genérico de IA.

Contenido orientado a intención de compra.

Ejemplos:

- «Gafas de sol rectangulares: modelos que puedes probar online»
- «Gafas aviador: cómo elegir tamaño y estilo»
- «Ray-Ban Wayfarer: tamaños, estilos y cómo probarlas online»
- «Gafas de sol para cara redonda: formas que merece la pena probar»
- «Oversized vs rectangular: qué cambia visualmente»

Cada artículo debe llevar al producto/try-on.

---

# 20. SOCIAL / ACQUISITION

El producto tiene una ventaja visual para social media.

Formatos:

### Formato 1

«Le he pedido a la IA que me recomiende gafas según mi cara.»

### Formato 2

«Probando 5 gafas virales en mi propia cara.»

### Formato 3

«¿Ray-Ban o Oakley? Veamos cuál queda mejor.»

### Formato 4

«Tengo cara redonda. ¿Qué gafas me quedan mejor?»

Crear antes/después o comparativas de forma muy visual.

Canales iniciales:

- TikTok;
- Instagram Reels;
- Pinterest;
- YouTube Shorts.

No depender exclusivamente de paid ads.

---

# 21. INTERNACIONALIZACIÓN

La web debe soportar i18n desde el día 1.

Primero:

- `es-ES`
- `en-US` o `en`

No lanzar 10 idiomas de golpe.

## Reglas

- strings fuera de componentes;
- URLs localizables;
- metadata por idioma;
- hreflang cuando corresponda;
- moneda por país;
- precios localizados;
- affiliate retailer por país.

### Estrategia

Producto técnicamente global desde el principio.

Marketing/SEO inicialmente España.

Después:

España -> LATAM -> inglés.

---

# 22. BRANDING Y NOMBRES

## 22.1. Criterios

El nombre debe:

- pronunciarse fácilmente en español e inglés;
- no exigir la palabra «AI»;
- permitir ampliar producto más allá de face shape;
- no sonar a óptica local;
- poder funcionar como marca B2C;
- ser corto;
- idealmente tener `.com` disponible a precio estándar;
- no tener marcas competidoras fuertes;
- permitir naming para dominio y redes.

## 22.2. Nombres descartados

### Lensora

NO usar.

Ya existen varias marcas/webs con ese nombre, incluyendo una marca española de eyewear personalizada y un sitio de fotografía/cámaras.

### Framio

NO usar.

Existe en distintos contextos y además no transmite claramente nuestro producto.

### FrameWise

NO usar.

Existe en múltiples productos/software.

### SpecFit

NO usar.

Existe una app de eyewear/virtual try-on y otras iniciativas relacionadas.

### Lookora

NO usar.

Existe una plataforma de fashion AI/try-on.

### Trylense

NO usar.

Existe una marca de eyewear con virtual try-on.

## 22.3. Candidatos a investigar

### 1. Fitalens

Ventajas:

- transmite «fit + lens»;
- fácil de entender en inglés;
- tech pero no excesivamente IA;
- permite una identidad visual limpia.

Dominios a comprobar:

- fitalens.com
- fitalens.es
- fitalens.ai (solo si se desea y el coste se justifica)

### 2. Frameora

Ventajas:

- suena a marca;
- contiene «frame»;
- no limita el producto al análisis facial;
- buen potencial visual.

Dominios a comprobar:

- frameora.com
- frameora.es

### 3. Gafora

Ventajas:

- conecta inmediatamente con «gafas» para público hispanohablante;
- corto;
- fácil de recordar.

Desventaja:

- menos internacional que Fitalens/Frameora.

Dominios:

- gafora.com
- gafora.es

### 4. Vistria

Ventajas:

- abstracto;
- potencialmente internacional;
- no limita el producto a gafas para siempre.

Dominios:

- vistria.com
- vistria.es

### 5. Optifora

Ventajas:

- contiene raíz relacionada con óptica;
- suena a producto tecnológico.

Desventaja:

- más «genérico» y potencialmente parecido a marcas del sector óptico.

Dominios:

- optifora.com
- optifora.es

## 22.4. Screening actual

En una búsqueda rápida realizada el 25-09-2026 no aparecieron resultados indexados relevantes para:

- Fitalens;
- Frameora;
- Gafora;
- Vistria;
- Optifora.

Esto **NO demuestra disponibilidad registral**.

Antes de comprar cualquier dominio hay que:

1. comprobar disponibilidad en registrador en tiempo real;
2. comprobar marca en EUIPO;
3. comprobar OEPM si se pretende actividad en España;
4. comprobar redes sociales principales;
5. comprobar app stores;
6. comprobar GitHub;
7. comprobar conflicto fonético/ortográfico.

## 22.5. Dominio recomendado

Primera opción:

**`.com`**.

No hace falta pagar un `.ai` caro para que el producto parezca AI.

A fecha 2026, Namecheap publica como referencia alrededor de:

- `.com`: aproximadamente $11–15/año de registro según promoción/precio; renovación publicada alrededor de $18.48/año.
- `.es`: alrededor de $18.98/año en la página consultada.
- `.co`: puede tener una promoción inicial muy barata, pero la renovación publicada es mucho más alta (aprox. $45.48/año), por lo que no es mi primera elección si buscamos coste recurrente bajo.
- `.ai`: es sensiblemente más caro; Namecheap publica actualmente $179.96 por el mínimo de 2 años y $229.96 por renovación de 2 años.

Referencias:

- https://www.namecheap.com/domains/registration/gtld/com/
- https://www.namecheap.com/domains/registration/cctld/es/
- https://www.namecheap.com/domains/registration/cctld/co/
- https://www.namecheap.com/domains/registration/cctld/ai/

### Estrategia

Comprar `.com` si está disponible a precio normal.

Si el `.es` también está disponible a coste normal y el mercado inicial es España, se puede comprar de forma defensiva y redirigirlo al `.com`.

No pagar cientos/miles de euros por un dominio premium en esta fase.

---

# 23. QUÉ HAY QUE HACER ANTES DE PROGRAMAR MUCHO

## Fase 0 — VALIDACIÓN DE MERCADO

### Paso 1 — Keyword research real

No utilizar Google Trends como sustituto de search volume.

Conseguir datos para España y posteriormente mercados internacionales de:

- keyword;
- monthly volume;
- CPC;
- competition/difficulty;
- search intent;
- SERP features.

Clústeres:

`gafas de sol`
`gafas`
`gafas de sol mujer`
`gafas de sol hombre`
`gafas Ray-Ban`
`gafas rectangulares`
`gafas cuadradas`
`gafas aviador`
`gafas redondas`
`probar gafas online`
`gafas virtuales`
`gafas con IA`
`virtual glasses try on`
`try glasses online`
`what glasses suit me`

Países:

- Spain;
- Mexico;
- Colombia;
- Argentina;
- USA;
- UK.

Fuentes posibles:

- Google Keyword Planner;
- Semrush;
- Ahrefs;
- DataForSEO/u otra API si se necesita automatizar.

No inventar volúmenes.

## Paso 2 — benchmark de proveedores de try-on

Crear dataset de test:

- 10 rostros;
- 10 monturas;
- 100 combinaciones.

Medir:

- calidad;
- fidelidad;
- tiempo;
- coste;
- fallos.

## Paso 3 — benchmark de competidores

Para cada competidor registrar:

- propuesta de valor;
- onboarding;
- número de pasos;
- si requiere cuenta;
- precio;
- créditos;
- tipo de try-on;
- catalog/brands;
- link to purchase;
- países/idiomas;
- velocidad;
- privacidad;
- SEO footprint.

Competidores mínimos:

- VisuTry;
- SpecFit;
- Fotor;
- Dreamina;
- Mew Design;
- VirtualGlassesTryOn.ai;
- Looksy;
- Banuba;
- Fittingbox;
- 3–5 retailers españoles relevantes.

## Paso 4 — dominio + marca

Seleccionar 3 finalistas.

No comprar 10 dominios.

---

# 24. FASE 1 — PROTOTIPO FUNCIONAL

Objetivo: comprobar que una persona real completa el flujo.

Implementar:

- landing;
- upload;
- face quality check;
- analysis;
- 20–50 frames;
- 6 recommendations;
- 1 try-on gratuito;
- product links;
- analytics.

No implementar todavía:

- cuentas completas;
- social login;
- favoritos avanzados;
- historial ilimitado;
- miles de productos;
- recomendaciones sociales complejas;
- app;
- admin B2B.

---

# 25. FASE 2 — MONETIZACIÓN Y RETENCIÓN

Cuando haya suficiente uso:

- Stripe;
- credit packs;
- history;
- favoritos;
- shareable results;
- email magic link opcional;
- affiliate links;
- country-specific retailers.

---

# 26. FASE 3 — PRODUCT DISCOVERY AVANZADO

Features futuras:

## Buscar por imagen

Usuario sube screenshot de unas gafas.

Sistema intenta identificar modelo/atributos.

## Buscar por URL

Usuario pega URL de una tienda.

Sistema extrae producto.

## «Encuentra alternativas»

Si un modelo cuesta 250 €, mostrar:

- similares por forma;
- similares por estilo;
- más baratos.

## «Pruébate esta tendencia»

Landing de tendencias:

- rectangular;
- aviador;
- oversized;
- cat-eye;
- etc.

## Comparador

«Compara 4 modelos en tu cara.»

## Share card

Resultado visual diseñado para compartir.

---

# 27. ROADMAP DE IMPLEMENTACIÓN

## Sprint 0 — Investigación

Entregables:

- lista de keywords;
- tabla de competidores;
- benchmark providers;
- shortlist de nombres;
- decisión inicial de dominio.

## Sprint 1 — UX + shell

Entregables:

- Next.js;
- layout;
- landing;
- design system;
- responsive;
- analytics;
- i18n foundation.

## Sprint 2 — Face analysis

Entregables:

- upload;
- quality checks;
- face landmarks;
- face profile;
- deterministic recommendation engine.

## Sprint 3 — Catalog

Entregables:

- Supabase schema;
- products;
- brands;
- styles;
- first 20–50 models;
- admin seed mechanism.

## Sprint 4 — Try-on

Entregables:

- provider adapter;
- queue/status;
- image result;
- error handling;
- usage accounting.

## Sprint 5 — Purchase flow

Entregables:

- outbound clicks;
- tracking;
- affiliate URLs;
- product page;
- basic SEO.

## Sprint 6 — Paywall

Solo si hay suficiente engagement:

- credit packs;
- Stripe;
- receipts;
- entitlement system.

---

# 28. DEFINICIÓN DE «MVP LISTO»

El MVP está listo cuando un usuario puede:

1. entrar sin cuenta;
2. entender el producto;
3. subir selfie;
4. recibir feedback si la foto es mala;
5. completar análisis;
6. ver al menos 6 recomendaciones;
7. entender por qué cada una aparece;
8. probar al menos una;
9. recibir un resultado usable;
10. probar un segundo modelo;
11. comparar;
12. ir al retailer;
13. nosotros registramos todos los eventos principales;
14. la foto no queda almacenada indefinidamente;
15. las API keys no están expuestas;
16. los errores de proveedor no rompen el producto;
17. la experiencia funciona bien en móvil.

---

# 29. PRINCIPIOS DE ENGINEERING

## 29.1. Simplicidad

Preferir una solución sencilla y sustituible antes que una arquitectura prematuramente sofisticada.

## 29.2. Provider abstraction

Todas las APIs externas caras deben estar detrás de adaptadores.

## 29.3. No hardcodear negocio

Los productos, pesos, categorías y textos principales deben ser configurables.

## 29.4. Mobile-first

La mayoría de usuarios probablemente llegará desde móvil/social.

## 29.5. SEO-first para páginas públicas

No esconder todo detrás de JS cliente si necesitamos indexación.

## 29.6. Observabilidad

Registrar:

- latencias;
- errores;
- coste estimado por try-on;
- provider;
- success rate.

## 29.7. Tests

Unit tests para:

- scoring;
- validation;
- provider adapters.

E2E para:

- landing -> upload -> recommendation -> try-on -> outbound.

---

# 30. REGLAS PARA CLAUDE CODE

Cuando implementes una feature:

1. Comprueba primero si ya existe una abstracción/utility que pueda reutilizarse.
2. No introduzcas una dependencia nueva si puede resolverse con el stack existente.
3. No implementes funcionalidades fuera del alcance del MVP salvo que sean necesarias para la arquitectura.
4. Mantén el código fuertemente tipado.
5. Los errores del proveedor nunca deben devolver secretos al cliente.
6. No pongas API keys en componentes cliente.
7. No hagas llamadas caras al proveedor durante renders o re-renders accidentales.
8. Los jobs largos deben ser asíncronos.
9. La UI debe mostrar estados claros.
10. Los try-ons fallidos deben poder reintentarse.
11. No cobrar un crédito por una generación que falla.
12. No guardar imágenes indefinidamente.
13. No registrar imágenes faciales en logs.
14. No registrar prompts/respuestas que contengan datos personales innecesarios.
15. No inferir atributos personales sensibles.
16. No utilizar reconocimiento de identidad.
17. No crear dashboards B2B.
18. No crear app nativa.
19. No convertir la aplicación en un generador de imágenes genérico.
20. Cada feature debe relacionarse con uno de estos objetivos: discovery, recommendation, try-on, compare, purchase o validation.

---

# 31. COPILOTO DE PRODUCTO: CÓMO DECIDIR QUÉ CONSTRUIR

Ante una nueva idea, puntuar mentalmente:

### ¿Reduce la fricción de elección?

### ¿Aumenta número de try-ons?

### ¿Aumenta probabilidad de click a producto?

### ¿Aumenta conversión?

### ¿Genera contenido/SEO?

### ¿Aumenta viralidad?

### ¿Reduce coste por usuario?

Si la respuesta es «no» a todas, probablemente no pertenece al MVP.

---

# 32. EXPERIMENTOS DE VALIDACIÓN

## Experimento A — ¿la gente quiere saber qué le queda?

Landing + upload + análisis.

Métrica:

`upload rate`

## Experimento B — ¿quieren probar recomendaciones?

Después del análisis:

`try-on rate`

## Experimento C — ¿quieren probar varias?

`2nd_try_on_rate`

## Experimento D — ¿hay intención comercial?

`outbound_click_rate`

## Experimento E — ¿pagan?

Mostrar crédito premium después de una experiencia gratuita.

`paywall_click -> checkout -> payment`

## Experimento F — ¿SEO convierte?

Medir por landing:

- organic sessions;
- uploads;
- try-ons;
- product clicks.

No optimizar solamente sesiones.

---

# 33. HIPÓTESIS ECONÓMICA

El modelo debe analizarse por usuario activo, no únicamente por sesiones.

Variables:

`CAC`

`AI_COST_PER_USER`

`TRY_ONS_PER_USER`

`AFFILIATE_REVENUE_PER_PURCHASE`

`PURCHASE_RATE_AFTER_CLICK`

`PAID_CREDIT_REVENUE`

Modelo conceptual:

```text
Revenue/user
 = affiliate revenue
 + paid try-on revenue

Contribution/user
 = revenue/user - AI cost/user - payment fees - variable infra
```

Objetivo inicial:

descubrir si el margen unitario puede ser positivo **sin necesidad de subscription obligatoria**.

No asumir todavía cifras concretas de afiliación ni conversiones.

---

# 34. PRIMERAS 10 TAREAS QUE CLAUDE DEBE EJECUTAR

Cuando se inicie el proyecto:

### Task 1

Crear el esqueleto Next.js + TypeScript + Tailwind.

### Task 2

Configurar Supabase y `.env` correctamente.

### Task 3

Crear design system mínimo.

### Task 4

Implementar landing mobile-first.

### Task 5

Implementar upload seguro.

### Task 6

Implementar quality check de imagen.

### Task 7

Implementar face landmarks/local analysis.

### Task 8

Implementar `FaceProfile` + scoring engine.

### Task 9

Crear catálogo seed de 20–50 modelos.

### Task 10

Crear interface `TryOnProvider` sin bloquear la aplicación a un proveedor específico.

Después:

### Task 11

Conectar primer provider.

### Task 12

Construir recommendations UI.

### Task 13

Construir try-on UI.

### Task 14

Construir compare.

### Task 15

Registrar outbound clicks.

### Task 16

Crear primeras páginas SEO.

### Task 17

Instrumentar funnel.

### Task 18

Implementar privacy/terms/cookies básicos.

---

# 35. CHECKLIST ANTES DE CADA DEPLOY

```text
[ ] npm/build pasa
[ ] tests pasan
[ ] lint pasa
[ ] no secrets en client bundle
[ ] no imágenes privadas indexables
[ ] upload limits activos
[ ] rate limiting activo
[ ] try-on timeout configurado
[ ] try-on failures controlados
[ ] analytics principales funcionando
[ ] metadata SEO presente
[ ] sitemap correcto
[ ] robots correcto
[ ] canonical correcto
[ ] mobile usable
[ ] privacy links presentes
[ ] eliminación/retención de imágenes configurada
```

---

# 36. DECISIONES QUE NO DEBEN TOMARSE SIN VALIDACIÓN

No decidir definitivamente aún:

- proveedor de try-on;
- pricing final;
- modelo de afiliación concreto;
- mercados internacionales definitivos;
- nombre final;
- si habrá suscripción;
- cantidad definitiva de catálogo;
- pesos del algoritmo de recomendación.

Todas son hipótesis a validar.

---

# 37. DECISIÓN ESTRATÉGICA ACTUAL

La dirección recomendada para el nuevo proyecto es:

> **B2C + web + gafas de sol primero + discovery + recommendation + virtual try-on + outbound purchase.**

La gran oportunidad no debe definirse como «ser la IA que sabe qué gafas van con tu cara» porque ya existen productos cercanos.

Debe definirse como:

> **«El lugar donde descubres, comparas y pruebas virtualmente gafas reales que puedes comprar, personalizadas a tu cara y preferencias.»**

Esto permite competir por intención de compra, no únicamente por una query long-tail.

---

# 38. SOURCES / REFERENCES

## Mercado / competencia

- VisuTry: https://www.visutry.com/
- VisuTry Glasses Advisor: https://www.visutry.com/en/face-analysis
- SpecFit: https://specfit.app/
- Fotor AI Glasses Try-On: https://www.fotor.com/ai-image-generator/virtual-glasses-try-on/
- Mew Design: https://mew.design/create/ai-glasses-try-on
- Dreamina: https://dreamina.capcut.com/ai-image/glasses-ai-try-on
- VirtualGlassesTryOn: https://virtualglassestryon.ai/
- Looksy: https://looksy.tech/eyewear
- Banuba: https://www.banuba.com/glasses-virtual-try-on
- Fittingbox: https://fittingbox.com/en/resources/faq-eyewear-virtual-try-on-technology

## AI/API

- Google Gemini image generation/editing: https://ai.google.dev/gemini-api/docs/image-generation
- FASHN API: https://docs.fashn.ai/
- fal Virtual Try-On: https://fal.ai/models/fal-ai/image-apps-v2/virtual-try-on/api

## Infra

- Supabase Storage signed URLs: https://supabase.com/docs/reference/javascript/file-buckets-createsignedurl
- Next.js on Vercel: https://vercel.com/docs/frameworks/full-stack/nextjs

## SEO

- Google Image SEO: https://developers.google.com/search/docs/appearance/google-images
- Google Product structured data: https://developers.google.com/search/docs/appearance/structured-data/product
- Google Merchant Listings: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing
- Product variants: https://developers.google.com/search/docs/appearance/structured-data/product-variants

## Privacy

- RGPD / EUR-Lex: https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=celex%3A32016R0679
- AEPD — seguridad de tratamientos: https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/medidas-de-cumplimiento/seguridad-de-los-tratamientos
- AEPD — protección de datos por defecto: https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/medidas-de-cumplimiento/proteccion-de-datos-por-defecto

## Domain pricing reference

- Namecheap .com: https://www.namecheap.com/domains/registration/gtld/com/
- Namecheap .es: https://www.namecheap.com/domains/registration/cctld/es/
- Namecheap .co: https://www.namecheap.com/domains/registration/cctld/co/
- Namecheap .ai: https://www.namecheap.com/domains/registration/cctld/ai/

---

# 39. RESUMEN PARA CLAUDE

**Estamos creando una web B2C globalizable para descubrir y probar gafas reales con IA.**

El usuario no debe sentir que está usando una herramienta técnica de computer vision. Debe sentir:

> «He subido mi foto y ahora sé qué gafas probar y dónde comprarlas.»

La prioridad técnica es conseguir una experiencia muy fluida y de alta calidad con pocos modelos, no construir una infraestructura enorme.

La prioridad de negocio es medir:

`upload -> recommendation -> try-on -> repeat try-on -> product click -> purchase`

La prioridad de adquisición es:

`gafas/gafas de sol/estilos/marcas -> landing SEO/social -> personalización -> try-on -> retailer`

El producto debe estar diseñado desde el día 1 para:

- móvil;
- SEO;
- internacionalización;
- privacidad;
- proveedor de try-on intercambiable;
- affiliate links;
- créditos de pago;
- catálogo creciente.

**No sobreconstruir. Validar con datos reales.**
