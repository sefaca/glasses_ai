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
  common: {
    home: "Inicio",
    back: "Volver",
    exit: "Salir",
    language: "Idioma",
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
  demo: {
    disclaimer:
      "Ejemplo generado. La persona de la foto no existe y las monturas son simulaciones, no fotografías de producto.",
    original: "La foto",
    noGlasses: "Sin gafas",
    photoAlt: "Foto de partida de una persona generada",
    simulationBadge: "Simulación",
    items: [
      { model: "Clubmaster", reference: "RB3016" },
      { model: "Round Metal", reference: "RB3447" },
    ],
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

  flow: {
    steps: ["Tu foto", "Marcas", "Elegir", "Resultado"],
    photo: {
      title: "Sube una foto y te decimos qué probarte.",
      subtitle: "El análisis de proporciones se ejecuta en tu navegador.",
    },
    brands: {
      title: "¿Alguna marca en mente?",
      subtitle:
        "Elige las que te interesen, o sigue sin elegir ninguna y miramos todo el catálogo.",
      styleLegend: "Estilo, si tienes preferencia",
      changePhoto: "← Cambiar la foto",
      next: "Ver mis seis →",
    },
    styles: {
      clasicas: "Clásicas",
      modernas: "Modernas",
      oversized: "Oversized",
      minimalistas: "Minimalistas",
      retro: "Retro",
      deportivas: "Deportivas",
    },
    choose: {
      title: "Tus seis",
      empty: "Nada encaja con ese filtro",
      emptyBody:
        "Vuelve atrás y quita alguna marca o algún estilo. El catálogo tiene {frames} monturas de {brands} marcas.",
      hint: "Elige una y la generamos sobre tu cara",
      back: "← Marcas",
      seeResults: "Ver resultados ({count}) →",
    },
    result: {
      titleOne: "Sobre tu cara",
      titleMany: "Compáralas",
      counter: "{chosen} de {max}",
      back: "← Volver a las seis",
      another: "Probar otra",
      empty: "No queda ninguna montura seleccionada.",
    },
    disclaimer:
      "Catálogo en construcción: tenemos marca, modelo y referencia, pero todavía no sus imágenes oficiales ni sus precios. Para generar la simulación tu foto se envía a nuestro servidor y de ahí al proveedor, y no se guarda en ningún sitio.",
  },

  upload: {
    cta: "Subir una foto",
    changePhoto: "Cambiar la foto",
    formats: "JPG, PNG o WEBP",
    hints: [
      "De frente y con buena luz",
      "Los ojos visibles",
      "Sin filtros",
      "Mejor sin gafas puestas",
      "Solo tú en la foto",
    ],
    opening: "Abriendo la foto…",
    analyzing: "Analizando proporciones en tu navegador…",
    tryAnother: "Probar con otra foto",
    yourProfile: "Tu perfil",
    lowConfidence:
      "La estimación es poco firme con esta foto. Una más frontal daría una lectura mejor.",
    removePhoto: "Quitar la foto",
    chosenPhotoAlt: "La foto que has elegido",
    notStored:
      "La foto no se ha subido a ningún servidor. El análisis se ejecuta en tu navegador y lo único que guardamos en memoria son proporciones, sin imagen.",
    errorDecode: "No hemos podido abrir esa imagen. Prueba con otra.",
    errorPrepare: "No hemos podido preparar esa imagen. Prueba con otra.",
    errorLoader:
      "No hemos podido cargar el analizador. Comprueba tu conexión y vuelve a intentarlo.",
    errorProcess: "No hemos podido procesar la imagen. Prueba con otra foto.",
    rejectedGeneric: "Necesitamos una foto más frontal y con mejor luz.",
    issues: {
      "unsupported-type": "Solo aceptamos imágenes JPG, PNG o WEBP.",
      "too-large": "La imagen pesa demasiado. El máximo son 12 MB.",
      "too-small":
        "La imagen es muy pequeña. Necesitamos al menos 480 píxeles de lado.",
      "too-many-pixels":
        "La imagen tiene demasiada resolución. Reduce su tamaño.",
      empty: "El archivo está vacío.",
    },
    quality: {
      "no-face":
        "No reconocemos una cara en la foto. Prueba con una foto frontal.",
      "multiple-faces":
        "Hay más de una persona. Necesitamos una foto en la que salgas solo tú.",
      "incomplete-landmarks":
        "No vemos bien los ojos. Prueba con una foto más frontal y sin nada que los tape.",
      "head-turned":
        "La cara está girada. Necesitamos que mires de frente a la cámara.",
      "head-tilted": "Endereza un poco la cabeza y repite la foto.",
      "eyes-closed": "Tienes los ojos cerrados o entornados. Prueba otra foto.",
      "face-too-small":
        "La cara sale muy pequeña. Acércate o recorta la foto alrededor de tu cara.",
      "resolution-too-low":
        "La foto tiene poca resolución. Necesitamos una imagen de al menos 480 píxeles de lado.",
    },
  },

  explain: {
    faceShapes: {
      oval: "ovalado",
      round: "redondeado",
      square: "cuadrado",
      oblong: "alargado",
      heart: "de corazón",
      diamond: "de diamante",
      unknown: "difícil de clasificar",
    },
    frameShapes: {
      rectangular: "rectangular",
      square: "cuadrada",
      round: "redonda",
      oval: "ovalada",
      aviator: "aviador",
      "cat-eye": "cat-eye",
      wayfarer: "wayfarer",
      geometric: "geométrica",
      oversized: "oversized",
    },
    frameEffects: {
      rectangular: "aporta líneas definidas y estructura el rostro",
      square: "marca ángulos y da presencia",
      round: "suaviza los rasgos y resta dureza",
      oval: "pasa desapercibida y equilibra sin llamar la atención",
      aviator: "abre la mirada y alarga visualmente el rostro",
      "cat-eye": "eleva la mirada y realza el tercio superior",
      wayfarer: "da anchura y un aire clásico reconocible",
      geometric: "introduce un contraste de forma más rotundo",
      oversized: "añade volumen y acorta visualmente el rostro",
    },
    unknownProfile:
      "No hemos podido estimar la forma de tu rostro con suficiente claridad. Aun así, puedes explorar estilos y probártelos.",
    profileOne:
      "Tu rostro parece encajar principalmente con un perfil {primary}.",
    profileTwo:
      "Tu rostro parece encajar principalmente con un perfil {primary}, con algunas características de un perfil {secondary}.",
    shapeClause: "la forma {shape} {effect}",
    widthClause: "su anchura queda proporcionada respecto a tu rostro",
    styleClause: "encaja con el estilo que has elegido",
    fallback: "Una opción equilibrada para empezar a comparar.",
    matchGood: "Buena combinación",
    matchVeryGood: "Muy buena combinación",
  },

  brandPicker: {
    suggestedPersonalised: "Encajan con tus proporciones",
    suggestedGeneric: "Marcas",
    rest: "Y el resto",
    clear: "Quitar la selección",
    note:
      "Sube una foto y te decimos cuáles encajan mejor con tus proporciones. Sin ella solo podemos ordenarlas alfabéticamente.",
    mostly: "Sobre todo {shapes}",
    and: "y",
  },

  results: {
    yourPhoto: "Tu foto",
    generating: "Generando… unos 30 s",
    retry: "Reintentar",
    remove: "Quitar",
    removeLabel: "Quitar {model}",
    simulationAlt: "Simulación de {model} sobre tu foto",
    simulationBadge: "Simulación",
    whereToBuy: "Dónde comprar",
    widthFit: {
      narrow: "Puede quedarte estrecha",
      good: "Anchura equilibrada",
      wide: "Puede quedarte ancha",
    },
  },

  frameCard: {
    cta: "Ver en mi cara",
    remove: "Quitar",
    needsPhoto: "Sube una foto para verla puesta",
    match: "Buena combinación",
    unavailable: {
      derivative: "Prueba no disponible para esta marca",
      trademark: "Pendiente de acuerdo con la marca",
      inactive: "No disponible",
      unknown: "No disponible",
    },
  },

  tryOn: {
    errors: {
      rateLimited:
        "Has hecho muchas pruebas seguidas. Espera unos minutos y vuelve a intentarlo.",
      providerTimeout: "El proveedor ha tardado demasiado. Vuelve a intentarlo.",
      providerUnavailable:
        "El proveedor no está disponible ahora mismo. Vuelve a intentarlo en un momento.",
      contentRejected:
        "No hemos podido generar esta prueba. Prueba con otra montura u otra foto.",
      invalidInput: "Algo falla con la imagen. Prueba con otra foto.",
      noFaceDetected: "No reconocemos una cara en la foto.",
      unknown: "No hemos podido generar la prueba. Vuelve a intentarlo.",
    },
    access: {
      title: "Esto todavía es privado",
      body: "Cada generación tiene un coste real, así que de momento hace falta un código para probarlo.",
      wrong: "Ese código no es correcto. Comprueba que esté completo.",
      placeholder: "Código",
      cancel: "Cancelar",
      submit: "Entrar",
    },
  },

  legal: {
    pendingReview: "Estado de este documento",
    privacy: {
      label: "Privacidad",
      title: "Qué hacemos con tu foto",
      intro: [
        "Este sitio está en fase de validación y todavía no acepta fotos. Lo que sigue describe cómo está diseñado el tratamiento, para que puedas juzgarlo antes de que exista.",
      ],
      sections: [
        {
          heading: "Análisis de proporciones",
          paragraphs: [
            "Las proporciones faciales se calculan en tu navegador. Lo único que viaja a nuestro servidor es un conjunto de unas veinte proporciones adimensionales —relaciones entre anchos y altos— sin ninguna imagen asociada.",
            "Es una decisión de arquitectura para minimizar la exposición, no una afirmación jurídica: no damos por hecho que unas medidas derivadas del rostro queden fuera de la normativa de protección de datos. La clasificación legal la revisará un profesional antes de que el producto se abra al público.",
          ],
        },
        {
          heading: "Prueba virtual",
          paragraphs: [
            "Si pides probarte una montura, la imagen sí tiene que salir del dispositivo para procesarse. En ese caso irá a un almacenamiento privado, con enlaces firmados de caducidad corta, y se eliminará junto con los resultados derivados pasado un plazo breve. Antes de que eso ocurra verás qué proveedor la procesa y durante cuánto tiempo se conserva.",
          ],
        },
        {
          heading: "Lo que no hacemos",
          paragraphs: [],
          items: [
            "No hacemos reconocimiento de identidad ni buscamos quién eres.",
            "No inferimos atributos personales sensibles a partir de tu cara.",
            "No entrenamos modelos con tus fotos.",
            "No vendemos datos ni los usamos para publicidad personalizada.",
            "No guardamos imágenes faciales en registros ni en analítica.",
            "No conservamos tu foto «por si acaso».",
          ],
        },
        {
          heading: "Estado de este documento",
          paragraphs: [
            "Pendiente de revisión jurídica profesional. No es todavía una política de privacidad completa y no pretende pasar por una.",
          ],
        },
      ],
    },
    terms: {
      label: "Términos",
      title: "Condiciones de uso",
      intro: [
        "El sitio está en fase de validación. No hay servicio contratable, no se aceptan pagos y no se procesan datos de usuarios.",
      ],
      sections: [
        {
          heading: "Qué es este sitio",
          paragraphs: [
            "Una capa independiente de descubrimiento de gafas. No vendemos monturas, no somos una óptica y no tenemos relación comercial con las marcas que puedan aparecer. Cuando exista, el enlace de compra llevará a la tienda del tercero, que es quien vende y a cuyas condiciones queda sujeta la compra.",
          ],
        },
        {
          heading: "Sobre las recomendaciones y las pruebas virtuales",
          paragraphs: [
            "Las recomendaciones son orientativas. No son una medición ni un consejo profesional, y no afirmamos que una montura sea objetivamente la que mejor te queda.",
            "Cualquier prueba virtual es una simulación y se identifica como tal. No sustituye a probarse la montura.",
          ],
        },
        {
          heading: "Marcas de terceros",
          paragraphs: [
            "Las marcas y modelos que aparezcan son propiedad de sus titulares. Su mención no implica acuerdo, patrocinio ni asociación, y no presentamos como socio a nadie con quien no tengamos un acuerdo.",
          ],
        },
        {
          heading: "Estado de este documento",
          paragraphs: [
            "Pendiente de revisión jurídica profesional. No es todavía un documento contractual completo.",
          ],
        },
      ],
    },
    cookies: {
      label: "Cookies",
      title: "Cookies y almacenamiento",
      intro: [
        "Hoy este sitio no instala ninguna cookie y no usa analítica de terceros. Tampoco hay un banner de consentimiento, porque no habría nada que consentir.",
      ],
      sections: [
        {
          heading: "Qué se usará cuando haya producto",
          paragraphs: [],
          items: [
            "Una cookie técnica de sesión anónima, para no exigir registro y poder aplicar límites de uso. Sin ella el producto no puede funcionar.",
            "Almacenamiento local en tu navegador para recordar las preferencias que elijas, que nunca sale de tu dispositivo.",
            "Analítica de producto sin contenido facial y sin identificarte personalmente, para medir el embudo.",
          ],
        },
        {
          heading: "Consentimiento",
          paragraphs: [
            "Lo que requiera consentimiento se pedirá antes de instalarse, no después.",
          ],
        },
        {
          heading: "Estado de este documento",
          paragraphs: ["Pendiente de revisión jurídica profesional."],
        },
      ],
    },
  },
};
