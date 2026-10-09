import { FrameGlyph } from "@/components/ui/FrameGlyph";
import { canTryOn, tryOnBlockedReason } from "@/lib/catalog/rights";
import type { FrameProfile } from "@/lib/catalog/types";
import { explainRecommendation, matchLabel } from "@/lib/recommendations/explain";
import type { FrameScore } from "@/lib/recommendations/score";

/**
 * Card de recomendación — CLAUDE.md §8.6.
 *
 * El score crudo no se muestra: se traduce a una etiqueta cualitativa, y
 * cuando la confianza es baja no se muestra ninguna. Prometer menos es parte
 * del producto.
 *
 * El botón de prueba consulta `canTryOn()`, así que una montura sin derechos
 * de derivación aparece con el botón desactivado y el motivo a la vista en
 * lugar de fallar al pulsarlo.
 */

interface FrameCardProps {
  frame: FrameProfile;
  score: FrameScore;
  position: number;
  shapeLabel: string;
  /** `true` si ya está en la comparación. */
  selected?: boolean;
  /** Sin foto analizada no hay nada sobre lo que superponer. */
  canSelect?: boolean;
  onToggle?: (frameId: string) => void;
}

const BLOCKED_COPY: Record<string, string> = {
  "derivative-rights-not-cleared": "Prueba no disponible para esta marca",
  "trademark-not-cleared": "Pendiente de acuerdo con la marca",
  "frame-inactive": "No disponible",
  unknown: "No disponible",
};

export function FrameCard({
  frame,
  score,
  position,
  shapeLabel,
  selected = false,
  canSelect = false,
  onToggle,
}: FrameCardProps) {
  const label = matchLabel(score);
  // El mock es lo único conectado hoy: el proveedor real está detrás del muro
  // de gates de D-017.
  const available = canTryOn(frame, "mock");
  const blocked = tryOnBlockedReason(frame, "mock");

  return (
    <article className="group flex flex-col border-t border-line pt-5">
      <div className="flex items-baseline justify-between">
        <span className="rule-label text-[0.65rem] text-muted tabular-nums">
          {String(position).padStart(2, "0")}
        </span>
        {label && (
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[0.65rem] font-medium text-accent">
            {label}
          </span>
        )}
      </div>

      <div className="flex items-center justify-center py-7">
        <FrameGlyph
          shape={frame.shape}
          thickness={frame.thickness}
          className="w-full max-w-[13rem] text-ink transition-colors duration-300 group-hover:text-accent"
          label={`${frame.model}, montura ${shapeLabel.toLowerCase()}`}
        />
      </div>

      {/*
        Sin precio, a propósito → D-019. Un precio en nuestra interfaz se lee
        como nuestro precio y da a entender que vendemos nosotros. El precio
        es del retailer y aparece en su ficha, al otro lado de «ver dónde
        comprar».
      */}
      <h3 className="font-display text-xl leading-tight">
        {frame.model}
        {frame.reference && (
          <span className="ml-1.5 font-sans text-xs text-muted">
            {frame.reference}
          </span>
        )}
        <span className="mt-0.5 block font-sans text-xs tracking-wide text-muted">
          {frame.brand} · {shapeLabel} · {frame.colorName}
        </span>
      </h3>

      <p className="mt-3 grow text-sm leading-relaxed text-muted">
        {explainRecommendation(frame, score)}
      </p>

      <div className="mt-5">
        {!available ? (
          <p
            className="w-full rounded-full border border-dashed border-line px-5 py-2.5 text-center text-xs text-muted"
            title={blocked ?? undefined}
          >
            {BLOCKED_COPY[blocked ?? "unknown"]}
          </p>
        ) : canSelect ? (
          <button
            type="button"
            aria-pressed={selected}
            onClick={() => onToggle?.(frame.id)}
            className={[
              "w-full rounded-full border px-5 py-2.5 text-sm font-medium transition-colors active:translate-y-px",
              selected
                ? "border-accent bg-accent text-on-accent"
                : "border-ink hover:bg-ink hover:text-paper",
            ].join(" ")}
          >
            {selected ? "Quitar" : "Ver en mi cara"}
          </button>
        ) : (
          // Sin foto no hay nada sobre lo que superponer. El botón lo dice en
          // lugar de aparecer activo y no hacer nada al pulsarlo.
          <a
            href="#foto"
            className="block w-full rounded-full border border-dashed border-line px-5 py-2.5 text-center text-xs text-muted transition-colors hover:border-ink hover:text-ink"
          >
            Sube una foto para verla puesta
          </a>
        )}
      </div>
    </article>
  );
}
