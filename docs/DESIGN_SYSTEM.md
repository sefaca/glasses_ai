# Design System

> **Guía vinculante.** Esta paleta es la paleta. No se introducen colores fuera de ella, y los tokens se usan por su rol, nunca por su aspecto.
>
> Evidencia: [research/design/eyewear-palette.md](../research/design/eyewear-palette.md) · Decisión: [D-018](DECISION_LOG.md#d-018) · Implementación: `app/globals.css`

---

## 1. El principio

> **En eyewear de moda el color de marca no está en la interfaz. El producto pone el color; la UI es un escenario neutro.**

Las paletas con color protagonista pertenecen a las cadenas de óptica —Specsavers verde, Afflelou rojo— porque venden confianza y precio. Nosotros no somos eso ([D-001](DECISION_LOG.md#d-001)). Si la web grita, compite con las monturas, que es lo único que el usuario ha venido a mirar.

De ahí tres reglas:

1. **Casi monocromo.** Neutro cálido dominante, un único acento.
2. **El acento sale del producto**, no de la moda web: tortoise, coñac, marrón. Nunca naranja vivo, azul corporativo ni verde de óptica.
3. **Los dos temas son de primera clase.** Tortoise y lente transparente se leen distinto sobre claro y sobre oscuro.

---

## 2. Tokens

Siete roles. No hay más, y añadir uno es una decisión que se registra.

| Token | Rol | Claro | Oscuro |
|---|---|---|---|
| `paper` | Fondo de página | `#f7f5f1` | `#141210` |
| `surface` | Fondo elevado: secciones, tarjetas | `#fffefc` | `#1c1916` |
| `ink` | Texto principal y trazo de los glifos | `#1c1a17` | `#ece7df` |
| `muted` | Texto secundario, metadatos | `#6b6258` | `#9b9289` |
| `line` | Filetes y bordes | `#e3ded5` | `#2f2b25` |
| `accent` | Acción principal, énfasis, hover de glifo | `#7e4420` | `#d08a52` |
| `accent-soft` | Fondo de etiqueta sobre el acento | `#f0e5da` | `#2a2017` |
| `on-accent` | Texto sobre `accent` | `#fdfbf8` | `#141210` |

En Tailwind: `bg-paper`, `text-ink`, `text-muted`, `border-line`, `bg-accent`, `text-on-accent`, `bg-accent-soft`, `text-accent`.

### Por qué estos valores

- **`paper` es marfil claro, no beige.** El sector traduce *Cloud Dancer* (Pantone 2026) a marfil translúcido y crema cálido, y señala que **el blanco opaco puro es difícil de vender** en eyewear. Un beige más saturado leería a revista, no a óptica.
- **`accent` es coñac, no naranja.** El núcleo comercial de la categoría es marrón transparente, tortoise y negro. Un naranja vivo caería en *Energy Orange*, clasificado como el color de **mayor riesgo** de la temporada.
- **`ink` no es negro puro** (`#000`): sobre papel cálido el negro absoluto corta. `#1c1a17` tiene la misma temperatura que el fondo.

### Contraste — verificado, no estimado

Todos los pares de texto cumplen **WCAG AA (≥4,5:1)** en ambos temas:

| Par | Claro | Oscuro |
|---|---:|---:|
| `ink` / `paper` | 15,95:1 | 15,18:1 |
| `muted` / `paper` | 5,49:1 | 6,11:1 |
| `accent` / `paper` | 7,05:1 | 6,62:1 |
| `accent` / `accent-soft` | 6,19:1 | 5,65:1 |
| `on-accent` / `accent` | 7,43:1 | 6,62:1 |

**Cualquier cambio de token se revalida antes de entrar.** `muted` es el más ajustado: no oscurecer `paper` ni aclarar `muted` sin recalcular.

---

## 3. Reparto de color

Adaptación de la regla 60/30/10 del sector:

- **~90 % neutro** — `paper`, `surface`, `ink`, `muted`, `line`.
- **~10 % acento** — CTA principal, numeración de sección, hover de glifo, etiquetas.
- **0 % experimental.** No hay colores semánticos de estado todavía; cuando hagan falta (error, éxito), entran como decisión registrada y con contraste verificado.

**Prohibido:** gradientes de color saturado, más de un acento, color como única señal de estado, y cualquier hex escrito a mano en un componente.

---

## 4. Tipografía

| Rol | Familia | Uso |
|---|---|---|
| `font-display` | **Instrument Serif** 400 | Titulares y nombres de modelo. Serif editorial de alto contraste |
| `font-sans` | **Familjen Grotesk** | Todo lo demás: cuerpo, UI, datos |

La serif aporta el tono de catálogo; la grotesca sostiene lo técnico. **No se añade una tercera familia.** Datos numéricos con `tabular-nums`; etiquetas de sección con la clase `rule-label` (versalitas, `letter-spacing` 0.18em).

---

## 5. Materia y movimiento

- **Grano de papel** (`.grain`) sobre toda la página, opacidad 0.035 en claro y 0.05 en oscuro. Un fondo plano delata la plantilla.
- **Una sola secuencia de entrada orquestada** (`.reveal`, con `animation-delay` escalonado), no micro-animaciones dispersas.
- **Atmósfera cálida** detrás del titular con un radial de `accent-soft`. Nunca un gradiente de color saturado.
- `prefers-reduced-motion: reduce` anula toda animación. No es opcional.
- Foco visible con `outline` de `accent` y `outline-offset: 3px`. Todo elemento interactivo es alcanzable por teclado.

---

## 6. Componentes: reglas no negociables

- **Botón principal:** `bg-accent`, píldora, sombra, y estado `:active` que se hunde (`active:translate-y-px`). Un botón sin respuesta al pulsar está mal.
- **Botón secundario:** borde `line`, hover a borde `ink`.
- **Tarjetas:** siempre con estado hover. En `FrameCard` el glifo pasa de `ink` a `accent`.
- **Glifos de montura:** el trazo es `currentColor`, así que heredan el token del contexto. El grosor del trazo refleja el grosor real de la montura.
- **Estado vacío diseñado.** «Nada encaja con ese filtro» es una pantalla, no un hueco.
- **Lo no disponible se explica.** Un try-on bloqueado muestra el motivo en un borde discontinuo, no un botón que falla al pulsarlo.
- **Sin precios** → [D-019](DECISION_LOG.md#d-019). Una cifra junto a una montura en nuestra interfaz se lee como *nuestro* precio y da a entender que vendemos nosotros. El precio es del retailer y vive en su ficha. La única cifra en euros permitida en la UI son las **etiquetas del filtro de presupuesto**, que son una pregunta, no un precio.

---

## 7. Estado

La paleta es una **hipótesis de diseño**, igual que los pesos del scoring. Es coherente con la categoría y legible, pero **no hay ningún dato de conversión** que diga que vende más. Se recalibra con comportamiento real cuando haya tráfico.
