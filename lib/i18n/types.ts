import type { FrameShape } from "../catalog/types";
import type { FaceShape } from "../face/types";
import type { QualityIssue } from "../face/quality";
import type { UploadIssue } from "../upload/validate";

/**
 * Forma del diccionario.
 *
 * Explícita a propósito en lugar de inferida de `es` con `as const`: así
 * añadir una clave obliga a traducirla en **los cinco** idiomas, y
 * `Record<FrameShape, string>` garantiza que una forma nueva de montura no se
 * quede sin etiqueta en ninguno. El compilador es la única red que impide que
 * una página salga medio traducida, que es justo el defecto que detectamos en
 * VisuTry (H1 en inglés dentro de `/es/`) → docs/GROWTH_SEO.md §5.
 */

/**
 * El diccionario es **datos puros**: ni una función.
 *
 * No es purismo. Un diccionario con funciones no cruza la frontera de React
 * Server Components, así que un servidor no se lo puede pasar a un componente
 * cliente y el build falla. Las frases con variables llevan marcadores
 * `{nombre}` y se resuelven con `format()`.
 */

/** Sección de un documento legal: encabezado + párrafos + lista opcional. */
export interface LegalSection {
  heading: string;
  paragraphs: readonly string[];
  items?: readonly string[];
}

export interface LegalDoc {
  label: string;
  title: string;
  intro: readonly string[];
  sections: readonly LegalSection[];
}

export interface Dictionary {
  meta: { title: string; description: string };
  nav: { styles: string; howItWorks: string };
  common: {
    home: string;
    back: string;
    exit: string;
    language: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    note: string;
  };
  demo: {
    /** Advertencia obligatoria: la persona y las monturas son generadas. */
    disclaimer: string;
    original: string;
    noGlasses: string;
    photoAlt: string;
    simulationBadge: string;
    items: ReadonlyArray<{ model: string; reference: string }>;
  };
  steps: {
    label: string;
    items: ReadonlyArray<{ title: string; body: string }>;
  };
  catalog: { label: string; title: string; body: string; cta: string };
  privacy: { label: string; title: string; body: string; link: string };
  frames: {
    shapes: Record<FrameShape, string>;
    simulationNotice: string;
  };
  footer: {
    tagline: string;
    privacy: string;
    terms: string;
    cookies: string;
  };

  /** Pantalla `/probar`: los cuatro pasos. */
  flow: {
    steps: readonly [string, string, string, string];
    photo: { title: string; subtitle: string };
    brands: {
      title: string;
      subtitle: string;
      styleLegend: string;
      changePhoto: string;
      next: string;
    };
    styles: Record<
      "clasicas" | "modernas" | "oversized" | "minimalistas" | "retro" | "deportivas",
      string
    >;
    choose: {
      title: string;
      empty: string;
      /** Marcadores: `{frames}`, `{brands}`. */
      emptyBody: string;
      hint: string;
      back: string;
      /** Marcador: `{count}`. */
      seeResults: string;
    };
    result: {
      titleOne: string;
      titleMany: string;
      /** Marcadores: `{chosen}`, `{max}`. */
      counter: string;
      back: string;
      another: string;
      empty: string;
    };
    disclaimer: string;
  };

  upload: {
    cta: string;
    changePhoto: string;
    formats: string;
    hints: readonly string[];
    opening: string;
    analyzing: string;
    tryAnother: string;
    yourProfile: string;
    lowConfidence: string;
    removePhoto: string;
    chosenPhotoAlt: string;
    notStored: string;
    errorDecode: string;
    errorPrepare: string;
    /** No se pudo cargar el modelo de análisis. */
    errorLoader: string;
    /** El modelo cargó pero falló al procesar la imagen. */
    errorProcess: string;
    /** La foto no vale y no hay un motivo concreto que dar. */
    rejectedGeneric: string;
    /** Validación de archivo, antes de decodificar. */
    issues: Record<UploadIssue, string>;
    /** Control de calidad de la foto, tras los landmarks. */
    quality: Record<QualityIssue, string>;
  };

  /**
   * Explicaciones generadas por plantilla → CLAUDE.md §9.4.
   *
   * Los hechos salen del `FrameScore`; aquí solo está la lengua. Nunca se
   * afirma una medida ni la forma del rostro como un hecho: la redacción es
   * siempre condicional, en los cinco idiomas.
   */
  explain: {
    /** Adjetivo del rostro: «ovalado», «oval», «ovale»… */
    faceShapes: Record<FaceShape, string>;
    /** Forma de la montura en minúscula, para meterla dentro de una frase. */
    frameShapes: Record<FrameShape, string>;
    /** Qué hace visualmente cada forma. Cualitativo, nunca numérico. */
    frameEffects: Record<FrameShape, string>;
    unknownProfile: string;
    /** Marcador: `{primary}`. */
    profileOne: string;
    /** Marcadores: `{primary}`, `{secondary}`. */
    profileTwo: string;
    /** Marcadores: `{shape}`, `{effect}`. */
    shapeClause: string;
    widthClause: string;
    styleClause: string;
    fallback: string;
    matchGood: string;
    matchVeryGood: string;
  };

  brandPicker: {
    suggestedPersonalised: string;
    suggestedGeneric: string;
    rest: string;
    clear: string;
    note: string;
    /** «Sobre todo redondas y aviador»: el porqué de la sugerencia. */
    /** Marcador: `{shapes}`. */
    mostly: string;
    /** Conjunción para enumerar dos formas. */
    and: string;
  };

  results: {
    yourPhoto: string;
    generating: string;
    retry: string;
    remove: string;
    /** Marcador: `{model}`. */
    removeLabel: string;
    /** Marcador: `{model}`. */
    simulationAlt: string;
    simulationBadge: string;
    whereToBuy: string;
    /** Lectura cualitativa del ajuste por anchura. `null` = no decir nada. */
    widthFit: { narrow: string; good: string; wide: string };
  };

  frameCard: {
    cta: string;
    remove: string;
    needsPhoto: string;
    match: string;
    unavailable: {
      derivative: string;
      trademark: string;
      inactive: string;
      unknown: string;
    };
  };

  tryOn: {
    /** Códigos de error del servidor → algo que la persona pueda hacer. */
    errors: {
      rateLimited: string;
      providerTimeout: string;
      providerUnavailable: string;
      contentRejected: string;
      invalidInput: string;
      noFaceDetected: string;
      unknown: string;
    };
    access: {
      title: string;
      body: string;
      wrong: string;
      placeholder: string;
      cancel: string;
      submit: string;
    };
  };

  /**
   * Lista de espera de la alfa. La promesa tiene que ser **exactamente** lo
   * que vamos a hacer: un aviso, una vez. Cualquier adorno aquí es una
   * promesa que luego hay que cumplir.
   */
  waitlist: {
    prompt: string;
    title: string;
    body: string;
    emailLabel: string;
    emailPlaceholder: string;
    submit: string;
    /** Qué recibirá, literal. Va visible antes de enviar, no después. */
    promise: string;
    successTitle: string;
    successBody: string;
    errors: {
      invalidEmail: string;
      rateLimited: string;
      unavailable: string;
      generic: string;
    };
  };

  legal: {
    privacy: LegalDoc;
    terms: LegalDoc;
    cookies: LegalDoc;
    pendingReview: string;
  };
}
