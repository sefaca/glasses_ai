import type { FrameShape } from "../catalog/types";
import type { Locale } from "../i18n";

/**
 * Texto propio de cada forma, en los cinco idiomas.
 *
 * Vive aquí y no en el diccionario de interfaz porque es **contenido
 * editorial**, no etiquetas: son las dos o tres frases que diferencian una
 * página de forma de la siguiente. Sin esto, nueve páginas de forma serían la
 * misma plantilla con el nombre cambiado, que es exactamente lo que Google
 * trata como contenido escalado sin valor.
 *
 * Dos reglas al escribir aquí:
 *
 * - **Nada numérico.** Las medidas concretas van en las guías, donde se puede
 *   citar la fuente. Aquí se habla de efecto visual y de qué comprobar, que es
 *   cualitativo y no requiere verificar una ficha.
 * - **Nada de «te favorece».** La compatibilidad entre forma de rostro y
 *   montura es una hipótesis de producto sin validar, y afirmarla como un
 *   hecho sería inventar precisión → CLAUDE.md §8.5.
 */

export interface ShapeCopy {
  /** Qué es la forma y qué hace visualmente. */
  intro: string;
  /** Qué mirar al elegir una, en cualitativo. */
  choosing: string;
}

/**
 * Nombre de cada forma **como título de página**, por idioma.
 *
 * Distinto de la etiqueta de interfaz a propósito. En alemán «Pilotenbrille»
 * ya es la gafa entera, no un adjetivo: componer «{forma} Sonnenbrillen»
 * producía «pilotenbrille Sonnenbrillen», que ni es alemán ni es una
 * búsqueda real. Cada idioma trae aquí el sintagma que la gente escribe.
 */
export const SHAPE_PAGE_NAME: Record<Locale, Record<FrameShape, string>> = {
  es: {
    rectangular: "Gafas de sol rectangulares",
    square: "Gafas de sol cuadradas",
    round: "Gafas de sol redondas",
    oval: "Gafas de sol ovaladas",
    aviator: "Gafas de sol aviador",
    "cat-eye": "Gafas de sol cat-eye (ojo de gato)",
    wayfarer: "Gafas de sol wayfarer",
    geometric: "Gafas de sol geométricas",
    oversized: "Gafas de sol grandes (oversize)",
  },
  en: {
    rectangular: "Rectangular sunglasses",
    square: "Square sunglasses",
    round: "Round sunglasses",
    oval: "Oval sunglasses",
    aviator: "Aviator sunglasses",
    "cat-eye": "Cat-eye sunglasses",
    wayfarer: "Wayfarer sunglasses",
    geometric: "Geometric sunglasses",
    oversized: "Oversized sunglasses",
  },
  it: {
    rectangular: "Occhiali da sole rettangolari",
    square: "Occhiali da sole squadrati",
    round: "Occhiali da sole rotondi",
    oval: "Occhiali da sole ovali",
    aviator: "Occhiali da sole aviator",
    "cat-eye": "Occhiali da sole cat-eye",
    wayfarer: "Occhiali da sole wayfarer",
    geometric: "Occhiali da sole geometrici",
    oversized: "Occhiali da sole oversize",
  },
  pt: {
    rectangular: "Óculos de sol retangulares",
    square: "Óculos de sol quadrados",
    round: "Óculos de sol redondos",
    oval: "Óculos de sol ovais",
    aviator: "Óculos de sol aviador",
    "cat-eye": "Óculos de sol gatinho",
    wayfarer: "Óculos de sol wayfarer",
    geometric: "Óculos de sol geométricos",
    oversized: "Óculos de sol oversized",
  },
  de: {
    rectangular: "Rechteckige Sonnenbrillen",
    square: "Eckige Sonnenbrillen",
    round: "Runde Sonnenbrillen",
    oval: "Ovale Sonnenbrillen",
    aviator: "Pilotenbrillen",
    "cat-eye": "Schmetterlingsbrillen",
    wayfarer: "Wayfarer Sonnenbrillen",
    geometric: "Geometrische Sonnenbrillen",
    oversized: "Oversize Sonnenbrillen",
  },
};

