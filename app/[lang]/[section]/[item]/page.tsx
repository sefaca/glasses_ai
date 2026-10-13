import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogLayout } from "@/components/content/CatalogLayout";
import { FrameGlyph } from "@/components/ui/FrameGlyph";
import {
  brandsWithFrames,
  countByShape,
  framesOfBrand,
  listableFrames,
} from "@/lib/catalog";
import type { Brand } from "@/lib/catalog/brands";
import type { FrameProfile, FrameShape } from "@/lib/catalog/types";
import { frameFrontWidthMm } from "@/lib/catalog/types";
import { catalogCopy } from "@/lib/content/catalog-copy";
import { SHAPE_META, shapeCopy, shapePageName } from "@/lib/content/shape-copy";
import {
  CONTENT_LOCALES,
  SECTION_SLUGS,
  brandPath,
  sectionFromSlug,
  shapeFromSlug,
  shapePath,
  shapeSlug,
} from "@/lib/content/sections";
import { absoluteUrl } from "@/lib/site";
import {
  format,
  getDictionary,
  isLocale,
  localePath,
  type Locale,
} from "@/lib/i18n";
import { localizedMetadata } from "@/lib/i18n/metadata";

/**
 * Página de forma o de marca, según la sección.
 *
 * Ninguna de las dos es una plantilla rellenada con un nombre distinto:
 *
 * - La de **forma** lleva su propio texto editorial (`shape-copy`), escrito
 *   forma a forma en los cinco idiomas, más la lista real de monturas de esa
 *   forma ordenadas por anchura cuando se conoce.
 * - La de **marca** se compone con hechos —grupo propietario, país, segmento,
 *   qué formas hace— que difieren de verdad entre marcas. Mykita y Hawkers no
 *   se parecen porque sus datos no se parecen.
 *
 * Lo que ninguna dice: que seamos socios de nadie → D-021. Y ninguna muestra
 * precios → D-019.
 */

export function generateStaticParams() {
  return CONTENT_LOCALES.flatMap((lang) => {
    const counts = countByShape();
    const shapes = (Object.keys(counts) as FrameShape[])
      .filter((shape) => (counts[shape] ?? 0) > 0)
      .map((shape) => ({
        lang,
        section: SECTION_SLUGS.sunglasses[lang],
        item: shapeSlug(shape, lang),
      }));

    const brands = brandsWithFrames().map((brand) => ({
      lang,
      section: SECTION_SLUGS.brands[lang],
      item: brand.slug,
    }));

    return [...shapes, ...brands];
  });
}

/** Resuelve el par sección+item a lo que toque, o `null` si no existe. */
function resolve(lang: Locale, section: string, item: string) {
  const kind = sectionFromSlug(section, lang);
  if (kind === "sunglasses") {
    const shape = shapeFromSlug(item, lang);
    return shape ? ({ kind, shape } as const) : null;
  }
  if (kind === "brands") {
    const brand = brandsWithFrames().find((b) => b.slug === item);
    return brand ? ({ kind, brand } as const) : null;
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; section: string; item: string }>;
}): Promise<Metadata> {
  const { lang, section, item } = await params;
  if (!isLocale(lang)) return {};
  const target = resolve(lang, section, item);
  if (!target) return {};

  const copy = catalogCopy(lang);
  const path = `/${section}/${item}`;

  if (target.kind === "sunglasses") {
    const name = shapePageName(lang, target.shape);
    return localizedMetadata(lang, path, {
      title: format(SHAPE_META[lang].title, { shape: name }),
      description: format(SHAPE_META[lang].description, { shape: name }),
    });
  }

  return localizedMetadata(lang, path, {
    title: format(copy.brand.title, { brand: target.brand.name }),
    description: format(copy.brand.description, { brand: target.brand.name }),
  });
}

export default async function CatalogItemPage({
  params,
}: {
  params: Promise<{ lang: string; section: string; item: string }>;
}) {
  const { lang, section, item } = await params;
  if (!isLocale(lang)) notFound();
  const target = resolve(lang, section, item);
  if (!target) notFound();

  return target.kind === "sunglasses" ? (
    <ShapePage lang={lang} shape={target.shape} section={section} />
  ) : (
    <BrandPage lang={lang} brand={target.brand} section={section} />
  );
}

/* ---------------------------------------------------------------- forma -- */

function ShapePage({
  lang,
  shape,
  section,
}: {
  lang: Locale;
  shape: FrameShape;
  section: string;
}) {
  const dict = getDictionary(lang);
  const copy = catalogCopy(lang);
  const text = shapeCopy(lang, shape);
  const name = dict.frames.shapes[shape];

  const frames = sortByWidth(
    listableFrames().filter((frame) => frame.shape === shape),
  );
  const counts = countByShape();
  const others = (Object.keys(dict.frames.shapes) as FrameShape[]).filter(
    (other) => other !== shape && (counts[other] ?? 0) > 0,
  );

  return (
    <CatalogLayout
      lang={lang}
      crumbs={[
        {
          label: copy.shapesLabel,
          href: localePath(lang, `/${section}`),
        },
        { label: name },
      ]}
      title={shapePageName(lang, shape)}
      intro={text.intro}
      schema={collectionSchema(
        lang,
        `/${section}/${shapeSlug(shape, lang)}`,
        frames,
      )}
    >
      <div className="mt-10 flex justify-center">
        <FrameGlyph
          shape={shape}
          thickness={0.45}
          className="w-44 text-accent"
          label={name}
        />
      </div>

      <h2>{copy.inCatalogue}</h2>
      <FrameList frames={frames} lang={lang} />
      <p className="text-xs">{copy.measurementsPending}</p>

      <h2>{copy.choosingLabel}</h2>
      <p>{text.choosing}</p>

      <h2>{copy.otherShapes}</h2>
      <ul>
        {others.map((other) => (
          <li key={other}>
            <Link href={localePath(lang, shapePath(other, lang))}>
              {dict.frames.shapes[other]}
            </Link>
          </li>
        ))}
      </ul>
    </CatalogLayout>
  );
}

