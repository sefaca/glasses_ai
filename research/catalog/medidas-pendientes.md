# Recolección de medidas — 23 monturas

> **Para qué sirve esto.** Es lo único que separa 125 páginas delgadas de 125
> páginas con una tabla comparativa multimarca que hoy no tiene ninguna SERP
> del sector. El continente ya está construido: en cuanto una montura pase a
> `verified`, su página la muestra sola.
>
> Trabajo estimado: **2-3 horas** para las 17 que faltan.

---

## Cómo se recoge, y por qué así

**Abre la ficha oficial en el navegador y transcribe el número.** Nada de
scripts.

No es exceso de celo. Tras la sentencia *Ryanair / PR Aviation* (C-30/14), una
web cuya base de datos no está protegida por la Directiva **puede limitar el
scraping por contrato**, y los términos de muchas tiendas lo hacen. Una medida
es un hecho y nadie es dueño de ella; una descripción o una fotografía sí
tienen dueño.

Tres fuentes, por orden de fiabilidad:

1. **El estampado de la varilla** (`50□22 150`), si tienes las gafas delante.
   Es la fuente definitiva y no admite discusión.
2. **La ficha oficial de la marca.** Ojo: `ray-ban.com` devuelve 403 a
   peticiones automáticas, así que esta hay que abrirla a mano.
3. **Una ficha de tienda**, solo para contrastar. Nunca como fuente única: ya
   hemos visto dos tiendas contradecirse en el puente de la RB2140.

**Qué anotar por montura y por talla:** calibre, puente, varilla, alto de
lente y, si se publica, ancho del frontal. Más la URL consultada y la fecha.

**Capturas de pantalla:** a `research/catalog/raw/`, que está fuera de git.
Llevan imágenes de terceros. Al repositorio llega solo el número, la URL y la
fecha.

### Un matiz que confunde a todo el mundo

«Ancho de lente» y «ancho de frontal» **no son la misma medida**. Ray-Ban
publica calibre-puente-varilla; Hawkers y Meller publican frontal-alto-varilla.
En el catálogo son campos distintos (`lensWidthMm` frente a `totalWidthMm`) y
no deben mezclarse en la misma columna.

---

## Grupo A — las 6 que ya tienen medidas, pendientes de confirmar

Están como `indicative`: vienen de tiendas, no de ficha oficial. Las cuatro
primeras tienen además **un conflicto anotado** en el catálogo.

| Montura | Ref. | Lo que tenemos | Qué hay que resolver |
|---|---|---|---|
| Aviator Classic | RB3025 | 58-14-135, alto 50 | Confirmar. Es la única sin conflicto |
| Wayfarer Original | RB2140 | 50-22-150, alto 43 | **Dos conflictos**: las tiendas dan alto 41, y discrepan en si el puente de la 50 es 22 o 18 |
| New Wayfarer | RB2132 | 52-18-145, alto 41 | Las tiendas dan 37,6 / 40,8 / 43,2 por talla. El 41 no corresponde a la 52 |
| Clubmaster | RB3016 | 51-21-145, alto 40 | Las tiendas dan 42-44 |
| Round Metal | RB3447 | 50-21-145, alto 50 | Confirmar; es circular, por eso 50×50 |
| Justin | RB4165 | 54-16-145, alto 48 | Las tiendas dan 42 (talla 51) y 44 (54) |

**Las tallas completas también hacen falta**, no solo una: RB3025 en 55/58/62,
RB2140 en 50/54, RB2132 en 52/55/58, RB3016 en 49/51/55, RB3447 en 47/50/53 y
RB4165 en 51/54.

---

## Grupo B — las 17 sin ninguna medida

Ordenadas por lo que desbloquean. Las tres primeras filas completan grupos de
forma que hoy no tienen ni una montura medida.

| # | Marca | Modelo | Ref. | Forma | Desbloquea |
|---|---|---|---|---|---|
| 1 | Oakley | Frogskins | OO9013 | wayfarer | Wayfarer deja de ser solo Ray-Ban |
| 2 | Hawkers | One | — | wayfarer | Ídem, y es la marca con feed de afiliación |
| 3 | Hawkers | Warwick | — | wayfarer | Ídem |
| 4 | Persol | 714 Steve McQueen | PO0714 | aviator | Aviador multimarca |
| 5 | Carrera | Champion | **falta ref.** | aviator | Ídem. Hay que averiguar su referencia |
| 6 | Oliver Peoples | Gregory Peck Sun | OV5186S | round | Redondas multimarca |
| 7 | Warby Parker | Durand | — | round | Ídem. Comprobar si envía a España |
| 8 | Mr. Boho | Jordaan | — | round | Ídem |
| 9 | Persol | 649 | PO0649 | square | Cuadradas, que hoy no tiene ninguna medida |
| 10 | Oakley | Holbrook | OO9102 | square | Ídem |
| 11 | Polaroid | PLD 6125 | PLD6125 | square | Ídem |
| 12 | Parafina | Ebro | — | rectangular | Rectangulares: solo hay 2 monturas en total |
| 13 | Komono | Francis | — | oval | Ovaladas: solo hay 2 |
| 14 | Mykita | Lite | — | oval | Ídem |
| 15 | Meller | Nayah | — | cat-eye | Única cat-eye del catálogo |
| 16 | Gentle Monster | Papas | — | oversized | Única oversized |
| 17 | *(ninguna)* | — | — | geometric | Las dos geométricas son el **mismo modelo** en dos colores |

### Dos cosas que no se arreglan midiendo

- **Cat-eye y oversized tienen una sola montura cada una.** Por muchas medidas
  que recojas, esas dos páginas no tendrán nada que comparar. Para que valgan
  hace falta **añadir monturas al catálogo**, no medir las que hay.
- **Las dos «geométricas» son la misma Clubmaster en dos colores.** Esa página
  compara un modelo consigo mismo.

---

## Plantilla para pegar los datos

Rellena esto y lo paso al catálogo:

```
montura: <marca> <modelo> <referencia>
fuente:  <URL exacta de la ficha oficial>  |  estampado
fecha:   2026-__-__
tallas:
  <calibre>-<puente>-<varilla>  alto <mm>   frontal <mm o ->
  ...
notas:   <cualquier cosa rara: dos fichas que discrepan, talla que no existe…>
```

---

## Lo que gana cada página en cuanto esto esté

- **Las de forma** pasan a llevar una tabla comparativa multimarca ordenada por
  anchura, con el índice de anchura (2 × calibre + puente) que ya usamos en la
  guía de tallas. Es el dato que ninguna SERP del sector tiene hoy.
- **Las de marca** ganan la distribución de anchuras de esa marca frente al
  resto del catálogo.
- **La recomendación del producto** deja de apoyarse en una escala estimada
  para las monturas medidas, y la lectura de anchura se vuelve fiable.
- Se pueden crear **páginas de modelo** para las que tengan todas sus tallas,
  que es la familia con más intención de compra de todo el plan.
