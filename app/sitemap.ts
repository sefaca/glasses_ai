import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { brandsWithFrames, countByShape } from "@/lib/catalog";
import type { FrameShape } from "@/lib/catalog/types";
import { GUIDES } from "@/lib/content/guides";
import { brandPath, sectionSlug, shapePath } from "@/lib/content/sections";
import {
  INDEXABLE_LOCALES,
  LOCALES,
  LOCALE_HREFLANG,
  localePath,
  xDefaultLocale,
  type Locale,
} from "@/lib/i18n";

/**
 * Sitemap de las páginas indexables, con sus alternativas por idioma.
 *
 * **Solo entra lo que es indexable.** Hoy el sitio entero está en `noindex`,
 * así que este sitemap existe para que la fontanería esté montada y se pueda
 * verificar, no para enviarlo a Search Console: anunciar URLs que dicen
 * `noindex` es mandar una señal contradictoria. Se envía en el gate G0
 * → docs/GROWTH_SEO.md §4.
 *
 * **Cada ruta declara en qué idiomas existe de verdad.** Sin eso, las guías
 * —que solo están en español— se anunciarían como `/de/guias/...`, que da 404,
 * y el `hreflang` apuntaría a páginas inexistentes. Es justo la señal
 * contradictoria que este fichero dice evitar, y por eso `locales` no es
 * opcional.
 *
 * `/probar` no está, y es a propósito: su contenido lo pinta el cliente y no
 * hay nada que indexar.
 */

interface SitemapRoute {
  path: string;
  priority: number;
  locales: readonly Locale[];
}

/**
 * Las páginas de catálogo existen en los cinco idiomas, **con el slug de cada
 * uno**: `/de/sonnenbrillen/pilotenbrillen`, no la ruta española traducida a
 * medias. Por eso se emiten por idioma en lugar de con una ruta común.
 */
function catalogRoutes(): SitemapRoute[] {
  const counts = countByShape();
  const shapes = (Object.keys(counts) as FrameShape[]).filter(
    (shape) => (counts[shape] ?? 0) > 0,
  );
  const brands = brandsWithFrames();
  const routes: SitemapRoute[] = [];

  for (const locale of LOCALES) {
    routes.push(
      { path: `/${sectionSlug("sunglasses", locale)}`, priority: 0.7, locales: [locale] },
      { path: `/${sectionSlug("brands", locale)}`, priority: 0.6, locales: [locale] },
    );
    for (const shape of shapes) {
      routes.push({ path: shapePath(shape, locale), priority: 0.8, locales: [locale] });
    }
    for (const brand of brands) {
      routes.push({ path: brandPath(brand.slug, locale), priority: 0.6, locales: [locale] });
    }
  }
  return routes;
}

const ROUTES: SitemapRoute[] = [
  { path: "/", priority: 1, locales: LOCALES },
  { path: "/precios", priority: 0.5, locales: LOCALES },
  { path: "/legal/privacy", priority: 0.3, locales: LOCALES },
  { path: "/legal/terms", priority: 0.3, locales: LOCALES },
  { path: "/legal/cookies", priority: 0.3, locales: LOCALES },
  { path: "/legal/refunds", priority: 0.3, locales: LOCALES },
  { path: "/guias", priority: 0.6, locales: ["es"] },
  ...GUIDES.map((guide) => ({
    path: `/guias/${guide.slug}`,
    priority: 0.8,
    locales: guide.locales,
  })),
  ...catalogRoutes(),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap(({ path, priority, locales: declared }) => {
    // Doble filtro: el idioma tiene que existir para esa ruta **y** estar
    // abierto. Hoy no hay ninguno abierto, así que el sitemap sale vacío, y
    // eso es lo correcto: anunciar una URL que dice `noindex` es pedirle a
    // Google que decida cuál de las dos señales le creemos.
    const locales = declared.filter((locale) =>
      INDEXABLE_LOCALES.includes(locale),
    );
    if (locales.length === 0) return [];
    // Una página que existe en un solo idioma no lleva alternativas: hreflang
    // con una sola entrada no dice nada y apuntar a traducciones que no están
    // es peor que callarse.
    const languages: Record<string, string> | undefined =
      locales.length > 1
        ? {
            ...Object.fromEntries(
              locales.map((locale) => [
                LOCALE_HREFLANG[locale],
                absoluteUrl(localePath(locale, path)),
              ]),
            ),
            "x-default": absoluteUrl(localePath(xDefaultLocale(), path)),
          }
        : undefined;

    return locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      priority,
      ...(languages ? { alternates: { languages } } : {}),
    }));
  });
}
