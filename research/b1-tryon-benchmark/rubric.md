# B1 · Entregable C — Rúbrica de evaluación

Dos instrumentos, y el orden importa:

1. **Test ciego de identificación** — mide *identidad* de forma objetiva. Es el que decide.
2. **Rúbrica 0–3** — mide *por qué* falla y *cuánto*. Es la que permite comparar proveedores entre sí.

La rúbrica sola no vale: puntuar «¿reconozco la montura?» sabiendo cuál es la montura es un juicio contaminado. Por eso el test ciego va primero y lo hace otra persona.

---

## 1. Test ciego de identificación (instrumento principal)

### Por qué es el que manda

Nuestro negocio depende de poder afirmar:

> «Estas son las Ray-Ban Aviator RB3025 que estás viendo.»

No:

> «Esto se parece bastante a unas Ray-Ban.»

Lo primero sostiene una afiliación. Lo segundo es un generador de imágenes. La diferencia no la detecta una puntuación estética, la detecta un test de identificación.

### Montaje

Por cada output generado se prepara una lámina con:

- arriba: **el resultado generado** (la persona con las gafas puestas);
- abajo: **tres fotos de producto** etiquetadas A, B, C — la montura real objetivo y dos distractores.

Pregunta única al evaluador:

> **«¿Cuál de estas tres monturas está intentando representar la imagen de arriba?»**

Se registra la respuesta y una segunda pregunta de confianza:

> **«¿Cómo de seguro estás?»** — Seguro / Dudando / He adivinado

### Reglas que hacen válido el test

- **El evaluador no puede ser quien generó las imágenes** ni haber visto el catálogo de prueba.
- **Orden aleatorio** de A/B/C en cada lámina (que el objetivo no caiga siempre en la misma posición).
- **Orden aleatorio de las láminas**, mezclando proveedores. El evaluador no sabe qué proveedor generó qué.
- **Selección de distractores:** el distractor debe diferir del objetivo en **al menos 2** de estos 4 atributos: forma de lente · grosor de montura · tipo de puente · color/material.
  - Demasiado parecido (RB3025 vs RB3026) → el test es injusto y no mide nada.
  - Demasiado distinto (aviador vs cat-eye) → el test es trivial y todos aprobarían.
- Mínimo **2 evaluadores** distintos sobre el mismo set. Si discrepan mucho, el set de distractores está mal calibrado.

### Lectura del resultado

| Acierto | Lectura |
|---|---|
| ~33 % | **Azar.** El proveedor no representa el producto, solo genera «unas gafas» |
| 50–69 % | Zona muerta. Hay señal pero no basta para afirmar identidad de producto |
| **≥70 %** | **Umbral GO.** El producto es identificable |
| ≥85 % | Excelente |

Adicional: si el % de «he adivinado» supera el 30 %, el resultado de acierto no es fiable aunque salga alto.

---

## 2. Rúbrica 0–3 (instrumento de diagnóstico)

Ocho criterios, 0–3 cada uno. **Total bruto: 0–24.**

> Nota: en tu tabla original agrupabas puente y patillas en una sola fila (7 criterios, 0–21). Los separo porque fallan de forma distinta y diagnostican cosas distintas: el puente delata si el modelo entendió la *arquitectura* de la montura (un aviador tiene doble puente), y las patillas delatan si entendió la *perspectiva 3D*. Si prefieres mantener 0–21, funde C4 y C5 y ajusta los umbrales proporcionalmente.

### Grupo I — Identidad (criterio de corte)

| | Criterio | 0 | 1 | 2 | 3 |
|---|---|---|---|---|---|
| **C1** | **Identidad de la montura** | No parece esa montura | Similar | Claramente similar | Prácticamente idéntica |

**C1 funciona como gate por caso:** si C1 ≤ 1, el caso cuenta como **fallo** y no se promedia el resto. Un try-on precioso de otra montura es un fallo de producto, no un aprobado con matices.

### Grupo II — Fidelidad geométrica (¿es *ese* producto?)

| | Criterio | 0 | 1 | 2 | 3 |
|---|---|---|---|---|---|
| **C2** | **Geometría / forma de lente** | Incorrecta | Bastantes errores | Correcta | Muy fiel |
| **C3** | **Escala y proporción** respecto a la cara | Incorrecta | Regular | Buena | Muy buena |
| **C4** | **Puente** (tipo, altura, doble puente si aplica) | Inexistente o deformado | Errores visibles | Correcto | Muy fiel |
| **C5** | **Patillas** (existencia, grosor, perspectiva, terminal) | Inexistentes o deformadas | Errores visibles | Correctas | Muy fieles |
| **C6** | **Color y material** (acetato vs metal, acabado, tinte de lente) | Incorrecto | Aproximado | Correcto | Muy fiel |

### Grupo III — Integración (¿es creíble?)

| | Criterio | 0 | 1 | 2 | 3 |
|---|---|---|---|---|---|
| **C7** | **Posición y alineación** en la cara | Incorrecta | Regular | Buena | Natural |
| **C8** | **Calidad visual final** (luz, sombras, bordes, artefactos) | Mala | Aceptable | Buena | **Comercial** |

En C8, «3 = comercial» significa: *publicaría esta imagen en la ficha de producto sin retocar*.

### Fallos catastróficos — marcar aparte, no puntuar

Se registran como flag booleano porque una media los esconde y son inaceptables a cualquier precio:

- `F_IDENTIDAD` — la montura generada es reconociblemente **otro modelo**
- `F_CARA` — se alteró la cara de la persona (rasgos, piel, edad, complexión)
- `F_EXTRA` — miembros, orejas o gafas duplicadas, deformidades
- `F_VACIO` — no hay gafas en el resultado
- `F_RECHAZO` — el proveedor rechazó la petición (filtro de contenido, cara detectada, etc.)

> `F_CARA` es especialmente grave y fácil de pasar por alto: si el modelo «mejora» sutilmente la cara del usuario, el try-on deja de ser informativo — le estás enseñando a otra persona con esas gafas. Mirar siempre original y resultado al lado.

---

## 3. Puntuación compuesta

Por cada combinación (proveedor × persona × foto × montura):

```
Caso válido        = C1 ≥ 2  y  ningún flag F_*
Fidelidad bruta    = C1+C2+C3+C4+C5+C6+C7+C8          (0–24)
Fidelidad geométr. = C2+C3+C4+C5+C6                    (0–15)
```

Por proveedor, sobre el conjunto de casos:

```
TASA_VALIDOS   = casos válidos / casos totales            ← la métrica de negocio
ACIERTO_CIEGO  = aciertos test ciego / láminas            ← la métrica de verdad
FIDELIDAD_MED  = media de Fidelidad bruta de casos válidos
LAT_P50, LAT_P95
COSTE_EFECTIVO = coste total / casos válidos              ← incluye lo pagado por los fallos
```

**`COSTE_EFECTIVO`, no coste por llamada.** Si un proveedor cuesta 0,04 $ pero solo el 50 % de sus salidas son válidas, cuesta 0,08 $. Es el número que entra en la economía unitaria.

---

## 4. Calibración antes de puntuar nada

Antes de la ronda completa, quien puntúe debe calibrar con **5 casos de referencia** puntuados dos veces con 1 hora de separación. Si la diferencia media supera 2 puntos sobre 24, la rúbrica se está aplicando de forma inestable y hay que fijar ejemplos ancla («esto es un 2 en patillas») antes de seguir.

Puntuar siempre **original y resultado en pantalla a la vez**, al 100 % de zoom, y con la foto de producto de la montura a la vista.
