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
    pricing: "Precios",
    privacy: "Privacidad",
    terms: "Términos",
    refunds: "Reembolsos",
    cookies: "Cookies",
  },

  flow: {
    steps: ["Tu foto", "Tus seis", "Resultado"],
    filtersLabel: "Filtrar por marca o estilo",
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
    dropTitle: "Arrastra aquí tu foto",
    dropAction: "o pulsa para elegirla",
    dropPaste: "También puedes pegarla con Ctrl+V",
    dropActive: "Suéltala",
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
      freeExhausted:
        "Has usado tus pruebas gratuitas. Pronto podrás conseguir más.",
      dailyCap:
        "Hemos llegado al límite de pruebas de hoy. Vuelve mañana y lo intentamos de nuevo.",
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

    packs: {
      title: "Consigue más pruebas",
      body:
        "Has usado las tuyas. Elige un pack y sigue probando monturas sobre tu foto.",
      generations: "{count} pruebas",
      best: "El más elegido",
      buy: "Conseguirlas",
      note: "El precio final puede variar según tu país e impuestos.",
      unavailable: "Todavía no se puede comprar. Volvemos en unos días.",
      error: "No hemos podido abrir el pago. Vuelve a intentarlo.",
    },
  },

  checkout: {
    title: "Termina tu compra",
    body: "Abrimos la pasarela para que puedas terminar el pago.",
    opening: "Abriendo la pasarela...",
    missing: "No hay ningún pago pendiente en este enlace.",
    unavailable:
      "El pago no está disponible ahora mismo. Vuelve a intentarlo en un rato.",
    error: "No hemos podido abrir la pasarela. Vuelve a intentarlo.",
    back: "Volver a probar gafas",
  },

  auth: {
    title: "Crea tu cuenta para probártelas",
    body: "Hasta aquí has llegado sin dar nada, y lo que has visto seguirá siendo gratis.",
    titleAfterFree: "Ya la has visto. ¿Otra?",
    bodyAfterFree:
      "Esa era tu prueba gratuita. Crea tu cuenta y te damos otra, para que puedas comparar dos monturas sobre la misma foto.",
    emailLabel: "Tu correo",
    emailPlaceholder: "tu@correo.com",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Mínimo 8 caracteres",
    confirmLabel: "Repite la contraseña",
    confirmPlaceholder: "La misma otra vez",
    showPassword: "Ver contraseña",
    hidePassword: "Ocultar contraseña",
    submit: "Continuar",
    google: "Continuar con Google",
    or: "o",
    promise:
      "Solo usamos tu correo para que puedas entrar. Ni newsletter, ni publicidad, ni se lo damos a nadie. Puedes pedir que borremos tu cuenta cuando quieras.",
    signOut: "Cerrar sesión",
    errors: {
      invalidEmail: "Esa dirección no parece válida. Revísala.",
      weakPassword: "La contraseña necesita al menos 8 caracteres.",
      passwordMismatch: "Las dos contraseñas no coinciden.",
      wrongPassword: "Esa contraseña no es correcta para este correo.",
      rateLimited: "Demasiados intentos seguidos. Prueba dentro de un rato.",
      unavailable: "El registro no está disponible ahora mismo. Vuelve a intentarlo más tarde.",
      generic: "No hemos podido completarlo. Vuelve a intentarlo.",
    },
  },
  waitlist: {
    prompt: "No tengo código",
    title: "Te avisamos cuando puedas probarlo",
    body: "Estamos abriendo poco a poco porque cada prueba tiene un coste real. Déjanos tu correo y te escribimos cuando te toque.",
    emailLabel: "Tu correo",
    emailPlaceholder: "tu@correo.com",
    submit: "Avisadme",
    promise:
      "Un único correo, cuando puedas entrar. Nada más: ni newsletter, ni publicidad, ni tu correo a terceros. Puedes pedir que lo borremos cuando quieras.",
    successTitle: "Apuntado",
    successBody:
      "Te escribiremos a esa dirección cuando abramos tu turno. Puedes cerrar esto y seguir mirando.",
    errors: {
      invalidEmail: "Esa dirección no parece válida. Revísala.",
      rateLimited: "Demasiados intentos seguidos. Prueba dentro de un rato.",
      unavailable:
        "Todavía no podemos guardar tu correo, así que no te lo pedimos a medias. Vuelve a intentarlo en unos días.",
      generic: "No hemos podido apuntarte. Vuelve a intentarlo.",
    },
  },

  pricing: {
    title: "Precios",
    intro:
      "Empieza gratis. Si te quedas, compras un pack de pruebas cuando lo necesites: sin suscripción y sin caducidad.",
    free: {
      title: "Gratis, sin tarjeta",
      body:
        "Una prueba sin registrarte y otra más al crear tu cuenta. Suficiente para ver dos monturas sobre tu propia cara antes de decidir nada.",
    },
    packsTitle: "Packs de pruebas",
    generations: "{count} pruebas",
    best: "El más elegido",
    note:
      "Precios con impuestos incluidos. El importe exacto depende de tu país y se te muestra antes de pagar.",
    cta: "Probar gratis",
    points: [
      "Las generaciones no caducan.",
      "Sin suscripción: pagas una vez y ya está.",
      "Si una prueba falla, no gasta saldo.",
    ],
    refunds: "Lee la política de reembolso",
  },
  legal: {
    refunds: {
      label: "Reembolsos",
      title: "Política de reembolso",
      intro: [
        "Los packs son contenido digital: las generaciones se añaden a tu cuenta en cuanto se confirma el pago.",
        "La venta la realiza Paddle.com Market Ltd como vendedor registrado. Es quien figura en tu factura y quien ejecuta la devolución.",
      ],
      sections: [
        {
          heading: "Catorce días, si no has gastado nada",
          paragraphs: [
            "Si no has usado ninguna generación del pack, te devolvemos el importe íntegro dentro de los 14 días siguientes a la compra. No hace falta que expliques por qué.",
          ],
        },
        {
          heading: "Si ya has gastado alguna",
          paragraphs: [
            "Dentro de esos mismos 14 días te devolvemos la parte proporcional a las generaciones que te queden sin usar.",
            "Pasado el plazo, escríbenos igualmente: si algo no ha funcionado como prometemos, lo resolvemos.",
          ],
        },
        {
          heading: "Una prueba fallida no gasta saldo",
          paragraphs: [
            "Si una generación falla, no se descuenta de tu saldo. No tienes que reclamar nada, porque no llega a cobrarse.",
          ],
        },
        {
          heading: "Cómo pedirlo",
          paragraphs: [
            "Escribe a {email} desde el correo con el que compraste, indicando el número de pedido de tu factura. Respondemos en un plazo máximo de cinco días hábiles.",
            "También puedes contactar directamente con el soporte de Paddle, cuyos datos aparecen en la factura que recibiste.",
          ],
        },
        {
          heading: "Derecho de desistimiento",
          paragraphs: [
            "Al comprar aceptas que las generaciones queden disponibles de inmediato, lo que supone renunciar al derecho de desistimiento sobre las que ya hayas consumido. Lo que no hayas usado sigue cubierto por los 14 días descritos arriba.",
          ],
        },
        {
          heading: "Estado de este documento",
          paragraphs: [
            "Pendiente de revisión jurídica profesional.",
          ],
        },
      ],
    },
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
          heading: "Si te apuntas a la lista de espera",
          paragraphs: [
            "Es lo único que guardamos de ti como persona identificable, y solo si lo pides tú. Guardamos tu correo, el idioma en que te apuntaste, desde qué punto de la web lo hiciste y la fecha en que aceptaste. Nada más: ni tu nombre, ni tu IP, ni nada de tu foto o de tu rostro.",
            "La lista no se cruza con la analítica del producto. Lo que medimos del uso es anónimo y así se queda: unirlo a tu correo lo convertiría en un seguimiento identificado.",
            "Lo usamos para un único correo, cuando podamos abrirte el acceso. No vendemos ni cedemos la lista. Puedes pedirnos que borremos tu dirección cuando quieras y lo haremos sin preguntarte por qué.",
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
        "El sitio está en fase inicial. El uso básico es gratuito y, si quieres más pruebas, puedes comprar un pack de generaciones.",
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
          heading: "Qué se vende y quién vende",
          paragraphs: [
            "El uso básico es gratuito. Quien quiera más pruebas puede comprar un pack de generaciones: contenido digital, sin suscripción, que se añade a tu cuenta al completar el pago y no caduca.",
            "La venta la realiza Paddle.com Market Ltd como vendedor registrado. Es quien figura en tu factura y quien gestiona el cobro, los impuestos y las devoluciones. Las condiciones están en nuestra política de reembolso.",
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
        "Este sitio no instala ninguna cookie y no usa analítica de terceros. Tampoco hay un banner de consentimiento, porque no hay nada que consentir.",
        "Sí medimos cómo se usa el producto, con analítica propia: qué pasos se completan y qué falla. No lleva cookies, no identifica a nadie y nunca incluye tu foto ni medidas de tu cara. Para agrupar los pasos de una misma visita usamos un identificador aleatorio guardado en la memoria de la pestaña, que desaparece al cerrarla.",
      ],
      sections: [
        {
          heading: "Qué se usará cuando haya producto",
          paragraphs: [],
          items: [
            "Si creas una cuenta, una cookie técnica para mantener tu sesión. Es estrictamente necesaria —sin ella no podemos saber que eres tú— y por eso no necesita consentimiento, pero aquí queda dicha. Dura 30 días y desaparece al cerrar sesión. Si no te registras, no se instala.",
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
