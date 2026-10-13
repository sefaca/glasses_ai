import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogLayout } from "@/components/content/CatalogLayout";
import { FrameGlyph } from "@/components/ui/FrameGlyph";
import { brandsWithFrames, countByShape, framesOfBrand } from "@/lib/catalog";
import type { FrameShape } from "@/lib/catalog/types";
import { catalogCopy } from "@/lib/content/catalog-copy";
import { shapeCopy } from "@/lib/content/shape-copy";
import {
  CONTENT_LOCALES,
  SECTION_SLUGS,
  brandPath,
  sectionFromSlug,
  sectionSlug,
  shapePath,
} from "@/lib/content/sections";
import { format, getDictionary, isLocale, localePath } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/i18n/metadata";

/**
 * Los dos hubs de catálogo: formas y marcas.
 *
 * Comparten ruta porque comparten estructura —una rejilla de enlaces con su
 * recuento— y separarlos en dos archivos duplicaría el andamiaje. Lo que
 * cambia es la sección, que se despacha por el slug.
 *
 * Los slugs están traducidos de verdad: `/de/sonnenbrillen`, no
 * `/de/gafas-de-sol`. Un segmento en español dentro de una página alemana no
 * compite por nada.
 */

export function generateStaticParams() {
  return CONTENT_LOCALES.flatMap((lang) =>
    (Object.keys(SECTION_SLUGS) as Array<keyof typeof SECTION_SLUGS>).map(
      (kind) => ({ lang, section: SECTION_SLUGS[kind][lang] }),
    ),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; section: string }>;
}): Promise<Metadata> {
  const { lang, section } = await params;
  if (!isLocale(lang)) return {};
  const kind = sectionFromSlug(section, lang);
  if (!kind) return {};

  const copy = catalogCopy(lang);
  const page = kind === "sunglasses" ? copy.sunglassesHub : copy.brandsHub;

  return localizedMetadata(lang, `/${section}`, {
    title: page.title,
    description: page.description,
  });
}

export default async function SectionHubPage({
  params,
}: {
  params: Promise<{ lang: string; section: string }>;
}) {
  const { lang, section } = await params;
  if (!isLocale(lang)) notFound();
  const kind = sectionFromSlug(section, lang);
  if (!kind) notFound();

  const dict = getDictionary(lang);
  const copy = catalogCopy(lang);

  if (kind === "sunglasses") {
    const counts = countByShape();
    const shapes = (Object.keys(dict.frames.shapes) as FrameShape[]).filter(
      (shape) => (counts[shape] ?? 0) > 0,
    );

    return (
      <CatalogLayout
        lang={lang}
        crumbs={[{ label: copy.shapesLabel }]}
        title={copy.sunglassesHub.title}
        intro={copy.sunglassesHub.intro}
      >
        <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {shapes.map((shape) => {
            const count = counts[shape] ?? 0;
            return (
              <li key={shape}>
                <Link
                  href={localePath(lang, shapePath(shape, lang))}
                  className="group flex h-full items-start gap-5 bg-surface px-5 py-6 transition-colors hover:bg-paper"
                >
                  <FrameGlyph
                    shape={shape}
                    thickness={0.45}
                    className="mt-1 w-16 shrink-0 text-ink transition-colors group-hover:text-accent"
                  />
                  <div className="min-w-0">
                    <h2 className="font-display text-xl leading-tight tracking-tight transition-colors group-hover:text-accent">
                      {dict.frames.shapes[shape]}
                    </h2>
                    <p className="mt-1 text-[0.7rem] text-muted tabular-nums">
                      {count === 1
                        ? copy.frameCountOne
                        : format(copy.frameCount, { count })}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      {shapeCopy(lang, shape).intro}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <h2>{copy.brandsLabel}</h2>
        <p>
          <Link href={localePath(lang, `/${sectionSlug("brands", lang)}`)}>
            {copy.brandsHub.title}
          </Link>
        </p>
      </CatalogLayout>
    );
  }

  const brands = brandsWithFrames();

  return (
    <CatalogLayout
      lang={lang}
      crumbs={[{ label: copy.brandsLabel }]}
      title={copy.brandsHub.title}
      intro={copy.brandsHub.intro}
    >
      <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => {
          const count = framesOfBrand(brand.id).length;
          return (
            <li key={brand.id}>
              <Link
                href={localePath(lang, brandPath(brand.slug, lang))}
                className="group flex h-full flex-col gap-1 bg-surface px-5 py-5 transition-colors hover:bg-paper"
              >
                <h2 className="font-display text-xl leading-tight tracking-tight transition-colors group-hover:text-accent">
                  {brand.name}
                </h2>
                <p className="text-[0.7rem] text-muted tabular-nums">
                  {count === 1
                    ? copy.frameCountOne
                    : format(copy.frameCount, { count })}
                  <span className="mx-1.5">·</span>
                  {brand.country}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      <h2>{copy.shapesLabel}</h2>
      <p>
        <Link href={localePath(lang, `/${sectionSlug("sunglasses", lang)}`)}>
          {copy.sunglassesHub.title}
        </Link>
      </p>
    </CatalogLayout>
  );
}
