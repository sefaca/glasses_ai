import type { Locale } from "../i18n";
import type { BrandTier } from "../catalog/brands";

/**
 * Textos de las páginas de catálogo: los dos hubs, las de forma y las de
 * marca.
 *
 * Las páginas de marca se **componen con hechos**, no con prosa escrita a
 * mano marca por marca: grupo propietario, país, segmento de precio y qué hay
 * de esa marca en el catálogo. Dos razones:
 *
 * 1. Son datos verificables. Escribir un párrafo de carácter para cada marca
 *    sería opinión nuestra disfrazada de información.
 * 2. Diferencian de verdad. Una página de Mykita y una de Hawkers no se
 *    parecen en nada porque los hechos no se parecen, no porque hayamos
 *    cambiado los adjetivos.
 *
 * Lo que **no** se dice en ninguna: que seamos socios de nadie, ni que una
 * marca sea mejor que otra → D-021.
 */

export interface CatalogCopy {
  sunglassesHub: { title: string; description: string; intro: string };
  brandsHub: { title: string; description: string; intro: string };
  /** Encabezados de sección reutilizados en varias páginas. */
  shapesLabel: string;
  brandsLabel: string;
  inCatalogue: string;
  /** Encabezado del apartado de talla. */
  choosingLabel: string;
  otherShapes: string;
  otherBrands: string;
  /** `{count}` monturas. */
  frameCount: string;
  frameCountOne: string;
  /** Ficha de marca, compuesta con hechos. */
  brand: {
    title: string;
    description: string;
    /** `{brand}`, `{country}`. */
    origin: string;
    /** `{brand}`, `{group}`. */
    partOfGroup: string;
    independent: string;
    /** `{count}`, `{shapes}`. */
    inOurCatalogue: string;
    /** Cuando solo hay una montura de esa marca. */
    inOurCatalogueOne: string;
    tierLabel: string;
    tiers: Record<BrandTier, string>;
    /** Aviso obligatorio: no somos socios de nadie. */
    noPartnership: string;
  };
  /** Aviso cuando el catálogo aún no tiene medidas verificadas. */
  measurementsPending: string;
  /** Enlace al flujo. */
  tryCta: string;
  /** Conjunción para enumerar formas: «wayfarer y aviador». */
  and: string;
}

