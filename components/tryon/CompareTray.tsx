"use client";

import { useCallback, useState } from "react";
import { FaceOverlay } from "@/components/tryon/FaceOverlay";
import { outboundUrl } from "@/lib/catalog/rights";
import type { FrameProfile } from "@/lib/catalog/types";
import type { FacePlacement } from "@/lib/face/landmarks";
import { assessWidthFit, WIDTH_FIT_LABEL } from "@/lib/face/overlay";
import { requestTryOn, type TryOnClientResult } from "@/lib/tryon/client";
import type { UploadPayload } from "@/lib/upload/prepare";

/**
 * Comparación de 2–4 monturas sobre la misma foto — CLAUDE.md §8.7 y §8.8.
 *
 * Es la pieza que una marca no puede ofrecer por definición, porque solo
 * puede enseñarse a sí misma. Si H-M2 es cierta, el valor del producto vive
 * aquí.
 *
 * Cada tarjeta empieza con el **esquema a escala** (gratis, instantáneo,
 * responde a «¿me entra en la cara?») y puede pasar a la **imagen generada**
 * bajo demanda. Bajo demanda y no automático por una razón de dinero: seis
 * generaciones de golpe cuestan unas tres veces el gate de coste por usuario
 * activo (GC-5). La mitad del valor se obtiene gratis con el esquema.
 */

export const MAX_COMPARE = 4;

type TileState =
  | { phase: "schematic" }
  | { phase: "generating" }
  | { phase: "generated"; result: Extract<TryOnClientResult, { status: "completed" }> }
  | { phase: "failed"; message: string };

interface CompareTrayProps {
  photoUrl: string;
  photo: UploadPayload;
  placement: FacePlacement;
  frames: FrameProfile[];
  shapeLabels: Record<string, string>;
  onRemove: (frameId: string) => void;
  onClear: () => void;
}

export function CompareTray({
  photoUrl,
  photo,
  placement,
  frames,
  shapeLabels,
  onRemove,
  onClear,
}: CompareTrayProps) {
  const [tiles, setTiles] = useState<Record<string, TileState>>({});

  const generate = useCallback(
    async (frameId: string) => {
      setTiles((current) => ({ ...current, [frameId]: { phase: "generating" } }));
      const result = await requestTryOn(frameId, photo);
      setTiles((current) => ({
        ...current,
        [frameId]:
          result.status === "completed"
            ? { phase: "generated", result }
            : { phase: "failed", message: result.message },
      }));
    },
    [photo],
  );

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
          frames.length === 1 ? "max-w-sm" : "grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {frames.map((frame) => {
          const state = tiles[frame.id] ?? { phase: "schematic" };
          const fit = assessWidthFit(frame, placement);
          const fitLabel = WIDTH_FIT_LABEL[fit];
          const buyUrl = outboundUrl(frame);

          return (
            <article key={frame.id} className="overflow-hidden rounded-xl">
              <div className="relative">
                {state.phase === "generated" ? (
                  /* eslint-disable-next-line @next/next/no-img-element -- data: en memoria, no se persiste */
                  <img
                    src={state.result.resultUrl}
                    alt={`Simulación de ${frame.model} sobre tu foto`}
                    className="w-full rounded-xl rounded-b-none border border-line object-cover"
                    style={{
                      aspectRatio: `${placement.image.width} / ${placement.image.height}`,
                    }}
                  />
                ) : (
                  <FaceOverlay
                    photoUrl={photoUrl}
                    placement={placement}
                    frame={frame}
                    className="rounded-b-none"
                  />
                )}

                {state.phase === "generating" && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl rounded-b-none bg-paper/75 backdrop-blur-sm">
                    <p className="flex items-center gap-2 text-xs">
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"
                      />
                      Generando…
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onRemove(frame.id)}
                  aria-label={`Quitar ${frame.model} de la comparación`}
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

              {state.phase === "schematic" && (
                <button
                  type="button"
                  onClick={() => void generate(frame.id)}
                  className="mt-3 w-full rounded-full border border-ink px-4 py-2 text-xs font-medium transition-colors hover:bg-ink hover:text-paper active:translate-y-px"
                >
                  Ver con la montura
                </button>
              )}

              {state.phase === "failed" && (
                <div className="mt-3">
                  <p className="text-xs text-ink">{state.message}</p>
                  <button
                    type="button"
                    onClick={() => void generate(frame.id)}
                    className="mt-2 w-full rounded-full border border-line px-4 py-2 text-xs transition-colors hover:border-ink"
                  >
                    Reintentar
                  </button>
                </div>
              )}

              {state.phase === "generated" && !state.result.labelAsProduct && (
                /*
                  RULE #1 llegando al píxel. La fidelidad no está medida
                  (GT-1), así que la imagen NO puede presentarse como ese
                  producto. Lo decide el servidor, no esta vista.
                */
                <p className="mt-3 rounded-lg bg-accent-soft px-3 py-2 text-[0.7rem] leading-relaxed text-accent">
                  Interpretación de estilo, no una reproducción fiel de este
                  modelo. No la uses para decidir la compra.
                </p>
              )}

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

      <p className="mt-7 border-t border-line pt-4 text-xs leading-relaxed text-muted">
        El esquema es a escala estimada y sirve para comparar anchuras. La
        imagen generada sale de una descripción del modelo, no de su foto
        oficial: para generarla, tu foto se envía a nuestro servidor y de ahí
        al proveedor, y no se guarda en ningún sitio.
      </p>
    </section>
  );
}
