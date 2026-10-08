import type { Dictionary } from "./types";

/**
 * English strings. Second locale → CLAUDE.md §21.
 * Typed against `Dictionary` so a key added in one locale fails the build
 * until it exists in the other.
 */
export const en: Dictionary = {
  meta: {
    title: "Find sunglasses that suit you — and try them on",
    description:
      "Upload a photo, discover sunglasses that fit your proportions and compare models before you buy.",
  },
  nav: {
    styles: "Styles",
    howItWorks: "How it works",
  },
  hero: {
    eyebrow: "Sunglasses",
    title: "Find the sunglasses that suit you.",
    titleAccent: "Try them on your own face.",
    subtitle:
      "Upload a photo, get six frames that fit your proportions, and compare them before deciding.",
    ctaPrimary: "Try it free",
    ctaSecondary: "Browse styles",
    note: "No account. Your photo isn't stored.",
  },
  steps: {
    label: "How it works",
    items: [
      {
        title: "You upload a photo",
        body: "Front-facing, decent light. The proportion analysis runs in your browser — for that step the photo never leaves your phone.",
      },
      {
        title: "We give you six",
        body: "Not an endless catalogue. Six frames, each with a concrete reason it's there, across several brands.",
      },
      {
        title: "You compare and choose",
        body: "Try them on, put them side by side, and we take you to where the one you pick is sold.",
      },
    ],
  },
  catalog: {
    label: "The catalogue",
    title: "Shapes, not trends.",
    body: "Every frame earns its place through geometry and measurements, not through hype. That's what makes the recommendation explainable.",
    cta: "See every shape",
  },
  privacy: {
    label: "Privacy",
    title: "Your face is not our product.",
    body: "Facial proportions are computed in your browser. If you request a virtual try-on, the image goes to private storage, expires within hours and is deleted. We do no identity recognition and no profiling.",
    link: "How we handle your data",
  },
  frames: {
    shapes: {
      rectangular: "Rectangular",
      square: "Square",
      round: "Round",
      oval: "Oval",
      aviator: "Aviator",
      "cat-eye": "Cat-eye",
      wayfarer: "Wayfarer",
      geometric: "Geometric",
      oversized: "Oversized",
    },
    simulationNotice: "Simulation. The result is indicative.",
  },
  footer: {
    tagline: "Independent eyewear discovery. Validation phase.",
    privacy: "Privacy",
    terms: "Terms",
    cookies: "Cookies",
  },
};
