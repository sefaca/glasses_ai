import Image from "next/image";
import { getDictionary, DEFAULT_LOCALE } from "@/lib/i18n";

/**
 * La demostración del producto en la landing — CLAUDE.md §8.1, que pide
 * «mostrar ejemplos reales» de foto original, recomendación y try-on.
 *
 * Hasta ahora la landing era abstracta: siluetas dibujadas. En un producto
 * cuyo valor entero es visual, eso es la mayor debilidad que tenía.
 *
 * **Las tres imágenes son nuestras y están generadas.** La persona no existe
 * —se generó para no usar la cara de nadie real— y las monturas son
 * simulaciones, no fotografía de producto. Va dicho debajo, no en letra
 * pequeña: enseñar una cara generada sin decirlo sería exactamente el tipo de
 * ambigüedad que RULE #1 existe para evitar.
 */

const dict = getDictionary(DEFAULT_LOCALE);

const PANELS = [
  { src: "/demo/original.jpg", kind: "original" as const },
  { src: "/demo/clubmaster.jpg", kind: "result" as const, index: 0 },
  { src: "/demo/round-metal.jpg", kind: "result" as const, index: 1 },
];

export function DemoTriptych() {
  return (
    <figure>
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {PANELS.map((panel, i) => {
          const frame =
            panel.kind === "result" ? dict.demo.items[panel.index] : null;

          return (
            <div
              key={panel.src}
              className="reveal overflow-hidden rounded-xl border border-line bg-surface"
              style={{ animationDelay: `${560 + i * 110}ms` }}
            >
              <div className="relative aspect-[2/3]">
                <Image
                  src={panel.src}
                  alt={
                    frame
                      ? `Simulación de unas ${frame.model} sobre la misma foto`
                      : "Foto de partida de una persona generada"
                  }
                  fill
                  sizes="(max-width: 640px) 33vw, 240px"
                  className="object-cover"
                  priority={i === 0}
                />
                {/* El original se marca para que la comparación se lea sola. */}
                <span className="absolute bottom-2 left-2 rounded-full bg-black/45 px-2.5 py-1 text-[0.6rem] text-white backdrop-blur-sm">
                  {frame ? "Simulación" : dict.demo.original}
                </span>
              </div>

              <div className="px-2.5 py-2.5 text-center sm:px-3">
                <p className="truncate text-xs font-medium">
                  {frame ? frame.model : dict.demo.original}
                </p>
                <p className="mt-0.5 truncate text-[0.65rem] text-muted">
                  {frame ? frame.reference : "Sin gafas"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <figcaption
        className="reveal mt-4 text-xs leading-relaxed text-muted"
        style={{ animationDelay: "900ms" }}
      >
        {dict.demo.disclaimer}
      </figcaption>
    </figure>
  );
}
