# Decision Log

> **Trazabilidad del proyecto.** Dentro de seis meses, «¿por qué descartamos el proveedor X?» tiene que tener respuesta con la evidencia que había entonces.
>
> Ni Project Brain ni Claude Code recuerdan nada entre conversaciones: **una decisión que no está aquí no existe** y se volverá a discutir desde cero. El estado resumido vive en [PROJECT_STATE.md](PROJECT_STATE.md); la evidencia larga, en [research/](../research/).

**Aviso sobre el arranque.** D-001…D-014 no son decisiones nuevas: son las que ya estaban implícitas en [CLAUDE.md](../CLAUDE.md), [README.md](../README.md) y [research/b1-tryon-benchmark/](../research/b1-tryon-benchmark/), transcritas aquí el 2026-09-25 por Claude Code. **El fundador debe ratificarlas o corregirlas**; hasta entonces son una lectura del repositorio, no decisiones firmadas. D-015 sí es nueva y sale del análisis de [affiliate-programs.md](../research/monetization/affiliate-programs.md).

## Status

| | Significado |
|---|---|
| **OPEN** | Tomada y en vigor. Su hipótesis no está contrastada y no hay experimento en marcha |
| **VALIDATING** | Hay un experimento definido y en curso que puede confirmarla o tumbarla |
| **VALIDATED** | El experimento concluyó a favor. Con la cifra delante |
| **INVALIDATED** | El experimento la tumbó. **Se deja escrita, no se borra** |
| **DEFERRED** | Aplazada a propósito, con condición de reapertura escrita |
| **REJECTED** | Descartada |

**Type:** DECISIÓN (elegimos) · RESTRICCIÓN (no negociable, no se valida) · HIPÓTESIS (creencia que sostiene el plan).
**Evidence:** **[D]** oficial · **[M]** marketing · **[T]** tercero · **[?]** no publicado · **[X]** medido por nosotros.

---

## Index

