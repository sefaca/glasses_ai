import type { Dictionary } from "./types";

/**
 * English.
 *
 * Not a word-for-word rendering of `es`: the SERP wording differs. The
 * category term is "sunglasses", the shape people search for is "aviator",
 * and "cat-eye" and "wayfarer" are the established spellings.
 */
export const en: Dictionary = {
  meta: {
    title: "Find glasses that suit you and try them on",
    description:
      "Upload a photo, discover sunglasses that fit your proportions and compare models before you buy.",
  },
  nav: {
    styles: "Styles",
    howItWorks: "How it works",
  },
  common: {
    home: "Home",
    back: "Back",
    exit: "Exit",
    language: "Language",
  },
  hero: {
    eyebrow: "Sunglasses",
    title: "Find the glasses that suit you.",
    titleAccent: "See them on your own face.",
    subtitle:
      "Upload a photo, get six frames that match your proportions, and compare them before you decide.",
    ctaPrimary: "Try it free",
    ctaSecondary: "Browse styles",
    note: "No sign-up. Your photo isn't stored.",
  },
  demo: {
    disclaimer:
      "Generated example. The person in the photo doesn't exist and the frames are simulations, not product photography.",
    original: "The photo",
    noGlasses: "No glasses",
    photoAlt: "Starting photo of a generated person",
    simulationBadge: "Simulation",
    items: [
      { model: "Clubmaster", reference: "RB3016" },
      { model: "Round Metal", reference: "RB3447" },
    ],
  },
  steps: {
    label: "How it works",
    items: [
      {
        title: "You upload a photo",
        body: "Front-facing, well lit. The proportion analysis runs in your browser — the photo doesn't leave your phone for that.",
      },
      {
        title: "We give you six",
        body: "Not an endless catalogue. Six frames from several brands, each with a concrete reason for being there.",
      },
      {
        title: "You compare and choose",
        body: "Try them on, put them side by side, and we'll take you to where the one you pick is sold.",
      },
    ],
  },
  catalog: {
    label: "The catalogue",
    title: "Shapes, not trends.",
    body: "Every frame earns its place through geometry and measurements, not through what's fashionable. That's what lets us explain why we recommended it.",
    cta: "See every shape",
  },
  privacy: {
    label: "Privacy",
    title: "Your face isn't our product.",
    body: "Facial proportions are computed in your browser. If you ask for a virtual try-on, the image goes to private storage, expires within hours and is deleted. We don't do identity recognition or profiling.",
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
    simulationNotice: "Simulation. Treat the result as indicative.",
  },
  footer: {
    tagline: "Independent eyewear discovery. Validation phase.",
    privacy: "Privacy",
    terms: "Terms",
    cookies: "Cookies",
  },

  flow: {
    steps: ["Your photo", "Brands", "Choose", "Result"],
    photo: {
      title: "Upload a photo and we'll tell you what to try.",
      subtitle: "The proportion analysis runs in your browser.",
    },
    brands: {
      title: "Any brand in mind?",
      subtitle:
        "Pick the ones you're interested in, or carry on without choosing and we'll look at the whole catalogue.",
      styleLegend: "Style, if you have a preference",
      changePhoto: "← Change the photo",
      next: "See my six →",
    },
    styles: {
      clasicas: "Classic",
      modernas: "Modern",
      oversized: "Oversized",
      minimalistas: "Minimal",
      retro: "Retro",
      deportivas: "Sporty",
    },
    choose: {
      title: "Your six",
      empty: "Nothing matches that filter",
      emptyBody:
        "Go back and drop a brand or a style. The catalogue has {frames} frames from {brands} brands.",
      hint: "Pick one and we'll generate it on your face",
      back: "← Brands",
      seeResults: "See results ({count}) →",
    },
    result: {
      titleOne: "On your face",
      titleMany: "Compare them",
      counter: "{chosen} of {max}",
      back: "← Back to the six",
      another: "Try another",
      empty: "No frames selected.",
    },
    disclaimer:
      "Catalogue under construction: we have brand, model and reference, but not their official images or prices yet. To generate the simulation your photo is sent to our server and on to the provider, and isn't stored anywhere.",
  },

  upload: {
    cta: "Upload a photo",
    changePhoto: "Change the photo",
    formats: "JPG, PNG or WEBP",
    hints: [
      "Facing forward, well lit",
      "Eyes visible",
      "No filters",
      "Better without glasses on",
      "Just you in the photo",
    ],
    opening: "Opening the photo…",
    analyzing: "Analysing proportions in your browser…",
    tryAnother: "Try another photo",
    yourProfile: "Your profile",
    lowConfidence:
      "The estimate isn't firm with this photo. A more front-facing one would read better.",
    removePhoto: "Remove the photo",
    chosenPhotoAlt: "The photo you chose",
    notStored:
      "The photo hasn't been uploaded anywhere. The analysis runs in your browser, and all we hold in memory are proportions, with no image.",
    errorDecode: "We couldn't open that image. Try another one.",
    errorPrepare: "We couldn't prepare that image. Try another one.",
    errorLoader:
      "We couldn't load the analyser. Check your connection and try again.",
    errorProcess: "We couldn't process that image. Try another photo.",
    rejectedGeneric: "We need a more front-facing photo with better light.",
    issues: {
      "unsupported-type": "We only accept JPG, PNG or WEBP images.",
      "too-large": "That image is too heavy. The limit is 12 MB.",
      "too-small": "That image is too small. We need at least 480 px per side.",
      "too-many-pixels": "That image has too much resolution. Scale it down.",
      empty: "The file is empty.",
    },
    quality: {
      "no-face":
        "We can't find a face in that photo. Try a front-facing one.",
      "multiple-faces":
        "There's more than one person. We need a photo with just you in it.",
      "incomplete-landmarks":
        "We can't see the eyes clearly. Try a more front-facing photo with nothing covering them.",
      "head-turned":
        "The face is turned away. We need you looking straight at the camera.",
      "head-tilted": "Straighten your head a little and retake the photo.",
      "eyes-closed": "Your eyes are closed or squinting. Try another photo.",
      "face-too-small":
        "The face is very small in frame. Move closer or crop around your face.",
      "resolution-too-low":
        "That photo is low resolution. We need an image of at least 480 pixels per side.",
    },
  },

  explain: {
    faceShapes: {
      oval: "oval",
      round: "round",
      square: "square",
      oblong: "oblong",
      heart: "heart-shaped",
      diamond: "diamond-shaped",
      unknown: "hard to classify",
    },
    frameShapes: {
      rectangular: "rectangular",
      square: "square",
      round: "round",
      oval: "oval",
      aviator: "aviator",
      "cat-eye": "cat-eye",
      wayfarer: "wayfarer",
      geometric: "geometric",
      oversized: "oversized",
    },
    frameEffects: {
      rectangular: "brings defined lines and structures the face",
      square: "marks angles and adds presence",
      round: "softens the features and takes off hardness",
      oval: "stays discreet and balances without drawing attention",
      aviator: "opens up the eyes and visually lengthens the face",
      "cat-eye": "lifts the eyes and emphasises the upper third",
      wayfarer: "adds width and a recognisably classic look",
      geometric: "introduces a bolder contrast of shape",
      oversized: "adds volume and visually shortens the face",
    },
    unknownProfile:
      "We couldn't estimate your face shape clearly enough. You can still browse styles and try them on.",
    profileOne: "Your face seems to fit mainly a {primary} profile.",
    profileTwo:
      "Your face seems to fit mainly a {primary} profile, with some characteristics of a {secondary} one.",
    shapeClause: "the {shape} shape {effect}",
    widthClause: "its width sits in proportion to your face",
    styleClause: "it matches the style you picked",
    fallback: "A balanced option to start comparing with.",
    matchGood: "Good match",
    matchVeryGood: "Very good match",
  },

  brandPicker: {
    suggestedPersonalised: "These match your proportions",
    suggestedGeneric: "Brands",
    rest: "And the rest",
    clear: "Clear selection",
    note:
      "Upload a photo and we'll tell you which ones fit your proportions best. Without one we can only sort them alphabetically.",
    mostly: "Mostly {shapes}",
    and: "and",
  },

  results: {
    yourPhoto: "Your photo",
    generating: "Generating… about 30 s",
    retry: "Try again",
    remove: "Remove",
    removeLabel: "Remove {model}",
    simulationAlt: "Simulation of {model} on your photo",
    simulationBadge: "Simulation",
    whereToBuy: "Where to buy",
    widthFit: {
      narrow: "May sit narrow on you",
      good: "Balanced width",
      wide: "May sit wide on you",
    },
  },

  frameCard: {
    cta: "See it on me",
    remove: "Remove",
    needsPhoto: "Upload a photo to see it on",
    match: "Good match",
    unavailable: {
      derivative: "Try-on unavailable for this brand",
      trademark: "Pending agreement with the brand",
      inactive: "Unavailable",
      unknown: "Unavailable",
    },
  },

  tryOn: {
    errors: {
      rateLimited:
        "That's a lot of try-ons in a row. Wait a few minutes and try again.",
      providerTimeout: "The provider took too long. Please try again.",
      providerUnavailable:
        "The provider isn't available right now. Try again in a moment.",
      contentRejected:
        "We couldn't generate this try-on. Try a different frame or photo.",
      invalidInput: "Something's wrong with the image. Try another photo.",
      noFaceDetected: "We can't find a face in that photo.",
      unknown: "We couldn't generate the try-on. Please try again.",
    },
    access: {
      title: "This is still private",
      body: "Each generation has a real cost, so for now you need a code to try it.",
      wrong: "That code isn't right. Check it's complete.",
      placeholder: "Code",
      cancel: "Cancel",
      submit: "Enter",
    },
  },

  waitlist: {
    prompt: "I don't have a code",
    title: "We'll let you know when you can try it",
    body: "We're opening up slowly because each try-on has a real cost. Leave us your email and we'll write when it's your turn.",
    emailLabel: "Your email",
    emailPlaceholder: "you@email.com",
    submit: "Let me know",
    promise:
      "One single email, when you can get in. Nothing else: no newsletter, no ads, and your address goes to no one. You can ask us to delete it whenever you like.",
    successTitle: "You're on the list",
    successBody:
      "We'll write to that address when your turn opens up. You can close this and carry on looking.",
    errors: {
      invalidEmail: "That address doesn't look valid. Check it.",
      rateLimited: "Too many attempts in a row. Try again in a while.",
      unavailable:
        "We can't store your email yet, so we won't ask for it half-heartedly. Try again in a few days.",
      generic: "We couldn't add you. Please try again.",
    },
  },

  legal: {
    pendingReview: "Status of this document",
    privacy: {
      label: "Privacy",
      title: "What we do with your photo",
      intro: [
        "This site is in its validation phase and doesn't accept photos yet. What follows describes how the processing is designed, so you can judge it before it exists.",
      ],
      sections: [
        {
          heading: "Proportion analysis",
          paragraphs: [
            "Facial proportions are computed in your browser. The only thing that travels to our server is a set of about twenty dimensionless ratios — relationships between widths and heights — with no image attached.",
            "That's an architectural decision to minimise exposure, not a legal claim: we don't assume that measurements derived from a face fall outside data protection law. A professional will review the legal classification before the product opens to the public.",
          ],
        },
        {
          heading: "Virtual try-on",
          paragraphs: [
            "If you ask to try a frame on, the image does have to leave your device to be processed. It goes to private storage with short-lived signed links, and is deleted along with any derived results after a brief period. Before that happens you'll see which provider processes it and how long it's kept.",
          ],
        },
        {
          heading: "If you join the waiting list",
          paragraphs: [
            "This is the only thing we keep about you as an identifiable person, and only if you ask us to. We store your email, the language you signed up in, where on the site you did it, and the date you agreed. Nothing else: no name, no IP, nothing from your photo or your face.",
            "The list is never joined with product analytics. What we measure about usage is anonymous and stays that way: linking it to your email would turn it into identified tracking.",
            "We use it for a single email, when we can open access to you. We don't sell or share the list. You can ask us to delete your address whenever you like and we will, without asking why.",
          ],
        },
        {
          heading: "What we don't do",
          paragraphs: [],
          items: [
            "We don't do identity recognition or try to work out who you are.",
            "We don't infer sensitive personal attributes from your face.",
            "We don't train models on your photos.",
            "We don't sell data or use it for personalised advertising.",
            "We don't keep facial images in logs or analytics.",
            "We don't keep your photo «just in case».",
          ],
        },
        {
          heading: "Status of this document",
          paragraphs: [
            "Pending professional legal review. It isn't a complete privacy policy yet and doesn't pretend to be one.",
          ],
        },
      ],
    },
    terms: {
      label: "Terms",
      title: "Terms of use",
      intro: [
        "The site is in its validation phase. There's no service to contract, no payments are accepted and no user data is processed.",
      ],
      sections: [
        {
          heading: "What this site is",
          paragraphs: [
            "An independent eyewear discovery layer. We don't sell frames, we aren't an optician and we have no commercial relationship with the brands that may appear. When it exists, the buying link will lead to a third-party shop, which is the seller and whose terms govern the purchase.",
          ],
        },
        {
          heading: "About recommendations and virtual try-ons",
          paragraphs: [
            "Recommendations are indicative. They aren't a measurement or professional advice, and we don't claim that a frame is objectively the one that suits you best.",
            "Any virtual try-on is a simulation and is labelled as such. It doesn't replace trying the frame on.",
          ],
        },
        {
          heading: "Third-party brands",
          paragraphs: [
            "Any brands and models shown belong to their owners. Mentioning them implies no agreement, sponsorship or association, and we don't present anyone as a partner without an agreement.",
          ],
        },
        {
          heading: "Status of this document",
          paragraphs: [
            "Pending professional legal review. It isn't a complete contractual document yet.",
          ],
        },
      ],
    },
    cookies: {
      label: "Cookies",
      title: "Cookies and storage",
      intro: [
        "This site sets no cookies and uses no third-party analytics. There is no consent banner either, because there is nothing to consent to.",
        "We do measure how the product is used, with our own analytics: which steps get completed and what fails. It uses no cookies, identifies nobody, and never includes your photo or measurements of your face. To group the steps of a single visit we use a random identifier held in the tab's memory, which disappears when you close it.",
      ],
      sections: [
        {
          heading: "What will be used once there's a product",
          paragraphs: [],
          items: [
            "A technical anonymous-session cookie, so we can skip sign-up and still apply usage limits. The product can't work without it.",
            "Local storage in your browser to remember the preferences you choose, which never leaves your device.",
            "Product analytics with no facial content and without identifying you personally, to measure the funnel.",
          ],
        },
        {
          heading: "Consent",
          paragraphs: [
            "Anything that requires consent will be asked for before it's set, not after.",
          ],
        },
        {
          heading: "Status of this document",
          paragraphs: ["Pending professional legal review."],
        },
      ],
    },
  },
};
