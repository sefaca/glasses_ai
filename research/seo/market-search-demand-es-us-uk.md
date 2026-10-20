# Demanda de búsqueda de gafas de sol: ES frente a US y UK, y arquitectura de páginas

> **Estado:** CERRADO (ronda 0, solo Trends y Wikipedia) · **Investigación a:** 2026-10-18/19 · Alimenta [D-036](../../docs/DECISION_LOG.md#d-036) y el orden de mercados.

## 0. Cómo leer los números

Dos fuentes, con naturalezas distintas y por eso separadas:

- **Google Trends**, interfaz web, consultado el 2026-10-18 `[X]`. **Interés relativo normalizado, NO volumen.** Cada consulta se escala a 100 en su máximo y los valores por debajo de 1 se ven como 0. El mismo término ancla dio entre 1,5 y 21 según la consulta en que se comparó, así que **solo se usan proporciones dentro de una misma consulta** y todo lo que queda por debajo de ~5 puntos se trata como orden de magnitud, no como cifra.
- **Wikimedia Pageviews API**, consultado el 2026-10-19 `[D]` como fuente, `[X]` el cálculo. Páginas vistas **reales y medidas**, filtradas a `user` para excluir bots. Mide notoriedad enciclopédica, no intención de compra: las marcas con historia cultural salen infladas frente a las nativas de ecommerce. **Ordena, no dimensiona.**

Coincidencia amplia en Trends: «gafas» incluye «gafas de sol»; «ray ban» incluye Ray-Ban Meta; «specs» y «shades» son polisémicos y no se usan como evidencia.

**Volumen absoluto, CPC, dificultad y SERP reales siguen siendo `[?]`.** Hacen falta Keyword Planner y SERPs localizadas, y el 2026-10-18 se decidió no pagar por datos de momento. Hasta entonces, nada de lo que hay aquí dimensiona un mercado.

## 1. Cuota de búsqueda por país (Trends, 12 meses, misma consulta)

| Término | Cuota media | Pico |
|---|---|---|
| sunglasses US | 30,9 | 100 |
| sunglasses GB | 27,0 | 70 |
| gafas de sol ES | 9,8 | 34 |

Serie de 5 años: ES 8,7 · US 21,8 · GB 22,8. **ES/US = 0,32 a 0,40; GB/US = 0,87 a 1,05.**

Hipótesis, no dato: con búsquedas por habitante similares, el conjunto anglófono sería varias veces el español.

## 2. Estacionalidad (Trends, media mensual de 5 años)

| | Ene | Feb | Mar | Abr | May | Jun | Jul | Ago | Sep | Oct | Nov | Dic |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ES | 19 | 22 | 27 | 35 | 34 | 36 | 38 | 33 | 17 | 15 | 15 | 19 |
| GB | 18 | 24 | 36 | 46 | 54 | 56 | 50 | 41 | 22 | 16 | 15 | 15 |
| US | 14 | 17 | 23 | 34 | 33 | 30 | 26 | 21 | 17 | 15 | 16 | 15 |

El pico español es **largo y plano** (abril a agosto); el británico es **corto y agudo** (mayo a julio, hasta 56). Hoy los tres están en valle. Indexar en octubre da cuatro o cinco meses de rodaje antes de marzo: **es el momento de construir, no de juzgar resultados.**

**Lo que NO se sostiene:** se intentó derivar la estacionalidad de las páginas vistas de Wikipedia y no funciona. El artículo español «Gafas de sol» se mueve entre 350 y 470 visitas al mes —ruido— y el inglés «Sunglasses» marca pico en mayo con una amplitud de solo 1,5×. **Wikipedia no sirve como proxy estacional de esta categoría.** Queda escrito para no volver a intentarlo.

## 3. Formas (Trends, relativo a «aviador/aviator» = 1 dentro de cada mercado)

| Forma | ES | US | GB |
|---|---|---|---|
| redondas / round | 1,38 | 1,06 | 0,71 |
| wayfarer | 1,11 | 0,62 | 0,41 |
| cuadradas / square | 0,64 | 1,34 | 0,73 |
| rectangulares / rectangle | 0,23 | 0,51 | 0,27 |
| ojo de gato / cat eye | 0,08 | 0,44 | 0,54 |
| oversize / oversized | ≈0 | 0,67 | 0,34 |

**El hallazgo que cambió una URL:** en España se dice **«gafas de sol grandes» (13,2)** y **«gafas de sol de pasta» (21,0, al nivel de «redondas»)**. «Oversized» es ≈0. Nuestra página apuntaba a un término que aquí no se usa → corregido en D-036.

Otros términos ES: «polarizadas» ≈ 7,7 veces «aviador» (es atributo de lente, no forma); «deportivas» ≈ 1,8. Se busca con y sin «de sol», y ambas formas pesan.

Género ES: «hombre» ≈ 33× y «mujer» ≈ 40× «aviador». **No se pueden construir con honestidad**: el catálogo no tiene etiqueta de género de fuente y CLAUDE.md §9.1 prohíbe inferirla.

US/UK: no hay divergencia real de vocabulario; los dos dicen «sunglasses». La excepción es «polarized» (35,8) frente a «polarised» (26,0), que gana **incluso en Reino Unido**. Una sola versión `en` sirve a ambos. Lo que cambia es el retailer.

## 4. Marcas

### 4.1. Interés de búsqueda (Trends, relativo a Ray-Ban = 1)

- **ES:** oakley 1,0 · hawkers 0,53 · meller 0,20 · prada 0,16 · persol 0,10 · gucci 0,08 · carrera 0,08 · mr boho 0,05 · polaroid 0,04 · chimi 0,04 · gentle monster 0,04 · dior 0,03
- **US:** oakley 2,0 · warby parker 0,56 · maui jim 0,25 · prada 0,25 · gucci 0,19 · costa 0,12 · persol 0,08
- **GB:** oakley 1,9 · prada 0,28 · gucci 0,19 · persol 0,10

Modelos ES (relativo a «ray ban wayfarer» = 1): rb2140 0,15 · rb3025 0,04 · rb2132 0,03 · rb3016 ≈0. «ray ban wayfarer» pesa ≈7 veces «ray ban aviator» en ES, 3,3 en US y 2,7 en GB.

### 4.2. Notoriedad medida (Wikipedia, páginas vistas de usuario, 12 meses a 2026-09)

| Marca | es.wikipedia | en.wikipedia | ES/EN |
|---|---:|---:|---:|
| Ray-Ban | 40.227 | 194.734 | 0,21 |
| Saint Laurent | 17.617 | 47.780 | 0,37 |
| **Hawkers** | **12.381** | **176** | **70,3** |
| Oakley | 6.235 | 98.115 | 0,06 |
| Persol | *sin artículo* | 34.204 | — |
| Warby Parker | *sin artículo* | 75.202 | — |
| Maui Jim | *sin artículo* | 53.741 | — |
| Oliver Peoples | *sin artículo* | 33.344 | — |

Las dos fuentes **coinciden** en lo esencial y eso refuerza la lectura: Hawkers es un fenómeno español sin huella fuera; Oakley pesa mucho más en inglés que aquí; Ray-Ban es la marca que mejor viaja al español.

Cuatro marcas no tienen ni artículo en español. Nadie llegará a esas fichas por búsqueda de marca en España; siguen teniendo sentido como catálogo, no como imán de tráfico.

**Trampa metodológica, documentada porque casi provoca una conclusión falsa:** Oakley daba 913 visitas hasta descubrir que su artículo se llama «Oakley, Inc.». **Un título mal elegido se parece exactamente a poca demanda.** Y las cifras de Gucci, Tom Ford, Versace, Burberry, Dior y Prada se descartan: miden la casa de moda entera, no sus gafas.

## 5. Probadores, cara y medidas (Trends)

- ES: «probar gafas online», «probador de gafas» y «probar gafas de sol» quedan en ≈0,1, **casi indetectables**. «gafas virtuales» marca 25,8 pero está contaminado por realidad virtual.
- Relativo a «round sunglasses»: «glasses try on» GB 0,36 · US 0,12. En Reino Unido puede ser mayoritariamente tráfico de cadenas de graduadas.
- Cara: «gafas cara redonda» 7,0 · «gafas de sol cara redonda» 0 · «qué gafas me quedan bien» 0. Confirma [D-008](../../docs/DECISION_LOG.md#d-008).
- Medidas ES (5 años): «talla de gafas» 12,3 · «calibre gafas» 6,7 · «medidas gafas» 5,7 · «medidas de las gafas» 1,0 · **«números de las gafas» 0,2** (la que usábamos en el tracker) · «tallas ray ban» ≈0,1. GB: «glasses size» 33,5.

**Consecuencia incómoda para la tesis del producto:** en España el probador virtual **no se busca**. El tráfico tendrá que venir de forma, marca y talla, y el probador es lo que encuentran al llegar, no lo que buscan. No invalida el producto; sí invalida esperar tráfico de esa keyword.

## 6. Regiones de España (Trends, 12 meses)

«gafas de sol»: Extremadura 100 · Cantabria 99 · Castilla y León 94 · Castilla-La Mancha 91 · Andalucía 88 · Madrid 87 · Valencia 86 · Cataluña 75 · País Vasco 73 · Baleares 70 · Canarias 59. Ceuta y Melilla se ignoran por muestra pequeña.

Sesgo real solo en marca: **Meller** se concentra en Baleares (80) y Cataluña (62) frente a 12-34 en el resto; **Hawkers** es fuerte en Madrid (100), Castilla-La Mancha (90), Murcia (89), Valencia (88) y flojo en Cataluña (48) y Galicia (50).

**La categoría es homogénea. No se justifica ninguna página regional.**

## 7. Qué mercado abrir después del español

Orden propuesto: **ES → EN (una sola versión para US y GB) → IT/DE**.

A favor del inglés: conjunto de búsqueda mayor, terminología compartida entre los dos países y más demanda relativa de herramienta en Reino Unido. En contra: SERP más dura, **sin retailer afiliado fuera de España y sin revisor nativo**.

Disparador: embudo orgánico demostrado en español **más** revisor nativo con nombre **más** un retailer de destino verificado. Sin los tres, no se abre.

Fuera de alcance por ahora: LATAM. La consulta de MX/CO/AR/PE no dio datos fiables; «lentes de sol» existe en México y «óculos» devolvió 0 en BR/PT. A repetir con mejor método.

## 8. Arquitectura de páginas

Criterio: intención comercial × dificultad realista para un dominio de días y sin enlaces.

**P0 — sin páginas nuevas, solo reorientar lo que hay**

1. `redondas`, `wayfarer`, `aviador`: la demanda más alta de las formas, y 11, 8 y 6 modelos para sostenerlas.
2. `oversized` → **`grandes`**, con «oversize» de apoyo en el nombre. Hecho en D-036; costaba cero porque la página no estaba indexada.
3. `cat-eye`: slug intacto, «ojo de gato» añadido al nombre. Demanda baja (0,08).
4. `ovaladas`: solo 2 monturas. `noindex` hasta tener ≥4, o ampliar.
5. Fichas de marca con 1-2 monturas: no podar todavía. Disparador el 2026-11-24 → si más del 30 % está en «Rastreada, actualmente sin indexar», dejar indexables solo las de ≥3 modelos.

**P1 — páginas nuevas con datos que ya tenemos**

1. `/es/gafas-de-sol/de-pasta` (acetato). Demanda ≈ «redondas» y hueco léxico sin ocupar. Soporte: ~40 monturas de acetato. Falta verificar el material montura a montura en ficha oficial.
2. `/es/guias/talla-de-gafas`: cómo leer calibre-puente-varilla y cómo medirse. Reorienta el cluster de «números de las gafas» (0,2) a «talla» (12,3). No necesita datos nuevos.
3. `/es/guias/aviador-o-wayfarer`: las dos pesan casi igual y hay 6 y 8 modelos.

**P2 — condicionadas a medidas verificadas**

4. `/es/guias/gafas-de-sol-polarizadas`: el modificador más grande (7,7× «aviador»). Hoy solo 8 monturas declaran lente polarizada. Antes hace falta el dato por montura.
5. Fichas de modelo: **solo con las cinco medidas verificadas**. Es una puerta de publicación por datos, no por opinión.
6. Buscador por medidas: una sola URL interactiva, facetas en `noindex`.

**P3 — fuera**: género (sin etiqueta de fuente), precio, outlet, «probar Ray-Ban» (RULE #1), ciudades y cualquier matriz forma × cara × género.

## 9. Qué sostiene el catálogo

66 monturas tras eliminar duplicados. Por forma: round 11 · oversized 9 · square 9 · wayfarer 7 · rectangular 8 · geometric 7 · aviator 6 · cat-eye 6 · oval 2.

Con medidas `indicative`: 15. **Con medidas `verified`: 0.**

Marcas con ≥3 modelos: Ray-Ban 12, Oakley 6, Persol 3, Hawkers 3. **20 de 34 marcas tienen una sola montura.**

Ampliar, por este orden: **Hawkers de 3 a ~8** (segunda marca en España y la única con programa de afiliación localizado), **Meller de 2 a ~5**, cuatro ovaladas, y medidas verificadas en toda la base.

## 10. Techo de páginas a 12 meses (hipótesis)

70 a 90 páginas en español **si se verifican las medidas**: 9 formas + ~8 marcas + ~8 guías + hasta ~65 fichas de modelo. Sin medidas verificadas el techo se queda en 45-55.

Dicho de otro modo, y esto responde a la petición de «posicionarnos por miles de palabras clave»: **las miles de keywords llegan por 70-90 páginas fuertes, no por miles de páginas.** Una página buena posiciona para muchas variantes. Google juzga el contenido escalado por su valor para el usuario y no por cómo se produjo —«no matter how it's created» `[D]`— así que el único camino legítimo a escala es una página por entidad **solo si lleva datos verificados propios**.

## 11. Pendiente `[?]`

Volumen y CPC de Keyword Planner · 10 SERPs en Google.es en incógnito · quién ocupa el top 5 de «gafas de sol de pasta», «gafas de sol grandes» y «talla de gafas» · retailer de destino para el mercado en inglés · repetir la consulta de LATAM con mejor método.

## 12. Fuentes

- Google Trends, consultas del 2026-10-18 (datos crudos en el directorio de trabajo de la sesión, no versionados).
- [Wikimedia Pageviews API](https://doc.wikimedia.org/generated-data-platform/aqs/analytics-api/reference/page-views.html) `[D]`.
- [Google Search spam policies — scaled content abuse](https://developers.google.com/search/docs/essentials/spam-policies) `[D]`.
