# B1 — Benchmark de virtual try-on de gafas

**Pregunta que responde este benchmark:**

> ¿Existe una tecnología que represente una **montura real e identificable** sobre la fotografía real de una persona, con fidelidad suficiente para sostener un producto afiliado?

No «¿queda bonito?». No «¿funciona la IA?». **¿Es identificable ese modelo concreto?**

Si la respuesta es no, el proyecto no continúa en esta forma. Nada de lo que hay aguas abajo —catálogo, afiliación, SEO, marca— importa hasta que esto esté contestado.

| Documento | Contenido |
|---|---|
| [providers.md](providers.md) | **A** — Tabla comparativa de proveedores investigados y fuentes |
| Este archivo, §2–§3 | **B** — Protocolo e inputs exactos |
| [rubric.md](rubric.md) | **C** — Rúbrica 0–3 y test ciego |
| Este archivo, §5 | **D** — Coste estimado |
| Este archivo, §6 | **E** — Criterio GO / NO-GO |
| Este archivo, §7 | **F** — Instrucciones exactas de ejecución |

---

## 1. Lo que hay que entender antes de ejecutar

La investigación de proveedores ([providers.md](providers.md)) obliga a un cambio en el diseño original. Hay **dos clases de tecnología con riesgos opuestos**, y el benchmark tiene que atacar las dos:

- **Clase A (3D/AR — Fittingbox, Jeeliz, Banuba):** la montura es un modelo 3D real. La fidelidad geométrica está garantizada por construcción; el coste es una suscripción y el coste marginal por try-on tiende a cero. **Su riesgo no es la imagen: es la licencia.** Su precio y sus condiciones están diseñadas para un retailer que vende su propio catálogo, no para un agregador independiente multi-marca.
- **Clase B (generativo — Gemini, FLUX, Qwen):** la montura son píxeles dibujados a partir de una referencia. Libertad total de catálogo y coste variable por generación, pero **la fidelidad es el riesgo entero**, y la limitación documentada de estos modelos (pérdida de nitidez en accesorios y detalle fino) cae exactamente sobre lo que nos importa: puente, patillas, grosor.

Por eso el benchmark tiene **tres tracks** y el primero no genera ni una sola imagen.

---

## 2. Protocolo

### Track 0 — Viabilidad comercial y legal (se lanza primero, día 1 hora 0)

Siete preguntas que ninguna web contesta y que invalidan cualquier resultado visual si salen mal. Se envían por email **antes de empezar a generar nada**, porque la latencia de respuesta comercial (2–5 días) es el verdadero camino crítico.

Las preguntas y los borradores están en [templates/outreach.md](templates/outreach.md). La que decide:

> ¿Su licencia permite que **un tercero independiente** muestre monturas de marcas con las que no tiene relación comercial?

Si la respuesta de todos es no, la Clase A entera desaparece y B1 se juega por completo a la Clase B.

### Track A — Proveedores especializados (3D/AR)

Aquí no se mide si las gafas están bien colocadas: **están bien colocadas, es un modelo 3D**. Se mide:

1. **Calidad de la digitalización automática.** Jeeliz genera el 3D desde las fotos de la ficha de producto. Esa conversión es donde puede perderse la fidelidad → se evalúa con la misma rúbrica.
2. **¿Existe modo foto?** Nuestro flujo es «sube una foto». Fittingbox declara modo foto; Jeeliz parece solo cámara en vivo. **Si solo hay cámara en vivo, cambia el producto**, no solo el proveedor (ver §8).
3. **Latencia de carga y fluidez en móvil real**, no en portátil.

Captura manual por screenshot: son widgets, no APIs de generación. ~8–16 capturas bastan.

### Track B — Modelos generativos

Aquí sí: 40 casos por modelo, vía API, reproducible.

**Ejecución en dos rondas, para no gastar de más:**

- **Ronda 1 — criba (8 casos por modelo).** 2 personas × 2 fotos × 2 monturas (la más fácil: wayfarer de acetato grueso; la más difícil: aviador metálico de doble puente). Coste ≈ 2 €. Descarta a cualquiera que no llegue a 4/8 casos válidos.
- **Ronda 2 — completa (40 casos), solo supervivientes.** 5 personas × 2 fotos × 4 monturas.

Si un modelo no supera la ronda 1, no se le dedican 40 casos. La mayoría del presupuesto debe ir al ganador, no a repartirse por igual.

### Track C — Coste real de la ruta autoconstruida

