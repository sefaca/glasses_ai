"use client";

import { FaceOverlay } from "@/components/tryon/FaceOverlay";
import type { FrameProfile } from "@/lib/catalog/types";
import type { FacePlacement } from "@/lib/face/landmarks";
import { assessWidthFit, WIDTH_FIT_LABEL } from "@/lib/face/overlay";
import { outboundUrl } from "@/lib/catalog/rights";

/**
 * Comparación de 2–4 monturas sobre la misma foto — CLAUDE.md §8.8.
 *
 * Es la pieza que una marca no puede ofrecer por definición, porque solo
 * puede enseñarse a sí misma. Si H-M2 es cierta, el valor del producto vive
 * aquí.
 *
 * Con una sola seleccionada se muestra igual: ver **una** montura a escala
 * sobre tu cara ya responde a «¿no será demasiado ancha?», que es media duda.
 */

export const MAX_COMPARE = 4;

interface CompareTrayProps {
  photoUrl: string;
  placement: FacePlacement;
  frames: FrameProfile[];
  shapeLabels: Record<string, string>;
  onRemove: (frameId: string) => void;
  onClear: () => void;
}

export function CompareTray({
  photoUrl,
  placement,
  frames,
  shapeLabels,
  onRemove,
  onClear,
}: CompareTrayProps) {
  if (frames.length === 0) return null;

  return (
    <section className="mt-20" aria-live="polite">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4">
        <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
          {frames.length === 1 ? "Sobre tu cara" : "Compáralas"}
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-muted underline decoration-line underline-offset-4 hover:text-ink"
        >
          Quitar todas
        </button>
      </div>

      <div
        className={`mt-6 grid gap-5 ${
          frames.length === 1
            ? "max-w-sm"
            : "grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {frames.map((frame) => {
          const fit = assessWidthFit(frame, placement);
          const fitLabel = WIDTH_FIT_LABEL[fit];
          const buyUrl = outboundUrl(frame);

          return (
            <article key={frame.id} className="overflow-hidden rounded-xl">
              <div className="relative">
                <FaceOverlay
                  photoUrl={photoUrl}
                  placement={placement}
                  frame={frame}
                  className="rounded-b-none"
                />
                <button
                  type="button"
                  onClick={() => onRemove(frame.id)}
                  aria-label={`Quitar ${frame.model} de la comparación`}
                  className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/45 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                >
                  ×
                </button>
              </div>

              {/*
                Pie de ficha al estilo de catálogo: modelo y referencia arriba,
                color y lente debajo. La referencia es el dato que convierte
                «unas negras» en un producto que se puede ir a comprar.
              */}
              <div className="bg-[#23201c] px-3 py-3 text-center text-[#f3efe8]">
                <p className="text-sm leading-tight font-medium">
                  {frame.model}
                  {frame.reference && (
                    <span className="ml-1.5 font-normal opacity-70">
                      {frame.reference}
                    </span>
                  )}
                </p>
                <p className="mt-1 text-[0.7rem] opacity-65">
                  {frame.brand}
                  <span className="mx-1.5">·</span>
                  {frame.colorName}
                  <span className="mx-1.5">·</span>
                  {frame.lensName}
                </p>
              </div>

              <p className="mt-2 text-xs text-muted">
                {shapeLabels[frame.shape]}
                {fitLabel && (
                  <>
                    <span className="mx-1.5">·</span>
                    <span className={fit === "good" ? "text-accent" : undefined}>
                      {fitLabel}
                    </span>
                  </>
                )}
              </p>

              {buyUrl ? (
                <a
                  href={buyUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-3 block rounded-full border border-ink px-4 py-2 text-center text-xs font-medium transition-colors hover:bg-ink hover:text-paper"
                >
                  Ver dónde comprar
                </a>
              ) : (
                <p className="mt-3 rounded-full border border-dashed border-line px-4 py-2 text-center text-xs text-muted">
                  Sin tienda todavía
                </p>
              )}
            </article>
          );
        })}
      </div>

      {/*
        Honestidad sobre lo que esto es. Un dibujo de línea no se confunde con
        una foto, pero más vale decirlo: la escala sale de una media de
        población, no de medir a esta persona.
      */}
      <p className="mt-7 border-t border-line pt-4 text-xs leading-relaxed text-muted">
        Esquema a escala estimada, no una simulación fotorrealista. Sirve para
        comparar anchuras y proporciones entre monturas, no para afirmar
        medidas exactas.
      </p>
    </section>
  );
}
