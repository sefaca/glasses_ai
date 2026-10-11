"use client";

/**
 * Indicador de pasos para el flujo de una sola pantalla.
 *
 * El flujo anterior era una página larga con secciones apiladas, y obligaba a
 * buscar scrolleando lo que venía después. Esto se comporta como un generador
 * de imágenes: un panel, un paso cada vez, sin moverse del sitio.
 *
 * Los pasos ya recorridos son navegables hacia atrás; los de delante, no:
 * saltar al paso 3 sin haber subido una foto no significa nada.
 */

export interface StepDefinition {
  id: string;
  label: string;
}

interface StepHeaderProps {
  steps: StepDefinition[];
  currentIndex: number;
  /** Hasta dónde ha llegado el usuario. Más allá no se puede saltar. */
  reachedIndex: number;
  onNavigate: (index: number) => void;
}

export function StepHeader({
  steps,
  currentIndex,
  reachedIndex,
  onNavigate,
}: StepHeaderProps) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3">
      {steps.map((step, index) => {
        const state =
          index === currentIndex
            ? "current"
            : index < currentIndex
              ? "done"
              : "upcoming";
        const navigable = index <= reachedIndex && index !== currentIndex;

        return (
          <li key={step.id} className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              disabled={!navigable}
              aria-current={state === "current" ? "step" : undefined}
              onClick={() => navigable && onNavigate(index)}
              className={[
                "flex items-center gap-2 rounded-full px-1 text-sm transition-colors",
                navigable ? "cursor-pointer hover:text-ink" : "cursor-default",
                state === "current"
                  ? "text-ink"
                  : state === "done"
                    ? "text-muted"
                    : "text-muted/55",
              ].join(" ")}
            >
              <span
                aria-hidden
                className={[
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.7rem] tabular-nums transition-colors",
                  state === "current"
                    ? "border-accent bg-accent text-on-accent"
                    : state === "done"
                      ? "border-accent text-accent"
                      : "border-line",
                ].join(" ")}
              >
                {state === "done" ? "✓" : index + 1}
              </span>
              {/* En móvil solo se ve el número del paso activo: no cabe más. */}
              <span
                className={
                  state === "current" ? "truncate" : "hidden truncate sm:inline"
                }
              >
                {step.label}
              </span>
            </button>

            {index < steps.length - 1 && (
              <span aria-hidden className="h-px w-4 bg-line sm:w-8" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
