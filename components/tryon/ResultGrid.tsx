"use client";

import type { FrameProfile } from "@/lib/catalog/types";
import { outboundUrl } from "@/lib/catalog/rights";
import type { FacePlacement } from "@/lib/face/landmarks";
import { assessWidthFit, widthFitLabel } from "@/lib/face/overlay";
import { track } from "@/lib/analytics/client";
import { format, type Dictionary } from "@/lib/i18n";

/**
 * Las simulaciones generadas, hasta cuatro sobre la misma cara.
 *
 * **Sin esquema sobre la foto**: al elegir una montura se genera directamente.
 * Mientras tanto se ve la foto tal cual con el estado de carga encima, no un
 * dibujo que después se sustituye.
 *
 * Es presentacional a propósito: el estado de generación lo lleva la página,
 * que es quien recibe el click. Así no hace falta disparar peticiones desde
 * un efecto, que además de frágil lo prohíbe la regla de lint.
 */

export const MAX_COMPARE = 4;

export type GenerationState =
  | { phase: "generating" }
  | {
      phase: "done";
      url: string;
      /** `false` ⇒ no se puede presentar como ese producto. RULE #1. */
      labelAsProduct: boolean;
    }
  | { phase: "failed"; message: string };

interface ResultGridProps {
  photoUrl: string;
  placement: FacePlacement;
  frames: FrameProfile[];
  states: Record<string, GenerationState | undefined>;
  shapeLabels: Record<string, string>;
  dict: Dictionary;
  onRetry: (frameId: string) => void;
  onRemove: (frameId: string) => void;
}

export function ResultGrid({
  photoUrl,
  placement,
  frames,
  states,
  shapeLabels,
  dict,
  onRetry,
  onRemove,
}: ResultGridProps) {
  const texts = dict.results;
  if (frames.length === 0) return null;

  return (
    <div
      className={`grid gap-5 ${
        frames.length === 1 ? "max-w-sm" : "grid-cols-1 sm:grid-cols-2"
      }`}
    >
      {frames.map((frame) => {
        const state = states[frame.id] ?? { phase: "generating" as const };
        const fit = assessWidthFit(frame, placement);
        const fitLabel = widthFitLabel(fit, texts.widthFit);
        const buyUrl = outboundUrl(frame);

        return (
          <article key={frame.id} className="overflow-hidden rounded-xl">
            <div
              className="relative overflow-hidden rounded-xl rounded-b-none border border-line bg-surface"
              style={{
                aspectRatio: `${placement.image.width} / ${placement.image.height}`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- blob local o data:, nunca se persiste */}
              <img
                src={state.phase === "done" ? state.url : photoUrl}
                alt={
                  state.phase === "done"
                    ? format(texts.simulationAlt, { model: frame.model })
                    : texts.yourPhoto
                }
                className={`absolute inset-0 h-full w-full object-cover transition-opacity ${
                  state.phase === "done" ? "opacity-100" : "opacity-55"
                }`}
              />

              {state.phase === "generating" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="flex items-center gap-2 rounded-full bg-paper/85 px-4 py-2 text-xs backdrop-blur-sm">
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"
                    />
                    {texts.generating}
                  </p>
                </div>
              )}

              {state.phase === "failed" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-5 text-center">
                  <p className="text-xs">{state.message}</p>
                  <button
                    type="button"
                    onClick={() => onRetry(frame.id)}
                    className="rounded-full border border-ink bg-paper px-4 py-2 text-xs font-medium transition-colors hover:bg-ink hover:text-paper"
                  >
                    {texts.retry}
                  </button>
                </div>
              )}

              {/*
                RULE #1 (D-002) pide indicación visible de que es una
                simulación. Mínima, en la esquina, como cualquier probador
                virtual — no una advertencia que compita con la imagen.
              */}
              {state.phase === "done" && (
                <span className="absolute bottom-2 left-2 rounded-full bg-black/45 px-2.5 py-1 text-[0.65rem] text-white backdrop-blur-sm">
                  {texts.simulationBadge}
                </span>
              )}

              <button
                type="button"
                onClick={() => onRemove(frame.id)}
                aria-label={format(texts.removeLabel, { model: frame.model })}
                className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/45 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              >
                ×
              </button>
            </div>

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

            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted">
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
              {buyUrl && (
                <a
                  href={buyUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  onClick={() =>
                    track("outbound_product_click", {
                      frameId: frame.id,
                      brandId: frame.brandId,
                    })
                  }
                  className="text-xs text-accent underline decoration-line underline-offset-4"
                >
                  {texts.whereToBuy}
                </a>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
