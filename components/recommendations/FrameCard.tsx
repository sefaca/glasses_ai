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
        <span className="block font-sans text-xs tracking-wide text-muted">
          {frame.brand} · {shapeLabel}
        </span>
      </h3>

      <p className="mt-3 grow text-sm leading-relaxed text-muted">
        {explainRecommendation(frame, score)}
      </p>

      <div className="mt-5">
        {available ? (
          <button
            type="button"
            className="w-full rounded-full border border-ink px-5 py-2.5 text-sm font-medium transition-colors hover:bg-ink hover:text-paper active:translate-y-px"
          >
            Probarme
          </button>
        ) : (
          <p
            className="w-full rounded-full border border-dashed border-line px-5 py-2.5 text-center text-xs text-muted"
            title={blocked ?? undefined}
          >
            {BLOCKED_COPY[blocked ?? "unknown"]}
          </p>
        )}
      </div>
    </article>
  );
}
