import type { FrameShape } from "../catalog/types";
import { LOCALES, type Locale } from "../i18n";

/**
 * Rutas de catálogo con **slug traducido de verdad**, no el español con otra
 * etiqueta.
 *
 * Importa porque una página alemana que vive en `/de/gafas-de-sol/aviador` no
 * compite por nada: quien busca en Alemania escribe «Pilotenbrillen», no
 * «aviador». El segmento y el término son parte del contenido, no decoración.
 *
 * Las dos secciones se sirven desde la misma ruta dinámica
 * `[section]/[item]`, así que los slugs **no pueden colisionar dentro de un
 * idioma**. Hay un test que lo comprueba: una colisión silenciosa haría que
 * una de las dos páginas dejara de existir.
 */

export type SectionKind = "sunglasses" | "brands";

/** Slug de cada sección por idioma. */
export const SECTION_SLUGS: Record<SectionKind, Record<Locale, string>> = {
  sunglasses: {
    es: "gafas-de-sol",
    en: "sunglasses",
    it: "occhiali-da-sole",
    pt: "oculos-de-sol",
    de: "sonnenbrillen",
  },
  brands: {
    es: "marcas",
    en: "brands",
    it: "marche",
    pt: "marcas",
    de: "marken",
  },
};

/**
 * Slug de cada forma por idioma.
 *
 * En alemán la forma aviador se busca como «Pilotenbrillen» y la cat-eye como
 * «Schmetterlingsbrillen»: son los términos del mercado, no traducciones
 * literales. En italiano, en cambio, «aviator» se usa en inglés.
 */
export const SHAPE_SLUGS: Record<FrameShape, Record<Locale, string>> = {
  rectangular: {
    es: "rectangulares",
    en: "rectangular",
    it: "rettangolari",
    pt: "retangulares",
    de: "rechteckige",
  },
  square: {
    es: "cuadradas",
    en: "square",
    it: "squadrati",
    pt: "quadrados",
    de: "eckige",
  },
  round: {
    es: "redondas",
    en: "round",
    it: "rotondi",
    pt: "redondos",
    de: "runde",
  },
  oval: {
    es: "ovaladas",
    en: "oval",
    it: "ovali",
    pt: "ovais",
    de: "ovale",
  },
  aviator: {
    es: "aviador",
    en: "aviator",
    it: "aviator",
    pt: "aviador",
    de: "pilotenbrillen",
  },
  "cat-eye": {
    es: "cat-eye",
    en: "cat-eye",
    it: "cat-eye",
    pt: "gatinho",
    de: "schmetterlingsbrillen",
  },
  wayfarer: {
    es: "wayfarer",
    en: "wayfarer",
    it: "wayfarer",
    pt: "wayfarer",
    de: "wayfarer",
  },
  geometric: {
    es: "geometricas",
    en: "geometric",
    it: "geometrici",
    pt: "geometricos",
    de: "geometrische",
  },
  oversized: {
    es: "oversized",
    en: "oversized",
    it: "oversize",
    pt: "oversized",
    de: "oversize",
  },
};

export function sectionSlug(kind: SectionKind, locale: Locale): string {
  return SECTION_SLUGS[kind][locale];
}

/** Qué sección es un slug, o `null` si no es ninguna. */
export function sectionFromSlug(
  slug: string,
  locale: Locale,
): SectionKind | null {
  for (const kind of Object.keys(SECTION_SLUGS) as SectionKind[]) {
    if (SECTION_SLUGS[kind][locale] === slug) return kind;
  }
  return null;
}

export function shapeSlug(shape: FrameShape, locale: Locale): string {
  return SHAPE_SLUGS[shape][locale];
}

export function shapeFromSlug(slug: string, locale: Locale): FrameShape | null {
  for (const shape of Object.keys(SHAPE_SLUGS) as FrameShape[]) {
    if (SHAPE_SLUGS[shape][locale] === slug) return shape;
  }
  return null;
}

/** Ruta sin prefijo de idioma de una página de forma. */
export function shapePath(shape: FrameShape, locale: Locale): string {
  return `/${sectionSlug("sunglasses", locale)}/${shapeSlug(shape, locale)}`;
}

/** Ruta sin prefijo de idioma de una página de marca. */
export function brandPath(brandSlug: string, locale: Locale): string {
  return `/${sectionSlug("brands", locale)}/${brandSlug}`;
}

/** Todos los idiomas, para generar parámetros estáticos. */
export const CONTENT_LOCALES = LOCALES;