export const CATALOG_COPY: Record<Locale, CatalogCopy> = {
  es: {
    sunglassesHub: {
      title: "Gafas de sol por forma de montura",
      description:
        "Las nueve formas de montura del catálogo, qué hace cada una y qué modelos de varias marcas tenemos de cada tipo.",
      intro:
        "La forma de la montura es lo primero que cambia el resultado en una cara, por encima del color y de la marca. Estas son las nueve que distinguimos, con lo que hace cada una y los modelos que tenemos.",
    },
    brandsHub: {
      title: "Marcas de gafas de sol",
      description:
        "Las marcas con monturas en nuestro catálogo: quién es su propietario, de dónde son y qué formas tienen.",
      intro:
        "Somos una capa independiente de descubrimiento: no vendemos, no somos ópticos y no tenemos acuerdo con ninguna de estas marcas. Las listamos porque sus monturas están en el catálogo.",
    },
    shapesLabel: "Formas",
    brandsLabel: "Marcas",
    inCatalogue: "En el catálogo",
    choosingLabel: "Cómo elegir la talla",
    otherShapes: "Otras formas",
    otherBrands: "Otras marcas",
    frameCount: "{count} monturas",
    frameCountOne: "1 montura",
    brand: {
      title: "{brand}: monturas y formas en catálogo",
      description:
        "Qué monturas de {brand} tenemos, de qué formas son y qué comprobar antes de elegir una talla.",
      origin: "{brand} es una marca de {country}.",
      partOfGroup: "Pertenece al grupo {group}.",
      independent: "Es independiente, sin grupo propietario.",
      inOurCatalogue:
        "Tenemos {count} monturas suyas en el catálogo, sobre todo {shapes}.",
      inOurCatalogueOne: "Tenemos una montura suya en el catálogo.",
      tierLabel: "Segmento de precio",
      tiers: {
        accessible: "Accesible",
        mid: "Medio",
        premium: "Premium",
        luxury: "Lujo",
      },
      noPartnership:
        "No tenemos ningún acuerdo con esta marca. La nombramos porque sus monturas están en el catálogo, que es uso descriptivo y no implica relación comercial.",
    },
    measurementsPending:
      "Las medidas de estas monturas están pendientes de verificar en la ficha oficial. Cuando una lo esté, lo diremos en su ficha.",
    tryCta: "Ver qué me encaja",
    and: "y",
  },

  en: {
    sunglassesHub: {
      title: "Sunglasses by frame shape",
      description:
        "The nine frame shapes in the catalogue, what each one does, and which models from several brands we have of each.",
      intro:
        "Frame shape changes the result on a face more than colour or brand does. These are the nine we distinguish, what each one does, and the models we have.",
    },
    brandsHub: {
      title: "Sunglasses brands",
      description:
        "The brands with frames in our catalogue: who owns them, where they are from, and which shapes they make.",
      intro:
        "We are an independent discovery layer: we don't sell, we aren't opticians, and we have no agreement with any of these brands. They are listed because their frames are in the catalogue.",
    },
    shapesLabel: "Shapes",
    brandsLabel: "Brands",
    inCatalogue: "In the catalogue",
    choosingLabel: "How to pick the size",
    otherShapes: "Other shapes",
    otherBrands: "Other brands",
    frameCount: "{count} frames",
    frameCountOne: "1 frame",
    brand: {
      title: "{brand}: frames and shapes in the catalogue",
      description:
        "Which {brand} frames we have, what shapes they are, and what to check before picking a size.",
      origin: "{brand} is a brand from {country}.",
      partOfGroup: "It belongs to the {group} group.",
      independent: "It is independent, with no parent group.",
      inOurCatalogue:
        "We have {count} of its frames in the catalogue, mostly {shapes}.",
      inOurCatalogueOne: "We have one of its frames in the catalogue.",
      tierLabel: "Price segment",
      tiers: {
        accessible: "Accessible",
        mid: "Mid-range",
        premium: "Premium",
        luxury: "Luxury",
      },
      noPartnership:
        "We have no agreement with this brand. We name it because its frames are in the catalogue, which is descriptive use and implies no commercial relationship.",
    },
    measurementsPending:
      "Measurements for these frames are pending verification against the official spec sheet. We'll say so on each one once it is verified.",
    tryCta: "See what fits me",
    and: "and",
  },

  it: {
    sunglassesHub: {
      title: "Occhiali da sole per forma della montatura",
      description:
        "Le nove forme di montatura del catalogo, cosa fa ciascuna e quali modelli di diverse marche abbiamo per ogni tipo.",
      intro:
        "La forma della montatura cambia il risultato su un viso più del colore e più della marca. Queste sono le nove che distinguiamo, cosa fa ciascuna e i modelli che abbiamo.",
    },
    brandsHub: {
      title: "Marche di occhiali da sole",
      description:
        "Le marche con montature nel nostro catalogo: chi le possiede, da dove vengono e quali forme producono.",
      intro:
        "Siamo un livello indipendente di scoperta: non vendiamo, non siamo ottici e non abbiamo accordi con nessuna di queste marche. Le elenchiamo perché le loro montature sono in catalogo.",
    },
    shapesLabel: "Forme",
    brandsLabel: "Marche",
    inCatalogue: "In catalogo",
    choosingLabel: "Come scegliere la taglia",
    otherShapes: "Altre forme",
    otherBrands: "Altre marche",
    frameCount: "{count} montature",
    frameCountOne: "1 montatura",
    brand: {
      title: "{brand}: montature e forme in catalogo",
      description:
        "Quali montature {brand} abbiamo, di che forma sono e cosa controllare prima di scegliere una taglia.",
      origin: "{brand} è una marca di {country}.",
      partOfGroup: "Appartiene al gruppo {group}.",
      independent: "È indipendente, senza gruppo proprietario.",
      inOurCatalogue:
        "Abbiamo {count} sue montature in catalogo, soprattutto {shapes}.",
      inOurCatalogueOne: "Abbiamo una sua montatura in catalogo.",
      tierLabel: "Fascia di prezzo",
      tiers: {
        accessible: "Accessibile",
        mid: "Media",
        premium: "Premium",
        luxury: "Lusso",
      },
      noPartnership:
        "Non abbiamo alcun accordo con questa marca. La nominiamo perché le sue montature sono in catalogo: è uso descrittivo e non implica alcun rapporto commerciale.",
    },
    measurementsPending:
      "Le misure di queste montature sono in attesa di verifica sulla scheda ufficiale. Quando una sarà verificata, lo diremo nella sua scheda.",
    tryCta: "Vedi cosa mi sta bene",
    and: "e",
  },

  pt: {
    sunglassesHub: {
      title: "Óculos de sol por formato de armação",
      description:
        "Os nove formatos de armação do catálogo, o que cada um faz e quais modelos de várias marcas temos de cada tipo.",
      intro:
        "O formato da armação muda o resultado num rosto mais do que a cor e mais do que a marca. Estes são os nove que distinguimos, o que cada um faz e os modelos que temos.",
    },
    brandsHub: {
      title: "Marcas de óculos de sol",
      description:
        "As marcas com armações no nosso catálogo: quem são os donos, de onde vêm e que formatos fazem.",
      intro:
        "Somos uma camada independente de descoberta: não vendemos, não somos ópticos e não temos acordo com nenhuma dessas marcas. Elas estão listadas porque as armações estão no catálogo.",
    },
    shapesLabel: "Formatos",
    brandsLabel: "Marcas",
    inCatalogue: "No catálogo",
    choosingLabel: "Como escolher o tamanho",
    otherShapes: "Outros formatos",
    otherBrands: "Outras marcas",
    frameCount: "{count} armações",
    frameCountOne: "1 armação",
    brand: {
      title: "{brand}: armações e formatos no catálogo",
      description:
        "Quais armações {brand} temos, de que formato são e o que conferir antes de escolher um tamanho.",
      origin: "{brand} é uma marca de {country}.",
      partOfGroup: "Pertence ao grupo {group}.",
      independent: "É independente, sem grupo proprietário.",
      inOurCatalogue:
        "Temos {count} armações dela no catálogo, sobretudo {shapes}.",
      inOurCatalogueOne: "Temos uma armação dela no catálogo.",
      tierLabel: "Faixa de preço",
      tiers: {
        accessible: "Acessível",
        mid: "Intermediária",
        premium: "Premium",
        luxury: "Luxo",
      },
      noPartnership:
        "Não temos nenhum acordo com esta marca. Nós a citamos porque as armações dela estão no catálogo, o que é uso descritivo e não implica relação comercial.",
    },
    measurementsPending:
      "As medidas destas armações estão pendentes de verificação na ficha oficial. Quando uma estiver verificada, diremos na ficha dela.",
    tryCta: "Ver o que combina comigo",
    and: "e",
  },

  de: {
    sunglassesHub: {
      title: "Sonnenbrillen nach Fassungsform",
      description:
        "Die neun Fassungsformen im Katalog, was jede bewirkt und welche Modelle verschiedener Marken wir von jeder haben.",
      intro:
        "Die Fassungsform verändert das Ergebnis im Gesicht stärker als Farbe oder Marke. Das sind die neun, die wir unterscheiden, was jede bewirkt und welche Modelle wir haben.",
    },
    brandsHub: {
      title: "Sonnenbrillenmarken",
      description:
        "Die Marken mit Fassungen in unserem Katalog: wem sie gehören, woher sie kommen und welche Formen sie machen.",
      intro:
        "Wir sind eine unabhängige Ebene zum Entdecken: wir verkaufen nicht, wir sind keine Optiker und wir haben mit keiner dieser Marken eine Vereinbarung. Sie stehen hier, weil ihre Fassungen im Katalog sind.",
    },
    shapesLabel: "Formen",
    brandsLabel: "Marken",
    inCatalogue: "Im Katalog",
    choosingLabel: "Die richtige Größe wählen",
    otherShapes: "Andere Formen",
    otherBrands: "Andere Marken",
    frameCount: "{count} Fassungen",
    frameCountOne: "1 Fassung",
    brand: {
      title: "{brand}: Fassungen und Formen im Katalog",
      description:
        "Welche {brand}-Fassungen wir haben, welche Formen das sind und worauf du bei der Größe achten solltest.",
      origin: "{brand} ist eine Marke aus {country}.",
      partOfGroup: "Sie gehört zur Gruppe {group}.",
      independent: "Sie ist unabhängig, ohne Muttergruppe.",
      inOurCatalogue:
        "Wir haben {count} ihrer Fassungen im Katalog, vor allem {shapes}.",
      inOurCatalogueOne: "Wir haben eine ihrer Fassungen im Katalog.",
      tierLabel: "Preissegment",
      tiers: {
        accessible: "Erschwinglich",
        mid: "Mittelklasse",
        premium: "Premium",
        luxury: "Luxus",
      },
      noPartnership:
        "Wir haben keine Vereinbarung mit dieser Marke. Wir nennen sie, weil ihre Fassungen im Katalog stehen — das ist beschreibende Nennung und bedeutet keine Geschäftsbeziehung.",
    },
    measurementsPending:
      "Die Maße dieser Fassungen sind noch nicht am offiziellen Datenblatt geprüft. Sobald eine geprüft ist, steht es bei ihr.",
    tryCta: "Sehen, was mir passt",
    and: "und",
  },
};

export function catalogCopy(locale: Locale): CatalogCopy {
  return CATALOG_COPY[locale];
}