| ID | Date | Decision | Type | Status |
|---|---|---|---|---|
| [D-001](#d-001) | 2026-09-25 | B2C web-first multi-marca; ni app nativa ni B2B | RESTRICCIÓN | OPEN |
| [D-002](#d-002) | 2026-09-25 | RULE #1 — fidelidad de montura por encima del realismo | RESTRICCIÓN | OPEN |
| [D-003](#d-003) | 2026-09-25 | Gafas de sol primero; graduadas después | DECISIÓN | OPEN |
| [D-004](#d-004) | 2026-09-25 | Orden de Fase 0: B1 → B3 → B4 → B5 | DECISIÓN | OPEN |
| [D-005](#d-005) | 2026-09-25 | Presupuesto de Fase 0: ~15,50 € y ninguna suscripción | DECISIÓN | OPEN |
| [D-006](#d-006) | 2026-09-25 | No pagar suscripción de Clase A para evaluarla | DECISIÓN | OPEN |
| [D-007](#d-007) | 2026-09-25 | Landmarks en el navegador; la foto sale solo para el try-on | DECISIÓN | OPEN |
| [D-008](#d-008) | 2026-09-25 | La demanda se intercepta aguas arriba | HIPÓTESIS | VALIDATING |
| [D-009](#d-009) | 2026-09-25 | Nombres descartados por colisión de marca | DECISIÓN | REJECTED |
| [D-010](#d-010) | 2026-09-25 | Dominio y marca, aplazados | DECISIÓN | DEFERRED |
| [D-011](#d-011) | 2026-09-25 | Scoring determinista; el LLM no es juez | DECISIÓN | OPEN |
| [D-012](#d-012) | 2026-09-25 | Foto vs cámara: no decidir todavía | DECISIÓN | DEFERRED |
| [D-013](#d-013) | 2026-09-25 | Corrección: la Clase A tiene **mejor** postura de privacidad | HIPÓTESIS | VALIDATED |
| [D-014](#d-014) | 2026-09-25 | Tres capas de documentación; `research/` es la evidencia | DECISIÓN | OPEN |
| [D-015](#d-015) | 2026-09-25 | El try-on crea una obra derivada de la imagen oficial | HIPÓTESIS | **VALIDATED** |
| [D-016](#d-016) | 2026-10-08 | Corrección: el riesgo de licencia es de la Clase B, no de la Clase A | HIPÓTESIS | VALIDATED |
| [D-017](#d-017) | 2026-10-08 | Construir la plataforma antes de cerrar B1, con muro de gates | DECISIÓN | OPEN |
| [D-018](#d-018) | 2026-10-09 | Paleta: escenario neutro cálido + un acento coñac del producto | DECISIÓN | OPEN |
| [D-019](#d-019) | 2026-10-09 | No mostramos precios en nuestra interfaz | DECISIÓN | OPEN |
| [D-020](#d-020) | 2026-10-09 | Previsualización de proporción: esquema a escala, **no** try-on | DECISIÓN | OPEN |
| [D-021](#d-021) | 2026-10-09 | Corrección: nombrar no requiere permiso. Tres permisos, no uno | DECISIÓN | OPEN |
| [D-022](#d-022) | 2026-10-09 | Generar desde el conocimiento del modelo: tercera vía | HIPÓTESIS | OPEN |
| [D-023](#d-023) | 2026-10-11 | La shortlist de nombres está entera ocupada; `.io` descartado | DECISIÓN | OPEN |
| [D-024](#d-024) | 2026-10-11 | Nombre y dominio: **lookfit.app** | DECISIÓN | OPEN |
| [D-025](#d-025) | 2026-10-11 | Código de acceso compartido, no rate limiting real, para abrir la alfa | DECISIÓN | OPEN |
| [D-026](#d-026) | 2026-10-13 | Cinco idiomas a la vez, **contra la recomendación técnica** | DECISIÓN | OPEN |
| [D-027](#d-027) | 2026-10-13 | Máximo de páginas sin esperar a verificar medidas | DECISIÓN | OPEN |
| [D-028](#d-028) | 2026-10-13 | Registro antes que pago, y por código de correo | DECISIÓN | OPEN |

---

<a id="d-001"></a>
## D-001 · B2C web-first multi-marca; ni app nativa ni B2B

- **Date** 2026-09-25 · **Type** RESTRICCIÓN · **Status** OPEN
- **Context** El sector deriva de forma natural hacia B2B: los proveedores de try-on venden a marcas y retailers, y ahí está el dinero fácil y el cliente que paga factura.
- **Evidence** Ninguna externa. Restricción de alcance del fundador — [CLAUDE.md §0](../CLAUDE.md), [§6](../CLAUDE.md).
- **Alternatives** (a) SaaS de try-on para ópticas y retailers; (b) app nativa iOS como SpecFit; (c) plugin de ecommerce.
- **Reason** El valor que perseguimos es agregar marcas para el consumidor. Servir a una marca es el negocio contrario, y una app añade fricción de instalación a un producto que se descubre por social.
- **Impact** Condiciona stack (web, SEO, SSR), modelo de ingreso (afiliación, no licencias) y qué features se rechazan sin discusión: dashboards B2B, integraciones Shopify, admin para ópticas.
- **Status note** En vigor y sin validar. Nadie ha comprobado que un consumidor prefiera un agregador independiente.

<a id="d-002"></a>
## D-002 · RULE #1 — fidelidad de montura por encima del realismo

- **Date** 2026-09-25 · **Type** RESTRICCIÓN · **Status** OPEN
- **Context** Un modelo generativo puede producir una imagen preciosa con **otras** gafas. Si el usuario compra unas Ray-Ban de 180 € y recibe algo visualmente distinto, la experiencia es engañosa.
- **Evidence** No requiere validación externa: es una restricción ética y comercial. Sí se **mide** — GT-1 (test ciego ≥70 %) y GT-6 (integridad facial, eliminatorio) en [b1-tryon-benchmark §6](../research/b1-tryon-benchmark/README.md).
- **Alternatives** (a) Priorizar realismo y aceptar «monturas parecidas»; (b) presentar el try-on como inspiración y no como producto; (c) no mostrar marca ni modelo.
- **Reason** Destruye la confianza en toda la plataforma y la relación con cualquier retailer afiliado. Con afiliación, la fidelidad **es** el producto.
- **Impact** Si un modelo no alcanza el umbral, **no se ofrece para try-on aunque esté en catálogo**. Si ningún proveedor lo alcanza, no se lanza el try-on de producto: no se sustituye por «algo parecido».
- **Consecuencia no evidente** La regla nos obliga a usar la imagen real del producto, es decir, **nos obliga a entrar en el riesgo de licencia de [D-015](#d-015)**. No hay versión del producto que lo esquive bajando la fidelidad.

<a id="d-003"></a>
## D-003 · Gafas de sol primero; graduadas después

- **Date** 2026-09-25 · **Type** DECISIÓN · **Status** OPEN
- **Context** Hay que elegir con qué categoría se valida el pipeline.
- **Evidence** [CLAUDE.md §7.1](../CLAUDE.md). Razonamiento de producto, **sin dato de mercado propio**.
- **Alternatives** (a) Graduadas primero, ticket más alto y más necesidad funcional; (b) ambas a la vez.
- **Reason** Intención comercial alta, decisión muy visual, componente fashion, menos complejidad médica y de prescripción, más potencial social.
- **Impact** Catálogo inicial, clusters de SEO, formatos sociales y el set de 6 monturas del benchmark.
- **Status note** Graduadas entran solo cuando el pipeline esté estable; la prescripción añade requisitos que no queremos en la primera versión.

<a id="d-004"></a>
## D-004 · Orden de Fase 0: B1 → B3 → B4 → B5

- **Date** 2026-09-25 · **Type** DECISIÓN · **Status** OPEN
- **Context** Cuatro bloques de validación que compiten por el mismo tiempo.
- **Evidence** [README.md § Fase 0](../README.md), [CLAUDE.md §23](../CLAUDE.md).
- **Alternatives** (a) Keywords primero, porque es barato y cómodo; (b) landing de humo antes de saber si la tecnología existe; (c) todo en paralelo.
- **Reason** Primero lo que puede matar el proyecto barato: tecnología y licencia. Un mapa de demanda perfecto no vale nada si B1 sale NO-GO.
- **Impact** Nada de dominio, marca, anuncios ni infraestructura antes de cerrar B1.
- **Riesgo conocido** B5 es el bloque más cómodo de investigar desde un chat y por eso el que más tienta adelantar.

<a id="d-005"></a>
## D-005 · Presupuesto de Fase 0: ~15,50 € y ninguna suscripción

- **Date** 2026-09-25 · **Type** DECISIÓN · **Status** OPEN
- **Context** La fase de validación es donde se gasta dinero en cosas que parecen avanzar (dominio, logo, plantillas, herramientas) y no compran información.
- **Evidence** Coste calculado sobre precios oficiales por imagen [D] — [b1-tryon-benchmark §5](../research/b1-tryon-benchmark/README.md).
- **Alternatives** (a) Suscribir Semrush o Ahrefs para B5; (b) pagar un plan de Clase A para evaluarlo; (c) comprar dominio y marca ya.
- **Reason** Cada euro debe comprar información o construir una capacidad demostrada.
- **Impact** B5 tiene que resolverse con fuentes gratuitas o de pago por consulta. Ninguna suscripción de ningún tipo.

<a id="d-006"></a>
## D-006 · No pagar suscripción de Clase A para evaluarla

- **Date** 2026-09-25 · **Type** DECISIÓN · **Status** OPEN
- **Context** Una estimación anterior tomaba los precios de las apps de Shopify (39–199 $/mes) como si fueran los precios directos de Clase A.
- **Evidence** [D] Jeeliz publica Starter 299 $/mes y Advanced 499 $/mes, y su mes gratuito es «para marcas establecidas», que no somos — [providers.md](../research/b1-tryon-benchmark/providers.md).
- **Alternatives** (a) Pagar un mes de Jeeliz para medirlo bien; (b) descartar la Clase A sin evaluarla.
- **Reason** Pagar cientos de euros para evaluar contradice D-005, y la exigencia de pagar es en sí misma un dato.
- **Impact** Si un proveedor exige pagar para evaluar, **eso es una respuesta del Track 0** sobre lo accesible que es. Se evalúa su demo pública y se anota `[?]`. Presupuesto de Track A: **0 €**.

<a id="d-007"></a>
## D-007 · Landmarks en el navegador; la foto sale solo para el try-on

- **Date** 2026-09-25 · **Type** DECISIÓN · **Status** OPEN
- **Context** Se manejan fotografías faciales, el dato más sensible del producto.
- **Evidence** [README.md § Stack](../README.md), [CLAUDE.md §14](../CLAUDE.md), AEPD sobre protección de datos por defecto.
- **Alternatives** (a) Analizar en servidor, más control y mejores modelos; (b) guardar la foto para historial por defecto.
- **Reason** Minimización por defecto: el análisis facial no necesita que la foto salga del dispositivo. El try-on generativo sí, y por eso va a bucket privado con TTL corto y borrado duro.
- **Impact** Condiciona el stack (MediaPipe en cliente), el quality check, la arquitectura de storage y el consentimiento previo al upload.
- **Límite explícito** Es una **decisión de arquitectura, no una conclusión jurídica**. No asumir que unas medidas faciales derivadas quedan fuera de la normativa por calcularse en cliente. Revisión profesional obligatoria antes de producción.

<a id="d-008"></a>
## D-008 · La demanda se intercepta aguas arriba

- **Date** 2026-09-25 · **Type** HIPÓTESIS · **Status** VALIDATING
- **Context** Sustituye a la hipótesis original del proyecto: «existe gran demanda de gente buscando qué gafas le quedan bien».
- **Evidence** [T] Google Trends: las long-tail de face-shape muestran interés relativo muy bajo en España frente a «gafas de sol». **Indicativo, no concluyente**: Trends normaliza y no mide volumen absoluto.
- **Alternatives** (a) Mantener la tesis de face-shape y apostar el SEO a esa query; (b) no depender de búsqueda y ir solo a social.
- **Reason** La demanda visible está en categoría, forma y marca. La personalización es el puente, no la puerta.
- **Impact** Reordena SEO (clusters A/B/C antes que D), el funnel de adquisición y el posicionamiento: el producto no se vende como «una IA que analiza caras».
- **Validates if** GK-1: al menos un cluster de categoría/forma con ≥10.000 búsquedas/mes en ES y top 5 no dominado por retailers grandes → [keyword-research](../research/market/keyword-research.md).
- **Falsified if** El volumen está solo en cabeceras inabordables **y** el cluster de try-on es residual. Entonces no hay puerta de SEO y el canal tiene que ser social o paid.

<a id="d-009"></a>
## D-009 · Nombres descartados por colisión de marca

- **Date** 2026-09-25 · **Type** DECISIÓN · **Status** REJECTED
- **Context** Screening de naming previo a comprar dominio.
- **Evidence** [T] Búsqueda de 2026-09-25 — [CLAUDE.md §22.2](../CLAUDE.md).
- **Decision** Descartados **Lensora, Framio, FrameWise, SpecFit, Lookora, Trylense**. SpecFit además es un competidor directo del sector.
- **Reason** Colisión con marcas o productos existentes en el mismo espacio o en espacios adyacentes.
- **Impact** Candidatos vivos: Fitalens, Frameora, Gafora, Vistria, Optifora.
- **Límite** El screening negativo de los candidatos vivos **no demuestra disponibilidad registral**. Falta EUIPO, OEPM, registrador en tiempo real, redes, app stores y conflicto fonético.

<a id="d-010"></a>
## D-010 · Dominio y marca, aplazados

- **Date** 2026-09-25 · **Type** DECISIÓN · **Status** DEFERRED
- **Context** Es la compra más tentadora de la fase de validación y la que da sensación de haber empezado.
- **Evidence** [README.md](../README.md), [CLAUDE.md §22.5](../CLAUDE.md). Precios de referencia de Namecheap [D] a 2026: `.com` ~11–15 $/año con renovación ~18,48 $; `.ai` 179,96 $ por el mínimo de 2 años.
- **Alternatives** (a) Comprar el `.com` ya por miedo a perderlo; (b) comprar `.com` + `.es` defensivo; (c) pagar un `.ai`.
- **Reason** Un dominio no compra información. Y no hace falta un `.ai` caro para que el producto parezca AI.
- **Impact** Ninguno técnico. Libera presupuesto para el benchmark.
- **Condición de reapertura** Cierre de B1 con GO técnico y comercial.

<a id="d-011"></a>
## D-011 · Scoring determinista; el LLM no es juez

- **Date** 2026-09-25 · **Type** DECISIÓN · **Status** OPEN
- **Context** Es tentador delegar la recomendación entera a un LLM: se escribe en una tarde y suena convincente.
- **Evidence** [CLAUDE.md §9](../CLAUDE.md), [Project Brain §13](../.claude/agents/project-brain.md).
- **Alternatives** (a) LLM como juez principal de los productos; (b) embeddings y vector DB; (c) scoring híbrido desde el día 1.
- **Reason** El criterio tiene que ser reproducible, explicable y calibrable con datos reales. Un LLM como juez no es ninguna de las tres cosas y no se puede depurar cuando recomienda mal.
- **Impact** El `ScoringEngine` es determinista y sus pesos viven en configuración, no en código. El LLM puede enriquecer el lenguaje de la explicación, pero **nunca inventar medidas o características del producto**.
- **Status note** Los pesos iniciales (35/25/15/10/15) son **hipótesis de producto, no ciencia**, y se recalibran con comportamiento real.

<a id="d-012"></a>
## D-012 · Foto vs cámara: no decidir todavía

- **Date** 2026-09-25 · **Type** DECISIÓN · **Status** DEFERRED
- **Context** Parece una decisión de UX urgente y no lo es.
- **Evidence** [D] Fittingbox soporta **ambos** modos — [b1-tryon-benchmark §8](../research/b1-tryon-benchmark/README.md).
- **Alternatives** (a) Comprometerse ya con foto; (b) comprometerse ya con cámara en vivo.
- **Reason** Mientras haya candidatos que soportan los dos, la disyuntiva no es real. Decidirla ahora es decidir con la información que no importa.
- **Impact si el ganador solo hace cámara en vivo** Cambia el quality check, la comparación sobre la misma foto y la share card. Es decir, **cambia el producto, no la infraestructura**.
- **Condición de reapertura** Cierre del Track 0 de B1. Lo único que hay que registrar antes es qué modos soporta cada candidato y a qué precio.

<a id="d-013"></a>
## D-013 · Corrección: la Clase A tiene mejor postura de privacidad

- **Date** 2026-09-25 · **Type** HIPÓTESIS · **Status** VALIDATED
- **Context** Se daba por hecho que los proveedores especializados eran peores en privacidad por implicar a un tercero.
- **Evidence** [D] Fittingbox documenta que la imagen se procesa **en el navegador** y solo vive en la caché mientras dura el try-on. La Clase B generativa **exige enviar la cara a un servidor de terceros** en cada try-on.
- **Reason** El dato documental contradice la suposición.
- **Impact** En RGPD, la Clase A parte con mejor postura. **Refuerza que el riesgo de la Clase A es la licencia, no la privacidad**, y empeora el perfil de la ruta generativa justo en el eje más sensible del producto.
- **Status note** VALIDATED sobre evidencia documental del proveedor, no medida por nosotros. Queda por confirmar el mismo punto en Jeeliz, Banuba y Perfect Corp: hoy [?].

<a id="d-014"></a>
## D-014 · Tres capas de documentación; `research/` es la evidencia

- **Date** 2026-09-25 · **Type** DECISIÓN · **Status** OPEN
- **Context** Project Brain vive en un Proyecto de chat y Claude Code en el repo. Los documentos generados en conversaciones y los adjuntos de un Proyecto son copias congeladas que divergen sin avisar, y ninguno de los dos agentes recuerda nada entre sesiones.
- **Evidence** Convenciones en [research/README.md](../research/README.md). Niveles `[D][M][T][?][X]` heredados de [providers.md §0](../research/b1-tryon-benchmark/providers.md).
- **Alternatives** (a) Mantener el estado en los chats del Proyecto; (b) un único documento gigante; (c) dos registros, uno por agente.
- **Reason** Separar **cómo se trabaja** ([CLAUDE.md](../CLAUDE.md)), **dónde estamos** ([PROJECT_STATE.md](PROJECT_STATE.md)), **qué decidimos** (este archivo) y **por qué** (`research/`). Un registro por agente garantiza dos versiones de la verdad.
- **Impact** El repo es la fuente de verdad; el Proyecto es un espejo que hay que resubir cuando algo cambie. Fotos, grabaciones, consentimientos y material bajo NDA van a `raw/`, `faces/` y `outputs/`: fuera de git **y fuera de los adjuntos del Proyecto**.

<a id="d-015"></a>
## D-015 · El try-on crea una obra derivada de la imagen oficial

- **Date** 2026-09-25 · **Status original** OPEN · **Status** **VALIDATED** el 2026-10-08 · **Type** HIPÓTESIS
- **Context** Nueva, detectada al estructurar B3. Hasta ahora el proyecto trataba «derecho a mostrar la imagen del producto» como el único permiso necesario.
- **Evidence original (2026-09-25)** Ninguna. Riesgo identificado por razonamiento, **no asesoramiento jurídico**.
- **Evidence (2026-10-08) — [D], términos publicados** Los términos estándar de publisher de las dos vías principales autorizan **mostrar sin modificar**, y además exigen reproducción fiel:
  - **Awin** cl. 10.1: sublicencia «to publish Advertiser Materials, **without modification**, on the Publisher Service». cl. 9.2.10/9.2.11: el publisher garantiza que «all Advertiser Materials will be **accurately and faithfully reproduced**». cl. 9.3: indemnidad a cargo del publisher por incumplir esas garantías. Misma redacción en ShareASale.
  - **Amazon Associates** §6(a): «You will not add to, delete from, or **otherwise alter any Program Content in any way**», con la única excepción de redimensionar manteniendo proporciones. Y §3: si modificas Program Content, la modificación es «Your Submission» y **«you assign to us all right, title, and interest»** — es decir, la imagen derivada, que contiene **la cara de un usuario nuestro**, quedaría cedida a Amazon.
  - Detalle completo y fuentes en [affiliate-programs §5.1](../research/monetization/affiliate-programs.md).
- **Qué queda validado exactamente** Que un try-on generativo sobre la imagen oficial **no está autorizado por los términos por defecto**. No está validado que ningún programa lo autorice nunca: una excepción escrita por anunciante sigue siendo posible y es lo que hay que ir a pedir.
- **Hipótesis** Una licencia de feed de afiliación típica autoriza **mostrar** la imagen de producto para promocionarlo. Nuestro try-on no la muestra: **crea una imagen nueva** a partir de ella y de la cara de un usuario. Que eso quede fuera de la autorización es un riesgo real y no contemplado en ningún documento del proyecto.
- **Alternatives si se confirma** (a) Clase A 3D, donde el activo es un modelo licenciado por el proveedor y no una imagen del retailer; (b) negociar marca por marca; (c) catálogo propio fotografiado por nosotros; (d) no mostrar marca ni modelo, lo que **contradice** [D-002](#d-002) y el modelo de afiliación.
- **Impact** Si la respuesta es no en todos los programas, la ruta generativa sobre imagen oficial no es defendible y **B1 se reordena entero a favor de la Clase A**. Es el tipo de hallazgo que cambia el orden del plan, no un detalle legal.
- **Validates if** GA-2: al menos un programa lo autoriza por escrito, o no lo prohíbe y el riesgo queda acotado → [affiliate-programs](../research/monetization/affiliate-programs.md).
- **Falsified if** Los programas lo prohíben expresamente o remiten a la marca, y ninguna marca lo autoriza.
- **Relación** Amplía GC-4 de B1 (¿quién responde si una marca reclama?) al derecho de imagen del producto. Consecuencia directa de [D-002](#d-002). Su consecuencia sobre el orden del plan está en [D-016](#d-016).

<a id="d-016"></a>
## D-016 · Corrección: el riesgo de licencia es de la Clase B, no de la Clase A

- **Date** 2026-10-08 · **Type** HIPÓTESIS · **Status** VALIDATED
- **Context** Todo el análisis de B1 asumía que el riesgo de licencia era de la Clase A (3D/AR), porque implica contratar a un proveedor con condiciones no públicas, y que la Clase B (generativa) era «libre: sin licencia de por medio» — así está escrito en [providers.md §6](../research/b1-tryon-benchmark/providers.md). Es al revés.
- **Evidence** **[D]** Los mismos términos de [D-015](#d-015). La licencia de afiliación cubre publicar la imagen del anunciante sin modificarla.
- **Reason** Lo que cada clase pone delante del usuario es un activo distinto:
  - **Clase B** muestra una imagen **derivada de la foto oficial del retailer** → modifica «Advertiser Materials» → incumple la licencia y arrastra indemnidad.
  - **Clase A** muestra un **modelo 3D licenciado por el proveedor de try-on** → no reproduce ni altera la imagen del anunciante. Lo único que toca al anunciante es el enlace de afiliado, que es exactamente lo que la licencia sí cubre.
- **Impact — reencuadre del catálogo de Fittingbox** Sus ~200.000 monturas de 1.200 marcas [D] no son un atajo cómodo de catálogo: son la única vía localizada donde **los derechos de derivación ya están resueltos aguas arriba**, por quien digitalizó la montura teniendo relación con la marca. Ese es su valor real, y no lo habíamos visto. Convierte la pregunta 4 del Track 0 en la más valiosa del bloque.
- **Límite, y es importante** Esto **no** da por limpia la Clase A. Si usamos Jeeliz para digitalizar una montura a partir de una foto de producto que **nosotros** aportamos sin derechos, el problema no se resuelve: se mueve un eslabón. De ahí que **GC-4** siga siendo la pregunta correcta, ampliada con *«¿de dónde salen los derechos de las monturas de su base?»*.
- **Consecuencia sobre el plan — DECISIÓN PENDIENTE, no tomada** Esto apunta a reordenar B1 dando prioridad a la Clase A y degradando la ruta generativa sobre imagen oficial a plan B. **No se reordena sin ratificación del fundador**, porque invierte D-004 en su tramo técnico y porque la Clase A es más lenta, más cara y con dependencia de proveedor único.
- **Status note** VALIDATED sobre evidencia documental de las redes, no sobre asesoramiento jurídico ni sobre respuesta de un programa concreto. Igual que [D-013](#d-013).

<a id="d-017"></a>
## D-017 · Construir la plataforma antes de cerrar B1, con muro de gates

- **Date** 2026-10-08 · **Type** DECISIÓN · **Status** OPEN
- **Context** Decisión del fundador: empezar a construir. Contradice [D-004](#d-004) (B1 → B3 → B4 → B5 → MVP) y el «no se escribe una línea hasta cerrar B1» del README.
- **Evidence** Ninguna externa. Decisión de alcance del fundador, 2026-10-08.
- **Alternatives** (a) Esperar al cierre de B1, como dictaba D-004; (b) construir el producto completo incluyendo integración real de proveedor y catálogo de marca; (c) **construir todo excepto lo que depende de un gate sin resolver** ← elegida.
- **Reason** Los gates abiertos de B1 y B3 condicionan **dos** piezas, no el producto entero. El upload, el quality check, los landmarks en cliente, el `FaceProfile`, el `ScoringEngine`, el catálogo como datos, la UI de recomendaciones, la comparación, la instrumentación y las páginas legales **no dependen de ningún gate**. Construirlas ahora no compromete ninguna decisión y produce la capacidad de ejecutar B1 y Track D con el producto real en vez de con láminas montadas a mano.
- **El muro de gates — qué queda deliberadamente sin construir**

  | Pieza | Bloqueada por | Qué se construye en su lugar |
  |---|---|---|
  | Integración de un proveedor real de try-on | [D-016](#d-016) sin ratificar, GC-1…GC-4 | `TryOnProvider` + `MockTryOnProvider` con resultado marcado como simulación |
  | Mostrar imágenes oficiales de producto de marca | GA-1 sin resolver | Catálogo con `rights.displayImage` y nada publicable sin `cleared` |
  | Try-on generativo sobre imagen oficial | **[D-015](#d-015) VALIDATED en contra** | `rights.deriveImage`, que por defecto es `denied` |
  | URLs de afiliado | GA-3 sin resolver | `outbound` registra el click y enlaza a la ficha pública sin tag |
  | Stripe y créditos | Fase 2, [CLAUDE.md §16](../CLAUDE.md) | nada |

- **Cómo se hace cumplir el muro, y esto es lo importante** No con una nota en un documento, sino **en el sistema de tipos**: `FrameProfile.rights` obliga a declarar el estado de derechos de cada montura, y `isPubliclyListable()` y `canTryOn()` niegan por defecto. Una montura sin derechos verificados **no se puede listar ni probar aunque esté en el catálogo**, y eso es exactamente [D-002](#d-002) (RULE #1) y [D-015](#d-015) convertidos en código en vez de en buenas intenciones.
- **Impact** El repo pasa de solo documentación a aplicación. Aparecen `npm run check` y el checklist de [CLAUDE.md §35](../CLAUDE.md) como puerta real. El presupuesto de [D-005](#d-005) sigue intacto: el stack elegido no cuesta nada hasta que se despliega.
- **Riesgo asumido, explícito** Si B1 sale NO-GO técnico, se habrá construido un producto sin su pieza central. Mitigación: lo que se construye primero es precisamente lo que **sobrevive a un NO-GO de try-on** — discovery, recomendación, comparación y catálogo —, y el proveedor queda detrás de un adaptador sustituible.
- **Status note** No invalida D-004: lo reordena. B1, B3, B4 y B5 siguen pendientes y sus gates siguen vigentes. Construir no es validar.

<a id="d-018"></a>
## D-018 · Paleta: escenario neutro cálido + un acento coñac del producto

- **Date** 2026-10-09 · **Type** DECISIÓN · **Status** OPEN
- **Context** La primera paleta se eligió por criterio estético general, sin mirar la categoría. Encargo del fundador: revisar qué hacen las marcas de gafas y las ópticas, concluir qué funciona y **usarlo como guía vinculante**.
- **Evidence** `[T]` Guía de color de eyewear 2026/2027 y observación directa de Hawkers — [research/design/eyewear-palette.md](../research/design/eyewear-palette.md). Contrastes WCAG **calculados**, no estimados.
  - **Advertencia de calidad:** la mayoría de webs de marca bloquean el scraping (403 en Brandfetch, Ace & Tate, Cubitts, Warby Parker, Encycolorpedia) y los agregadores de «brand colors» se contradicen entre sí; varios admiten que sus valores no salen de guías oficiales. **No se ha usado ningún hex de marca ajena como referencia.**
- **Alternatives** (a) Mantener la paleta anterior; (b) copiar el verde de óptica tipo Specsavers o el cerúleo de Warby Parker; (c) blanco puro minimalista.
- **Decision** Escenario casi monocromo en marfil cálido con un **único acento coñac/tortoise**. Tokens, valores y contrastes en [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).
- **Reason** En eyewear de moda **el color de marca no está en la interfaz: lo pone el producto**. Las paletas con color protagonista son de las *cadenas* de óptica, que venden confianza y precio, y nosotros hemos decidido no ser eso ([D-001](#d-001)). Copiar a Specsavers nos haría parecer una óptica; copiar a Warby Parker, su clon.
- **Qué cambia, concretamente** Dos calibraciones, no una reescritura. La dirección anterior era correcta.
  - `paper` `#f4f1ea` → **`#f7f5f1`**. Era beige editorial; el sector apunta a marfil claro y señala que el blanco opaco puro es difícil de vender en esta categoría.
  - `accent` `#a84a14` → **`#7e4420`**. El naranja quemado caía cerca de *Energy Orange*, clasificado como **el color de mayor riesgo** de la temporada. El coñac sale del núcleo comercial real: marrón transparente, tortoise y negro.
- **Impact** La guía es **vinculante**: no se introducen colores fuera de los ocho tokens, no hay hex escritos a mano en componentes, y cualquier cambio de token se revalida en contraste antes de entrar. Todos los pares de texto cumplen AA en los dos temas.
- **Status note** Es una **hipótesis de diseño**, como los pesos del scoring: coherente con la categoría y legible, pero **sin ningún dato de conversión** detrás. Se recalibra con comportamiento real.

<a id="d-019"></a>
## D-019 · No mostramos precios en nuestra interfaz

- **Date** 2026-10-09 · **Type** DECISIÓN · **Status** OPEN
- **Context** Las tarjetas de recomendación mostraban el precio, siguiendo [CLAUDE.md §8.6](../CLAUDE.md) («precio aproximado»). El fundador lo señaló: **parece que se lo vamos a cobrar nosotros**.
- **Evidence** Ninguna externa. Razonamiento de posicionamiento.
- **Alternatives** (a) Mantener el precio como pedía §8.6; (b) mostrarlo marcado como aproximado y con estado de verificación —fue mi primer arreglo, y se quedaba corto porque resolvía la exactitud, no el problema—; (c) mostrar una banda de precio; (d) **quitarlo** ← elegida.
- **Reason** El problema no era que el precio fuera inexacto: era **de quién parece el precio**. Una cifra junto a una montura en *nuestra* interfaz se lee como *nuestro* precio, y da a entender que vendemos nosotros. No vendemos: somos una capa de descubrimiento que lleva a la tienda ([D-001](#d-001)). El precio es del retailer y su sitio es su ficha, al otro lado de «ver dónde comprar».
- **Impact**
  - `FrameCard` no muestra precio. `formatPrice` eliminado de i18n.
  - **El dato se queda**: `priceCents` y `priceStatus` siguen en `FrameProfile` porque los necesita el filtro de presupuesto y vendrán en el feed.
  - El filtro de presupuesto se mantiene, reformulado como pregunta —«cuánto quieres gastar»— y con una línea explícita: *«Nosotros no vendemos gafas: el precio y la compra son de la tienda a la que te llevemos.»*
  - Efecto lateral que mejora el filtro: con `priceStatus`, una montura **sin precio fiable queda excluida** de una búsqueda con presupuesto, en vez de colarse. Enseñar algo que puede costar el triple a quien acaba de decir cuánto quiere gastar es peor que no enseñar nada.
- **Modifica** [CLAUDE.md §8.6](../CLAUDE.md), que lista «precio aproximado» entre los campos de la card. Queda sin efecto para la tarjeta de recomendación. §18.4 («precio vigente cuando esté verificado») sigue aplicando a la futura ficha de producto, donde el precio sí irá, **atribuido al retailer y con fecha**.

<a id="d-020"></a>
## D-020 · Previsualización de proporción: esquema a escala, no try-on

- **Date** 2026-10-09 · **Type** DECISIÓN · **Status** OPEN
- **Context** El botón «Probarme» de las tarjetas no hacía nada, porque el try-on real está detrás del muro de gates de [D-017](#d-017). Pero tras el Sprint 2 tenemos en el navegador la foto del usuario **y** sus landmarks, incluidas las pupilas.
- **Evidence** `[X]` Geometría verificada con 20 tests sobre mallas sintéticas: una montura de la anchura estimada de la cara cubre exactamente esa anchura, una más ancha se dibuja más ancha, y la escala es proporcional al tamaño de la cara en la foto.
- **Alternatives** (a) Dejar el botón muerto; (b) quitarlo hasta tener proveedor; (c) conectar el `MockTryOnProvider`, que no produce ninguna imagen; (d) **superponer el glifo de la montura a escala real sobre la foto** ← elegida.
- **Decision** Se dibuja la montura sobre la foto escalando por su anchura real: `anchoMonturaPx = anchoMm · interpupilarPx / DIP_media`. El ancho de la cara se cancela en la fórmula, así que la escala no depende de haber estimado bien el contorno facial. Hereda la inclinación de la cabeza.
- **Qué NO es, y es lo importante** **No es el try-on de [CLAUDE.md §8.7](../CLAUDE.md) y no cierra ningún gate de B1.** No hay foto de producto, no hay render fotorrealista y no se parece a llevar esas gafas puestas. GT-1 (test ciego de identidad) sigue sin medir, y [D-016](#d-016) sigue sin ratificar.
- **Qué sí es** La respuesta a *«¿esta montura es demasiado ancha para mi cara?»*, que es la mitad de la duda real de compra. Y comparar 2–4 monturas sobre la misma cara es exactamente lo que una marca **no puede** ofrecer, porque solo puede enseñarse a sí misma — es la hipótesis H-M2 hecha producto.
- **Por qué es compatible con RULE #1** [D-002](#d-002) prohíbe presentar como try-on de un producto una generación que no represente esa montura. Un dibujo de línea **no se confunde con una foto**, así que no puede inducir a creer que el producto se ve como no se ve. La UI lo declara: «esquema a escala estimada, no una simulación fotorrealista».
- **Límite declarado** La escala absoluta usa la DIP media de población (63 mm), no una medición de esta persona: el error entre individuos ronda el ±8 %. Por eso las etiquetas de ajuste son **cualitativas** —«puede quedarte ancha»— y nunca afirman milímetros → [CLAUDE.md §9.4](../CLAUDE.md). Hay un test que falla si alguna etiqueta contiene un dígito.
- **Impact** Coste cero, proveedor ninguno, problema de licencia ninguno: el glifo es nuestro, la foto es del usuario y todo ocurre en su navegador. Permite ejecutar el Track D de B1 con producto real en vez de láminas montadas a mano, con la advertencia de que lo que se estaría validando es el valor de **comparar**, no la fidelidad del try-on.

<a id="d-021"></a>
## D-021 · Corrección: nombrar no requiere permiso. Tres permisos, no uno

- **Date** 2026-10-09 · **Type** DECISIÓN · **Status** OPEN
- **Context** El muro de gates de [D-017](#d-017) exigía `useTrademark: cleared` para **listar** una montura. Consecuencia: ninguna marca real podía aparecer en el catálogo. El fundador lo cuestionó —«¿dices que poner nombre y referencia es ilegal?»— y tenía razón en que algo no cuadraba.
- **Evidence** Ninguna nueva. Es una corrección de razonamiento sobre la evidencia que ya había: los términos de [D-015](#d-015) restringen **los materiales que el anunciante te entrega**, no el acto de nombrar un producto.
- **Decision** Se separan tres permisos que estaban fundidos en uno, y **nombrar deja de ser uno de ellos**:
  1. `displayOfficialImage` — mostrar su foto de producto → GA-1
  2. `deriveOfficialImage` — derivar una imagen nueva de ella → GA-2, `denied` por defecto
  3. `useLogo` — usar su logotipo como gráfico
- **Reason** Nombrar el producto al que enlazas es **uso nominativo**, y es lo que hace todo el sector de referencia: comparadores, blogs de afiliación, retailers multimarca. Si no se pudiera nombrar un producto, no existiría el comercio de referencia. Yo había convertido una cautela en una prohibición.
- **Impact** `isPubliclyListable()` solo exige que la montura esté activa. El catálogo pasa de 17 monturas sintéticas a **24 monturas reales de 13 marcas**, con marca, modelo y referencia — y sin una sola imagen suya: se dibujan con nuestro glifo hasta que GA-1 se resuelva.
- **Límite** Nombrar sí, **logotipo no**: el mockup del fundador llevaba el logotipo de Ray-Ban en cada ficha y eso es un paso más. Y esto sigue siendo lectura de términos, no asesoramiento jurídico; los límites del uso nominativo varían por jurisdicción.

<a id="d-022"></a>
## D-022 · Generar desde el conocimiento del modelo: la tercera vía

- **Date** 2026-10-09 · **Type** HIPÓTESIS · **Status** OPEN
- **Context** El fundador generó con ChatGPT seis simulaciones suyas con distintos modelos de Ray-Ban, reconocibles y distinguibles entre sí. Al analizar **cómo** lo hizo, aparece una ruta que no estaba en el análisis.
- **Evidence** `[T]` El modelo generó desde su conocimiento interno del producto, **sin partir de ningún archivo del anunciante**. Awin restringe «Advertiser Materials», definido como material *«provided by or on behalf of an Advertiser»*: si nunca te lo entregan, no hay material que modificar.
- **Hipótesis** Existe una tercera ruta al try-on que no toca los términos de afiliación, porque no usa ningún activo ajeno: ni la foto del feed (Clase B clásica), ni el 3D del proveedor (Clase A), sino la representación interna del modelo generativo.
- **Qué corrige** [D-016](#d-016) decía «el riesgo de licencia es de la Clase B». Más preciso: **es de la Clase B *sobre imagen de feed***. Esta variante no lo tiene. Mi resumen anterior fue más categórico que la evidencia.
- **Dónde se mueve el problema** De derechos de autor a **exactitud**. El modelo no reproduce la RB3016: reproduce *su idea* de una RB3016. Si enlazas a comprarla con esa imagen, estás en el escenario que [D-002](#d-002) prohíbe. El propio ChatGPT se lo advirtió al fundador: *«no tomaría como exactos el tamaño ni el ajuste»*.
- **Implementación** `TryOnAssetOwnership` gana el modo `model-prior`, y aparece `canLabelAsProduct()` separado de `canTryOn()`: **se puede generar la imagen y aun así no poder decir que es esa montura**. Hoy `GENERATIVE_FIDELITY_VERIFIED = false`, así que toda imagen generada se etiqueta como simulación de estilo.
- **Validates if** GT-1: ≥70 % de acierto en test ciego de 3 opciones. Entonces la bandera pasa a `true` y la misma imagen puede llevar marca, modelo y referencia.
- **Falsified if** <50 %. El flujo seguiría funcionando pero sin poder enlazar a una referencia concreta: sería descubrimiento de estilo, no de producto.
- **Pendiente de comprobar** Los términos del proveedor generativo —algunos restringen generar marcas de terceros— y que esta ruta **sí envía la foto fuera del dispositivo**, lo que reabre el bloque de privacidad: DPA, transferencia internacional y retención.

<a id="d-023"></a>
## D-023 · La shortlist de nombres está ocupada entera; `.io` descartado

- **Date** 2026-10-11 · **Type** DECISIÓN · **Status** OPEN
- **Context** El fundador reabre [D-010](#d-010) para desplegar, pidiendo «el mejor para posicionar pero más barato» y preguntando si sirve `.io`.
- **Evidence** `[X]` 45 dominios comprobados por **RDAP de Verisign**, que es autoritativo para `.com` — no por DNS, que no vale: hay resolvers que secuestran NXDOMAIN, y el registro `.es` responde a todo.
- **Hallazgo que invalida parte de [D-009](#d-009)/[D-010](#d-010)** Las cinco candidatas de [CLAUDE.md §22.3](../CLAUDE.md) —**Fitalens, Frameora, Gafora, Vistria, Optifora**— están **todas registradas**, y varias apuntan a servidores de aparcamiento, es decir en venta y caras. El screening de §22.4 decía que no demostraba disponibilidad; ahora está comprobado que no la había.
  - De 25 nombres construidos con criterio, **solo `miradda.com` libre**. Su doble `d` filtra tráfico a `mirada.com`, que está pillado.
  - Dos de los libres son trampas en español: **`lentisimo`** se lee «lentísimo» y **`gafado`** significa gafado.
- **`.io`: descartado, por tres razones**
  1. **No es más barato: es 4–7× más caro.** Renovación ~46–75 $/año frente a ~10 $ del `.com` `[T]`.
  2. **No posiciona mejor.** Google trata los gTLD por igual y a `.io` como gTLD genérico pese a ser técnicamente ccTLD. La extensión no es señal de ranking `[T]`.
  3. **Riesgo de existencia.** Depende del Territorio Británico del Océano Índico, transferido a Mauricio por tratado en mayo de 2025. Los ccTLD se apoyan en códigos ISO 3166 `[T]`.
- **Decision sobre TLD** `.com` en **Cloudflare Registrar**, a precio de coste (~10,46 $/año, misma renovación) `[T]`. Alternativa independiente: Porkbun ~11 $. **Namecheap no**: barato el primer año, 18,48 $ al renovar. Ojo: Verisign sube el `.com` un 7 % el 1 de noviembre de 2026.
- **Único efecto SEO real de un TLD** Un ccTLD como `.es` da geolocalización a España, que ayuda hoy y estorba cuando toque LATAM e inglés ([CLAUDE.md §21](../CLAUDE.md)). No es gratis como decisión.
- **Resuelto el 2026-10-11 → [D-024](#d-024).** La ronda de naming se hizo y el dominio está comprado.

<a id="d-024"></a>
## D-024 · Nombre y dominio: lookfit.app

- **Date** 2026-10-11 · **Type** DECISIÓN · **Status** OPEN
- **Context** El fundador pide un nombre **internacional**, con el argumento de que el mercado anglosajón tiene más volumen y ticket más alto. Eso descarta las raíces españolas de [D-023](#d-023) —`gafateca` y compañía— y obliga a buscar en otro espacio.
- **Evidence** `[X]` ~190 dominios comprobados por RDAP. El `.com` internacional está **agotado**: de 92 nombres con raíz inglesa o inventados, cero libres. Los pocos `.com` disponibles (`pickshades`, `shadepicker`, `shadefitter`) atan el producto a gafas de sol, justo cuando [CLAUDE.md §4.1](../CLAUDE.md) pide sitio para crecer a graduadas.
- **Decision** **`lookfit.app`**, comprado en Namecheap el 2026-10-11, con auto-renovación y privacidad WHOIS activadas.
- **Alternatives** (a) `gafateca.com`, mejor marca pero solo español; (b) `vistafit.app`, que era mi recomendación porque «vista» es palabra real en los dos idiomas; (c) un `.com` premium del mercado secundario, de cientos a miles de euros; (d) `.io`, descartado en D-023 por caro y por el riesgo del código ISO.
- **Riesgo asumido** «fit» arrastra connotación de gimnasio en inglés. Es la razón por la que yo prefería `vistafit`, y el fundador eligió igualmente. Queda escrito para que dentro de seis meses se sepa que era un riesgo conocido y no un descuido.
- **Descartado por colisión de marca** `mirafit` — Mirafit es una marca británica de material de gimnasio con web activa. Es exactamente la comprobación que pide §22.4.
- **Consecuencia técnica no evidente** Todo el TLD `.app` está en la **lista de precarga HSTS**: los navegadores rechazan `http://` antes de conectar. Sin certificado el dominio **no carga en absoluto**, ni con aviso. El *redirect* que Namecheap crea por defecto apunta a `http://www.lookfit.app/` y por tanto **está roto de origen**; hay que borrarlo, igual que la *parking page*.
- **Pendiente** La comprobación de marca en EUIPO y OEPM que exige §22.4 **sigue sin hacer**. Registrar un dominio no da derechos de marca.

<a id="d-025"></a>
## D-025 · Código de acceso compartido en vez de rate limiting real

- **Date** 2026-10-11 · **Type** DECISIÓN · **Status** OPEN
- **Context** El dominio está comprado y el despliegue hecho ([D-024](#d-024)), así que la siguiente pregunta es si se puede meter `OPENAI_API_KEY` en producción. No se puede: cada generación cuesta ~0,10 € reales y nuestro `checkRateLimit` vive **en memoria del proceso**. En serverless cada instancia lleva su propia cuenta, así que un script con un bucle multiplica el límite por instancias. El `noindex` esconde la URL de Google, no de una persona.
- **Decision** `ACCESS_CODE`, un código compartido comprobado en el servidor (`lib/server/access.ts`) antes del rate limiting y antes de tocar al proveedor. Sin la variable definida no hay puerta, que es lo que mantiene el desarrollo local sin fricción. El navegador lo guarda en `localStorage` y la UI lo pide solo cuando el servidor devuelve 401.
- **Evidence** `[X]` La ruta rechaza con 401 `access_denied` toda petición sin código; 4 tests cubren el caso sin variable, el de espacios, el de cabecera ausente y el de código incorrecto.
- **Lo que esto NO es** No es autenticación. No identifica a nadie, no caduca, no se revoca por usuario y quien tiene el código lo puede reenviar. No sustituye al **límite de gasto duro** del panel de OpenAI, que es la única red que no depende de nuestro código.
- **Alternatives** (a) Upstash Redis para rate limiting persistente — la solución correcta, pero añade un servicio y una dependencia para enseñar el producto a diez personas, contra [CLAUDE.md §29.1](../CLAUDE.md); (b) Vercel Password Protection, que es de plan Pro; (c) dejar la URL abierta con el `noindex` como única defensa, que es apostar el saldo a que nadie encuentra la URL; (d) no desplegar con clave y quedarse en `mock`, que impide que alguien que no sea el fundador vea el producto real.
- **Cuándo caduca esta decisión** Al abrir al público. Entonces hacen falta sesión anónima y rate limiting persistente, y la puerta estorba más de lo que protege. Queda escrito para que no se confunda con una solución de seguridad.

<a id="d-026"></a>
## D-026 · Cinco idiomas a la vez, contra la recomendación técnica

- **Date** 2026-10-13 · **Type** DECISIÓN · **Status** OPEN
- **Context** El fundador pide posicionar en **es · en · it · pt · de** y, además, publicar la web en los cinco. El agente de growth recomendó lo contrario —publicar solo en español y abrir el segundo idioma por el gate G1— y se le expuso el argumento. El fundador lo reafirmó: «Hazlo en los 5 idiomas que te dije, y vamos a poner la web tb en los 5 idiomas igualmente». **Es su decisión y se ejecuta completa.**
- **Decision** Rutas localizadas con prefijo para los cinco, `hreflang` recíproco con `x-default` → `/en`, `canonical` propio por idioma, diccionario tipado que obliga a traducir cada clave, y selector de idioma sin redirección automática.
- **Evidence** `[X]` Verificado en local sobre el build de producción: los cinco sirven su `<html lang>` y su H1 traducidos **en el HTML**, no por JavaScript; `/de` enumera las cinco alternativas más `x-default`; la raíz redirige 307 a `/es`.
- **Argumentos en contra, que siguen siendo ciertos** `[T]`/`[X]`
  1. **No hay destino de compra fuera de España.** El único programa de afiliación localizado es Hawkers en Awin ES. Un usuario alemán que complete el embudo llega a un callejón sin salida.
  2. **Ningún idioma lo ha leído una persona nativa.** Las cinco traducciones son mías. Están marcadas como pendientes de revisión en la cabecera de `it.ts`, `pt.ts` y `de.ts`.
  3. **Los textos legales no son traducciones válidas.** Siguen pendientes de revisión jurídica (§14) y en Alemania falta Impressum.
  4. **Con una persona y un dominio sin enlaces**, repartir el esfuerzo deja a los cinco por debajo de las 10 impresiones por query, que es el umbral de ruido: no se aprendería nada de ninguno.
- **Mitigación aplicada** El `noindex` global **no se ha tocado**. Que la web esté en cinco idiomas no la hace indexable: eso sigue dependiendo del gate G0 de [GROWTH_SEO.md](GROWTH_SEO.md) §4, que exige contenido real y revisión por idioma. `robots.txt` prohíbe todo, en coherencia. Así el coste de esta decisión es sólo el trabajo ya hecho, y no un castigo de Google por contenido escalado sin valor.
- **Alternatives** (a) Solo español con la fontanería lista, que era la recomendación; (b) español e italiano, aprovechando que VisuTry no cubre italiano `[X]`; (c) cinco idiomas pero con las páginas legales solo en español, descartado porque es peor que no traducirlas.
- **Lo que haría falta para que esto rinda** Revisor nativo por idioma, un retailer de destino por mercado, y páginas de contenido —no solo la interfaz— en cada lengua. Queda escrito para que dentro de seis meses se sepa qué faltaba, y no se lea como que «el multiidioma no funcionó».

<a id="d-027"></a>
## D-027 · Máximo de páginas sin esperar a verificar medidas

- **Date** 2026-10-13 · **Type** DECISIÓN · **Status** OPEN
- **Context** El fundador pide «crear todas las páginas posibles o necesarias», dice expresamente que **las medidas le dan igual** y que el objetivo es atraer el máximo tráfico de Google, en varios idiomas. Se le expuso antes el argumento contrario —que el agente fijaba un techo de ~45-55 páginas y puertas de admisión por familia— y lo reafirmó.
- **Esto deroga una regla de [CLAUDE.md §0](../CLAUDE.md)**, que dice «NO generar páginas SEO vacías o programáticas sin contenido/valor real», y relaja las puertas de admisión que el propio agente propuso (forma ≥3 monturas verificadas, marca ≥4). Queda escrito porque es el fundador quien cambia su propia regla, no el agente quien la ignora.
- **Decision** 125 páginas de catálogo: 2 hubs + 9 formas + 14 marcas, en los cinco idiomas. Total del sitio, 154 páginas.
- **Cómo se evita que sean clones** (lo único que se negoció) Las de forma llevan **texto editorial propio por forma y por idioma** —45 textos escritos uno a uno, con un test que falla si dos coinciden o si alguno se quedó en español—. Las de marca se componen con **hechos que difieren de verdad**: grupo propietario, país, segmento y qué formas hace esa marca. Los slugs están traducidos al término que se busca en cada mercado, no a la traducción literal: `pilotenbrillen`, no `aviador`.
- **Riesgo asumido, y es real** Google define el abuso de contenido escalado por intención y valor, no por cómo se produce `[D]`. Estas páginas no tienen medidas verificadas, imágenes de producto ni precios, así que su valor frente a la SERP de un retailer es bajo. El riesgo no es que no posicionen: es que arrastren al dominio entero. El propio agente había declarado inalcanzables a 12 meses las cabeceras de categoría.
- **Mitigación** El `noindex` **no se toca**. Las 154 páginas existen y no son visibles para Google. Abrirlas es añadir un idioma a `INDEXABLE_LOCALES`, y esa es una decisión aparte que toma el fundador viendo las páginas. Recomendación mía: abrir **solo español** primero y mirar a las 6 semanas qué porcentaje queda en «Rastreada, actualmente sin indexar»; por encima del 30 % es la señal de que Google no les ve valor, y entonces conviene enriquecer antes de abrir más.
- **Alternatives** (a) El techo de 45-55 páginas con puertas de admisión, que era la recomendación; (b) publicar solo español y traducir por demanda; (c) esperar a verificar las medidas de 17 monturas —2-3 horas de trabajo— y publicar con datos, que habría hecho estas mismas páginas mucho más defendibles.
- **Qué lo convertiría en acierto** Verificar las medidas. Las páginas ya están construidas para mostrarlas: en cuanto `measurementsStatus` pase a `verified`, cada página de forma gana una tabla comparativa multimarca que hoy no tiene ninguna SERP. Es el mismo trabajo de siempre, pero ahora con el continente ya hecho.

<a id="d-028"></a>
## D-028 · Registro antes que pago, y por código de correo

- **Date** 2026-10-13 · **Type** DECISIÓN · **Status** OPEN
- **Context** El fundador pide montar «autenticación, tabla de precios, etc.». Se le expuso que el pricing es una de las decisiones que [CLAUDE.md §36](../CLAUDE.md) prohíbe tomar sin validación, y que hoy no hay un solo dato de uso: la generación está tras un código y nadie de fuera la ha probado. Acordado: **registro ahora, pago cuando haya datos**.
- **Decision** Registro por **código de seis dígitos al correo**, con Supabase Auth. Sin contraseña y sin redes sociales → §24 las excluye de la fase 1. Registrarse y entrar son el mismo gesto: nadie debería tener que recordar si ya tenía cuenta.
- **Por qué código y no enlace mágico** En el móvil, el enlace del correo abre el navegador de la aplicación de correo, no aquel donde la persona estaba: la sesión queda en el sitio equivocado y el flujo se rompe justo después de haber subido una foto. El código se teclea donde estás.
- **Qué NO bloquea** Subir la foto, el análisis y las seis recomendaciones siguen siendo gratis y anónimos → §0. Lo que pide cuenta es **la generación**, que es lo que cuesta ~0,10 € reales. El texto de la pantalla lo explica, porque decir por qué se pide algo convierte mejor que pedirlo a secas.
- **La sesión es nuestra, no de Supabase** Supabase Auth solo manda el código y lo comprueba; de su respuesta se usa el identificador y nada más. A partir de ahí llevamos una cookie `httpOnly` firmada con HMAC. Así no hay tokens de Supabase en el navegador ni refrescos que gestionar. Ocho tests cubren lo único que importa: que no se pueda falsificar.
- **El código compartido se queda** No como reliquia: el plan gratuito de Supabase limita mucho el envío de correos, y si falla, sin esa puerta nadie podría entrar, ni nosotros.
- **Alternatives** (a) Contraseña, descartada: más fricción y una superficie de ataque que no queremos mantener; (b) enlace mágico, descartado por el problema del móvil; (c) OAuth con Google, descartado por §24 y porque añade un tercero que ve quién usa el producto; (d) montar Stripe ya, que es lo que el fundador pedía primero, descartado porque el precio saldría de una suposición.
- **Lo que falta para cobrar, en orden** (1) contabilidad de uso por cuenta, que además arregla la deuda del rate limiting en memoria; (2) abrir la generación con una gratis y medir E-A a E-D; (3) entonces el precio, con un número que salga de lo observado. Mientras tanto no hay tabla de precios, y eso es deliberado.

---

## Cómo añadir una entrada

1. ID siguiente. **Nunca reutilizar ni renumerar.**
2. `Date` absoluta `YYYY-MM-DD`. Nunca «la semana pasada».
3. `Evidence` **con nivel**. Si no hay evidencia, escribir «ninguna»: es un dato sobre la decisión, no un hueco.
4. `Alternatives` es obligatorio. Una decisión sin alternativas escritas no es una decisión: es lo primero que se nos ocurrió.
5. Si es HIPÓTESIS: **Validates if** y **Falsified if**. Una hipótesis sin falsador es una opinión.
6. Si contradice una entrada anterior, decirlo con el ID: «invalida D-008». La entrada vieja pasa a INVALIDATED y **se queda escrita**.
7. Añadir la fila al índice y, si cambia el estado del proyecto, actualizar [PROJECT_STATE.md](PROJECT_STATE.md).
