# Monturas de referencia (M1–M4)

Elegidas por **máximo contraste geométrico**: el objetivo es detectar si el proveedor respeta la arquitectura de cada montura o simplemente dibuja «unas gafas».

Rellenar al recoger los inputs (día 1, paso 5 del protocolo):

| ID | Tipo | Qué pone a prueba | Marca | Modelo | URL ficha | Archivo |
|---|---|---|---|---|---|---|
| **M1** | Aviador metálica | Doble puente, varilla fina, lente en gota, reflejo metálico | | | | `M1.jpg` |
| **M2** | Wayfarer, acetato grueso | Grosor, bisel, inclinación de patillas | | | | `M2.jpg` |
| **M3** | Redonda metálica | Círculo perfecto, puente de llave, aro fino | | | | `M3.jpg` |
| **M4** | Cat-eye | Vértice superior externo, asimetría de lente | | | | `M4.jpg` |

**M1 y M3 son los casos duros:** geometrías que los modelos generativos tienden a «redondear» hacia una montura genérica. M4 debe ser de una marca distinta a las demás, para que el test no dependa de lo bien que un modelo se sepa el catálogo de Ray-Ban de memoria.

## Archivos por montura

- `M{n}.jpg` — foto de producto **de frente**, fondo limpio. Es la referencia que se envía al proveedor.
- `M{n}_34.jpg` — foto en 3/4 si existe. Referencia adicional para modelos que aceptan varias.
- `M{n}_distractor_a.jpg` y `M{n}_distractor_b.jpg` — las dos opciones falsas del test ciego.

## Regla de selección de distractores

El distractor debe diferir del objetivo en **al menos 2** de: forma de lente · grosor de montura · tipo de puente · color/material.

- Demasiado parecido (RB3025 vs RB3026) → el test es injusto y no mide nada.
- Demasiado distinto (aviador vs cat-eye) → el test es trivial y lo aprueba cualquiera.

| ID | Distractor A | Distractor B | Atributos que difieren |
|---|---|---|---|
| M1 | | | |
| M2 | | | |
| M3 | | | |
| M4 | | | |

## Derechos

Estas imágenes son **solo para evaluación técnica interna**. No se publican, no van a redes y no se usan en marketing. El uso de fotos de producto de marca en un contexto público es una cuestión distinta que se resuelve en B3 (afiliación), donde la fuente legítima son los feeds de afiliado, no la descarga directa.
