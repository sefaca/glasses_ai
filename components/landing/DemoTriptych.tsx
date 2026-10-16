import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";

/**
 * La demostración del producto en la landing — CLAUDE.md §8.1, que pide
 * «mostrar ejemplos reales» de foto original, recomendación y try-on.
 *
 * Hasta ahora la landing era abstracta: siluetas dibujadas. En un producto
 * cuyo valor entero es visual, eso es la mayor debilidad que tenía.
 *
 * La secuencia se numera y la primera pieza va marcada como el punto de
 * partida, porque sin eso las tres imágenes se leen como tres fotos sueltas
 * de la misma persona en vez de como un antes y dos después. La flecha entre
 * la primera y la segunda es lo que convierte una rejilla en una historia.
 *
 * **Las tres imágenes son nuestras y están generadas.** La persona no existe
 * —se generó para no usar la cara de nadie real— y las monturas son
 * simulaciones, no fotografía de producto. Va dicho debajo, no en letra
 * pequeña: enseñar una cara generada sin decirlo sería exactamente el tipo de
 * ambigüedad que RULE #1 existe para evitar.
 */

const PANELS = [
  { src: "/demo/original.jpg", kind: "original" as const },
  { src: "/demo/clubmaster.jpg", kind: "result" as const, index: 0 },
  { src: "/demo/round-metal.jpg", kind: "result" as const, index: 1 },
];

export function DemoTriptych({ dict }: { dict: Dictionary }) {
  return (
    <figure>
      <div className="relative grid grid-cols-3 gap-2 sm:gap-3">
        {PANELS.map((panel, i) => {
          const frame =
            panel.kind === "result" ? dict.demo.items[panel.index] : null;

          return (
            <div
              key={panel.src}
              className={[
                "reveal relative overflow-hidden rounded-xl border bg-surface",
                // El resultado pesa más que el punto de partida: el original
                // se queda en segundo plano y las monturas destacan.
                frame ? "border-line" : "border-dashed border-line/80",
              ].join(" ")}
              style={{ animationDelay: `${420 + i * 110}ms` }}
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={panel.src}
                  alt={
                    frame
                      ? `${dict.demo.simulationBadge} — ${frame.model} (${frame.reference})`
                      : dict.demo.photoAlt
                  }
                  fill
                  sizes="(max-width: 1024px) 32vw, 160px"
                  className={`object-cover ${frame ? "" : "opacity-85 saturate-75"}`}
                  priority={i === 0}
                />

                {/* Número de paso: lo que convierte tres fotos en una secuencia. */}
                <span className="rule-label absolute top-2 left-2 rounded-full bg-paper/85 px-2 py-0.5 text-[0.55rem] text-ink tabular-nums backdrop-blur-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {frame && (
                  <span className="absolute right-2 bottom-2 rounded-full bg-black/50 px-2 py-0.5 text-[0.55rem] text-white backdrop-blur-sm">
                    {dict.demo.simulationBadge}
                  </span>
                )}
              </div>

              <div className="px-2 py-2 text-center">
                <p className="truncate text-[0.7rem] font-medium">
                  {frame ? frame.model : dict.demo.original}
                </p>
                <p className="mt-0.5 truncate text-[0.6rem] text-muted">
                  {frame ? frame.reference : dict.demo.noGlasses}
                </p>
              </div>
            </div>
          );
        })}

        {/*
          La flecha entre el original y el primer resultado. Decorativa: lo
          que dice ya está en los números y en los pies, así que se oculta a
          lectores de pantalla en vez de repetirlo.
        */}
        <span
          aria-hidden
          className="absolute top-[38%] left-1/3 z-10 -ml-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[0.7rem] text-on-accent shadow-sm"
        >
          →
        </span>
      </div>

      <figcaption
        className="reveal mt-3 text-[0.7rem] leading-relaxed text-muted"
        style={{ animationDelay: "760ms" }}
      >
        {dict.demo.disclaimer}
      </figcaption>
    </figure>
  );
}
