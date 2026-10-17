import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FrameGlyph } from "@/components/ui/FrameGlyph";
import { sellablePacks } from "@/lib/billing/packs";
import { format, getDictionary, isLocale, localePath } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/i18n/metadata";

/**
 * Precios, en público.
 *
 * No es el muro que sale al agotar el cupo: aquel aparece dentro del flujo y
 * solo a quien ya ha probado. Esta se puede leer y enlazar sin haber subido
 * ninguna foto, que es lo que pide una pasarela para verificar una cuenta y
 * lo que espera cualquiera que quiera saber el precio antes de empezar.
 *
 * El slug es `/precios` en los cinco idiomas, igual que `/probar`. Hoy solo
 * el español es indexable, así que un slug traducido no cambiaría nada; se
 * localizará cuando se abra otro idioma al índice.
 *
 * **Las cifras son de referencia.** La que se cobra la decide Paddle por el
 * país de quien paga, y así se dice en la nota.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);

  return localizedMetadata(lang, "/precios", {
    title: dict.pricing.title,
    description: dict.pricing.intro,
  });
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const copy = dict.pricing;
  const packs = sellablePacks();
  const currency = lang === "en" ? "usd" : "eur";

  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6 sm:px-8">
        <Link
          href={localePath(lang)}
          aria-label={dict.common.home}
          className="text-accent"
        >
          <FrameGlyph shape="round" thickness={0.3} className="h-6 w-auto" />
        </Link>
        <Link
          href={localePath(lang)}
          className="text-sm text-muted hover:text-ink"
        >
          {dict.common.back}
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
        <h1 className="font-display text-4xl leading-tight tracking-tight">
          {copy.title}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          {copy.intro}
        </p>

        {/* Lo gratuito primero: es por donde entra todo el mundo. */}
        <section className="mt-10 rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-display text-2xl tracking-tight">
            {copy.free.title}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            {copy.free.body}
          </p>
          <Link
            href={localePath(lang, "/probar")}
            className="mt-5 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent transition-transform active:translate-y-px"
          >
            {copy.cta}
          </Link>
        </section>

        <h2 className="mt-14 font-display text-2xl tracking-tight">
          {copy.packsTitle}
        </h2>

        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {packs.map((pack) => (
            <li
              key={pack.id}
              className={`rounded-2xl border p-5 ${
                pack.featured ? "border-accent bg-accent/5" : "border-line"
              }`}
            >
              <p className="font-display text-3xl tracking-tight">
                {pack.display[currency]}
              </p>
              <p className="mt-1 text-sm text-muted">
                {format(copy.generations, { count: pack.generations })}
              </p>
              {pack.featured && (
                <p className="mt-3 text-[0.7rem] text-accent">{copy.best}</p>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs leading-relaxed text-muted">{copy.note}</p>

        <ul className="mt-10 space-y-2 text-sm leading-relaxed text-muted">
          {copy.points.map((point) => (
            <li key={point} className="flex gap-3">
              <span aria-hidden className="text-accent">
                —
              </span>
              {point}
            </li>
          ))}
        </ul>

        <Link
          href={localePath(lang, "/legal/refunds")}
          className="mt-8 inline-block border-b border-accent pb-0.5 text-sm text-accent"
        >
          {copy.refunds}
        </Link>
      </main>
    </div>
  );
}
