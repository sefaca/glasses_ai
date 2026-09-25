# Track D — Multi-brand test

**Lo que valida:** el producto, no la tecnología.

> ¿La combinación **RECOMENDACIÓN + MULTI-MARCA + TRY-ON** aporta valor frente a probarse una marca directamente en su propia web?

Es la única prueba de B1 que no mide píxeles. Y es la que responde a la pregunta que ningún benchmark visual puede responder:

> Ray-Ban ya tiene su propio try-on en su ficha de producto. **¿Por qué debería alguien venir a nosotros?**

Si la respuesta es «porque también hacemos try-on», no hay producto: ellos también lo hacen, con mejor catálogo y sin intermediario.

---

## 1. La métrica que decide: tasa de descubrimiento cruzado

El error sería preguntar «¿te gusta?». Todo el mundo dice que sí a una demo bonita.

La pregunta útil es **contrafactual**: ¿acaba el participante eligiendo algo que no habría encontrado solo?

```
ANTES de ver nada:
  «Si compraras gafas de sol hoy, ¿dónde mirarías?»   → destino previo
  «¿Qué marca tienes en la cabeza?»                    → marca previa

DESPUÉS de ver las 6 recomendaciones probadas:
  «¿Cuál comprarías?»                                  → elección real
```

```
TASA_DESCUBRIMIENTO_CRUZADO
 = participantes cuya elección final es de una marca
   que NO nombraron antes  /  total de participantes
```

**Cómo se lee:**

| Resultado | Lectura |
|---|---|
| **Baja** (<30 %) | Somos una interfaz más agradable para una decisión **ya tomada**. El try-on de la propia marca basta. **El agregador no aporta.** |
| **Media** (30–60 %) | Hay valor de descubrimiento, pero conviven con la intención de marca previa |
| **Alta** (>60 %) | **Creamos descubrimiento real.** Es exactamente lo que una marca no puede hacer por definición, porque solo se enseña a sí misma |

Esta métrica es el núcleo del Gate 4. El resto de preguntas la contextualizan.

---

## 2. Diseño

**5 participantes × 6 monturas × 4–6 marcas.** Nada de esto se programa: se monta a mano con las imágenes del benchmark.

### Condición experimental (nosotros)

Una lámina por participante, con **su propia foto**:

```
┌────────────────────────────────────────────┐
│  Tus 6 recomendaciones                      │
│  Seleccionadas según tus proporciones       │
│  faciales y tu estilo                       │
│                                            │
│  [try-on]  Ray-Ban Aviator      149 €      │
│  [try-on]  Meller Nayah          79 €      │
│  [try-on]  Hawkers Warwick       39 €      │
│  [try-on]  Oakley Holbrook      129 €      │
│  [try-on]  Persol PO0649        219 €      │
│  [try-on]  Polaroid PLD 6125     89 €      │
└────────────────────────────────────────────┘
```

Requisitos de la lámina:

- las 6 monturas **sobre la misma foto** de la misma persona, misma escala y encuadre;
- **4–6 marcas distintas**, con rango de precio amplio (≈40 € a ≈220 €). El rango importa: parte del valor del agregador es enseñar la alternativa barata al lado de la cara;
- 6 formas diferentes, para que la elección sea real y no forzada;
- precio visible en cada una;
- **sin logos nuestros, sin mencionar IA.** Se evalúa la utilidad, no la marca ni la tecnología.

### Condición de control (una sola marca)

El try-on real de una marca en su propia web — Ray-Ban o cualquier retailer español que lo tenga. **Que lo use el participante de verdad**, no un pantallazo. El control tiene que ser el competidor real, no una versión de paja.

### Orden

Alternar qué condición ve primero entre participantes (P1, P3, P5 empiezan por el control; P2, P4 por el nuestro). Si todos ven lo mismo primero, se mide la novedad, no el valor.

---

## 3. Guion de la entrevista

Literal. No improvisar y **no defender el producto** cuando critiquen algo.

### Antes (2 min)

