import type { Dictionary } from "./types";

/** Textos en español. Mercado inicial → CLAUDE.md §2.2. */
export const es: Dictionary = {
  meta: {
    title: "Descubre qué gafas te quedan bien y pruébatelas",
    description:
      "Sube una foto, descubre estilos de gafas de sol que encajan contigo y compara modelos antes de comprar.",
  },
  nav: {
    styles: "Estilos",
    howItWorks: "Cómo funciona",
  },
  hero: {
    eyebrow: "Gafas de sol",
    title: "Descubre qué gafas te quedan bien.",
    titleAccent: "Pruébatelas en tu cara.",
    subtitle:
      "Sube una foto, recibe seis modelos que encajan con tus proporciones y compáralos antes de decidir.",
    ctaPrimary: "Probar gratis",
    ctaSecondary: "Explorar estilos",
    note: "Sin registro. Tu foto no se guarda.",
  },
  steps: {
    label: "Cómo funciona",
    items: [
      {
        title: "Subes una foto",
        body: "Frontal y con buena luz. El análisis de proporciones se hace en tu navegador: la foto no sale de tu móvil para eso.",
      },
      {
        title: "Te damos seis",
        body: "No un catálogo infinito. Seis monturas con una razón concreta por la que aparecen, de varias marcas.",
      },
      {
        title: "Las comparas y eliges",
        body: "Te las pruebas, las pones una al lado de otra y te llevamos a donde se compra el modelo que elijas.",
      },
    ],
  },
  catalog: {
    label: "El catálogo",
    title: "Formas, no tendencias.",
    body: "Cada montura entra por su geometría y sus medidas, no por lo que esté de moda. Así se puede explicar por qué te la recomendamos.",
    cta: "Ver todas las formas",
  },
  privacy: {
    label: "Privacidad",
    title: "Tu cara no es nuestro producto.",
    body: "Las proporciones faciales se calculan en tu navegador. Si pides una prueba virtual, la imagen va a un almacenamiento privado, caduca en horas y se borra. No hacemos reconocimiento de identidad ni perfilado.",
    link: "Cómo tratamos tus datos",
  },
  frames: {
    shapes: {
      rectangular: "Rectangular",
      square: "Cuadrada",
      round: "Redonda",
      oval: "Ovalada",
      aviator: "Aviador",
      "cat-eye": "Cat-eye",
      wayfarer: "Wayfarer",
      geometric: "Geométrica",
      oversized: "Oversized",
    },
    simulationNotice: "Simulación. El resultado es orientativo.",
  },
  footer: {
    tagline: "Descubrimiento independiente de gafas. Fase de validación.",
    privacy: "Privacidad",
    terms: "Términos",
    cookies: "Cookies",
  },
};
