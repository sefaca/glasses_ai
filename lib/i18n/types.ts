import type { FrameShape } from "../catalog/types";

/**
 * Forma del diccionario.
 *
 * Explícita a propósito en lugar de inferida de `es` con `as const`: así
 * añadir una clave obliga a traducirla en todos los idiomas, y `Record<
 * FrameShape, string>` garantiza que una forma nueva de montura no se quede
 * sin etiqueta en ninguno.
 */
export interface Dictionary {
  meta: { title: string; description: string };
  nav: { styles: string; howItWorks: string };
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    note: string;
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
}
