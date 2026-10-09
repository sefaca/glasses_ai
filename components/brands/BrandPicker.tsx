"use client";

import type { BrandSuggestion } from "@/lib/recommendations/brands";

/**
 * Elección de marcas — el eje que faltaba.
 *
 * Es como se compran gafas de verdad: «quiero unas Ray-Ban». El selector
 * anterior solo tenía estilo, y dejaba fuera la pregunta que más gente se
 * hace primero.
 *
 * Las sugerencias solo aparecen **si significan algo**. Con perfil neutro
 * todas las marcas empatan, y presentar un empate como «elegidas para ti»
 * sería falsa personalización — justo lo que CLAUDE.md §0 prohíbe. Sin foto,
 * esto es una lista de marcas y se presenta como tal.
 */

interface BrandPickerProps {
  /** Ordenadas por encaje si hay rostro; alfabéticas si no. */
  suggestions: BrandSuggestion[];
  /** `true` si hay diferencia real entre marcas que merezca destacarse. */
  personalised: boolean;
  selectedIds: string[];
  onToggle: (brandId: string) => void;
  onClear: () => void;
  shapeLabels: Record<string, string>;
}

/** Cuántas se destacan como sugeridas antes del resto. */
const HIGHLIGHTED = 4;

export function BrandPicker({
  suggestions,
  personalised,
  selectedIds,
  onToggle,
  onClear,
  shapeLabels,
}: BrandPickerProps) {
  const highlighted = personalised ? suggestions.slice(0, HIGHLIGHTED) : [];
  const rest = personalised ? suggestions.slice(HIGHLIGHTED) : suggestions;
  const allSelected = selectedIds.length === 0;

  return (
    <div>
      {personalised && highlighted.length > 0 && (
        <div className="mb-8">
          <p className="rule-label text-[0.7rem] text-accent">
            Encajan con tus proporciones
          </p>
          <ul className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {highlighted.map((suggestion) => {
              const active = selectedIds.includes(suggestion.brand.id);
              return (
                <li key={suggestion.brand.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => onToggle(suggestion.brand.id)}
                    className={[
                      "flex h-full w-full flex-col items-start gap-1 px-4 py-4 text-left transition-colors",
                      active
                        ? "bg-accent text-on-accent"
                        : "bg-surface hover:bg-paper",
                    ].join(" ")}
                  >
                    <span className="text-sm font-medium">
                      {suggestion.brand.name}
                    </span>
                    <span
                      className={`text-xs ${active ? "opacity-80" : "text-muted"}`}
                    >
                      {/* El porqué, no solo el qué: la forma con la que destaca. */}
                      Sobre todo{" "}
                      {suggestion.topShapes
                        .slice(0, 2)
                        .map((s) => shapeLabels[s]?.toLowerCase() ?? s)
                        .join(" y ")}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="rule-label text-[0.7rem] text-muted">
          {personalised ? "Y el resto" : "Marcas"}
        </p>
        {!allSelected && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-muted underline decoration-line underline-offset-4 hover:text-ink"
          >
            Ver todas
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {rest.map((suggestion) => {
          const active = selectedIds.includes(suggestion.brand.id);
          return (
            <button
              key={suggestion.brand.id}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(suggestion.brand.id)}
              title={suggestion.brand.tagline}
              className={[
                "rounded-full border px-4 py-2 text-sm transition-all active:translate-y-px",
                active
                  ? "border-accent bg-accent text-on-accent"
                  : "border-line hover:border-ink",
              ].join(" ")}
            >
              {suggestion.brand.name}
              <span
                className={`ml-1.5 text-xs tabular-nums ${active ? "opacity-70" : "text-muted"}`}
              >
                {suggestion.frameCount}
              </span>
            </button>
          );
        })}
      </div>

      {!personalised && (
        <p className="mt-4 text-xs text-muted">
          Sube una foto y te decimos cuáles encajan mejor con tus proporciones.
          Sin ella solo podemos ordenarlas alfabéticamente.
        </p>
      )}
    </div>
  );
}
