import Link from "next/link";
import { FrameGlyph } from "@/components/ui/FrameGlyph";
import { countByShape } from "@/lib/catalog";
import type { FrameShape } from "@/lib/catalog/types";
import { DEFAULT_LOCALE, getDictionary } from "@/lib/i18n";

/**
 * Landing — CLAUDE.md §8.1.
 *
 * Server component y texto en el HTML: la indexabilidad es un requisito del
 * producto (§29.5), aunque hoy `robots` esté en noindex porque estamos en
 * validación.
 *
 * El orden de la página es el argumento: primero el beneficio, luego el
 * mecanismo, luego el catálogo, y la privacidad como sección propia y no como
 * una línea de letra pequeña — es parte de la propuesta de valor frente a
 * competidores que piden cuenta.
 */

const dict = getDictionary(DEFAULT_LOCALE);

/** Tres formas con silueta muy distinta para el collage del hero. */
const HERO_SHAPES: FrameShape[] = ["aviator", "cat-eye", "wayfarer"];

export default function HomePage() {
  const counts = countByShape();
  const shapes = (Object.keys(dict.frames.shapes) as FrameShape[]).filter(
    (shape) => (counts[shape] ?? 0) > 0,
  );

  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        {/* Sin nombre de marca: D-010 está aplazada y no se inventa uno. */}
        <Link href="/" aria-label="Inicio" className="text-accent">
          <FrameGlyph shape="round" thickness={0.3} className="h-6 w-auto" />
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted">
          <a href="#catalogo" className="hover:text-ink">
            {dict.nav.styles}
          </a>
          <a href="#como-funciona" className="hover:text-ink">
            {dict.nav.howItWorks}
          </a>
        </nav>
      </header>

      <main>
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden px-5 pt-10 pb-20 sm:px-8 sm:pt-20">
          {/* Atmósfera cálida detrás del titular. El fondo plano delata plantilla. */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-[-18rem] left-1/2 h-[34rem] w-[52rem] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, var(--accent-soft), transparent)",
            }}
          />

          <div className="relative mx-auto max-w-6xl">
            <p
              className="rule-label reveal text-[0.7rem] text-accent"
              style={{ animationDelay: "60ms" }}
            >
              {dict.hero.eyebrow}
            </p>

            <h1
              className="reveal mt-5 max-w-3xl font-display text-[2.6rem] leading-[1.03] tracking-[-0.02em] text-balance sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "140ms" }}
            >
              {dict.hero.title}{" "}
              <em className="text-accent not-italic">{dict.hero.titleAccent}</em>
            </h1>

            <p
              className="reveal mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
              style={{ animationDelay: "240ms" }}
            >
              {dict.hero.subtitle}
            </p>

            <div
              className="reveal mt-9 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "320ms" }}
            >
              <Link
                href="/probar"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-on-accent shadow-[0_8px_20px_-8px_rgba(0,0,0,0.45)] transition-transform active:translate-y-px active:shadow-[0_3px_10px_-6px_rgba(0,0,0,0.45)]"
              >
                {dict.hero.ctaPrimary}
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
              <a
                href="#catalogo"
                className="rounded-full border border-line px-7 py-3.5 text-sm font-medium transition-colors hover:border-ink"
              >
                {dict.hero.ctaSecondary}
              </a>
            </div>

            <p
              className="reveal mt-5 text-xs text-muted"
              style={{ animationDelay: "400ms" }}
            >
              {dict.hero.note}
            </p>

            {/* Collage de siluetas. Lo que el usuario recuerda de la página. */}
            <div
              className="reveal mt-16 flex items-center justify-center gap-6 sm:mt-24 sm:gap-14"
              style={{ animationDelay: "480ms" }}
              aria-hidden
            >
              {HERO_SHAPES.map((shape, i) => (
                <FrameGlyph
                  key={shape}
                  shape={shape}
                  thickness={i === 1 ? 0.7 : 0.25}
                  className={[
                    "h-auto text-ink",
                    i === 1 ? "w-40 sm:w-72" : "w-24 opacity-45 sm:w-44",
                    i === 0 ? "-rotate-6" : i === 2 ? "rotate-6" : "",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Cómo funciona ---------- */}
        <section
          id="como-funciona"
          className="border-t border-line px-5 py-20 sm:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <p className="rule-label text-[0.7rem] text-muted">
              {dict.steps.label}
            </p>
            <ol className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
              {dict.steps.items.map((step, i) => (
                <li key={step.title} className="border-t border-line pt-5">
                  <span className="rule-label block text-[0.7rem] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-3 font-display text-2xl tracking-tight sm:text-[1.75rem]">
                    {step.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- Catálogo por forma ---------- */}
        <section
          id="catalogo"
          className="border-t border-line bg-surface px-5 py-20 sm:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <p className="rule-label text-[0.7rem] text-muted">
              {dict.catalog.label}
            </p>
            <div className="mt-8 grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-16">
              <div>
                <h2 className="font-display text-3xl leading-tight tracking-tight text-balance sm:text-4xl">
                  {dict.catalog.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {dict.catalog.body}
                </p>
              </div>

              <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
                {shapes.map((shape) => (
                  <li key={shape}>
                    <div className="group flex h-full flex-col items-center justify-between gap-4 bg-surface px-4 py-7 transition-colors hover:bg-paper">
                      <FrameGlyph
                        shape={shape}
                        thickness={0.45}
                        className="w-24 text-ink transition-colors group-hover:text-accent"
                        label={dict.frames.shapes[shape]}
                      />
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          {dict.frames.shapes[shape]}
                        </p>
                        <p className="mt-0.5 text-xs text-muted tabular-nums">
                          {counts[shape]}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- Privacidad ---------- */}
        <section className="border-t border-line px-5 py-20 sm:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[22rem_1fr] lg:gap-16">
            <div>
              <p className="rule-label text-[0.7rem] text-muted">
                {dict.privacy.label}
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight text-balance sm:text-4xl">
                {dict.privacy.title}
              </h2>
            </div>
            <div className="max-w-xl">
              <p className="text-sm leading-relaxed text-muted">
                {dict.privacy.body}
              </p>
              <Link
                href="/legal/privacidad"
                className="mt-5 inline-block border-b border-accent pb-0.5 text-sm text-accent"
              >
                {dict.privacy.link}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">{dict.footer.tagline}</p>
          <nav className="flex gap-6 text-xs text-muted">
            <Link href="/legal/privacidad" className="hover:text-ink">
              {dict.footer.privacy}
            </Link>
            <Link href="/legal/terminos" className="hover:text-ink">
              {dict.footer.terms}
            </Link>
            <Link href="/legal/cookies" className="hover:text-ink">
              {dict.footer.cookies}
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