/**
 * Plantillas de metadatos por idioma. `{shape}` es el nombre de página de
 * arriba, ya completo, así que la plantilla solo añade el complemento.
 */
export const SHAPE_META: Record<Locale, { title: string; description: string }> = {
  es: {
    title: "{shape}: modelos y cómo elegir la talla",
    description:
      "{shape}: qué define esta forma de montura, qué comprobar antes de elegir una talla y qué modelos de varias marcas tenemos en catálogo.",
  },
  en: {
    title: "{shape}: models and how to pick the size",
    description:
      "{shape}: what defines this frame shape, what to check before choosing a size, and which models from several brands are in our catalogue.",
  },
  it: {
    title: "{shape}: modelli e come scegliere la taglia",
    description:
      "{shape}: cosa definisce questa forma, cosa controllare prima di scegliere una taglia e quali modelli di diverse marche abbiamo in catalogo.",
  },
  pt: {
    title: "{shape}: modelos e como escolher o tamanho",
    description:
      "{shape}: o que define este formato, o que conferir antes de escolher um tamanho e quais modelos de várias marcas temos no catálogo.",
  },
  de: {
    title: "{shape}: Modelle und die richtige Größe",
    description:
      "{shape}: was diese Fassungsform ausmacht, worauf du bei der Größe achten solltest und welche Modelle verschiedener Marken im Katalog stehen.",
  },
};

