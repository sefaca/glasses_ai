import type { Dictionary } from "./types";

/**
 * Deutsch.
 *
 * Die Kategorie heißt «Sonnenbrillen». Wichtig für die Suche: die Form heißt
 * **Pilotenbrille**, nicht «Aviator», und «Schmetterlingsbrille» ist der
 * gebräuchliche Begriff für Cat-Eye — beide stehen so in den Suchanfragen.
 * Durchgehend per «du», wie im übrigen Produkt.
 *
 * MENSCHLICHE PRÜFUNG AUSSTEHEND → docs/GROWTH_SEO.md.
 */
export const de: Dictionary = {
  meta: {
    title: "Finde die Brille, die dir steht — und probiere sie an",
    description:
      "Lade ein Foto hoch, entdecke Sonnenbrillen, die zu deinen Proportionen passen, und vergleiche Modelle vor dem Kauf.",
  },
  nav: {
    styles: "Formen",
    howItWorks: "So funktioniert's",
  },
  common: {
    home: "Start",
    back: "Zurück",
    exit: "Schließen",
    language: "Sprache",
  },
  hero: {
    eyebrow: "Sonnenbrillen",
    title: "Finde die Brille, die dir steht.",
    titleAccent: "Probiere sie auf deinem Gesicht.",
    subtitle:
      "Lade ein Foto hoch, bekomme sechs Modelle passend zu deinen Proportionen und vergleiche sie, bevor du dich entscheidest.",
    ctaPrimary: "Kostenlos testen",
    ctaSecondary: "Formen ansehen",
    note: "Ohne Anmeldung. Dein Foto wird nicht gespeichert.",
  },
  demo: {
    disclaimer:
      "Generiertes Beispiel. Die Person auf dem Foto existiert nicht, und die Fassungen sind Simulationen, keine Produktfotos.",
    original: "Das Foto",
    noGlasses: "Ohne Brille",
    photoAlt: "Ausgangsfoto einer generierten Person",
    simulationBadge: "Simulation",
    items: [
      { model: "Clubmaster", reference: "RB3016" },
      { model: "Round Metal", reference: "RB3447" },
    ],
  },
  steps: {
    label: "So funktioniert's",
    items: [
      {
        title: "Du lädst ein Foto hoch",
        body: "Frontal und gut ausgeleuchtet. Die Proportionsanalyse läuft in deinem Browser — dafür verlässt das Foto dein Handy nicht.",
      },
      {
        title: "Wir geben dir sechs",
        body: "Keinen endlosen Katalog. Sechs Fassungen verschiedener Marken, jede mit einem konkreten Grund, warum sie dabei ist.",
      },
      {
        title: "Du vergleichst und wählst",
        body: "Du probierst sie an, stellst sie nebeneinander, und wir bringen dich dorthin, wo dein Modell verkauft wird.",
      },
    ],
  },
  catalog: {
    label: "Der Katalog",
    title: "Formen, keine Trends.",
    body: "Jede Fassung kommt über ihre Geometrie und ihre Maße hinein, nicht über das, was gerade modern ist. Nur so lässt sich erklären, warum wir sie dir empfehlen.",
    cta: "Alle Formen ansehen",
  },
  privacy: {
    label: "Datenschutz",
    title: "Dein Gesicht ist nicht unser Produkt.",
    body: "Die Gesichtsproportionen werden in deinem Browser berechnet. Wenn du eine virtuelle Anprobe anforderst, geht das Bild in einen privaten Speicher, verfällt nach Stunden und wird gelöscht. Wir betreiben keine Identitätserkennung und kein Profiling.",
    link: "Wie wir mit deinen Daten umgehen",
  },
  frames: {
    shapes: {
      rectangular: "Rechteckig",
      square: "Eckig",
      round: "Rund",
      oval: "Oval",
      aviator: "Pilotenbrille",
      "cat-eye": "Schmetterling",
      wayfarer: "Wayfarer",
      geometric: "Geometrisch",
      oversized: "Oversize",
    },
    simulationNotice: "Simulation. Das Ergebnis ist ein Anhaltspunkt.",
  },
  footer: {
    tagline: "Unabhängige Brillensuche. Validierungsphase.",
    privacy: "Datenschutz",
    terms: "Nutzungsbedingungen",
    cookies: "Cookies",
  },

  flow: {
    steps: ["Dein Foto", "Marken", "Auswählen", "Ergebnis"],
    photo: {
      title: "Lade ein Foto hoch, und wir sagen dir, was du anprobieren solltest.",
      subtitle: "Die Proportionsanalyse läuft in deinem Browser.",
    },
    brands: {
      title: "Hast du eine Marke im Kopf?",
      subtitle:
        "Wähle die, die dich interessieren — oder mach ohne Auswahl weiter, dann sehen wir uns den ganzen Katalog an.",
      styleLegend: "Stil, falls du eine Vorliebe hast",
      changePhoto: "← Foto ändern",
      next: "Meine sechs ansehen →",
    },
    styles: {
      clasicas: "Klassisch",
      modernas: "Modern",
      oversized: "Oversize",
      minimalistas: "Minimalistisch",
      retro: "Retro",
      deportivas: "Sportlich",
    },
    choose: {
      title: "Deine sechs",
      empty: "Mit diesem Filter passt nichts",
      emptyBody:
        "Geh zurück und nimm eine Marke oder einen Stil heraus. Der Katalog hat {frames} Fassungen von {brands} Marken.",
      hint: "Wähle eine aus, und wir generieren sie auf deinem Gesicht",
      back: "← Marken",
      seeResults: "Ergebnisse ansehen ({count}) →",
    },
    result: {
      titleOne: "Auf deinem Gesicht",
      titleMany: "Vergleiche sie",
      counter: "{chosen} von {max}",
      back: "← Zurück zu den sechs",
      another: "Noch eine anprobieren",
      empty: "Keine Fassung ausgewählt.",
    },
    disclaimer:
      "Katalog im Aufbau: Wir haben Marke, Modell und Referenz, aber noch nicht die offiziellen Bilder oder Preise. Für die Simulation wird dein Foto an unseren Server und von dort an den Anbieter geschickt und nirgendwo gespeichert.",
  },

  upload: {
    cta: "Foto hochladen",
    changePhoto: "Foto ändern",
    formats: "JPG, PNG oder WEBP",
    hints: [
      "Frontal und gut ausgeleuchtet",
      "Augen sichtbar",
      "Ohne Filter",
      "Besser ohne Brille",
      "Nur du auf dem Foto",
    ],
    opening: "Foto wird geöffnet…",
    analyzing: "Proportionen werden in deinem Browser analysiert…",
    tryAnother: "Anderes Foto versuchen",
    yourProfile: "Dein Profil",
    lowConfidence:
      "Mit diesem Foto ist die Schätzung wenig belastbar. Ein frontaleres Bild würde besser gelesen.",
    removePhoto: "Foto entfernen",
    chosenPhotoAlt: "Das Foto, das du ausgewählt hast",
    notStored:
      "Das Foto wurde auf keinen Server hochgeladen. Die Analyse läuft in deinem Browser, und im Speicher bleiben nur Proportionen — ohne Bild.",
    errorDecode: "Wir konnten dieses Bild nicht öffnen. Versuch ein anderes.",
    errorPrepare: "Wir konnten dieses Bild nicht aufbereiten. Versuch ein anderes.",
    errorLoader:
      "Wir konnten den Analysator nicht laden. Prüf deine Verbindung und versuch es noch einmal.",
    errorProcess: "Wir konnten das Bild nicht verarbeiten. Versuch ein anderes Foto.",
    rejectedGeneric: "Wir brauchen ein frontaleres Foto mit besserem Licht.",
    issues: {
      "unsupported-type": "Wir akzeptieren nur JPG-, PNG- oder WEBP-Bilder.",
      "too-large": "Das Bild ist zu groß. Maximal 12 MB.",
      "too-small":
        "Das Bild ist zu klein. Wir brauchen mindestens 480 Pixel pro Seite.",
      "too-many-pixels": "Das Bild hat zu viel Auflösung. Verkleinere es.",
      empty: "Die Datei ist leer.",
    },
    quality: {
      "no-face":
        "Wir erkennen auf dem Foto kein Gesicht. Versuch ein frontales Foto.",
      "multiple-faces":
        "Es ist mehr als eine Person zu sehen. Wir brauchen ein Foto nur mit dir.",
      "incomplete-landmarks":
        "Wir sehen die Augen nicht gut. Versuch ein frontaleres Foto, ohne dass etwas sie verdeckt.",
      "head-turned":
        "Das Gesicht ist weggedreht. Schau bitte direkt in die Kamera.",
      "head-tilted": "Richte den Kopf etwas gerade und mach das Foto neu.",
      "eyes-closed":
        "Deine Augen sind geschlossen oder zusammengekniffen. Versuch ein anderes Foto.",
      "face-too-small":
        "Das Gesicht ist sehr klein im Bild. Geh näher heran oder schneide um dein Gesicht zu.",
      "resolution-too-low":
        "Das Foto hat eine niedrige Auflösung. Wir brauchen mindestens 480 Pixel pro Seite.",
    },
  },

  explain: {
    faceShapes: {
      oval: "ovales",
      round: "rundliches",
      square: "eckiges",
      oblong: "längliches",
      heart: "herzförmiges",
      diamond: "rautenförmiges",
      unknown: "schwer einzuordnendes",
    },
    /**
     * Sintagma completo, no un adjetivo suelto: en alemán «Pilotenform» es
     * una palabra y «rechteckige Form» son dos. Pegar un sufijo al adjetivo
     * produce engendros como «rechteckigeForm», así que cada entrada trae ya
     * su sustantivo.
     */
    frameShapes: {
      rectangular: "rechteckige Form",
      square: "eckige Form",
      round: "runde Form",
      oval: "ovale Form",
      aviator: "Pilotenform",
      "cat-eye": "Schmetterlingsform",
      wayfarer: "Wayfarer-Form",
      geometric: "geometrische Form",
      oversized: "Oversize-Form",
    },
    frameEffects: {
      rectangular: "bringt klare Linien und gibt dem Gesicht Struktur",
      square: "betont Kanten und sorgt für Präsenz",
      round: "macht die Züge weicher und nimmt Härte heraus",
      oval: "bleibt zurückhaltend und gleicht aus, ohne aufzufallen",
      aviator: "öffnet den Blick und streckt das Gesicht optisch",
      "cat-eye": "hebt den Blick und betont das obere Drittel",
      wayfarer: "gibt Breite und einen erkennbar klassischen Zug",
      geometric: "setzt einen deutlicheren Formkontrast",
      oversized: "bringt Volumen und verkürzt das Gesicht optisch",
    },
    unknownProfile:
      "Wir konnten deine Gesichtsform nicht klar genug schätzen. Du kannst trotzdem Formen ansehen und sie anprobieren.",
    profileOne:
      "Dein Gesicht passt anscheinend vor allem zu einem {primary} Profil.",
    profileTwo:
      "Dein Gesicht passt anscheinend vor allem zu einem {primary} Profil, mit einigen Zügen eines {secondary} Profils.",
    shapeClause: "die {shape} {effect}",
    widthClause: "ihre Breite steht im Verhältnis zu deinem Gesicht",
    styleClause: "sie passt zu dem Stil, den du gewählt hast",
    fallback: "Eine ausgewogene Option für den Anfang des Vergleichs.",
    matchGood: "Gute Kombination",
    matchVeryGood: "Sehr gute Kombination",
  },

  brandPicker: {
    suggestedPersonalised: "Passen zu deinen Proportionen",
    suggestedGeneric: "Marken",
    rest: "Und der Rest",
    clear: "Auswahl aufheben",
    note:
      "Lade ein Foto hoch, und wir sagen dir, welche am besten zu deinen Proportionen passen. Ohne Foto können wir sie nur alphabetisch sortieren.",
    mostly: "Vor allem {shapes}",
    and: "und",
  },

  results: {
    yourPhoto: "Dein Foto",
    generating: "Wird generiert… etwa 30 s",
    retry: "Erneut versuchen",
    remove: "Entfernen",
    removeLabel: "{model} entfernen",
    simulationAlt: "Simulation von {model} auf deinem Foto",
    simulationBadge: "Simulation",
    whereToBuy: "Wo zu kaufen",
    widthFit: {
      narrow: "Könnte dir zu schmal sein",
      good: "Ausgewogene Breite",
      wide: "Könnte dir zu breit sein",
    },
  },

  frameCard: {
    cta: "Auf meinem Gesicht ansehen",
    remove: "Entfernen",
    needsPhoto: "Lade ein Foto hoch, um sie aufgesetzt zu sehen",
    match: "Gute Kombination",
    unavailable: {
      derivative: "Anprobe für diese Marke nicht verfügbar",
      trademark: "Vereinbarung mit der Marke ausstehend",
      inactive: "Nicht verfügbar",
      unknown: "Nicht verfügbar",
    },
  },

  tryOn: {
    errors: {
      rateLimited:
        "Das waren viele Anproben hintereinander. Warte ein paar Minuten und versuch es noch einmal.",
      providerTimeout: "Der Anbieter hat zu lange gebraucht. Versuch es noch einmal.",
      providerUnavailable:
        "Der Anbieter ist gerade nicht verfügbar. Versuch es gleich noch einmal.",
      contentRejected:
        "Wir konnten diese Anprobe nicht erzeugen. Versuch eine andere Fassung oder ein anderes Foto.",
      invalidInput: "Mit dem Bild stimmt etwas nicht. Versuch ein anderes Foto.",
      noFaceDetected: "Wir erkennen auf dem Foto kein Gesicht.",
      unknown: "Wir konnten die Anprobe nicht erzeugen. Versuch es noch einmal.",
    },
    access: {
      title: "Das hier ist noch privat",
      body: "Jede Generierung kostet echtes Geld, deshalb braucht es vorerst einen Code zum Ausprobieren.",
      wrong: "Dieser Code stimmt nicht. Prüf, ob er vollständig ist.",
      placeholder: "Code",
      cancel: "Abbrechen",
      submit: "Weiter",
    },
  },

  legal: {
    pendingReview: "Stand dieses Dokuments",
    privacy: {
      label: "Datenschutz",
      title: "Was wir mit deinem Foto machen",
      intro: [
        "Diese Seite ist in der Validierungsphase und nimmt noch keine Fotos an. Das Folgende beschreibt, wie die Verarbeitung entworfen ist, damit du sie beurteilen kannst, bevor es sie gibt.",
      ],
      sections: [
        {
          heading: "Proportionsanalyse",
          paragraphs: [
            "Die Gesichtsproportionen werden in deinem Browser berechnet. Zu unserem Server gelangt nur ein Satz von etwa zwanzig dimensionslosen Verhältnissen — Relationen zwischen Breiten und Höhen — ohne jedes zugehörige Bild.",
            "Das ist eine Architekturentscheidung zur Minimierung der Angriffsfläche, keine rechtliche Aussage: Wir setzen nicht voraus, dass aus dem Gesicht abgeleitete Maße außerhalb des Datenschutzrechts liegen. Die rechtliche Einordnung prüft eine Fachperson, bevor das Produkt öffentlich wird.",
          ],
        },
        {
          heading: "Virtuelle Anprobe",
          paragraphs: [
            "Wenn du eine Fassung anprobieren möchtest, muss das Bild zur Verarbeitung das Gerät verlassen. Dann geht es in einen privaten Speicher mit kurzlebigen signierten Links und wird zusammen mit den abgeleiteten Ergebnissen nach kurzer Zeit gelöscht. Vorher siehst du, welcher Anbieter es verarbeitet und wie lange es aufbewahrt wird.",
          ],
        },
        {
          heading: "Was wir nicht tun",
          paragraphs: [],
          items: [
            "Wir betreiben keine Identitätserkennung und suchen nicht heraus, wer du bist.",
            "Wir leiten keine sensiblen persönlichen Merkmale aus deinem Gesicht ab.",
            "Wir trainieren keine Modelle mit deinen Fotos.",
            "Wir verkaufen keine Daten und nutzen sie nicht für personalisierte Werbung.",
            "Wir speichern keine Gesichtsbilder in Logs oder in der Analytik.",
            "Wir behalten dein Foto nicht „für alle Fälle“.",
          ],
        },
        {
          heading: "Stand dieses Dokuments",
          paragraphs: [
            "Juristische Prüfung steht aus. Es ist noch keine vollständige Datenschutzerklärung und gibt auch nicht vor, eine zu sein.",
          ],
        },
      ],
    },
    terms: {
      label: "Nutzungsbedingungen",
      title: "Bedingungen für die Nutzung",
      intro: [
        "Die Seite ist in der Validierungsphase. Es gibt keine buchbare Leistung, es werden keine Zahlungen angenommen und keine Nutzerdaten verarbeitet.",
      ],
      sections: [
        {
          heading: "Was diese Seite ist",
          paragraphs: [
            "Eine unabhängige Ebene zum Entdecken von Brillen. Wir verkaufen keine Fassungen, wir sind kein Optiker und wir haben keine geschäftliche Beziehung zu den Marken, die auftauchen können. Sobald es ihn gibt, führt der Kauflink in den Shop eines Dritten, der verkauft und zu dessen Bedingungen der Kauf zustande kommt.",
          ],
        },
        {
          heading: "Zu Empfehlungen und virtuellen Anproben",
          paragraphs: [
            "Die Empfehlungen sind Anhaltspunkte. Sie sind keine Messung und keine fachliche Beratung, und wir behaupten nicht, dass eine Fassung objektiv die ist, die dir am besten steht.",
            "Jede virtuelle Anprobe ist eine Simulation und wird als solche gekennzeichnet. Sie ersetzt das Anprobieren nicht.",
          ],
        },
        {
          heading: "Marken Dritter",
          paragraphs: [
            "Gezeigte Marken und Modelle gehören ihren Inhabern. Ihre Nennung bedeutet keine Vereinbarung, kein Sponsoring und keine Verbindung, und wir stellen niemanden als Partner dar, mit dem wir keine Vereinbarung haben.",
          ],
        },
        {
          heading: "Stand dieses Dokuments",
          paragraphs: [
            "Juristische Prüfung steht aus. Es ist noch kein vollständiges Vertragsdokument.",
          ],
        },
      ],
    },
    cookies: {
      label: "Cookies",
      title: "Cookies und Speicherung",
      intro: [
        "Heute setzt diese Seite keine Cookies und nutzt keine Analytik Dritter. Es gibt auch kein Consent-Banner, weil es nichts zu bewilligen gäbe.",
      ],
      sections: [
        {
          heading: "Was genutzt wird, sobald es ein Produkt gibt",
          paragraphs: [],
          items: [
            "Ein technisches Cookie für eine anonyme Sitzung, damit keine Anmeldung nötig ist und trotzdem Nutzungsgrenzen greifen. Ohne das kann das Produkt nicht funktionieren.",
            "Lokale Speicherung in deinem Browser für die Einstellungen, die du wählst — sie verlässt dein Gerät nie.",
            "Produktanalytik ohne Gesichtsinhalte und ohne dich persönlich zu identifizieren, um den Funnel zu messen.",
          ],
        },
        {
          heading: "Einwilligung",
          paragraphs: [
            "Was eine Einwilligung braucht, wird vor dem Setzen erfragt, nicht danach.",
          ],
        },
        {
          heading: "Stand dieses Dokuments",
          paragraphs: ["Juristische Prüfung steht aus."],
        },
      ],
    },
  },
};