/* ---------------------------------------------------------------- marca -- */

function BrandPage({
  lang,
  brand,
  section,
}: {
  lang: Locale;
  brand: Brand;
  section: string;
}) {
  const dict = getDictionary(lang);
  const copy = catalogCopy(lang);
  const frames = sortByWidth(framesOfBrand(brand.id));

  // Las formas que esta marca hace, por frecuencia. Es el hecho que más
  // diferencia una página de marca de otra.
  const byShape = new Map<FrameShape, number>();
  for (const frame of frames) {
    byShape.set(frame.shape, (byShape.get(frame.shape) ?? 0) + 1);
  }
  const topShapes = [...byShape.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([s]) => dict.frames.shapes[s].toLowerCase());

  const others = brandsWithFrames().filter((other) => other.id !== brand.id);

  const intro = [
    format(copy.brand.origin, { brand: brand.name, country: brand.country }),
    brand.group
      ? format(copy.brand.partOfGroup, { group: brand.group })
      : copy.brand.independent,
    frames.length === 1
      ? copy.brand.inOurCatalogueOne
      : format(copy.brand.inOurCatalogue, {
          count: frames.length,
          shapes: topShapes.join(` ${copy.and} `),
        }),
  ].join(" ");

  return (
    <CatalogLayout
      lang={lang}
      crumbs={[
        { label: copy.brandsLabel, href: localePath(lang, `/${section}`) },
        { label: brand.name },
      ]}
      title={format(copy.brand.title, { brand: brand.name })}
      intro={intro}
      schema={collectionSchema(lang, `/${section}/${brand.slug}`, frames)}
    >
      <h2>{copy.brand.tierLabel}</h2>
      <p>{copy.brand.tiers[brand.tier]}</p>

      <h2>{copy.inCatalogue}</h2>
      <FrameList frames={frames} lang={lang} />
      <p className="text-xs">{copy.measurementsPending}</p>

      <p className="text-xs">{copy.brand.noPartnership}</p>

      <h2>{copy.otherBrands}</h2>
      <ul>
        {others.map((other) => (
          <li key={other.id}>
            <Link href={localePath(lang, brandPath(other.slug, lang))}>
              {other.name}
            </Link>
          </li>
        ))}
      </ul>
    </CatalogLayout>
  );
}

/* --------------------------------------------------------------- comunes -- */

/** Las que tienen anchura conocida primero, de menor a mayor. */
function sortByWidth(frames: FrameProfile[]): FrameProfile[] {
  return [...frames].sort((a, b) => {
    const wa = frameFrontWidthMm(a);
    const wb = frameFrontWidthMm(b);
    if (wa === null && wb === null) return a.model.localeCompare(b.model);
    if (wa === null) return 1;
    if (wb === null) return -1;
    return wa - wb;
  });
}

function FrameList({
  frames,
  lang,
}: {
  frames: FrameProfile[];
  lang: Locale;
}) {
  const dict = getDictionary(lang);

  return (
    <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line not-prose sm:grid-cols-2">
      {frames.map((frame) => {
        const width = frameFrontWidthMm(frame);
        return (
          <li
            key={frame.id}
            className="flex items-start gap-4 bg-surface px-5 py-5"
          >
            <FrameGlyph
              shape={frame.shape}
              thickness={frame.thickness}
              className="mt-1 w-16 shrink-0 text-ink"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium">
                {frame.model}
                {frame.reference && (
                  <span className="ml-1.5 text-xs font-normal text-muted">
                    {frame.reference}
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {frame.brand}
                <span className="mx-1.5">·</span>
                {dict.frames.shapes[frame.shape]}
                <span className="mx-1.5">·</span>
                {frame.colorName}
              </p>
              {width !== null && (
                <p className="mt-1 text-[0.7rem] text-muted tabular-nums">
                  ≈ {Math.round(width)} mm
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * `CollectionPage` con la lista de monturas.
 *
 * **Sin `Product` y sin `Offer`**: no vendemos, no publicamos precios y no
 * tenemos retailer, así que marcar productos sería marcado inválido → D-019.
 * Lo que sí es cierto es que la página es una colección de elementos, y eso
 * es lo que se declara.
 */
function collectionSchema(lang: Locale, path: string, frames: FrameProfile[]) {
  const url = absoluteUrl(localePath(lang, path));

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#page`,
    url,
    inLanguage: lang,
    isPartOf: {
      "@type": "WebSite",
      name: "lookfit",
      url: absoluteUrl(localePath(lang)),
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: frames.length,
      itemListElement: frames.map((frame, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${frame.brand} ${frame.model}${
          frame.reference ? ` ${frame.reference}` : ""
        }`,
      })),
    },
  };
}
