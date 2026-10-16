# Cómo cobran los generativos que ya tienen clientes

> **Para qué sirve.** Fijar el número con el que **arrancar** el experimento de
> pago, sacado de lo que cobra quien ya vive de esto. No es el precio
> definitivo: [CLAUDE.md §36](../../CLAUDE.md) prohíbe cerrar el pricing sin
> validación, y a esta fecha **nadie ajeno al fundador ha generado nunca**.
>
> Consultado el **2026-10-16**.

---

## 1. Método, y lo que no se ha hecho

- Todo lo marcado `[D]` sale de **la página oficial de precios** del producto.
- **Nada se convierte de divisa.** Cada precio va en la moneda en que se
  publica, porque convertirlo inventa una precisión que no existe.
- Cuatro productos se quedan en `[?]` y no se estiman: **Doji**, **Midjourney**,
  **Fotor** (su tabla no renderiza importes) y la caducidad de los créditos de
  **SpecFit**. Son justo los que más habría interesado tener.
- **Lensa** aparece solo como `[T]` y con aviso: las fuentes se contradicen
  entre sí. No se usa como ancla de nada.

## 2. Los dos comparables directos

Gafas, try-on, créditos. Son los únicos del mundo que hacen lo mismo que
nosotros con el mismo modelo de negocio.

| | **VisuTry** (web) | **SpecFit** (iOS) |
|---|---|---|
| Qué compra un crédito | Un informe del Advisor, **o** un try-on, **o** una montura en Frame Compare | Un try-on renderizado |
| Pack mínimo | **$2,99 / 30 créditos** | **$5,99 / 3 renders** |
| Precio por generación | **~$0,10** | **~$2,00** |
| Escalones | Suscripción $8,99/mes (90/mes); anual $89,99 (1.260) | $10,99/7 · $20,99/18 |
| Gratis | **1 crédito**, y el detector de forma facial **sin cuenta** | **0 renders.** Gratis: fit check y medición de PD |
| Modelo | Pack + suscripción opcional | Solo créditos. «No subscription. No account.» |
| ¿Caducan? | **No**, y lo anuncian | `[?]` |

Fuentes: <https://www.visutry.com/pricing> · <https://specfit.app/>

### El hallazgo que cambia el encuadre

Entre los **dos** comparables directos que existen hay un factor **20×** por
generación, con el mismo producto, la misma categoría y el mismo modelo.

> **En esta categoría el precio no lo fija el coste: lo fijan el empaquetado y
> el canal.** Cualquier cálculo de «coste + margen» es ruido.

Los dos números además no son comparables tal cual: el crédito de VisuTry paga
también análisis y comparación, y el render de SpecFit da dos imágenes en
gafas de sol y permite revisitar lo ya generado gratis.

## 3. Retrato con IA

El mismo acto que el nuestro: una foto tuya entra, una imagen tuya sale.

| Producto | Pack mínimo | Por unidad | Gratis | Caducan |
|---|---|---|---|---|
| HeadshotGen | $9,99 / 10 | ~$1,00 (→ $0,50 a 60) | 1 preview **a baja resolución** | «never expire» |
| BetterPic | $35 / 20 | ~$1,75 (→ $0,65 a 120) | hasta 10, **en cola** | `[?]` |
| Aragon | $35 / 40 | ~$0,88 | no listado | `[?]` |

<https://headshotgen.ai/pricing> · <https://www.betterpic.io/pricing> · <https://www.aragon.ai/pricing>

## 4. Generalistas de referencia

| Producto | Entrada | Gratis | Caducan |
|---|---|---|---|
| Mew Design | $5,69/mes, 500 créditos; un diseño cuesta 2-60 | 50 créditos al registrarse | Los de suscripción se resetean; **los comprados no** |
| Botika | ~$0,75/foto `[T]`, de reseñas de Shopify | `[?]` | `[?]` |
| Fotor | `[?]` la tabla no muestra importes | «Limited free credits», sin cifra | Roll-over 5 meses mientras estés suscrito |

