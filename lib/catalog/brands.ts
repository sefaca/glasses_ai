/**
 * Marcas de gafas del mercado accesible en España.
 *
 * La marca pasa a ser entidad de primer nivel porque es **un eje primario de
 * cómo se compran gafas** —«quiero unas Ray-Ban»— y el producto no lo
 * contemplaba. También es el cluster C de SEO (CLAUDE.md §18.2).
 *
 * `group` no es decoración: **es estrategia de afiliación**. Las seis marcas
 * de EssilorLuxottica son una sola negociación, no seis. Y `approachability`
 * ordena a quién tiene sentido escribir primero: una marca española pequeña
 * quiere la tracción; Luxottica no te necesita.
 *
 * Nombres de marca y titularidad son **hechos públicos**: nombrarlos es uso
 * nominativo y no requiere permiso → D-021. Lo que sí requiere permiso son
 * sus activos (imágenes, logotipos), y eso vive en `FrameRights`.
 */

export type BrandTier =
  | "accessible" // hasta ~80 €
  | "mid" // ~80–200 €
  | "premium" // ~200–400 €
  | "luxury"; // 400 € en adelante

/** Probabilidad razonable de que autoricen a un publisher pequeño. */
export type Approachability = "high" | "medium" | "low";

export interface Brand {
  id: string;
  slug: string;
  name: string;
  /** Grupo propietario o licenciatario. `null` si es independiente. */
  group: string | null;
  /** País de origen o sede. */
  country: string;
  tier: BrandTier;
  approachability: Approachability;
  /** Una línea de carácter, para la UI. */
  tagline: string;
  active: boolean;
}

/**
 * Nivel de evidencia de esta tabla: `[T]` terceros y conocimiento general del
 * sector. La titularidad de licencias **cambia con el tiempo** —Kering retiró
 * las suyas de Safilo para gestionarlas internamente— así que antes de
 * negociar con cualquiera hay que reverificar quién la gestiona hoy.
 */
