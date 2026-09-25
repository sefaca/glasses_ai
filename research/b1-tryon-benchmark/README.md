# B1 — Benchmark de virtual try-on de gafas

B1 responde a **tres preguntas independientes**, y cada una tiene su propio GO/NO-GO. Se puede pasar una y fallar otra, y esa combinación es información, no un empate.

| | Pregunta | Gates | Track |
|---|---|---|---|
| **T · Tecnología** | ¿Puede representarse una **montura real e identificable** sobre la foto de una persona? | GT-1…GT-6 | A, B |
| **C · Comercial** | ¿Alguna tecnología nos permite montar un **agregador multi-marca afiliado** a coste razonable y con licencia válida? | GC-1…GC-6 | 0, C |
| **P · Producto** | ¿Existe una razón real para que alguien **use nuestro agregador** en vez de ir a la marca? | GP-1…GP-4 | D |

Un ★★★★★ técnico con un ❌ de licencia no es nuestro proveedor, por muy bueno que sea. Y un GO técnico con un NO-GO de producto significa que hemos construido una demo, no un negocio.

| Documento | Contenido |
|---|---|
| [providers.md](providers.md) | **A** — Proveedores en las dos dimensiones, con niveles de evidencia |
| Este archivo, §2–§4 | **B** — Protocolo e inputs exactos |
| [rubric.md](rubric.md) | **C** — Rúbrica 0–3 y test ciego |
| [multi-brand-test.md](multi-brand-test.md) | Track D — validación de producto |
| Este archivo, §6 | **D** — Coste estimado |
| Este archivo, §7 | **E** — Criterios GO / NO-GO, los tres bloques |
| Este archivo, §8 | **F** — Instrucciones exactas de ejecución |

---

## 1. Lo que hay que entender antes de ejecutar

**No hay «varios proveedores de lo mismo». Hay dos tecnologías con riesgos opuestos** (detalle en [providers.md](providers.md)):

- **Clase A (3D/AR — Fittingbox, Jeeliz, Banuba):** la montura es un modelo 3D real. Fidelidad garantizada por construcción, coste marginal ≈ 0 **a escala**, y la imagen se procesa en el navegador. Su riesgo no es la imagen: **es la licencia**.
- **Clase B (generativo — Gemini, FLUX, Qwen):** libertad total de catálogo y coste variable, pero **la fidelidad es el riesgo entero** y hay que enviar la cara del usuario a un servidor de terceros.

Tres cosas que la investigación ya ha establecido y que condicionan el protocolo:

1. **Las condiciones comerciales de Fittingbox y Jeeliz no son públicas.** La página «Terms» de Fittingbox es solo privacidad; Jeeliz no publica ninguna página legal. El bloque C **no se puede resolver leyendo webs**: requiere hablar con ellos, y esa latencia (2–5 días) es el camino crítico real del sprint.
2. **La Clase A es carísima al arrancar y baratísima a escala; la Clase B, al revés.** El punto de cruce está en ~1.800 usuarios activos/mes. Eso hace que el gate de coste haya que evaluarlo **al volumen del mes 1–3**, no en régimen.
3. **La privacidad juega al revés de lo que suponíamos.** Fittingbox procesa la imagen en el navegador; la Clase B exige mandarla fuera.

---

## 2. Protocolo — cinco tracks

### Track 0 — Licencia y viabilidad comercial · **camino crítico, día 1 hora 0**

Diez preguntas que ninguna web contesta y que invalidan cualquier resultado visual si salen mal. Emails en [templates/outreach.md](templates/outreach.md).

1. ¿Podemos usarlo **comercialmente**?
2. ¿Podemos mostrar productos de **múltiples marcas**?
3. ¿Podemos mostrar productos que **no vendemos nosotros**?
4. ¿Podemos usar **sus assets 3D** de terceros? *(la pregunta de las 200.000 monturas)*
5. ¿Podemos **enviar tráfico fuera** con enlaces externos?
6. ¿Podemos usarlo para **afiliación**?
7. ¿Hay **restricciones de marca / trademark**? **¿Quién responde si una marca reclama?**
8. ¿Límites por **usuario / producto / sesión**? ¿Qué eje escala el precio?
9. ¿Podemos construir **nuestra propia UI**? ¿API o solo widget?
10. **Términos de prueba y contratación**: ¿trial real para alguien que no es marca establecida?