1. «Si tuvieras que comprarte unas gafas de sol este mes, ¿por dónde empezarías?»
2. «¿Hay alguna marca que tengas en la cabeza?»
3. «¿Qué es lo que más te frena al comprar gafas por internet?»

> Registrar literal. Las respuestas 1 y 2 son la línea base de la métrica principal.

### Durante

4. *(Condición nuestra)* «Estás buscando gafas de sol. **¿Esto te resulta útil?**» — y callarse.
5. «¿Qué es lo primero que miras?»
6. *(Condición control)* «Pruébate una en su web.» Cronometrar hasta el primer resultado.

### Después (5 min)

7. **«¿Cuál comprarías?»** — elección forzada, sin «ninguna».
8. **«¿Dónde la comprarías ahora mismo?»** ← si dice «en la web de la marca», somos un escaparate y perdemos el clic de afiliación. Es la pregunta que más incomoda y la más informativa.
9. «¿Qué habrías hecho sin esto?»
10. «¿En qué momento de tu compra te habría servido?»
11. «¿Volverías a usarlo? ¿Para qué?»
12. «¿Qué le falta para que lo usaras de verdad?»

### Prohibido preguntar

- «¿Te gusta la IA?»
- «¿Te parece innovador?»
- «¿Usarías esto?» en abstracto, sin contexto de compra.

Miden entusiasmo por la demo, no intención de compra. **El entusiasmo no paga comisiones.**

---

## 4. Qué se registra

Una fila por participante en `results/multi-brand-test.csv`:

| Campo | |
|---|---|
| `destino_previo` | Dónde miraría (pregunta 1) |
| `marca_previa` | Marca que tenía en la cabeza (pregunta 2) |
| `freno_declarado` | Qué le frena al comprar online (pregunta 3) |
| `eleccion_final` | Qué montura elige (pregunta 7) |
| `marca_elegida` | Su marca |
| `es_cruzado` | ¿`marca_elegida` ≠ `marca_previa`? ← **la métrica** |
| `precio_elegido` | Para ver si el agregador desplaza el gasto arriba o abajo |
| `donde_compraria` | Pregunta 8 |
| `util_si_no` | Pregunta 4, respuesta espontánea |
| `momento_util` | Pregunta 10 |
| `volveria` | Pregunta 11 |
| `carencia` | Pregunta 12 |
| `orden_condiciones` | Cuál vio primero |
| `cita_literal` | La frase más reveladora, textual |

Las citas literales valen más que las medias: con n=5 no hay estadística, hay señales.

---

## 5. Bloque P — ¿existe razón para usar nuestro agregador?

| Gate | Criterio | GO |
|---|---|---|
| **GP-1** | **Descubrimiento cruzado:** eligen una marca que no habían nombrado | ≥3 de 5 |
| **GP-2** | **Utilidad espontánea:** responden que sí a la pregunta 4 **sin que haya que explicarles el producto** | ≥3 de 5 |
| **GP-3** | **Momento identificado:** saben decir en qué punto de su compra les serviría | ≥3 de 5 |
| **GP-4** | **Comparación valorada:** mencionan espontáneamente comparar marcas o precios como lo valioso | ≥3 de 5 |

**GO de producto** si se cumplen 3 de 4.

**NO-GO de producto** si GP-1 baja de 2 de 5 **y** la mayoría responde en la pregunta 8 que compraría en la web de la marca. Significaría que somos un catálogo bonito encima de una decisión ya tomada — y ahí la afiliación no llega, porque el clic se lo lleva la marca.

> Con n=5 esto no es estadística: es detección de señal. Un NO-GO aquí no cierra el proyecto, obliga a repetirlo con n=15 antes de escribir código. Un GO tampoco lo confirma: lo autoriza a seguir.

---

## 6. Dependencia

Track D necesita 6 try-ons válidos por participante. Si el Track B no pasa GT-1, **no hay material con el que montar las láminas** y Track D no se puede ejecutar.

Por eso va al final, y por eso su resultado es independiente: se puede tener **GO técnico y NO-GO de producto**, que es el desenlace más incómodo y más probable de los dos.
