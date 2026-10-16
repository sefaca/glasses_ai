import { ImageResponse } from "next/og";

/**
 * Imagen de previsualización al compartir un enlace.
 *
 * Importa más de lo que parece: sin ella, un enlace pegado en WhatsApp o en
 * X sale como una caja gris con una URL, y el producto es **visual**. Es la
 * única impresión que se lleva quien ve el enlace antes de decidir si entra.
 *
 * Se genera en el build, así que no hay que mantener un PNG a mano ni
 * acordarse de regenerarlo cuando cambie la paleta: los colores salen de los
 * mismos valores que el resto del sitio.
 *
 * Sin tipografía personalizada a propósito. Cargar una fuente aquí obliga a
 * leer el fichero en cada generación y a mantener el binario en el
 * repositorio, y el dibujo se sostiene con la montura y el contraste.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "lookfit — descubre qué gafas te quedan bien";

const PAPER = "#f7f5f1";
const INK = "#1c1a17";
const ACCENT = "#7e4420";
const MUTED = "#6b6258";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          padding: "72px 80px",
        }}
      >
        {/* La montura, grande: es la marca y de paso dice de qué va esto. */}
        <svg width="160" height="80" viewBox="0 0 40 20" fill="none">
          <circle cx="9" cy="10" r="8" stroke={ACCENT} strokeWidth="2.2" />
          <circle cx="31" cy="10" r="8" stroke={ACCENT} strokeWidth="2.2" />
          <path
            d="M17 9.2c2.6-1.6 4.4-1.6 6 0"
            stroke={ACCENT}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: INK,
              maxWidth: 900,
            }}
          >
            Descubre qué gafas te quedan bien.
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 34,
              lineHeight: 1.3,
              color: ACCENT,
            }}
          >
            Pruébatelas en tu propia cara.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 26,
            color: MUTED,
          }}
        >
          <span>lookfit.app</span>
          <span>Sin registro · Tu foto no se guarda</span>
        </div>
      </div>
    ),
    size,
  );
}