> La 7 es la que más importa y la menos evidente. Banuba, que sí publica sus términos, **no prohíbe** mostrar marcas de terceros: lo que hace es trasladarnos toda la responsabilidad por contrato. Lo más probable no es que nos digan que no, sino que nos digan **«adelante, y si Luxottica reclama, es asunto tuyo»**. Preguntar por el sí/no no basta.

### Track A — Proveedores especializados (3D/AR)

No se mide si las gafas están bien colocadas: lo están, es un modelo 3D. Se mide:

1. **Calidad de la digitalización automática.** Jeeliz genera el 3D desde fotos de ficha de producto: ahí es donde puede perderse fidelidad → rúbrica completa.
2. **¿Existe modo foto?** Fittingbox lo confirma por escrito; en Jeeliz es desconocido.
3. **Fluidez en móvil real**, no en portátil.

Captura manual por screenshot: son widgets, no APIs de generación. 8–16 capturas bastan.

### Track B — Modelos generativos · dos rondas

- **Ronda 1 — criba (8 casos/modelo).** 2 personas × 2 fotos × 2 monturas: la más fácil (wayfarer de acetato) y la más difícil (aviador metálico de doble puente). ≈2 €. Se descarta quien no llegue a 4/8 válidos.
- **Ronda 2 — completa (40 casos), solo supervivientes.** 5 personas × 2 fotos × 4 monturas.

El presupuesto debe concentrarse en el ganador, no repartirse por igual.

### Track C — Coste de la ruta autoconstruida

No se implementa nada. Una hora de lectura para responder:

> El tracking facial es gratis y está resuelto (MediaPipe). **El cuello de botella es tener un 3D fiel por montura.** ¿Cuánto cuesta conseguir o generar 30 modelos 3D?

Es la única ruta que elimina la dependencia de un proveedor único, así que su coste es un dato del bloque C, no una curiosidad técnica.

### Track D — Multi-brand test · [multi-brand-test.md](multi-brand-test.md)

5 participantes × 6 monturas × 4–6 marcas. Valida el **producto**: ¿aporta valor RECOMENDACIÓN + MULTI-MARCA + TRY-ON frente a probarse una marca en su propia web? Métrica principal: **tasa de descubrimiento cruzado**.

Depende del Track B: sin try-ons válidos no hay láminas que enseñar.

---

## 3. Inputs exactos

### 3.1. Personas (5)

Por persona, **2 fotos**:

| | Foto 1 | Foto 2 |
|---|---|---|
| Ángulo | Frontal | Girada 15–30° |
| Luz | Buena, difusa | Distinta: más dura, lateral o interior |

Reparto de condiciones entre las 5 personas — **no buscamos diversidad demográfica artificial, buscamos el input real que va a llegar**:

- al menos 1 con **pelo cubriendo** parcialmente la cara o las sienes;
- al menos 1 con **barba**;
- proporciones faciales visiblemente distintas (cara ancha / cara alargada);
- fotos **hechas con móvil**. Si todas son de estudio, el benchmark miente.

**Técnico:** ≥1024 px de lado menor, sin filtros, sin gafas puestas, una sola persona, JPG o PNG.

