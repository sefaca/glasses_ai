import Link from "next/link";
import { notFound } from "next/navigation";
import { PageView } from "@/components/analytics/PageView";
import { Wordmark } from "@/components/brand/Wordmark";
import { DemoTriptych } from "@/components/landing/DemoTriptych";
import { FrameGlyph } from "@/components/ui/FrameGlyph";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { countByShape } from "@/lib/catalog";
import { guidesFor } from "@/lib/content/guides";
import type { FrameShape } from "@/lib/catalog/types";
import { getDictionary, isLocale, localePath } from "@/lib/i18n";

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

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const counts = countByShape();
  // Solo existen en español. En los demás idiomas la sección no se pinta, en
  // lugar de enlazar a páginas que no están traducidas.
  const guides = guidesFor(lang);
  const shapes = (Object.keys(dict.frames.shapes) as FrameShape[]).filter(
    (shape) => (counts[shape] ?? 0) > 0,
  );

  return (
    <div className="min-h-dvh">
      <PageView name="landing_view" props={{ locale: lang }} />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href={localePath(lang)} className="text-ink">
          <Wordmark className="h-5 w-auto sm:h-6" />
        </Link>
        <nav className="flex items-center gap-5 text-sm text-muted sm:gap-6">
          <a href="#catalogo" className="hidden hover:text-ink sm:inline">
            {dict.nav.styles}
          </a>
          <a href="#como-funciona" className="hidden hover:text-ink sm:inline">
            {dict.nav.howItWorks}
          </a>
          <LanguageSwitcher current={lang} label={dict.common.language} />
        </nav>
      </header>

      <main>
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden px-5 pt-6 pb-10 sm:px-8 sm:pt-10">
          {/* Atmósfera cálida detrás del titular. El fondo plano delata plantilla. */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-[-18rem] left-1/2 h-[34rem] w-[52rem] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, var(--accent-soft), transparent)",
            }}
          />

          {/*
            Dos columnas en pantalla ancha. Antes el titular ocupaba el alto
            entero y la demostración empezaba justo donde termina la ventana,
            así que lo primero que se veía era una frase y media imagen
            cortada. El producto es visual: lo que tiene que entrarse de una
            pasada es foto → gafas puestas, no el eslogan.
          */}
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-16">
            <div>
            <p
              className="rule-label reveal text-[0.7rem] text-accent"
              style={{ animationDelay: "60ms" }}
            >
              {dict.hero.eyebrow}
            </p>

            <h1
              className="reveal mt-4 max-w-2xl font-display text-[2.3rem] leading-[1.04] tracking-[-0.02em] text-balance sm:text-5xl lg:text-[3.4rem]"
              style={{ animationDelay: "140ms" }}
            >
              {dict.hero.title}{" "}
              <em className="text-accent not-italic">{dict.hero.titleAccent}</em>
            </h1>

            <p
              className="reveal mt-5 max-w-lg text-base leading-relaxed text-muted"
              style={{ animationDelay: "240ms" }}
            >
              {dict.hero.subtitle}
            </p>

            <div
              className="reveal mt-7 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "320ms" }}
            >
              <Link
                href={localePath(lang, "/probar")}
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

            </div>

            {/*
              La demostración, no la descripción. Es lo que el usuario
              recuerda de la página, y lo que pide §8.1. En ancho va al lado
              del titular; en móvil, justo debajo.
            */}
            <div className="mt-2 lg:mt-0">
              <DemoTriptych dict={dict} />
            </div>
          </div>
        </section>

        {/* ---------- Cómo funciona ---------- */}
        <section
          id="como-funciona"
          className="border-t border-line px-5 py-12 sm:px-8 sm:py-14"
        >
          <div className="mx-auto max-w-6xl">
            <p className="rule-label text-[0.7rem] text-muted">
              {dict.steps.label}
            </p>
            <ol className="mt-7 grid gap-7 sm:grid-cols-3 sm:gap-8">
              {dict.steps.items.map((step, i) => (
                <li key={step.title} className="border-t border-line pt-4">
                  <span className="rule-label block text-[0.7rem] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-2 font-display text-xl tracking-tight sm:text-2xl">
                    {step.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
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
          className="border-t border-line bg-surface px-5 py-14 sm:px-8 sm:py-16"
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

        {/* ---------- Guías ---------- */}
        {guides.length > 0 && (
          <section className="border-t border-line px-5 py-20 sm:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="rule-label text-[0.7rem] text-muted">Guías</p>
                <Link
                  href={localePath(lang, "/guias")}
                  className="text-xs text-muted hover:text-ink"
                >
                  Ver todas
                </Link>
              </div>
              <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
                {guides.map((guide) => (
                  <li key={guide.slug}>
                    <Link
                      href={localePath(lang, `/guias/${guide.slug}`)}
                      className="group flex h-full flex-col gap-2 bg-surface px-5 py-6 transition-colors hover:bg-paper"
                    >
                      <h3 className="font-display text-xl leading-tight tracking-tight transition-colors group-hover:text-accent">
                        {guide.breadcrumb}
                      </h3>
                      <p className="text-xs leading-relaxed text-muted">
                        {guide.description}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ---------- Privacidad ---------- */}
        <section className="border-t border-line px-5 py-14 sm:px-8 sm:py-16">
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
                href={localePath(lang, "/legal/privacy")}
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
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
            <Link href={localePath(lang, "/precios")} className="hover:text-ink">
              {dict.footer.pricing}
            </Link>
            <Link
              href={localePath(lang, "/legal/privacy")}
              className="hover:text-ink"
            >
              {dict.footer.privacy}
            </Link>
            <Link
              href={localePath(lang, "/legal/terms")}
              className="hover:text-ink"
            >
              {dict.footer.terms}
            </Link>
            <Link
              href={localePath(lang, "/legal/refunds")}
              className="hover:text-ink"
            >
              {dict.footer.refunds}
            </Link>
            <Link
              href={localePath(lang, "/legal/cookies")}
              className="hover:text-ink"
            >
              {dict.footer.cookies}
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