## 5. Los siete patrones

1. **Nadie vende una generación suelta.** El pack de entrada va de $2,99 a
   $35, con mediana en $6-10. El mínimo del sector son 3 unidades.
2. **El múltiplo sobre coste es enorme y no se esconde.** Los headshots cobran
   $0,50-1,75 por imagen con coste de céntimos. El sector cobra **el valor del
   resultado**, no el coste.
3. **El gratis es UNO, y va degradado.** Baja resolución, o en cola. El patrón
   no es «unas cuantas»: es *una suficiente para ver que funciona, con una
   pega visible*.
4. **Los dos de gafas regalan el análisis y cobran la imagen.** Es la frontera
   natural, porque es donde empieza el coste marginal. Nuestro
   [D-028](../../docs/DECISION_LOG.md#d-028) ya hace exactamente eso.
5. **Venden unidades de resultado, no moneda abstracta**, salvo quien tiene
   acciones de coste distinto. Nosotros tenemos **una sola acción cara**.
6. **«No caducan» se anuncia como ventaja.** Caducar un pack de compra puntual
   es hostil y ningún comparable directo lo hace.
7. **El pago llega después de un resultado visible.** Ninguno pide dinero antes
   de que hayas visto una imagen tuya.

## 6. La aritmética de la pasarela

Es la tabla que decide el suelo, y hay que rehacerla si cambia la pasarela.
Supuesto: Stripe UE, **1,5 % + 0,25 €**; IVA español 21 %; coste 0,10 €/gen `[X]`.

| | 1,99 €/5 | **4,99 €/10** | **9,99 €/25** | 2,99 €/10 (§16) |
|---|---:|---:|---:|---:|
| Neto sin IVA | 1,64 € | **4,12 €** | **8,26 €** | 2,47 € |
| Comisión | 0,28 € | 0,32 € | 0,40 € | 0,30 € |
| **Comisión / cobro** | **14,0 %** | **6,5 %** | **4,0 %** | **9,9 %** |
| COGS | 0,50 € | 1,00 € | 2,50 € | 1,00 € |
| **Contribución** | **0,86 €** | **2,80 €** | **5,36 €** | **1,18 €** |

**La comisión fija es lo que manda.** A 1,99 € se come el 14 % del cobro. Eso
solo, sin ningún argumento de mercado, descarta los packs de 2-3 €.

## 7. Precio por mercado

### Lo que hace el sector: no fija precios locales, **localiza uno**

- **Apple** equipara el precio base **antes de impuestos** y deriva el resto
  por tipo de cambio, con el redondeo de cada país `[D]`.
- **Stripe Adaptive Pricing** presenta la divisa local con un **2-4 % de
  conversión incorporado en el tipo** `[D]`.
- VisuTry, HeadshotGen, BetterPic y Aragon publican **un solo precio en USD**.

### El límite legal dentro de la UE

El **Reglamento (UE) 2018/302** prohíbe aplicar condiciones generales de
acceso distintas —precios incluidos— por nacionalidad, residencia o
establecimiento del cliente, y los servicios electrónicos no audiovisuales
están dentro `[D]`.

> **Lectura práctica para nosotros:** con **un solo sitio** y un solo checkout,
> como es nuestro caso, eso significa **un único precio para toda la UE**. No
> podemos cobrar más a un alemán que a un español por el mismo pack.

Lo que sí varía legítimamente es el **bruto**, porque el IVA es distinto:
mismo neto → 4,99 € en España (21 %), ~5,15 € en Italia (22 %), ~4,91 € en
Alemania (19 %). Eso no es discriminar, es aplicar el impuesto del país.

Afecta de lleno a [D-026](../../docs/DECISION_LOG.md#d-026): cuatro de nuestros
cinco idiomas son de la UE. **UK y EE. UU. quedan fuera del Reglamento.**

`[?]` **Pendiente de asesor**, no es decisión de pricing: el matiz de si se
pueden mantener precios distintos en sitios dirigidos a países distintos, y el
umbral de registro de VAT en Reino Unido para un vendedor no establecido.

### Propuesta

| Mercado | Entrada | Grande | Premium | Mecánica |
|---|---:|---:|---:|---|
| UE (es · it · pt · de) | **4,99 €** IVA incl. | 9,99 € | 49,99 € | Un solo neto; el bruto lo mueve el IVA |
| Reino Unido | **£5,99** IVA incl. | £11,99 | £59,99 | Punto de precio local |
| EE. UU. | **$9,99** + impuesto | $19,99 | $99,99 | Punto local, **sin impuesto incluido** → [D-030](../../docs/DECISION_LOG.md#d-030) |

**El diferencial sale del impuesto, no de un recargo.** 4,99 € con IVA son
4,12 € netos; $5,99 son $5,99 netos, porque allí el *sales tax* se añade en el
checkout. A ~1,08 USD/EUR eso es **~5,55 € netos: un +35 % sobre el neto
español sin haber subido el precio**.

## 7 bis. Pasarela elegida

**Paddle**, Merchant of Record → [D-030](../../docs/DECISION_LOG.md#d-030).

| | UE | Reino Unido | EE. UU. | Resuelve el IVA |
|---|---|---|---|---|
| Stripe | 1,5 % + 0,25 € | **2,5 % + 0,25 €** | 3,15 % + 0,25 € (+2 % conversión) | No |
| Mollie | 1,8 % + 0,25 € | 3,25 % + 0,25 € | 3,25 % + 0,25 € | No |
| **Paddle** | **5 % + $0,50** | igual | igual | **Sí** |

Stripe es más barata y mejor producto, pero **ninguna pasarela quita el IVA de
encima**: con Stripe o Mollie, el OSS europeo sigue siendo nuestro. Paddle
vende él.

Sobrecoste: **~0,39 € por venta de 4,99 €**. **El cruce está en ~100-150
ventas/mes** — por debajo, lo que se ahorra en gestoría vale más; por encima,
toca migrar a Stripe.

## 7 ter. El tercer pack es un ancla

150 generaciones a 49,99 € / £59,99 / $99,99 → [D-031](../../docs/DECISION_LOG.md#d-031).

**No se mide por sus ventas.** Un precio alto hace que el de en medio parezca
moderado, y eso funciona aunque no lo compre nadie. Lo que hay que medir es el
**reparto entre el pack de entrada y el de 9,99 €**, y hay que medirlo desde el
primer día: después no se reconstruye.

Ojo con quién lo compra. 150 generaciones no son una cantidad de consumidor; si
lo compra gente de verdad, probablemente sean ópticas, y eso es el negocio que
[CLAUDE.md §6](../../CLAUDE.md) excluye.

## 8. Gates propuestos

Fijados antes de ver datos, para no acomodarlos al resultado.

| ID | Qué | Umbral |
|---|---|---|
| `GM-1` | Conversión del paywall (`paywall_viewed → checkout_started`) | ≥ 10 % |
| `GM-2` | `p_pay` sobre usuarios registrados | ≥ 7,1 % |
| `GM-3` | Recompra tras agotar el pack, 30 días | < 25 %; por encima, el pack o el precio son pequeños |

### La señal que se va a confundir con un problema de precio

Si el clic saliente al retailer tras generar es **alto** y `p_pay` **bajo**, el
precio no está mal: **el modelo está mal**. La gente usa el producto para
decidir y compra fuera, el dinero está en afiliación y los créditos son solo
control de coste. Entonces se toca GA-3, no el precio.

## 9. Lo que falta

- `p_pay` real. Es la incógnita que lo decide todo y hoy es `[?]`.
- Elasticidad entre 2,99 € y 4,99 €: nadie la ha medido por nosotros.
- El umbral de VAT en Reino Unido.
- El precio de **Doji**, si algún día lo publica: es el try-on de consumo con
  dinero de verdad detrás.