No se implementa nada. Se responde a una sola pregunta con una hora de lectura:

> El tracking facial (MediaPipe) es gratis y está resuelto. **El cuello de botella es tener un modelo 3D fiel por montura.** ¿Cuánto cuesta conseguir o generar 30 modelos 3D?

Es la respuesta que determina si existe una salida a medio plazo con coste marginal cero, en caso de que la Clase A no nos deje entrar y la Clase B no dé la talla.

---

## 3. Inputs exactos

### 3.1. Personas (5)

Por persona, **2 fotos**:

| | Foto 1 | Foto 2 |
|---|---|---|
| Ángulo | Frontal | Girada 15–30° |
| Luz | Buena, difusa | Distinta a la foto 1 (más dura, lateral, o interior) |

Reparto de condiciones a lo largo de las 5 personas — **no buscamos diversidad demográfica artificial, buscamos el tipo de input real que va a llegar**:

- al menos 1 persona con **pelo cubriendo parcialmente** la cara o las sienes;
- al menos 1 persona con **barba**;
- proporciones faciales visiblemente distintas entre sí (cara ancha / cara alargada);
- fotos hechas **con móvil**, no de estudio. Si todas las fotos son perfectas, el benchmark miente.

**Requisitos técnicos:** ≥1024 px de lado menor, sin filtros, sin gafas puestas, una sola persona, JPG o PNG.

