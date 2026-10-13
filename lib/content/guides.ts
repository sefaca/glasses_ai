import type { Locale } from "../i18n";

/**
 * Registro de guías.
 *
 * Los metadatos viven aquí y el cuerpo en su propia página, porque una tabla
 * de medidas con notas al pie es ilegible como estructura de datos. Lo que sí
 * está aquí es lo que **tiene que coincidir en dos sitios**: las preguntas
 * frecuentes alimentan a la vez el HTML visible y el `FAQPage` del schema. Si
 * vivieran por separado divergirían, y un `FAQPage` que no coincide con lo
 * visible es exactamente lo que Google trata como marcado engañoso.
 *
 * `locale` es un campo y no una suposición: estas guías existen **solo en
 * español**. Mientras no las lea un revisor nativo, no se traducen, no llevan
 * `hreflang` y no entran en el sitemap de los otros idiomas
 * → docs/GROWTH_SEO.md, gate E-06.
 */

export interface Faq {
  question: string;
  answer: string;
}

export interface Guide {
  slug: string;
  /** Idiomas en los que esta guía existe de verdad. */
  locales: readonly Locale[];
  title: string;
  description: string;
  h1: string;
  /** Nombre corto para la miga de pan. */
  breadcrumb: string;
  /**
   * Fecha en la que se comprobaron los datos externos. No es la de
   * publicación: lo que le importa a quien lee una tabla de medidas es
   * cuándo se miró, no cuándo se escribió.
   */
  checkedOn: string;
  faqs: readonly Faq[];
}

export const GUIDES_INDEX = {
  title: "Guías",
  description:
    "Medidas, tallas y cómo comparar monturas. Con las fuentes a la vista y las discrepancias señaladas.",
} as const;

export const GUIDES: readonly Guide[] = [
  {
    slug: "tallas-ray-ban",
    locales: ["es"],
    title: "Tallas Ray-Ban: medidas de Aviator, Wayfarer y más",
    description:
      "Calibre, puente y varilla de seis modelos Ray-Ban en una tabla, con las fuentes que no coinciden señaladas, y cómo comparar con tus gafas actuales.",
    h1: "Tallas Ray-Ban: medidas de Aviator, Wayfarer, Clubmaster, Round Metal y Justin",
    breadcrumb: "Tallas Ray-Ban",
    checkedOn: "2026-10-13",
    faqs: [
      {
        question: "¿Dónde veo la talla de unas Ray-Ban?",
        answer:
          "Impresa en la cara interior de una varilla, normalmente la izquierda, en forma de tres números como 50□22 150.",
      },
      {
        question: "¿Qué significa 50□22 150?",
        answer:
          "50 mm de ancho de lente, 22 mm de puente y 150 mm de varilla.",
      },
      {
        question: "¿Qué talla de Ray-Ban Aviator es la estándar?",
        answer:
          "Las fuentes que hemos consultado describen la 58 como la talla media. La 55 es la pequeña y la 62 la grande. En las tres el puente es de 14 mm.",
      },
      {
        question: "¿Wayfarer de 50 o de 54?",
        answer:
          "Depende de cuánto te encaje de ancho lo que ya llevas. La 54 tiene un índice de anchura de 126 y la 50 de 122. Si tienes unas gafas cómodas, compara con su calibre y su puente.",
      },
      {
        question: "¿Una talla 55 de Ray-Ban es igual en todos los modelos?",
        answer:
          "No. Con calibre 55, el índice de anchura va de 124 en la Aviator a 131 en la Clubmaster, porque el puente va de 14 a 21 mm.",
      },
      {
        question: "¿Puedo saber mi talla con una foto?",
        answer:
          "No en milímetros. Con tu foto estimamos las proporciones de tu rostro y te decimos si una montura se te queda ancha, estrecha o equilibrada. Para un número exacto, mide unas gafas que ya te queden bien.",
      },
    ],
  },
  {
    slug: "ray-ban-wayfarer-vs-new-wayfarer",
    locales: ["es"],
    title: "Wayfarer RB2140 vs New Wayfarer RB2132: medidas",
    description:
      "RB2140 frente a RB2132: tallas, puente, varilla y altura de lente en una tabla, y qué talla de una equivale a la otra. Con las fuentes que discrepan.",
    h1: "Wayfarer (RB2140) o New Wayfarer (RB2132): diferencias de medidas y de ajuste",
    breadcrumb: "Wayfarer vs New Wayfarer",
    checkedOn: "2026-10-13",
    faqs: [
      {
        question: "¿Cuál es más grande, la Wayfarer o la New Wayfarer?",
        answer:
          "Depende de la talla. A igual índice de anchura son equivalentes: la 50 y la 52 empatan en 122. La New llega más lejos porque tiene la 58, con índice 134, y la Original tiene la lente más alta en las tallas pequeñas.",
      },
      {
        question: "¿Qué talla de New Wayfarer equivale a una Wayfarer 50?",
        answer:
          "La 52, por índice de anchura. El puente cambia, 18 frente a 22, y también la altura de lente.",
      },
      {
        question: "¿La New Wayfarer es más cómoda?",
        answer:
          "Varias tiendas lo dicen, y lo atribuyen a su menor inclinación. Es una afirmación de vendedores y no una medida. Comprueba el puente y la varilla frente a tus gafas actuales.",
      },
      {
        question: "¿De qué material son?",
        answer:
          "Las fuentes no se ponen de acuerdo en la New Wayfarer: unas dicen acetato y otra nailon. Está pendiente de comprobar en la ficha oficial.",
      },
    ],
  },
  {
    slug: "probar-gafas-online",
    locales: ["es"],
    title: "Probar gafas online: qué muestra cada probador",
    description:
      "Probadores 3D, imágenes con IA y esquemas a escala: qué te asegura cada tipo sobre el ajuste y sobre el parecido con la montura real.",
    h1: "Probar gafas online: qué garantiza cada tipo de probador y qué no",
    breadcrumb: "Probar gafas online",
    checkedOn: "2026-10-13",
    faqs: [
      {
        question: "¿Es fiable probarse gafas online?",
        answer:
          "Depende de qué esperes. Un probador 3D con la montura digitalizada es fiable para ver cómo asienta. Una lectura de proporción es fiable para saber si es ancha o estrecha. Una imagen generada con IA no lo es para saber si es esa montura.",
      },
      {
        question: "¿Sirve para saber mi talla?",
        answer:
          "Una lectura de proporción orienta sobre la anchura, pero no sustituye a medir unas gafas que ya te queden bien: mira los tres números de tu varilla y compáralos con los del modelo.",
      },
      {
        question: "¿Puedo probarme unas gafas concretas con una foto mía?",
        answer:
          "Puedes saber si su anchura encaja con tus proporciones. Si un probador te enseña una imagen realista de esa montura puesta, pregúntate cómo la ha obtenido y si lo declara.",
      },
      {
        question: "¿Qué pasa con mi foto?",
        answer:
          "El análisis de proporciones se hace en tu navegador y la foto no sale de tu dispositivo para eso. Si pides una imagen generada, sí se envía a un servidor. En otros probadores varía: mira su política de privacidad.",
      },
    ],
  },
];

export function findGuide(slug: string): Guide | null {
  return GUIDES.find((guide) => guide.slug === slug) ?? null;
}

/** Guías que existen en un idioma. Vacío en los cuatro sin traducción. */
export function guidesFor(locale: Locale): Guide[] {
  return GUIDES.filter((guide) => guide.locales.includes(locale));
}