**Consentimiento por escrito** antes de la primera foto — plantilla en [templates/outreach.md](templates/outreach.md#consentimiento). Las fotos no se versionan (`.gitignore` excluye `research/**/faces/`) y se borran al cerrar B1.

### 3.2. Monturas (6)

Un solo set sirve a los dos tracks, si se elige bien: **6 monturas, 6 marcas distintas, 6 formas, rango de precio amplio.**

| # | Tipo | Qué pone a prueba | Marca sugerida | Track B | Track D |
|---|---|---|---|:-:|:-:|
| **M1** | Aviador metálica | Doble puente, varilla fina, lente en gota, reflejo | Ray-Ban | ✅ **difícil** | ✅ |
| **M2** | Wayfarer, acetato grueso | Grosor, bisel, inclinación de patillas | Persol | ✅ **fácil** | ✅ |
| **M3** | Redonda metálica | Círculo perfecto, puente de llave, aro fino | Meller | ✅ **difícil** | ✅ |
| **M4** | Cat-eye acetato | Vértice superior externo, asimetría de lente | Hawkers | ✅ | ✅ |
| **M5** | Deportiva envolvente | — | Oakley | — | ✅ |
| **M6** | Cuadrada asequible | — | Polaroid | — | ✅ |

- **M1 y M3 son los casos duros:** geometrías que los modelos generativos tienden a «redondear» hacia una montura genérica.
- **Una marca por montura**, para que el test no dependa de lo bien que un modelo se sepa el catálogo de Ray-Ban de memoria, y para que Track D tenga las 4–6 marcas que necesita.
- **Rango de precio ≈40 € a ≈220 €.** Parte del valor de un agregador es enseñar la alternativa barata al lado de la cara: sin rango, Track D no puede detectarlo.

Por montura hacen falta: foto de producto de frente sobre fondo limpio (la referencia), foto en 3/4 si existe, URL de ficha, marca y modelo exactos, precio. Y para M1–M4, **2 distractores** para el test ciego — reglas en [frames/README.md](frames/README.md).

### 3.3. Matriz

```
Track B ronda 2:  5 personas × 2 fotos × 4 monturas  =  40 casos/modelo
  con 3 supervivientes                               = 120 generaciones
Track A:          4 monturas × 2 fotos × 1-2 provs.  ≈  8-16 capturas
Track D:          5 personas × 6 monturas            =  30 try-ons (reutiliza B)
```

### 3.4. Prompt de la Clase B

Mismo prompt literal para todos, sin ajustarlo a favor de ninguno. Se guarda en `prompts/v1.txt`; si cambia, se versiona y se re-ejecuta todo. **Un benchmark con prompts distintos por proveedor no compara proveedores, compara prompts.**

```
Place the exact eyeglasses shown in the reference product image onto the
person's face in the target photo.

Absolute requirements:
- Preserve the frame EXACTLY: lens shape, frame thickness, bridge type and
  height, temple arms, colour, material and finish must match the reference
  product image.
- Do NOT redesign, stylise or substitute the frame.
- Do NOT alter the person's face, skin, hair, age or body in any way.
- Match the lighting and perspective of the target photo.
- Output only the edited photo.
```

---

## 4. Estructura de resultados

```
research/b1-tryon-benchmark/
├── README.md              ← protocolo, coste, GO/NO-GO, ejecución
├── providers.md           ← A: proveedores en dos dimensiones + evidencia
├── rubric.md              ← C: rúbrica 0-3 + test ciego
├── multi-brand-test.md    ← Track D: validación de producto
├── frames/                ← fotos de producto M1-M6 + distractores (versionado)
├── faces/                 ← fotos de las 5 personas          [NO versionado]
├── outputs/               ← {proveedor}/{persona}_{foto}_{montura}.png  [NO versionado]
├── prompts/v1.txt
├── templates/
│   ├── scoring.csv · blind-test.csv · multi-brand-test.csv
│   └── outreach.md        ← Track 0 + consentimiento
└── results/
    ├── scoring.csv · blind-test.csv · multi-brand-test.csv
    ├── licence-matrix.md  ← respuestas del Track 0, una fila por proveedor
    └── findings.md        ← las TRES decisiones, firmadas
```

**Convención obligatoria:** `{proveedor}_{persona}_{foto}_{montura}.png` → `gemini31flash_p3_angulo_M1.png`. Sin esto, 120 imágenes son inanalizables a las dos horas.

---

## 5. Coste estimado (D)

### Track B — generativo

| Modelo | €/img | Ronda 1 (8) | Ronda 2 (40) |
|---|---:|---:|---:|
| Gemini 3.1 Flash Lite Image (1K) | 0,029 € | 0,23 € | 1,15 € |
| Gemini 3.1 Flash Image (1K) | 0,057 € | 0,46 € | 2,29 € |
| Gemini 3 Pro Image (1K/2K) | 0,114 € | 0,92 € | 4,57 € |
| FLUX.1 Kontext [pro] | 0,034 € | 0,27 € | 1,36 € |
| Qwen Image Edit | 0,018 € | 0,14 € | 0,72 € |

```
Ronda 1, los 5 modelos ..................  2,02 €
Ronda 2, 3 supervivientes (caso peor) ...  8,22 €
Track D, 30 try-ons con el ganador ......  1,71 €
Reintentos y fallos (+30 %) .............  3,58 €
                                          ────────
Track B + D .............................  ~15,50 €
```

### Track A — especializado: **presupuesto 0 €**

Corrección importante sobre la estimación anterior. Los precios de las apps de Shopify (39–199 $/mes) **no son los precios directos**: la web de Jeeliz publica Starter **299 $/mes** y Advanced 499 $/mes, y su mes gratuito es «para marcas establecidas», que no somos.

**Decisión: no se paga ninguna suscripción de Clase A durante B1.** Si un proveedor exige pagar para evaluar, eso es una respuesta del Track 0 —dice mucho sobre lo accesibles que son— y no un gasto de benchmark. Se usa lo que haya de trial, demo o plan gratuito; si no hay nada, se evalúa su demo pública y se anota como `[?]`.

### Total autorizado

**~15,50 €.** Nada más. Ni anuncios, ni dominio, ni logo, ni Framer, ni Supabase, ni Stripe, ni plantillas, ni suscripciones.

---

## 6. Criterios GO / NO-GO (E)

Se evalúa **el mejor proveedor de cada clase**, no la media del mercado.

### Bloque T — Tecnología

| Gate | Métrica | GO | NO-GO |
|---|---|---|---|
| **GT-1 · Identidad** | Acierto en el test ciego de 3 opciones (azar = 33 %) | **≥70 %** | <50 % |
| **GT-2 · Validez** | `TASA_VALIDOS` — casos con C1 ≥ 2 y sin flags | **≥70 %** | <50 % |
| **GT-3 · Fidelidad** | `FIDELIDAD_MED` sobre casos válidos | ≥17 / 24 | |
| **GT-4 · Latencia** | Clase B p50/p95 · Clase A carga del widget | ≤12 s / ≤25 s · <3 s | |
| **GT-5 · Calidad comercial** | % de casos con C8 = 3 | ≥30 % | |
| **GT-6 · Integridad facial** | % de casos con `F_CARA` | **≤5 %** | >5 % |

**GO técnico:** GT-1, GT-2 y GT-6 ✅ y ≥2 de {GT-3, GT-4, GT-5}.
GT-6 es eliminatorio por sí solo: si el sistema retoca la cara del usuario, el try-on no es informativo — le estás enseñando a otra persona con esas gafas.

### Bloque C — Modelo de agregador

Todas se responden en el Track 0, **por escrito**. Una respuesta ambigua cuenta como no.

| Gate | Pregunta | GO |
|---|---|---|
| **GC-1 · Multi-marca** | ¿Podemos mostrar varias marcas? | Sí por escrito |
| **GC-2 · Productos ajenos** | ¿Podemos mostrar lo que no vendemos? | Sí por escrito |
| **GC-3 · Tráfico saliente** | ¿Enlaces externos y afiliación permitidos? | Sí por escrito |
| **GC-4 · Riesgo IP** | ¿Quién responde si una marca reclama? | Riesgo acotado **o** asumible conscientemente |
| **GC-5 · Coste al arranque** | Coste/usuario activo **al volumen del mes 1–3**, no en régimen | ≤0,10 € |
| **GC-6 · Límites** | Topes de usuarios/productos/sesiones compatibles con tráfico social | Sí |

**GO comercial:** GC-1, GC-2 y GC-3 ✅ y ≥2 de {GC-4, GC-5, GC-6}.
Si los tres primeros fallan en **todos** los proveedores de Clase A, la Clase A desaparece y el bloque T se juega por completo a la Clase B.

### Bloque P — Producto · [multi-brand-test.md](multi-brand-test.md)

| Gate | Métrica | GO |
|---|---|---|
| **GP-1 · Descubrimiento cruzado** | Eligen una marca que no habían nombrado antes | ≥3 de 5 |
| **GP-2 · Utilidad espontánea** | Dicen que les es útil sin que haya que explicarlo | ≥3 de 5 |
| **GP-3 · Momento identificado** | Saben decir en qué punto de su compra les serviría | ≥3 de 5 |
| **GP-4 · Comparación valorada** | Mencionan espontáneamente comparar marcas/precios | ≥3 de 5 |

**GO de producto:** 3 de 4.

### Cómo se combinan

| T | C | P | Decisión |
|:-:|:-:|:-:|---|
| ✅ | ✅ | ✅ | **GO.** Pasar a afiliación (B3) |
| ✅ | ✅ | ❌ | **Parar y repetir P con n=15.** La tecnología está, el producto no se ha demostrado. Es el desenlace más probable e incómodo |
| ✅ | ❌ | ✅ | Clase A cerrada. **Seguir con Clase B**, revisando GC-5 con sus números |
| ❌ | ✅ | — | Clase B insuficiente. Depende por completo de que la Clase A nos deje entrar |
| ❌ | ❌ | — | **NO-GO.** Reevaluar en 3–6 meses: el campo se mueve rápido |

Las tres decisiones se escriben por separado en `results/findings.md`, con los números delante. **Sin números no hay decisión.**

---

## 7. Instrucciones exactas de ejecución (F)

### Día 1

**Hora 0 — Track 0 (30 min). Primero esto, antes que nada.**
1. Enviar los emails de [templates/outreach.md](templates/outreach.md) a Fittingbox, Jeeliz, Banuba y Perfect Corp con las 10 preguntas.
2. Solicitar trial/demo donde exista. **No contratar nada de pago.**

**Hora 0:30 — Inputs (2 h).**
3. Consentimiento por escrito de las 5 personas y recogida de las 10 fotos (§3.1) en `faces/p1..p5/`. Verificar que `git status` **no** las muestra.
4. Descargar las fotos de producto de M1–M6 a `frames/` y rellenar la tabla de [frames/README.md](frames/README.md).
5. Elegir los 2 distractores de M1–M4 según la regla de [frames/README.md](frames/README.md).

**Hora 2:30 — Track B ronda 1 (1,5 h).**
6. Claves de Gemini API y fal, ~10 € de crédito en cada una.
7. Generar los 8 casos de criba × 5 modelos con `prompts/v1.txt` **sin modificar**. Registrar latencia y coste real por llamada.
8. Puntuar solo C1. Descartar los modelos con <4/8 válidos.

**Hora 4 — Track A (2 h).**
9. Probar lo que haya disponible sin pagar. Comprobar **si existe modo foto** y capturar pantallas en `outputs/{proveedor}/`.
10. Probar en **móvil real**, no en portátil.

**Hora 6 — Track B ronda 2 (2 h).**
11. Generar los 40 casos con los supervivientes, más los 30 de Track D con el ganador.

### Día 2

**Hora 0 — Puntuación (2 h).**
12. Calibrar con 5 casos de referencia ([rubric.md §4](rubric.md)).
13. Puntuar los 8 criterios y los flags en `results/scoring.csv`.

**Hora 2 — Test ciego (1,5 h).**
14. Montar láminas (resultado + 3 fotos de producto en orden aleatorio).
15. Pasarlo a **2 personas que no hayan participado** en la generación.

**Hora 3:30 — Track D (2,5 h).**
16. Montar las 5 láminas de 6 monturas y ejecutar las entrevistas según [multi-brand-test.md](multi-brand-test.md). 30 min por participante.

**Hora 6 — Track C (45 min).**
17. Investigar el coste de conseguir o generar 30 modelos 3D. Anotar en `results/findings.md`.

**Hora 6:45 — Decisión (1 h).**
18. Rellenar los tres bloques de gates y escribir las **tres decisiones por separado**.
19. Volcar las respuestas del Track 0 que hayan llegado en `results/licence-matrix.md`. Las que falten quedan como `[?]` abiertas — **y el bloque C no se cierra hasta que lleguen.**
20. Borrar `faces/` y `outputs/` si hay NO-GO; archivarlos con fecha de caducidad si hay GO.

---

## 8. Foto vs cámara: no decidir todavía

Fittingbox confirma por escrito que soporta **ambos** modos [D], así que la disyuntiva no es real mientras siga en la mesa:

```
Modo A — Foto            Modo B — Cámara
subes foto               das permiso de cámara
analizamos               te ves en vivo
recomendamos             vas cambiando de montura
try-on                   try-on instantáneo
comparas y compartes
```

Podrían convivir: **«Pruébatelas ahora»** → cámara · **«Ver cómo me quedan en una foto»** → foto.

**No se decide la UX antes de saber qué nos deja hacer cada proveedor bajo qué licencia.** Lo único que hay que registrar en B1 es qué modos soporta cada candidato y a qué precio, porque si el ganador solo hace cámara en vivo, eso cambia el quality check, la comparación sobre la misma foto y la share card — es decir, cambia el producto, no la infraestructura.

---

## 9. Lo que este benchmark NO hace

No se desarrolla MVP, no se crea frontend, no se conecta Supabase, no se implementa ninguna funcionalidad de producto, no se compra dominio ni marca, no se lanzan anuncios y no se contrata ninguna suscripción. El único gasto autorizado son los ~15,50 € de §5.
