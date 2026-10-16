/**
 * El logotipo: **lookfit**, con las dos «o» convertidas en lentes.
 *
 * La idea es la que estaba delante todo el rato: el nombre ya contiene un par
 * de gafas. Dos círculos y un puente en mitad de la palabra se leen como
 * montura sin necesidad de dibujar unas gafas aparte, y eso resuelve el
 * problema de siempre de los logos de este sector —una silueta de gafas
 * genérica que podría ser de cualquiera—.
 *
 * Va en SVG y en una sola pieza, no como texto más un icono: así el espaciado
 * entre las letras y las lentes no depende de que la tipografía haya cargado,
 * que es lo que produce ese salto feo en la primera carga.
 *
 * El trazo usa `currentColor` y las lentes el acento, para que el mismo
 * componente sirva sobre papel y sobre tinta sin duplicarlo.
 */

interface Props {
  className?: string;
  /** Solo la montura, sin palabra. Para espacios cuadrados. */
  markOnly?: boolean;
  /** Texto accesible. Si es `null`, se oculta a lectores de pantalla. */
  title?: string | null;
}

export function Wordmark({
  className,
  markOnly = false,
  title = "lookfit",
}: Props) {
  if (markOnly) {
    return (
      <svg
        viewBox="0 0 40 20"
        className={className}
        role={title ? "img" : "presentation"}
        aria-hidden={title ? undefined : true}
        fill="none"
      >
        {title && <title>{title}</title>}
        <Lenses />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 132 26"
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      fill="none"
    >
      {title && <title>{title}</title>}

      {/*
        «l» y «k» a la izquierda, «fit» a la derecha, y las dos lentes en
        medio ocupando el lugar exacto de las dos «o». Las letras son trazos
        geométricos y no texto: un `<text>` dependería de la fuente del
        sistema y el logotipo cambiaría de forma en cada ordenador.
      */}
      <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        {/* l */}
        <path d="M4 3v17" />
      </g>

      <g transform="translate(10, 3)">
        <Lenses />
      </g>

      <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        {/* k */}
        <path d="M54 3v17M54 14l7-6M57.5 11l5 9" />
        {/* f */}
        <path d="M73 20v-13a4 4 0 0 1 4-4M69.5 9h8" />
        {/* i */}
        <path d="M86 9v11" />
        {/* t */}
        <path d="M97 3v12a5 5 0 0 0 5 5M93 9h8" />
      </g>

      {/* El punto de la «i», redondo como las lentes. */}
      <circle cx="86" cy="3.6" r="1.6" fill="currentColor" />
    </svg>
  );
}

/**
 * Las dos lentes con su puente.
 *
 * Proporciones tomadas de una montura real: las lentes algo más anchas que
 * altas y el puente corto. Una montura con lentes circulares perfectas se lee
 * como «gafas de disfraz»; esta se lee como unas gafas.
 */
function Lenses() {
  return (
    <g
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      className="text-accent"
    >
      <circle cx="9" cy="10" r="8" />
      <circle cx="31" cy="10" r="8" />
      <path d="M17 9.2c2.6-1.6 4.4-1.6 6 0" />
    </g>
  );
}
