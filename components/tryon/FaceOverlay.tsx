"use client";

import { FrameGlyph } from "@/components/ui/FrameGlyph";
import type { FrameProfile } from "@/lib/catalog/types";
import type { FacePlacement } from "@/lib/face/landmarks";
import { computeFrameOverlay } from "@/lib/face/overlay";

/**
 * La foto del usuario con una montura dibujada encima, a escala.
 *
 * El contenedor adopta **exactamente** el aspecto de la foto original. Es
 * imprescindible: la posición se expresa en porcentajes de la imagen, y si el
 * contenedor tuviera otro aspecto y la foto se recortara, las gafas quedarían
 * descolocadas.
 *
 * El glifo se dibuja dos veces, una clara y gruesa por detrás y otra oscura
 * encima. Es lo que lo hace legible sobre una foto cualquiera, sea oscura o
 * clara, sin saber nada de ella.
 */

interface FaceOverlayProps {
  photoUrl: string;
  placement: FacePlacement;
  frame: FrameProfile;
  className?: string;
}

export function FaceOverlay({
  photoUrl,
  placement,
  frame,
  className,
}: FaceOverlayProps) {
  const overlay = computeFrameOverlay(frame, placement);

  const box = {
    left: `${(overlay.centerXPct - overlay.widthPct / 2) * 100}%`,
    top: `${(overlay.centerYPct - overlay.heightPct / 2) * 100}%`,
    width: `${overlay.widthPct * 100}%`,
    height: `${overlay.heightPct * 100}%`,
    transform: `rotate(${overlay.rotationDeg}deg)`,
  } as const;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-line bg-surface ${className ?? ""}`}
      style={{
        aspectRatio: `${placement.image.width} / ${placement.image.height}`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- blob local, nunca se sube */}
      <img
        src={photoUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute" style={box} aria-hidden>
        <FrameGlyph
          shape={frame.shape}
          thickness={frame.thickness + 0.35}
          className="absolute inset-0 h-full w-full text-white/70"
        />
      </div>
      <div className="absolute" style={box} aria-hidden>
        <FrameGlyph
          shape={frame.shape}
          thickness={frame.thickness}
          className="absolute inset-0 h-full w-full text-[#15120e]"
        />
      </div>

      <p className="sr-only">
        Esquema de la montura {frame.model} de {frame.brand} superpuesto a tu
        foto, a escala estimada.
      </p>
    </div>
  );
}
