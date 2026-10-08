import type { FrameShape } from "@/lib/catalog/types";

/**
 * Dibujo de línea de una montura, generado a partir de su forma.
 *
 * No es decoración: es la respuesta honesta a no tener derechos de imagen.
 * Mientras GA-1 siga sin resolver no podemos mostrar fotos de producto de
 * marca (D-015), así que dibujamos la silueta nosotros. Como efecto lateral
 * da al catálogo un aire de ficha técnica que encaja con el tono editorial.
 *
 * Las formas asimétricas —aviador, cat-eye, wayfarer— se dibujan una vez con
 * el borde exterior hacia +x y se espejan para la lente contraria.
 */

interface FrameGlyphProps {
  shape: FrameShape;
  /** 0..1. Controla el grosor del trazo. */
  thickness?: number;
  className?: string;
  /** Texto alternativo. Vacío si el glifo es decorativo junto a un título. */
  label?: string;
}

/** Lentes simétricas: se describen con una primitiva y ya está. */
function symmetricLens(shape: FrameShape): React.ReactElement | null {
  switch (shape) {
    case "round":
      return <circle cx={0} cy={0} r={29} />;
    case "oval":
      return <ellipse cx={0} cy={0} rx={32} ry={22} />;
    case "rectangular":
      return <rect x={-32} y={-19} width={64} height={38} rx={7} />;
    case "square":
      return <rect x={-31} y={-25} width={62} height={50} rx={8} />;
    case "oversized":
      return <rect x={-35} y={-28} width={70} height={56} rx={17} />;
    default:
      return null;
  }
}

/** Lentes asimétricas: borde exterior hacia +x. */
const ASYMMETRIC_PATHS: Partial<Record<FrameShape, string>> = {
  aviator:
    "M -29 -21 L 29 -24 Q 34 -5 18 16 Q 4 25 -8 17 Q -27 1 -29 -21 Z",
  "cat-eye":
    "M -29 -13 Q -27 -21 -6 -23 L 25 -26 Q 34 -24 30 -11 Q 26 13 2 17 Q -23 15 -29 -13 Z",
  wayfarer:
    "M -30 -19 L 29 -22 Q 33 -17 30 6 Q 26 18 2 19 Q -23 17 -28 4 Q -31 -13 -30 -19 Z",
  geometric: "M -30 -2 L -15 -22 L 15 -22 L 30 -2 L 15 20 L -15 20 Z",
};

function Lens({ shape, flip }: { shape: FrameShape; flip: boolean }) {
  const symmetric = symmetricLens(shape);
  const content = symmetric ?? (
    <path d={ASYMMETRIC_PATHS[shape] ?? ASYMMETRIC_PATHS.wayfarer!} />
  );
  return (
    <g transform={flip ? "scale(-1,1)" : undefined} aria-hidden="true">
      {content}
    </g>
  );
}

export function FrameGlyph({
  shape,
  thickness = 0.5,
  className,
  label,
}: FrameGlyphProps) {
  // El grosor del trazo transmite el grosor real de la montura.
  const strokeWidth = 1.7 + thickness * 3.3;
  // El puente del aviador es doble y mucho más estrecho.
  const isAviator = shape === "aviator";

  return (
    <svg
      viewBox="0 0 200 80"
      className={className}
      role={label ? "img" : "presentation"}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    >
      <g transform="translate(58 40)">
        <Lens shape={shape} flip />
      </g>
      <g transform="translate(142 40)">
        <Lens shape={shape} flip={false} />
      </g>

      {/* Puente */}
      {isAviator ? (
        <>
          <path d="M 88 -2 Q 100 -8 112 -2" transform="translate(0 40)" />
          <path d="M 90 6 Q 100 1 110 6" transform="translate(0 40)" />
        </>
      ) : (
        <path d="M 89 36 Q 100 30 111 36" />
      )}

      {/* Patillas */}
      <path d="M 26 32 L 8 27" />
      <path d="M 174 32 L 192 27" />
    </svg>
  );
}
