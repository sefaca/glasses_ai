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

---

## Cómo añadir una entrada

1. ID siguiente. **Nunca reutilizar ni renumerar.**
2. `Date` absoluta `YYYY-MM-DD`. Nunca «la semana pasada».
3. `Evidence` **con nivel**. Si no hay evidencia, escribir «ninguna»: es un dato sobre la decisión, no un hueco.
4. `Alternatives` es obligatorio. Una decisión sin alternativas escritas no es una decisión: es lo primero que se nos ocurrió.
5. Si es HIPÓTESIS: **Validates if** y **Falsified if**. Una hipótesis sin falsador es una opinión.
6. Si contradice una entrada anterior, decirlo con el ID: «invalida D-008». La entrada vieja pasa a INVALIDATED y **se queda escrita**.
7. Añadir la fila al índice y, si cambia el estado del proyecto, actualizar [PROJECT_STATE.md](PROJECT_STATE.md).