**Consentimiento:** las 5 personas deben dar consentimiento explícito por escrito para procesar su imagen en proveedores externos de IA para una prueba técnica interna. Plantilla en [templates/outreach.md](templates/outreach.md#consentimiento). Las fotos **no se versionan** (`.gitignore` excluye `research/**/faces/`) y se borran al cerrar B1.

### 3.2. Monturas (4)

Elegidas por **máximo contraste geométrico**, para detectar si el proveedor respeta la arquitectura de la montura o simplemente dibuja «unas gafas»:

| # | Tipo | Qué pone a prueba | Modelo sugerido |
|---|---|---|---|
| **M1** | **Aviador metálica** | Doble puente, varilla fina, lente en gota, reflejo metálico | Ray-Ban Aviator RB3025 |
| **M2** | **Wayfarer, acetato grueso** | Grosor, bisel, inclinación característica de las patillas | Ray-Ban Wayfarer RB2140 |
| **M3** | **Redonda metálica** | Círculo perfecto (se deforma con facilidad), puente de llave, aro fino | Ray-Ban Round Metal RB3447 |
| **M4** | **Cat-eye** | Vértice superior externo, asimetría de la lente | Cualquier cat-eye de acetato de otra marca (Meller / Hawkers) |

M1 y M3 son los **casos duros**: geometrías que los modelos generativos tienden a «redondear» hacia una montura genérica. M4 en una marca distinta evita que todo el test dependa de lo bien que un modelo conozca Ray-Ban de memoria.

De cada montura hace falta: **foto de producto de frente sobre fondo limpio** (la que se envía como referencia) + **foto en 3/4** si existe (ayuda a los modelos que aceptan varias referencias) + URL de la ficha + marca y modelo exactos.

### 3.3. Matriz

```
Track B, ronda 2:  5 personas × 2 fotos × 4 monturas = 40 casos por modelo
Con 3 modelos supervivientes:                          120 generaciones
Track A:           4 monturas × 2 fotos × 1-2 proveedores ≈ 8-16 capturas
```

### 3.4. Prompt para la Clase B

Mismo prompt literal para todos los modelos, sin ajustarlo a favor de ninguno. Se guarda en `prompts/v1.txt` junto a los resultados; si se cambia, se versiona a `v2` y se re-ejecuta todo. **Un benchmark con prompts distintos por proveedor no compara proveedores, compara prompts.**

Punto de partida:

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
├── README.md              ← este archivo: protocolo, coste, GO/NO-GO, ejecución
├── providers.md           ← A: tabla comparativa + fuentes
├── rubric.md              ← C: rúbrica 0-3 + test ciego
├── frames/                ← fotos de producto de M1-M4 (versionadas)
│   └── README.md
├── faces/                 ← fotos de las 5 personas    [NO versionado]
│   └── p1/{frontal.jpg, angulo.jpg} ...
├── outputs/                                            [NO versionado]
│   └── {proveedor}/{persona}_{foto}_{montura}.png
├── prompts/
│   └── v1.txt
├── templates/
│   ├── scoring.csv        ← una fila por caso
│   ├── blind-test.csv     ← una fila por lámina
│   └── outreach.md        ← emails del Track 0 + consentimiento
└── results/
    ├── scoring.csv        ← copia de la plantilla, rellenada
    ├── blind-test.csv
    └── findings.md        ← conclusión y decisión GO/NO-GO firmada
```

**Convención de nombre, obligatoria:** `{proveedor}_{persona}_{foto}_{montura}.png` → `gemini31flash_p3_angulo_M1.png`. Sin esto, 120 imágenes son inanalizables a las dos horas.

---

## 5. Coste estimado (D)

### Track B — generativo

Precios oficiales por imagen a 2026-09-25 (ver [providers.md §2](providers.md)):

| Modelo | €/img aprox. | Ronda 1 (8) | Ronda 2 (40) |
|---|---:|---:|---:|
| Gemini 3.1 Flash Lite Image (1K) | 0,029 € | 0,23 € | 1,15 € |
| Gemini 3.1 Flash Image (1K) | 0,057 € | 0,46 € | 2,29 € |
| Gemini 3 Pro Image (1K/2K) | 0,114 € | 0,92 € | 4,57 € |
| FLUX.1 Kontext [pro] (fal) | 0,034 € | 0,27 € | 1,36 € |
| Qwen Image Edit (fal) | 0,018 € | 0,14 € | 0,72 € |

*Conversión a 1 $ ≈ 0,85 €, a verificar el día de la compra de créditos.*

```
Ronda 1, los 5 modelos ..................  2,02 €
Ronda 2, 3 supervivientes (caso peor) ...  8,22 €
Reintentos y fallos (+30 %) .............  3,07 €
                                          ────────
Track B total ...........................  ~13,50 €
```

### Track A — especializado

| Proveedor | Coste del benchmark |
|---|---|
| Jeeliz | **0 €** — plan Discovery gratuito, 3 productos |
| Fittingbox | 0 € si el free trial cubre la prueba; si no, 59 $/mes (~50 €) |
| Banuba / Perfect Corp | 0 € vía demo |

### Total

**15 € – 65 €**, según haga falta pagar un mes de Fittingbox.

> **Nada de anuncios, dominio, logo, Framer, Supabase, Stripe ni plantillas.** No se gasta un euro fuera de esta tabla hasta que B1 esté cerrado.

---

## 6. Criterio GO / NO-GO (E)

Se evalúa **el mejor proveedor**, no la media del mercado. Basta uno que pase.

### Puertas eliminatorias — las cuatro

| Gate | Métrica | GO | NO-GO |
|---|---|---|---|
| **G1 · Identidad** | Acierto en el test ciego de 3 opciones (azar = 33 %) | **≥70 %** | <50 % |
| **G2 · Validez** | `TASA_VALIDOS` — casos con C1 ≥ 2 y sin flags | **≥70 %** | <50 % |
| **G3 · Coste** | `COSTE_EFECTIVO` por try-on válido, o coste/usuario activo proyectado en suscripción | **≤0,10 €** | >0,25 € |
| **G4 · Licencia** | ¿Puede un tercero independiente mostrar marcas ajenas? | **Sí, por escrito** | No, en todos |

`F_CARA` en más del 5 % de los casos es **NO-GO por sí solo**, con independencia de todo lo demás: si el sistema retoca la cara del usuario, el try-on no es informativo.

### Puertas de calidad — al menos 2 de 3

| Gate | Métrica | GO |
|---|---|---|
| **G5 · Fidelidad** | `FIDELIDAD_MED` sobre casos válidos | ≥17 / 24 |
| **G6 · Latencia** | Clase B: p50 / p95 · Clase A: carga del widget | ≤12 s / ≤25 s · <3 s |
| **G7 · Calidad comercial** | % de casos con C8 = 3 | ≥30 % |

### Reglas de decisión

- **GO →** pasar a afiliación (B3). G1–G4 ✅ y ≥2 de {G5, G6, G7}.
- **GO condicional →** G1 y G2 en 50–70 %. Se sigue, pero con el try-on de pago desde el primer uso y sin free tier. Revisar la economía unitaria antes de escribir código.
- **NO-GO →** G1 <50 % en todos los proveedores. **Parar.** No hay producto afiliado que construir sobre esto. Volver a evaluar en 3–6 meses: es un campo que se mueve rápido.
- **Bifurcación de licencia →** la Clase A pasa G1–G3 con holgura pero falla G4. Entonces el problema no es técnico sino de modelo de negocio, y las opciones son: negociar, ser retailer en vez de agregador (contradice CLAUDE.md §0), o volver a la Clase B / ruta autoconstruida.

La decisión se escribe en `results/findings.md` con los números delante. **Si no hay números, no hay decisión.**

---

## 7. Instrucciones exactas de ejecución (F)

### Día 1

**Hora 0 — Track 0 (30 min). Primero esto, antes que nada.**
1. Enviar los 4 emails de [templates/outreach.md](templates/outreach.md) a Fittingbox, Jeeliz, Banuba y Perfect Corp.
2. Crear cuenta gratuita en Jeeliz (plan Discovery, 3 productos) y solicitar el free trial de Fittingbox.

**Hora 0:30 — Inputs (2 h).**
3. Pedir consentimiento por escrito a las 5 personas y recoger las 10 fotos según §3.1.
4. Guardarlas en `faces/p1..p5/` con los nombres `frontal.jpg` y `angulo.jpg`. Verificar que `git status` **no** las muestra.
5. Descargar las fotos de producto de M1–M4 a `frames/` y anotar marca, modelo y URL en `frames/README.md`.
6. Elegir los **2 distractores por montura** según la regla de §1 de [rubric.md](rubric.md) y guardarlos como `frames/M1_distractor_a.jpg`, etc.

**Hora 2:30 — Track B ronda 1 (1,5 h).**
7. Dar de alta claves de Gemini API y fal. Cargar ~10 € de crédito en cada una.
8. Generar los 8 casos de criba × 5 modelos con el prompt `prompts/v1.txt` **sin modificar**. Registrar latencia y coste real de cada llamada en `results/scoring.csv`.
9. Puntuar solo C1 en los 40 outputs. Descartar los modelos con <4/8 válidos.

**Hora 4 — Track A (2 h).**
10. Subir M1–M3 a Jeeliz (Discovery permite 3) y probar el try-on en **móvil real**.
11. Comprobar si existe modo foto. Capturar pantalla de los casos y guardarlos en `outputs/jeeliz/`.
12. Repetir con Fittingbox si el trial está activo.

**Hora 6 — Track B ronda 2 (2 h).**
13. Generar los 40 casos completos con los supervivientes. Guardar con la convención de nombre de §4.

### Día 2

**Hora 0 — Puntuación (2 h).**
14. Calibrar con 5 casos de referencia (§4 de [rubric.md](rubric.md)).
15. Puntuar los 8 criterios y los flags de todos los casos en `results/scoring.csv`.

**Hora 2 — Test ciego (1,5 h).**
16. Montar las láminas (resultado + 3 fotos de producto en orden aleatorio).
17. Pasarlo a **2 personas que no hayan participado** en la generación. Registrar en `results/blind-test.csv`.

**Hora 3:30 — Track C (1 h).**
18. Investigar el coste de conseguir o generar 30 modelos 3D de monturas. Anotar en `results/findings.md`.

**Hora 4:30 — Decisión (1 h).**
19. Calcular las métricas de §3 de [rubric.md](rubric.md), rellenar la tabla de gates de §6 y escribir la decisión en `results/findings.md`.
20. Borrar `faces/` y `outputs/` si la decisión es NO-GO, o archivarlos con fecha de caducidad si es GO.

---

## 8. El hallazgo que puede cambiar el producto, no solo el proveedor

Si la Clase A gana (probable en fidelidad) y resulta que **solo funciona con cámara en vivo**, el producto deja de ser:

```
sube una foto → analizamos → te enseñamos 6 → te pruebas
```

y pasa a ser:

```
enciende la cámara → te ves en un espejo → te enseñamos 6 → cambias entre ellas en vivo
```

No es peor. En varios aspectos es mejor: sin subida, sin espera, sin foto almacenada, **sin problema de RGPD** y con coste marginal cero. Pero rompe cosas que CLAUDE.md da por sentadas: el quality check de imagen, la comparación lado a lado con la misma foto, la share card para redes y buena parte del funnel instrumentado en §17.

**Es una decisión de producto, no de infraestructura, y hay que tomarla explícitamente al cerrar B1.** Si sale por aquí, la vía intermedia es: cámara en vivo para probar + captura de fotograma para comparar y compartir.

---

## 9. Lo que este benchmark NO hace

No se desarrolla MVP, no se crea frontend, no se conecta Supabase, no se implementa ninguna funcionalidad de producto y no se compra dominio, marca ni infraestructura. El único gasto autorizado es el de §5.