export const SHAPE_COPY: Record<Locale, Record<FrameShape, ShapeCopy>> = {
  // ── Español ────────────────────────────────────────────────────────────
  es: {
    rectangular: {
      intro:
        "La montura rectangular es más ancha que alta y mantiene las esquinas marcadas. Es la forma que más estructura aporta sin llegar a la rotundidad de una cuadrada, y por eso aguanta bien tanto un acetato grueso como un metal fino.",
      choosing:
        "Mira sobre todo la anchura del frontal: una rectangular estrecha se queda corta en una cara ancha y se nota más que en otras formas, porque las líneas horizontales marcan dónde termina la montura.",
    },
    square: {
      intro:
        "La cuadrada tiene proporciones de lente parecidas en alto y ancho, con ángulos definidos. Da presencia y es la forma con más carácter geométrico del catálogo.",
      choosing:
        "La altura de la lente importa tanto como la anchura: una cuadrada alta ocupa mucha cara y cambia el resultado más que un par de milímetros de calibre.",
    },
    round: {
      intro:
        "La redonda suaviza los rasgos y es la forma más reconocible de la tradición óptica. Funciona en metal fino, donde casi desaparece, y en acetato, donde se convierte en el centro de la cara.",
      choosing:
        "En una montura circular el calibre y la altura de lente son casi iguales, así que un calibre grande sube de golpe el tamaño aparente. Conviene ir a la talla más pequeña de las que te encajen.",
    },
    oval: {
      intro:
        "La ovalada es la más discreta: formas suaves, sin esquinas y con la lente más ancha que alta. Equilibra sin llamar la atención, que es justo su razón de ser.",
      choosing:
        "Al ser estrecha de alto, el puente y la posición en la nariz pesan más de lo normal. Compara el puente con el de unas gafas que ya te asienten bien.",
    },
    aviator: {
      intro:
        "La aviador nació como montura técnica y acabó siendo un icono. Lente en forma de gota, doble puente y metal: abre la mirada y alarga visualmente el rostro.",
      choosing:
        "Es la forma donde más cambia el resultado entre tallas, porque la lente cae hacia abajo. Dos milímetros de calibre se notan más aquí que en una wayfarer.",
    },
    "cat-eye": {
      intro:
        "La cat-eye sube en las esquinas exteriores y eleva la mirada. Es la forma con más intención estética del catálogo y la que menos pasa desapercibida.",
      choosing:
        "El ángulo de subida varía mucho entre modelos y no se publica en ninguna ficha. Es la forma donde más merece la pena ver el modelo concreto antes de decidir.",
    },
    wayfarer: {
      intro:
        "La wayfarer es trapezoidal, de acetato y con el frontal algo inclinado. Es probablemente la forma de gafa de sol más vendida de la historia y la que más versiones tiene.",
      choosing:
        "Cuidado con dar por hecha la talla: dentro de la misma familia hay versiones con puente de 18 y de 22 milímetros, y eso cambia cómo apoya aunque el calibre sea el mismo.",
    },
    geometric: {
      intro:
        "Bajo geométrica entran las formas que no encajan en las clásicas: hexágonos, pantos y combinaciones de recta y curva. Es la categoría con más variedad real entre modelos.",
      choosing:
        "Al no haber un patrón común, dos monturas geométricas con las mismas medidas pueden verse completamente distintas. Aquí la medida orienta menos que en el resto de formas.",
    },
    oversized: {
      intro:
        "Oversized no es una forma, es una escala: monturas deliberadamente mayores que la proporción del rostro. Añade volumen y acorta visualmente la cara.",
      choosing:
        "Es la única categoría donde que la montura sea más ancha que la cara es intencionado. Aun así hay un límite: si las varillas presionan en las sienes, la talla es demasiado grande.",
    },
  },

  // ── English ────────────────────────────────────────────────────────────
  en: {
    rectangular: {
      intro:
        "The rectangular frame is wider than it is tall and keeps its corners defined. It brings more structure than almost any other shape without the bluntness of a square, which is why it works in both thick acetate and thin metal.",
      choosing:
        "Watch the front width above all: a narrow rectangular frame falls short on a wide face and shows it more than other shapes, because horizontal lines mark exactly where the frame ends.",
    },
    square: {
      intro:
        "The square has lens proportions close to equal in height and width, with defined angles. It adds presence and is the most geometric shape in the catalogue.",
      choosing:
        "Lens height matters as much as width here: a tall square covers a lot of face and changes the result more than a couple of millimetres of lens width.",
    },
    round: {
      intro:
        "The round frame softens the features and is the most recognisable shape in optical tradition. In thin metal it almost disappears; in acetate it becomes the centre of the face.",
      choosing:
        "On a circular frame the lens width and height are nearly identical, so a large calibre raises the apparent size sharply. Lean towards the smallest size that fits you.",
    },
    oval: {
      intro:
        "The oval is the most discreet: soft shapes, no corners, and a lens wider than it is tall. It balances without drawing attention, which is exactly its point.",
      choosing:
        "Because it is shallow, the bridge and how it sits on the nose matter more than usual. Compare the bridge with a pair that already sits well on you.",
    },
    aviator: {
      intro:
        "The aviator began as a technical frame and ended up an icon. Teardrop lens, double bridge and metal: it opens up the eyes and visually lengthens the face.",
      choosing:
        "This is the shape where sizes differ most, because the lens drops downwards. Two millimetres of calibre show more here than on a wayfarer.",
    },
    "cat-eye": {
      intro:
        "The cat-eye lifts at the outer corners and raises the eyeline. It is the most deliberate shape in the catalogue and the least likely to go unnoticed.",
      choosing:
        "The lift angle varies enormously between models and no spec sheet publishes it. This is the shape where seeing the specific model matters most before deciding.",
    },
    wayfarer: {
      intro:
        "The wayfarer is trapezoidal, made of acetate, with a slightly tilted front. It is probably the best-selling sunglass shape in history and the one with the most versions.",
      choosing:
        "Don't assume the size: within the same family there are versions with an 18 mm bridge and a 22 mm one, and that changes how it rests even at the same lens width.",
    },
    geometric: {
      intro:
        "Geometric covers the shapes that don't fit the classics: hexagons, panto shapes and combinations of straight lines and curves. It has the most genuine variety between models.",
      choosing:
        "With no common pattern, two geometric frames with identical measurements can look completely different. Measurements guide you less here than in any other shape.",
    },
    oversized: {
      intro:
        "Oversized is not a shape, it is a scale: frames deliberately larger than the proportions of the face. It adds volume and visually shortens the face.",
      choosing:
        "This is the one category where a frame being wider than your face is the point. There is still a limit: if the temples press on your sides, the size is too big.",
    },
  },

  // ── Italiano ───────────────────────────────────────────────────────────
  it: {
    rectangular: {
      intro:
        "La montatura rettangolare è più larga che alta e mantiene gli angoli netti. Dà struttura più di quasi ogni altra forma senza la durezza della squadrata, e per questo regge bene sia l'acetato spesso sia il metallo sottile.",
      choosing:
        "Guarda soprattutto la larghezza del frontale: una rettangolare stretta su un viso largo si nota più che in altre forme, perché le linee orizzontali segnano esattamente dove finisce la montatura.",
    },
    square: {
      intro:
        "La squadrata ha proporzioni di lente quasi uguali in altezza e larghezza, con angoli definiti. Dà presenza ed è la forma più geometrica del catalogo.",
      choosing:
        "Qui l'altezza della lente conta quanto la larghezza: una squadrata alta occupa molto viso e cambia il risultato più di un paio di millimetri di calibro.",
    },
    round: {
      intro:
        "La rotonda ammorbidisce i tratti ed è la forma più riconoscibile della tradizione ottica. In metallo sottile quasi scompare; in acetato diventa il centro del viso.",
      choosing:
        "In una montatura circolare calibro e altezza della lente sono quasi identici, quindi un calibro grande alza di colpo la dimensione apparente. Conviene andare sulla taglia più piccola fra quelle che ti stanno.",
    },
    oval: {
      intro:
        "L'ovale è la più discreta: forme morbide, niente angoli e una lente più larga che alta. Equilibra senza farsi notare, che è esattamente il suo scopo.",
      choosing:
        "Essendo bassa, il ponte e l'appoggio sul naso pesano più del solito. Confronta il ponte con quello di un occhiale che già ti sta bene.",
    },
    aviator: {
      intro:
        "L'aviator nasce come montatura tecnica e diventa un'icona. Lente a goccia, doppio ponte e metallo: apre lo sguardo e allunga visivamente il viso.",
      choosing:
        "È la forma dove le taglie cambiano di più il risultato, perché la lente scende verso il basso. Due millimetri di calibro si notano qui più che su una wayfarer.",
    },
    "cat-eye": {
      intro:
        "La cat-eye sale agli angoli esterni e solleva lo sguardo. È la forma più intenzionale del catalogo e quella che passa meno inosservata.",
      choosing:
        "L'angolo di salita varia moltissimo fra modelli e nessuna scheda lo pubblica. È la forma in cui conviene di più vedere il modello preciso prima di decidere.",
    },
    wayfarer: {
      intro:
        "La wayfarer è trapezoidale, in acetato e con il frontale leggermente inclinato. È probabilmente la forma di occhiale da sole più venduta di sempre e quella con più versioni.",
      choosing:
        "Non dare per scontata la taglia: nella stessa famiglia esistono versioni con ponte da 18 e da 22 millimetri, e questo cambia l'appoggio anche a parità di calibro.",
    },
    geometric: {
      intro:
        "Sotto geometrica rientrano le forme che non stanno nelle classiche: esagoni, panto e combinazioni di retta e curva. È la categoria con più varietà reale fra modelli.",
      choosing:
        "Senza uno schema comune, due montature geometriche con le stesse misure possono apparire completamente diverse. Qui la misura orienta meno che nelle altre forme.",
    },
    oversized: {
      intro:
        "Oversize non è una forma, è una scala: montature volutamente più grandi delle proporzioni del viso. Aggiunge volume e accorcia visivamente il viso.",
      choosing:
        "È l'unica categoria in cui una montatura più larga del viso è voluta. Un limite però c'è: se le aste premono sulle tempie, la taglia è troppo grande.",
    },
  },

  // ── Português ──────────────────────────────────────────────────────────
  pt: {
    rectangular: {
      intro:
        "A armação retangular é mais larga do que alta e mantém os cantos marcados. Dá mais estrutura do que quase qualquer outra forma sem a dureza da quadrada, e por isso funciona tanto em acetato grosso quanto em metal fino.",
      choosing:
        "Olhe principalmente a largura da frente: uma retangular estreita fica curta num rosto largo e aparece mais do que em outras formas, porque as linhas horizontais marcam onde a armação termina.",
    },
    square: {
      intro:
        "A quadrada tem proporções de lente parecidas em altura e largura, com ângulos definidos. Dá presença e é a forma mais geométrica do catálogo.",
      choosing:
        "Aqui a altura da lente conta tanto quanto a largura: uma quadrada alta ocupa muito rosto e muda o resultado mais do que dois milímetros de calibre.",
    },
    round: {
      intro:
        "A redonda suaviza os traços e é a forma mais reconhecível da tradição óptica. Em metal fino quase desaparece; em acetato vira o centro do rosto.",
      choosing:
        "Numa armação circular o calibre e a altura da lente são quase iguais, então um calibre grande sobe de uma vez o tamanho aparente. Vale ir no menor tamanho que te sirva.",
    },
    oval: {
      intro:
        "A oval é a mais discreta: formas suaves, sem cantos e uma lente mais larga do que alta. Equilibra sem chamar atenção, que é justamente a intenção.",
      choosing:
        "Por ser baixa, a ponte e o apoio no nariz pesam mais do que o normal. Compare a ponte com a de um óculos que já assenta bem em você.",
    },
    aviator: {
      intro:
        "O aviador nasceu como armação técnica e virou ícone. Lente em gota, ponte dupla e metal: abre o olhar e alonga visualmente o rosto.",
      choosing:
        "É a forma em que os tamanhos mais mudam o resultado, porque a lente desce. Dois milímetros de calibre aparecem mais aqui do que numa wayfarer.",
    },
    "cat-eye": {
      intro:
        "O gatinho sobe nos cantos externos e levanta o olhar. É a forma mais intencional do catálogo e a que menos passa despercebida.",
      choosing:
        "O ângulo de subida varia muito entre modelos e nenhuma ficha publica isso. É a forma em que mais vale a pena ver o modelo específico antes de decidir.",
    },
    wayfarer: {
      intro:
        "A wayfarer é trapezoidal, de acetato e com a frente levemente inclinada. É provavelmente a forma de óculos de sol mais vendida da história e a que tem mais versões.",
      choosing:
        "Não presuma o tamanho: dentro da mesma família existem versões com ponte de 18 e de 22 milímetros, e isso muda o apoio mesmo com o mesmo calibre.",
    },
    geometric: {
      intro:
        "Em geométrica entram as formas que não cabem nas clássicas: hexágonos, panto e combinações de reta e curva. É a categoria com mais variedade real entre modelos.",
      choosing:
        "Sem um padrão comum, duas armações geométricas com as mesmas medidas podem parecer completamente diferentes. Aqui a medida orienta menos do que nas outras formas.",
    },
    oversized: {
      intro:
        "Oversized não é uma forma, é uma escala: armações propositalmente maiores que as proporções do rosto. Acrescenta volume e encurta visualmente o rosto.",
      choosing:
        "É a única categoria em que a armação ser mais larga que o rosto é intencional. Ainda assim há um limite: se as hastes apertam as têmporas, o tamanho é grande demais.",
    },
  },

  // ── Deutsch ────────────────────────────────────────────────────────────
  de: {
    rectangular: {
      intro:
        "Die rechteckige Fassung ist breiter als hoch und behält klare Ecken. Sie gibt mehr Struktur als fast jede andere Form, ohne die Härte der eckigen, und funktioniert deshalb in dickem Acetat wie in dünnem Metall.",
      choosing:
        "Achte vor allem auf die Frontbreite: eine schmale rechteckige Fassung fällt auf einem breiten Gesicht stärker auf als andere Formen, weil waagerechte Linien genau markieren, wo die Fassung endet.",
    },
    square: {
      intro:
        "Die eckige Fassung hat in Höhe und Breite fast gleiche Glasproportionen, mit klaren Winkeln. Sie sorgt für Präsenz und ist die geometrischste Form im Katalog.",
      choosing:
        "Hier zählt die Glashöhe so viel wie die Breite: eine hohe eckige Fassung nimmt viel Gesicht ein und verändert das Ergebnis stärker als zwei Millimeter Glasbreite.",
    },
    round: {
      intro:
        "Die runde Fassung macht die Züge weicher und ist die bekannteste Form der optischen Tradition. In dünnem Metall verschwindet sie fast, in Acetat wird sie zum Mittelpunkt des Gesichts.",
      choosing:
        "Bei einer kreisrunden Fassung sind Glasbreite und -höhe nahezu gleich, eine große Glasbreite hebt die scheinbare Größe also sprunghaft an. Nimm eher die kleinste Größe, die dir passt.",
    },
    oval: {
      intro:
        "Die ovale ist die zurückhaltendste: weiche Formen, keine Ecken und ein Glas, das breiter als hoch ist. Sie gleicht aus, ohne aufzufallen — genau darum geht es.",
      choosing:
        "Weil sie flach ist, wiegen Steg und Nasenauflage schwerer als sonst. Vergleiche den Steg mit einer Brille, die dir bereits gut sitzt.",
    },
    aviator: {
      intro:
        "Die Pilotenbrille begann als technische Fassung und wurde zur Ikone. Tropfenform, Doppelsteg und Metall: sie öffnet den Blick und streckt das Gesicht optisch.",
      choosing:
        "Bei dieser Form verändern Größen das Ergebnis am stärksten, weil das Glas nach unten verläuft. Zwei Millimeter Glasbreite fallen hier mehr auf als bei einer Wayfarer.",
    },
    "cat-eye": {
      intro:
        "Die Schmetterlingsbrille steigt an den äußeren Ecken an und hebt den Blick. Sie ist die bewussteste Form im Katalog und die, die am wenigsten unbemerkt bleibt.",
      choosing:
        "Der Anstiegswinkel schwankt stark zwischen Modellen und steht in keinem Datenblatt. Bei dieser Form lohnt es sich am meisten, das konkrete Modell vorher zu sehen.",
    },
    wayfarer: {
      intro:
        "Die Wayfarer ist trapezförmig, aus Acetat und mit leicht geneigter Front. Sie ist vermutlich die meistverkaufte Sonnenbrillenform überhaupt und die mit den meisten Varianten.",
      choosing:
        "Setz die Größe nicht voraus: innerhalb derselben Familie gibt es Varianten mit 18 und mit 22 Millimeter Steg, und das ändert den Sitz auch bei gleicher Glasbreite.",
    },
    geometric: {
      intro:
        "Unter geometrisch fallen die Formen, die nicht zu den Klassikern gehören: Sechsecke, Panto und Kombinationen aus Geraden und Kurven. Es ist die Kategorie mit der größten echten Vielfalt.",
      choosing:
        "Ohne gemeinsames Muster können zwei geometrische Fassungen mit identischen Maßen völlig verschieden aussehen. Maße helfen hier weniger als bei jeder anderen Form.",
    },
    oversized: {
      intro:
        "Oversize ist keine Form, sondern ein Maßstab: Fassungen, die bewusst größer sind als die Proportionen des Gesichts. Das bringt Volumen und verkürzt das Gesicht optisch.",
      choosing:
        "Es ist die einzige Kategorie, in der eine Fassung breiter als das Gesicht sein soll. Eine Grenze gibt es trotzdem: drücken die Bügel an den Schläfen, ist die Größe zu groß.",
    },
  },
};

export function shapeCopy(locale: Locale, shape: FrameShape): ShapeCopy {
  return SHAPE_COPY[locale][shape];
}

export function shapePageName(locale: Locale, shape: FrameShape): string {
  return SHAPE_PAGE_NAME[locale][shape];
}
