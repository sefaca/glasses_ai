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
