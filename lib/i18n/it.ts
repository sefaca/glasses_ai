import type { Dictionary } from "./types";

/**
 * Italiano.
 *
 * El término de categoría es «occhiali da sole». Ojo con las formas: el
 * mercado italiano busca «aviator» en inglés, no «a goccia», y «squadrati» /
 * «rettangolari» para las angulares.
 *
 * REVISIÓN HUMANA PENDIENTE → docs/GROWTH_SEO.md. Ningún idioma debería
 * publicarse indexable sin que lo lea una persona nativa.
 */
export const it: Dictionary = {
  meta: {
    title: "Scopri quali occhiali ti stanno bene e provali",
    description:
      "Carica una foto, scopri gli occhiali da sole adatti alle tue proporzioni e confronta i modelli prima di comprare.",
  },
  nav: {
    styles: "Stili",
    howItWorks: "Come funziona",
  },
  common: {
    home: "Home",
    back: "Indietro",
    exit: "Esci",
    language: "Lingua",
  },
  hero: {
    eyebrow: "Occhiali da sole",
    title: "Scopri quali occhiali ti stanno bene.",
    titleAccent: "Provali sul tuo viso.",
    subtitle:
      "Carica una foto, ricevi sei modelli adatti alle tue proporzioni e confrontali prima di decidere.",
    ctaPrimary: "Prova gratis",
    ctaSecondary: "Esplora gli stili",
    note: "Senza registrazione. La tua foto non viene conservata.",
  },
  demo: {
    disclaimer:
      "Esempio generato. La persona nella foto non esiste e le montature sono simulazioni, non fotografie di prodotto.",
    original: "La foto",
    noGlasses: "Senza occhiali",
    photoAlt: "Foto di partenza di una persona generata",
    simulationBadge: "Simulazione",
    items: [
      { model: "Clubmaster", reference: "RB3016" },
      { model: "Round Metal", reference: "RB3447" },
    ],
  },
  steps: {
    label: "Come funziona",
    items: [
      {
        title: "Carichi una foto",
        body: "Frontale e ben illuminata. L'analisi delle proporzioni avviene nel tuo browser: per quello la foto non esce dal telefono.",
      },
      {
        title: "Te ne diamo sei",
        body: "Non un catalogo infinito. Sei montature di marche diverse, ognuna con un motivo preciso per essere lì.",
      },
      {
        title: "Confronti e scegli",
        body: "Le provi, le metti una accanto all'altra e ti portiamo dove si compra il modello che scegli.",
      },
    ],
  },
  catalog: {
    label: "Il catalogo",
    title: "Forme, non tendenze.",
    body: "Ogni montatura entra per la sua geometria e le sue misure, non per quello che va di moda. È così che possiamo spiegarti perché te la consigliamo.",
    cta: "Vedi tutte le forme",
  },
  privacy: {
    label: "Privacy",
    title: "Il tuo viso non è il nostro prodotto.",
    body: "Le proporzioni del viso vengono calcolate nel tuo browser. Se chiedi una prova virtuale, l'immagine finisce in uno spazio privato, scade in poche ore e viene cancellata. Non facciamo riconoscimento dell'identità né profilazione.",
    link: "Come trattiamo i tuoi dati",
  },
  frames: {
    shapes: {
      rectangular: "Rettangolare",
      square: "Squadrata",
      round: "Rotonda",
      oval: "Ovale",
      aviator: "Aviator",
      "cat-eye": "Cat-eye",
      wayfarer: "Wayfarer",
      geometric: "Geometrica",
      oversized: "Oversize",
    },
    simulationNotice: "Simulazione. Il risultato è indicativo.",
  },
  footer: {
    tagline: "Scoperta indipendente di occhiali. Fase di validazione.",
    privacy: "Privacy",
    terms: "Termini",
    cookies: "Cookie",
  },

  flow: {
    steps: ["La tua foto", "Marche", "Scegli", "Risultato"],
    photo: {
      title: "Carica una foto e ti diciamo cosa provare.",
      subtitle: "L'analisi delle proporzioni avviene nel tuo browser.",
    },
    brands: {
      title: "Hai in mente qualche marca?",
      subtitle:
        "Scegli quelle che ti interessano, oppure vai avanti senza sceglierne nessuna e guardiamo tutto il catalogo.",
      styleLegend: "Stile, se hai una preferenza",
      changePhoto: "← Cambia la foto",
      next: "Vedi i miei sei →",
    },
    styles: {
      clasicas: "Classici",
      modernas: "Moderni",
      oversized: "Oversize",
      minimalistas: "Minimal",
      retro: "Retrò",
      deportivas: "Sportivi",
    },
    choose: {
      title: "I tuoi sei",
      empty: "Nessun risultato con questo filtro",
      emptyBody:
        "Torna indietro e togli una marca o uno stile. Il catalogo ha {frames} montature di {brands} marche.",
      hint: "Scegline uno e lo generiamo sul tuo viso",
      back: "← Marche",
      seeResults: "Vedi i risultati ({count}) →",
    },
    result: {
      titleOne: "Sul tuo viso",
      titleMany: "Confrontali",
      counter: "{chosen} di {max}",
      back: "← Torna ai sei",
      another: "Provane un altro",
      empty: "Non è selezionata nessuna montatura.",
    },
    disclaimer:
      "Catalogo in costruzione: abbiamo marca, modello e referenza, ma non ancora le immagini ufficiali né i prezzi. Per generare la simulazione la tua foto viene inviata al nostro server e da lì al fornitore, e non viene conservata da nessuna parte.",
  },

  upload: {
    cta: "Carica una foto",
    changePhoto: "Cambia la foto",
    formats: "JPG, PNG o WEBP",
    hints: [
      "Di fronte e con buona luce",
      "Occhi visibili",
      "Senza filtri",
      "Meglio senza occhiali",
      "Solo tu nella foto",
    ],
    opening: "Apertura della foto…",
    analyzing: "Analisi delle proporzioni nel tuo browser…",
    tryAnother: "Prova con un'altra foto",
    yourProfile: "Il tuo profilo",
    lowConfidence:
      "Con questa foto la stima è poco solida. Una più frontale darebbe una lettura migliore.",
    removePhoto: "Togli la foto",
    chosenPhotoAlt: "La foto che hai scelto",
    notStored:
      "La foto non è stata caricata su nessun server. L'analisi avviene nel tuo browser e in memoria restano solo proporzioni, senza immagine.",
    errorDecode: "Non siamo riusciti ad aprire l'immagine. Provane un'altra.",
    errorPrepare: "Non siamo riusciti a preparare l'immagine. Provane un'altra.",
    errorLoader:
      "Non siamo riusciti a caricare l'analizzatore. Controlla la connessione e riprova.",
    errorProcess: "Non siamo riusciti a elaborare l'immagine. Prova con un'altra foto.",
    rejectedGeneric: "Serve una foto più frontale e con una luce migliore.",
    issues: {
      "unsupported-type": "Accettiamo solo immagini JPG, PNG o WEBP.",
      "too-large": "L'immagine pesa troppo. Il massimo è 12 MB.",
      "too-small":
        "L'immagine è troppo piccola. Servono almeno 480 pixel per lato.",
      "too-many-pixels": "L'immagine ha una risoluzione eccessiva. Riducila.",
      empty: "Il file è vuoto.",
    },
    quality: {
      "no-face":
        "Non riconosciamo un volto nella foto. Prova con una foto frontale.",
      "multiple-faces":
        "C'è più di una persona. Serve una foto in cui ci sia solo tu.",
      "incomplete-landmarks":
        "Non vediamo bene gli occhi. Prova con una foto più frontale e senza nulla che li copra.",
      "head-turned":
        "Il viso è girato. Serve che tu guardi dritto verso la fotocamera.",
      "head-tilted": "Raddrizza un po' la testa e rifai la foto.",
      "eyes-closed":
        "Hai gli occhi chiusi o socchiusi. Prova con un'altra foto.",
      "face-too-small":
        "Il viso è troppo piccolo nell'inquadratura. Avvicinati o ritaglia intorno al viso.",
      "resolution-too-low":
        "La foto ha una risoluzione bassa. Serve un'immagine di almeno 480 pixel per lato.",
    },
  },

  explain: {
    faceShapes: {
      oval: "ovale",
      round: "tondeggiante",
      square: "squadrato",
      oblong: "allungato",
      heart: "a cuore",
      diamond: "a diamante",
      unknown: "difficile da classificare",
    },
    frameShapes: {
      rectangular: "rettangolare",
      square: "squadrata",
      round: "rotonda",
      oval: "ovale",
      aviator: "aviator",
      "cat-eye": "cat-eye",
      wayfarer: "wayfarer",
      geometric: "geometrica",
      oversized: "oversize",
    },
    frameEffects: {
      rectangular: "porta linee definite e struttura il viso",
      square: "segna gli angoli e dà presenza",
      round: "ammorbidisce i tratti e toglie durezza",
      oval: "resta discreta ed equilibra senza farsi notare",
      aviator: "apre lo sguardo e allunga visivamente il viso",
      "cat-eye": "solleva lo sguardo e valorizza il terzo superiore",
      wayfarer: "dà larghezza e un'aria classica riconoscibile",
      geometric: "introduce un contrasto di forma più deciso",
      oversized: "aggiunge volume e accorcia visivamente il viso",
    },
    unknownProfile:
      "Non siamo riusciti a stimare la forma del tuo viso con sufficiente chiarezza. Puoi comunque esplorare gli stili e provarli.",
    profileOne:
      "Il tuo viso sembra corrispondere soprattutto a un profilo {primary}.",
    profileTwo:
      "Il tuo viso sembra corrispondere soprattutto a un profilo {primary}, con alcune caratteristiche di un profilo {secondary}.",
    shapeClause: "la forma {shape} {effect}",
    widthClause: "la sua larghezza è proporzionata al tuo viso",
    styleClause: "si abbina allo stile che hai scelto",
    fallback: "Un'opzione equilibrata da cui iniziare a confrontare.",
    matchGood: "Buon abbinamento",
    matchVeryGood: "Ottimo abbinamento",
  },

  brandPicker: {
    suggestedPersonalised: "Adatte alle tue proporzioni",
    suggestedGeneric: "Marche",
    rest: "E il resto",
    clear: "Togli la selezione",
    note:
      "Carica una foto e ti diciamo quali si adattano meglio alle tue proporzioni. Senza foto possiamo solo ordinarle alfabeticamente.",
    mostly: "Soprattutto {shapes}",
    and: "e",
  },

  results: {
    yourPhoto: "La tua foto",
    generating: "Generazione… circa 30 s",
    retry: "Riprova",
    remove: "Rimuovi",
    removeLabel: "Rimuovi {model}",
    simulationAlt: "Simulazione di {model} sulla tua foto",
    simulationBadge: "Simulazione",
    whereToBuy: "Dove comprare",
    widthFit: {
      narrow: "Potrebbe risultare stretta",
      good: "Larghezza equilibrata",
      wide: "Potrebbe risultare larga",
    },
  },

  frameCard: {
    cta: "Vedi sul mio viso",
    remove: "Rimuovi",
    needsPhoto: "Carica una foto per vederli indossati",
    match: "Buon abbinamento",
    unavailable: {
      derivative: "Prova non disponibile per questa marca",
      trademark: "In attesa di accordo con la marca",
      inactive: "Non disponibile",
      unknown: "Non disponibile",
    },
  },

  tryOn: {
    errors: {
      rateLimited:
        "Hai fatto molte prove di seguito. Aspetta qualche minuto e riprova.",
      providerTimeout: "Il fornitore ci ha messo troppo. Riprova.",
      providerUnavailable:
        "Il fornitore non è disponibile in questo momento. Riprova tra poco.",
      contentRejected:
        "Non siamo riusciti a generare questa prova. Prova con un'altra montatura o un'altra foto.",
      invalidInput: "C'è qualcosa che non va nell'immagine. Prova un'altra foto.",
      noFaceDetected: "Non riconosciamo un volto nella foto.",
      unknown: "Non siamo riusciti a generare la prova. Riprova.",
    },
    access: {
      title: "Questo è ancora privato",
      body: "Ogni generazione ha un costo reale, quindi per ora serve un codice per provarlo.",
      wrong: "Il codice non è corretto. Controlla che sia completo.",
      placeholder: "Codice",
      cancel: "Annulla",
      submit: "Entra",
    },
  },

  legal: {
    pendingReview: "Stato di questo documento",
    privacy: {
      label: "Privacy",
      title: "Cosa facciamo con la tua foto",
      intro: [
        "Questo sito è in fase di validazione e non accetta ancora foto. Quello che segue descrive come è progettato il trattamento, così puoi giudicarlo prima che esista.",
      ],
      sections: [
        {
          heading: "Analisi delle proporzioni",
          paragraphs: [
            "Le proporzioni del viso vengono calcolate nel tuo browser. L'unica cosa che arriva al nostro server è un insieme di circa venti proporzioni adimensionali —rapporti fra larghezze e altezze— senza nessuna immagine associata.",
            "È una scelta di architettura per ridurre l'esposizione, non un'affermazione giuridica: non diamo per scontato che delle misure derivate dal volto restino fuori dalla normativa sulla protezione dei dati. La classificazione legale sarà verificata da un professionista prima dell'apertura al pubblico.",
          ],
        },
        {
          heading: "Prova virtuale",
          paragraphs: [
            "Se chiedi di provare una montatura, l'immagine deve uscire dal dispositivo per essere elaborata. In quel caso finisce in uno spazio privato, con link firmati a scadenza breve, e viene cancellata insieme ai risultati derivati dopo poco tempo. Prima che accada vedrai quale fornitore la elabora e per quanto tempo viene conservata.",
          ],
        },
        {
          heading: "Quello che non facciamo",
          paragraphs: [],
          items: [
            "Non facciamo riconoscimento dell'identità e non cerchiamo di capire chi sei.",
            "Non deduciamo attributi personali sensibili dal tuo volto.",
            "Non addestriamo modelli con le tue foto.",
            "Non vendiamo dati e non li usiamo per pubblicità personalizzata.",
            "Non conserviamo immagini del volto nei log né nelle analitiche.",
            "Non teniamo la tua foto «per ogni evenienza».",
          ],
        },
        {
          heading: "Stato di questo documento",
          paragraphs: [
            "In attesa di revisione legale professionale. Non è ancora un'informativa privacy completa e non pretende di esserlo.",
          ],
        },
      ],
    },
    terms: {
      label: "Termini",
      title: "Condizioni d'uso",
      intro: [
        "Il sito è in fase di validazione. Non c'è un servizio da sottoscrivere, non si accettano pagamenti e non si trattano dati degli utenti.",
      ],
      sections: [
        {
          heading: "Cos'è questo sito",
          paragraphs: [
            "Un livello indipendente di scoperta di occhiali. Non vendiamo montature, non siamo un ottico e non abbiamo rapporti commerciali con le marche che possono comparire. Quando esisterà, il link d'acquisto porterà al negozio di terzi, che è il venditore e alle cui condizioni è soggetto l'acquisto.",
          ],
        },
        {
          heading: "Su consigli e prove virtuali",
          paragraphs: [
            "I consigli sono indicativi. Non sono una misurazione né un parere professionale, e non affermiamo che una montatura sia oggettivamente quella che ti sta meglio.",
            "Ogni prova virtuale è una simulazione ed è indicata come tale. Non sostituisce il provare la montatura.",
          ],
        },
        {
          heading: "Marchi di terzi",
          paragraphs: [
            "I marchi e i modelli che compaiono appartengono ai rispettivi titolari. La loro menzione non implica accordo, sponsorizzazione o associazione, e non presentiamo come partner nessuno con cui non abbiamo un accordo.",
          ],
        },
        {
          heading: "Stato di questo documento",
          paragraphs: [
            "In attesa di revisione legale professionale. Non è ancora un documento contrattuale completo.",
          ],
        },
      ],
    },
    cookies: {
      label: "Cookie",
      title: "Cookie e archiviazione",
      intro: [
        "Oggi questo sito non installa nessun cookie e non usa analitiche di terzi. Non c'è nemmeno un banner di consenso, perché non ci sarebbe nulla da consentire.",
      ],
      sections: [
        {
          heading: "Cosa useremo quando ci sarà il prodotto",
          paragraphs: [],
          items: [
            "Un cookie tecnico di sessione anonima, per non richiedere la registrazione e poter applicare limiti d'uso. Senza di esso il prodotto non può funzionare.",
            "Archiviazione locale nel browser per ricordare le preferenze che scegli, che non esce mai dal tuo dispositivo.",
            "Analitiche di prodotto senza contenuto del volto e senza identificarti personalmente, per misurare il funnel.",
          ],
        },
        {
          heading: "Consenso",
          paragraphs: [
            "Tutto ciò che richiede consenso verrà chiesto prima di essere installato, non dopo.",
          ],
        },
        {
          heading: "Stato di questo documento",
          paragraphs: ["In attesa di revisione legale professionale."],
        },
      ],
    },
  },
};