export const BRANDS: Brand[] = [
  // ── EssilorLuxottica ──────────────────────────────────────────────────
  {
    id: "ray-ban",
    slug: "ray-ban",
    name: "Ray-Ban",
    group: "EssilorLuxottica",
    country: "Italia",
    tier: "mid",
    approachability: "low",
    tagline: "El icono. Aviator, Wayfarer y Clubmaster",
    active: true,
  },
  {
    id: "oakley",
    slug: "oakley",
    name: "Oakley",
    group: "EssilorLuxottica",
    country: "EE. UU.",
    tier: "mid",
    approachability: "low",
    tagline: "Rendimiento deportivo y lentes Prizm",
    active: true,
  },
  {
    id: "persol",
    slug: "persol",
    name: "Persol",
    group: "EssilorLuxottica",
    country: "Italia",
    tier: "premium",
    approachability: "low",
    tagline: "Artesanía italiana y el plegado 714",
    active: true,
  },
  {
    id: "oliver-peoples",
    slug: "oliver-peoples",
    name: "Oliver Peoples",
    group: "EssilorLuxottica",
    country: "EE. UU.",
    tier: "premium",
    approachability: "low",
    tagline: "Clasicismo discreto con referencia de cine",
    active: true,
  },
  {
    id: "arnette",
    slug: "arnette",
    name: "Arnette",
    group: "EssilorLuxottica",
    country: "EE. UU.",
    tier: "accessible",
    approachability: "low",
    tagline: "Surf y street, precio contenido",
    active: true,
  },
  {
    id: "vogue-eyewear",
    slug: "vogue-eyewear",
    name: "Vogue Eyewear",
    group: "EssilorLuxottica",
    country: "Italia",
    tier: "accessible",
    approachability: "low",
    tagline: "Tendencia de temporada a precio medio",
    active: true,
  },

  // ── Safilo ────────────────────────────────────────────────────────────
  {
    id: "carrera",
    slug: "carrera",
    name: "Carrera",
    group: "Safilo",
    country: "Italia",
    tier: "mid",
    approachability: "low",
    tagline: "Herencia deportiva de los setenta",
    active: true,
  },
  {
    id: "polaroid",
    slug: "polaroid",
    name: "Polaroid Eyewear",
    group: "Safilo",
    country: "EE. UU.",
    tier: "accessible",
    approachability: "low",
    tagline: "Polarización como argumento central",
    active: true,
  },

  // ── Kering Eyewear ────────────────────────────────────────────────────
  {
    id: "gucci",
    slug: "gucci",
    name: "Gucci",
    group: "Kering Eyewear",
    country: "Italia",
    tier: "luxury",
    approachability: "low",
    tagline: "Lujo italiano con firma muy reconocible",
    active: true,
  },
  {
    id: "saint-laurent",
    slug: "saint-laurent",
    name: "Saint Laurent",
    group: "Kering Eyewear",
    country: "Francia",
    tier: "luxury",
    approachability: "low",
    tagline: "Siluetas afiladas y acetato denso",
    active: true,
  },
  {
    id: "bottega-veneta",
    slug: "bottega-veneta",
    name: "Bottega Veneta",
    group: "Kering Eyewear",
    country: "Italia",
    tier: "luxury",
    approachability: "low",
    tagline: "Lujo sin logotipo",
    active: true,
  },

  // ── Marcolin · De Rigo · Marchon ──────────────────────────────────────
  {
    id: "tom-ford",
    slug: "tom-ford",
    name: "Tom Ford",
    group: "Marcolin",
    country: "EE. UU.",
    tier: "luxury",
    approachability: "low",
    tagline: "Acetato grueso y presencia rotunda",
    active: true,
  },
  {
    id: "police",
    slug: "police",
    name: "Police",
    group: "De Rigo",
    country: "Italia",
    tier: "mid",
    approachability: "low",
    tagline: "Metal y actitud urbana",
    active: true,
  },
  {
    id: "lozza",
    slug: "lozza",
    name: "Lozza",
    group: "De Rigo",
    country: "Italia",
    tier: "mid",
    approachability: "low",
    tagline: "La casa italiana más antigua del sector",
    active: true,
  },
  {
    id: "calvin-klein",
    slug: "calvin-klein",
    name: "Calvin Klein",
    group: "Marchon",
    country: "EE. UU.",
    tier: "mid",
    approachability: "low",
    tagline: "Minimalismo americano",
    active: true,
  },
  {
    id: "nike-vision",
    slug: "nike-vision",
    name: "Nike Vision",
    group: "Marchon",
    country: "EE. UU.",
    tier: "mid",
    approachability: "low",
    tagline: "Óptica deportiva de alto envolvimiento",
    active: true,
  },

  // ── Independientes de diseño ──────────────────────────────────────────
  {
    id: "gentle-monster",
    slug: "gentle-monster",
    name: "Gentle Monster",
    group: null,
    country: "Corea del Sur",
    tier: "premium",
    approachability: "low",
    tagline: "Volumen experimental y series cortas",
    active: true,
  },
  {
    id: "mykita",
    slug: "mykita",
    name: "Mykita",
    group: null,
    country: "Alemania",
    tier: "premium",
    approachability: "medium",
    tagline: "Ingeniería sin tornillos, acero muy fino",
    active: true,
  },
  {
    id: "moscot",
    slug: "moscot",
    name: "Moscot",
    group: null,
    country: "EE. UU.",
    tier: "premium",
    approachability: "medium",
    tagline: "Acetato neoyorquino de herencia centenaria",
    active: true,
  },
  {
    id: "garrett-leight",
    slug: "garrett-leight",
    name: "Garrett Leight",
    group: null,
    country: "EE. UU.",
    tier: "premium",
    approachability: "medium",
    tagline: "California clásico, acetato ligero",
    active: true,
  },
  {
    id: "cubitts",
    slug: "cubitts",
    name: "Cubitts",
    group: null,
    country: "Reino Unido",
    tier: "mid",
    approachability: "medium",
    tagline: "Hechas a mano en Londres, muy medidas",
    active: true,
  },

  // ── DTC internacional ─────────────────────────────────────────────────
  {
    id: "warby-parker",
    slug: "warby-parker",
    name: "Warby Parker",
    group: null,
    country: "EE. UU.",
    tier: "accessible",
    approachability: "medium",
    tagline: "DTC con prueba en casa y precio claro",
    active: true,
  },
  {
    id: "ace-and-tate",
    slug: "ace-and-tate",
    name: "Ace & Tate",
    group: null,
    country: "Países Bajos",
    tier: "mid",
    approachability: "medium",
    tagline: "Color y diseño holandés, muy gráfico",
    active: true,
  },
  {
    id: "komono",
    slug: "komono",
    name: "Komono",
    group: null,
    country: "Bélgica",
    tier: "accessible",
    approachability: "high",
    tagline: "Diseño belga asequible",
    active: true,
  },

  // ── España ────────────────────────────────────────────────────────────
  {
    id: "hawkers",
    slug: "hawkers",
    name: "Hawkers",
    group: null,
    country: "España",
    tier: "accessible",
    approachability: "high",
    tagline: "Alicante. Polarizadas asequibles, muy sociales",
    active: true,
  },
  {
    id: "meller",
    slug: "meller",
    name: "Meller",
    group: null,
    country: "España",
    tier: "accessible",
    approachability: "high",
    tagline: "Barcelona. Color y silueta de inspiración africana",
    active: true,
  },
  {
    id: "mr-boho",
    slug: "mr-boho",
    name: "Mr. Boho",
    group: null,
    country: "España",
    tier: "mid",
    approachability: "high",
    tagline: "Madrid. Diseño urbano y paleta sobria",
    active: true,
  },
  {
    id: "northweek",
    slug: "northweek",
    name: "Northweek",
    group: null,
    country: "España",
    tier: "accessible",
    approachability: "high",
    tagline: "Barcelona. Personalizables y deportivas",
    active: true,
  },
  {
    id: "parafina",
    slug: "parafina",
    name: "Parafina",
    group: null,
    country: "España",
    tier: "accessible",
    approachability: "high",
    tagline: "Monturas de plástico reciclado del océano",
    active: true,
  },
  {
    id: "barner",
    slug: "barner",
    name: "Barner",
    group: null,
    country: "España",
    tier: "accessible",
    approachability: "high",
    tagline: "Barcelona. Filtro de luz azul como origen",
    active: true,
  },

  // ── Deporte y montaña ─────────────────────────────────────────────────
  {
    id: "julbo",
    slug: "julbo",
    name: "Julbo",
    group: null,
    country: "Francia",
    tier: "mid",
    approachability: "medium",
    tagline: "Alta montaña y categoría 4",
    active: true,
  },
  {
    id: "smith",
    slug: "smith",
    name: "Smith",
    group: "Safilo",
    country: "EE. UU.",
    tier: "mid",
    approachability: "low",
    tagline: "Nieve y ciclismo, lentes ChromaPop",
    active: true,
  },
  {
    id: "bolle",
    slug: "bolle",
    name: "Bollé",
    group: null,
    country: "Francia",
    tier: "mid",
    approachability: "medium",
    tagline: "Deporte al aire libre desde 1888",
    active: true,
  },
  // ── Añadidas 2026-10-18: las más buscadas que faltaban ────────────────
  {
    id: "prada",
    slug: "prada",
    name: "Prada",
    group: "EssilorLuxottica",
    country: "Italia",
    tier: "luxury",
    approachability: "low",
    tagline:
      "Lujo italiano con señas propias: el triángulo y la montura Symbole.",
    active: true,
  },
  {
    id: "versace",
    slug: "versace",
    name: "Versace",
    group: "EssilorLuxottica",
    country: "Italia",
    tier: "luxury",
    approachability: "low",
    tagline:
      "Barroco, dorado y Medusa. Reconocible a tres metros.",
    active: true,
  },
  {
    id: "dolce-gabbana",
    slug: "dolce-gabbana",
    name: "Dolce & Gabbana",
    group: "EssilorLuxottica",
    country: "Italia",
    tier: "luxury",
    approachability: "low",
    tagline:
      "Mediterráneo exagerado: color, volumen y nada de discreción.",
    active: true,
  },
  {
    id: "emporio-armani",
    slug: "emporio-armani",
    name: "Emporio Armani",
    group: "EssilorLuxottica",
    country: "Italia",
    tier: "premium",
    approachability: "low",
    tagline:
      "La línea joven de Armani: diseño italiano a precio alcanzable.",
    active: true,
  },
  {
    id: "michael-kors",
    slug: "michael-kors",
    name: "Michael Kors",
    group: "EssilorLuxottica",
    country: "Estados Unidos",
    tier: "premium",
    approachability: "low",
    tagline:
      "Lujo accesible americano, muy fuerte en gafas de sol femeninas.",
    active: true,
  },
  {
    id: "burberry",
    slug: "burberry",
    name: "Burberry",
    group: "EssilorLuxottica",
    country: "Reino Unido",
    tier: "luxury",
    approachability: "low",
    tagline:
      "El check británico llevado a la montura.",
    active: true,
  },
  {
    id: "miu-miu",
    slug: "miu-miu",
    name: "Miu Miu",
    group: "EssilorLuxottica",
    country: "Italia",
    tier: "luxury",
    approachability: "low",
    tagline:
      "La hermana descarada de Prada: formas pequeñas y gestos pop.",
    active: true,
  },
  {
    id: "dior",
    slug: "dior",
    name: "Dior",
    group: "Thélios (LVMH)",
    country: "Francia",
    tier: "luxury",
    approachability: "low",
    tagline:
      "Alta costura francesa; sus modelos marcan tendencia cada temporada.",
    active: true,
  },
  {
    id: "celine",
    slug: "celine",
    name: "Celine",
    group: "Thélios (LVMH)",
    country: "Francia",
    tier: "luxury",
    approachability: "low",
    tagline:
      "Minimalismo parisino. La Triomphe es de las monturas más copiadas.",
    active: true,
  },
  {
    id: "fendi",
    slug: "fendi",
    name: "Fendi",
    group: "Thélios (LVMH)",
    country: "Italia",
    tier: "luxury",
    approachability: "low",
    tagline:
      "Roma y logotipo: monturas de gesto grande.",
    active: true,
  },
  {
    id: "maui-jim",
    slug: "maui-jim",
    name: "Maui Jim",
    group: "Kering Eyewear",
    country: "Estados Unidos",
    tier: "premium",
    approachability: "low",
    tagline:
      "Polarizadas hawaianas; su lente es el argumento entero.",
    active: true,
  },
  {
    id: "costa",
    slug: "costa",
    name: "Costa Del Mar",
    group: "EssilorLuxottica",
    country: "Estados Unidos",
    tier: "premium",
    approachability: "low",
    tagline:
      "Pensadas para el agua: pesca, barco y sol a plomo.",
    active: true,
  },
  {
    id: "vuarnet",
    slug: "vuarnet",
    name: "Vuarnet",
    group: null,
    country: "Francia",
    tier: "premium",
    approachability: "medium",
    tagline:
      "Lentes minerales francesas, de la nieve de los sesenta a hoy.",
    active: true,
  },
  {
    id: "quay",
    slug: "quay",
    name: "Quay Australia",
    group: null,
    country: "Australia",
    tier: "accessible",
    approachability: "high",
    tagline:
      "Tendencia australiana a precio bajo, muy fuerte en redes.",
    active: true,
  },
  {
    id: "le-specs",
    slug: "le-specs",
    name: "Le Specs",
    group: null,
    country: "Australia",
    tier: "accessible",
    approachability: "high",
    tagline:
      "Formas atrevidas y precio contenido. Nacida en los ochenta.",
    active: true,
  },
  {
    id: "chimi",
    slug: "chimi",
    name: "Chimi",
    group: null,
    country: "Suecia",
    tier: "mid",
    approachability: "high",
    tagline:
      "Minimalismo escandinavo con color: directo al consumidor.",
    active: true,
  },
  {
    id: "knockaround",
    slug: "knockaround",
    name: "Knockaround",
    group: null,
    country: "Estados Unidos",
    tier: "accessible",
    approachability: "high",
    tagline:
      "Baratas sin disimularlo, personalizables y con mil colores.",
    active: true,
  },
];

