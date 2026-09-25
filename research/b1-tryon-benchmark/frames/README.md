# Monturas de referencia (M1–M6)

Un solo set sirve a los dos tracks: **6 monturas, 6 marcas distintas, 6 formas, rango de precio amplio.**

Rellenar al recoger los inputs (día 1, paso 4 del protocolo):

| ID | Tipo | Qué pone a prueba | Marca | Modelo | Precio | URL ficha | Track B | Track D |
|---|---|---|---|---|---|---|:-:|:-:|
| **M1** | Aviador metálica | Doble puente, varilla fina, lente en gota, reflejo metálico | | | | | ✅ **difícil** | ✅ |
| **M2** | Wayfarer, acetato grueso | Grosor, bisel, inclinación de patillas | | | | | ✅ **fácil** | ✅ |
| **M3** | Redonda metálica | Círculo perfecto, puente de llave, aro fino | | | | | ✅ **difícil** | ✅ |
| **M4** | Cat-eye acetato | Vértice superior externo, asimetría de lente | | | | | ✅ | ✅ |
| **M5** | Deportiva envolvente | — | | | | | — | ✅ |
| **M6** | Cuadrada asequible | — | | | | | — | ✅ |

### Reglas de selección

- **M1 y M3 son los casos duros:** geometrías que los modelos generativos tienden a «redondear» hacia una montura genérica. Si un proveedor falla aquí y acierta en M2, está dibujando gafas, no reproduciendo un producto.
- **Una marca distinta por montura.** Evita que el test dependa de lo bien que un modelo se sepa el catálogo de Ray-Ban de memoria, y da a Track D las 4–6 marcas que necesita.
- **Rango de precio ≈40 € a ≈220 €.** Parte del valor de un agregador es enseñar la alternativa barata al lado de la cara; sin rango, Track D no puede detectarlo.
- Sugerencia de partida: Ray-Ban · Persol · Meller · Hawkers · Oakley · Polaroid.

## Archivos por montura

- `M{n}.jpg` — foto de producto **de frente**, fondo limpio. Es la referencia que se envía al proveedor.
- `M{n}_34.jpg` — foto en 3/4 si existe. Referencia adicional para modelos que aceptan varias.
- `M{n}_distractor_a.jpg` y `M{n}_distractor_b.jpg` — **solo M1–M4**, las dos opciones falsas del test ciego.

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

Estas imágenes son **solo para evaluación técnica interna**. No se publican, no van a redes y no se usan en marketing.

El uso de fotos de producto de marca en un contexto **público** es una cuestión distinta y se resuelve en B3 (afiliación), donde la fuente legítima son los feeds de afiliado, no la descarga directa. Ver también el gate GC-4: en los términos de Banuba —los únicos publicados— el riesgo de propiedad intelectual sobre el contenido que mostramos recae íntegramente sobre nosotros.
