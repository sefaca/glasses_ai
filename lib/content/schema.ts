import { absoluteUrl } from "../site";
import { localePath, type Locale } from "../i18n";
import type { Guide } from "./guides";

/**
 * JSON-LD de una guía.
 *
 * Tres decisiones que conviene no deshacer:
 *
 * - **Ni `Product` ni `Offer`.** Sin precio ni retailer no hay oferta, y
 *   marcar un producto sin `offers` es marcado inválido → D-019.
 * - **`author` es la organización, no una persona.** Inventar una firma sería
 *   exactamente lo que Google llama contenido engañoso. Cuando se decida quién
 *   firma, esto pasa a `Person` con su perfil.
 * - **Las FAQ salen del mismo array que la página.** Un `FAQPage` que no
 *   coincide con lo visible es marcado engañoso, y la única forma segura de
 *   que coincidan es que haya una sola fuente.
 */
export function guideSchema(guide: Guide, locale: Locale) {
  const url = absoluteUrl(localePath(locale, `/guias/${guide.slug}`));
  const organization = {
    "@type": "Organization",
    name: "lookfit",
    url: absoluteUrl(localePath(locale)),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: guide.h1,
        description: guide.description,
        inLanguage: locale,
        mainEntityOfPage: url,
        dateModified: guide.checkedOn,
        author: organization,
        publisher: organization,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Inicio",
            item: absoluteUrl(localePath(locale)),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Guías",
            item: absoluteUrl(localePath(locale, "/guias")),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: guide.breadcrumb,
            item: url,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: guide.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}