const BY_ID = new Map(BRANDS.map((brand) => [brand.id, brand]));
const BY_SLUG = new Map(BRANDS.map((brand) => [brand.slug, brand]));

export function findBrand(id: string): Brand | null {
  return BY_ID.get(id) ?? null;
}

export function findBrandBySlug(slug: string): Brand | null {
  return BY_SLUG.get(slug) ?? null;
}

export function brandName(id: string): string {
  return BY_ID.get(id)?.name ?? id;
}

export function activeBrands(): Brand[] {
  return BRANDS.filter((brand) => brand.active);
}

/**
 * A quién escribir primero para pedir permisos y afiliación.
 *
 * Ordena por accesibilidad y, a igualdad, pone España delante: el mercado
 * inicial es España (CLAUDE.md §2.2) y una marca local pequeña tiene un
 * incentivo real en la tracción que le llevamos.
 */
export function outreachPriority(): Brand[] {
  const rank: Record<Approachability, number> = { high: 0, medium: 1, low: 2 };
  return [...activeBrands()].sort((a, b) => {
    if (rank[a.approachability] !== rank[b.approachability]) {
      return rank[a.approachability] - rank[b.approachability];
    }
    if (a.country !== b.country) {
      if (a.country === "España") return -1;
      if (b.country === "España") return 1;
    }
    return a.name.localeCompare(b.name);
  });
}

/** Marcas agrupadas por propietario: cada grupo es una sola negociación. */
export function brandsByGroup(): Map<string, Brand[]> {
  const groups = new Map<string, Brand[]>();
  for (const brand of activeBrands()) {
    const key = brand.group ?? "Independiente";
    const list = groups.get(key);
    if (list) list.push(brand);
    else groups.set(key, [brand]);
  }
  return groups;
}
