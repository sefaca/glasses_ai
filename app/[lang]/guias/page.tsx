import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FrameGlyph } from "@/components/ui/FrameGlyph";
import { GUIDES_INDEX, guidesFor } from "@/lib/content/guides";
import { getDictionary, isLocale, localePath } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/i18n/metadata";

/**
 * Índice de guías.
 *
 * Existe porque la miga de pan de cada guía lo enlaza, y un nivel de
 * breadcrumb que apunta a un 404 es peor que no tenerlo. Es una lista honesta
 * de lo que hay: ni texto de relleno para que «parezca una sección», ni
 * categorías vacías esperando contenido futuro.
 */

export function generateStaticParams() {
  return [{ lang: "es" }];
}

/*
 * No se declara `dynamicParams`: con `cacheComponents` Next no lo admite. El
 * filtro por idioma lo hace `notFound()` cuando la guía no existe en esa
 * lengua, que además es la comprobación correcta: depende del contenido, no
 * de la configuración de la ruta.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  return {
    ...localizedMetadata(lang, "/guias", {
      title: GUIDES_INDEX.title,
      description: GUIDES_INDEX.description,
    }),
    alternates: { canonical: localePath(lang, "/guias") },
  };
}

export default async function GuiasIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const guides = guidesFor(lang);
  if (guides.length === 0) notFound();

  const dict = getDictionary(lang);

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
          href={localePath(lang, "/probar")}
          className="rounded-full border border-ink px-5 py-2 text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
        >
          {dict.hero.ctaPrimary}
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
        <h1 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">
          {GUIDES_INDEX.title}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          {GUIDES_INDEX.description}
        </p>

        <ul className="mt-12">
          {guides.map((guide) => (
            <li key={guide.slug} className="border-t border-line">
              <Link
                href={localePath(lang, `/guias/${guide.slug}`)}
                className="group block py-7"
              >
                <h2 className="font-display text-2xl leading-tight tracking-tight transition-colors group-hover:text-accent sm:text-[1.75rem]">
                  {guide.h1}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                  {guide.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
