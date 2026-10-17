import type { Dictionary } from "./types";

/**
 * Português.
 *
 * Escrito en la variante **brasileña**, que es el mercado grande: «óculos de
 * sol», «armação» (no «aro»), «celular» (no «telemóvel»). El código de ruta e
 * `hreflang` es `pt` y cubre también Portugal; si algún día los datos piden
 * separar `pt-BR` de `pt-PT`, se parte este diccionario en dos.
 *
 * REVISIÓN HUMANA PENDIENTE → docs/GROWTH_SEO.md.
 */
export const pt: Dictionary = {
  meta: {
    title: "Descubra quais óculos combinam com você e experimente",
    description:
      "Envie uma foto, descubra óculos de sol que combinam com as suas proporções e compare modelos antes de comprar.",
  },
  nav: {
    styles: "Estilos",
    howItWorks: "Como funciona",
  },
  common: {
    home: "Início",
    back: "Voltar",
    exit: "Sair",
    language: "Idioma",
  },
  hero: {
    eyebrow: "Óculos de sol",
    title: "Descubra quais óculos combinam com você.",
    titleAccent: "Experimente no seu rosto.",
    subtitle:
      "Envie uma foto, receba seis modelos que combinam com as suas proporções e compare antes de decidir.",
    ctaPrimary: "Testar grátis",
    ctaSecondary: "Explorar estilos",
    note: "Sem cadastro. A sua foto não fica guardada.",
  },
  demo: {
    disclaimer:
      "Exemplo gerado. A pessoa da foto não existe e as armações são simulações, não fotografias de produto.",
    original: "A foto",
    noGlasses: "Sem óculos",
    photoAlt: "Foto inicial de uma pessoa gerada",
    simulationBadge: "Simulação",
    items: [
      { model: "Clubmaster", reference: "RB3016" },
      { model: "Round Metal", reference: "RB3447" },
    ],
  },
  steps: {
    label: "Como funciona",
    items: [
      {
        title: "Você envia uma foto",
        body: "De frente e com boa luz. A análise das proporções acontece no seu navegador: para isso a foto não sai do celular.",
      },
      {
        title: "A gente te dá seis",
        body: "Não um catálogo infinito. Seis armações de marcas diferentes, cada uma com um motivo concreto para estar ali.",
      },
      {
        title: "Você compara e escolhe",
        body: "Experimenta, coloca lado a lado e levamos você até onde se compra o modelo que escolher.",
      },
    ],
  },
  catalog: {
    label: "O catálogo",
    title: "Formatos, não tendências.",
    body: "Cada armação entra pela geometria e pelas medidas, não pelo que está na moda. É isso que permite explicar por que recomendamos ela.",
    cta: "Ver todos os formatos",
  },
  privacy: {
    label: "Privacidade",
    title: "O seu rosto não é o nosso produto.",
    body: "As proporções do rosto são calculadas no seu navegador. Se você pedir uma prova virtual, a imagem vai para um armazenamento privado, expira em horas e é apagada. Não fazemos reconhecimento de identidade nem perfilamento.",
    link: "Como tratamos os seus dados",
  },
  frames: {
    shapes: {
      rectangular: "Retangular",
      square: "Quadrada",
      round: "Redonda",
      oval: "Oval",
      aviator: "Aviador",
      "cat-eye": "Gatinho",
      wayfarer: "Wayfarer",
      geometric: "Geométrica",
      oversized: "Oversized",
    },
    simulationNotice: "Simulação. O resultado é indicativo.",
  },
  footer: {
    tagline: "Descoberta independente de óculos. Fase de validação.",
    privacy: "Privacidade",
    terms: "Termos",
    cookies: "Cookies",
  },

  flow: {
    steps: ["Sua foto", "Os seus seis", "Resultado"],
    filtersLabel: "Filtrar por marca ou estilo",
    photo: {
      title: "Envie uma foto e dizemos o que experimentar.",
      subtitle: "A análise das proporções acontece no seu navegador.",
    },
    brands: {
      title: "Tem alguma marca em mente?",
      subtitle:
        "Escolha as que te interessam, ou siga sem escolher nenhuma e olhamos o catálogo inteiro.",
      styleLegend: "Estilo, se você tiver preferência",
      changePhoto: "← Trocar a foto",
      next: "Ver os meus seis →",
    },
    styles: {
      clasicas: "Clássicos",
      modernas: "Modernos",
      oversized: "Oversized",
      minimalistas: "Minimalistas",
      retro: "Retrô",
      deportivas: "Esportivos",
    },
    choose: {
      title: "Os seus seis",
      empty: "Nada combina com esse filtro",
      emptyBody:
        "Volte e tire alguma marca ou algum estilo. O catálogo tem {frames} armações de {brands} marcas.",
      hint: "Escolha uma e geramos no seu rosto",
      back: "← Marcas",
      seeResults: "Ver resultados ({count}) →",
    },
    result: {
      titleOne: "No seu rosto",
      titleMany: "Compare",
      counter: "{chosen} de {max}",
      back: "← Voltar aos seis",
      another: "Experimentar outro",
      empty: "Nenhuma armação selecionada.",
    },
    disclaimer:
      "Catálogo em construção: temos marca, modelo e referência, mas ainda não as imagens oficiais nem os preços. Para gerar a simulação a sua foto é enviada ao nosso servidor e de lá ao fornecedor, e não fica guardada em lugar nenhum.",
  },

  upload: {
    cta: "Enviar uma foto",
    dropTitle: "Arraste sua foto aqui",
    dropAction: "ou clique para escolher",
    dropPaste: "Você também pode colar com Ctrl+V",
    dropActive: "Solte",
    changePhoto: "Trocar a foto",
    formats: "JPG, PNG ou WEBP",
    hints: [
      "De frente e com boa luz",
      "Olhos visíveis",
      "Sem filtros",
      "Melhor sem óculos",
      "Só você na foto",
    ],
    opening: "Abrindo a foto…",
    analyzing: "Analisando proporções no seu navegador…",
    tryAnother: "Tentar com outra foto",
    yourProfile: "Seu perfil",
    lowConfidence:
      "Com esta foto a estimativa fica pouco firme. Uma mais de frente daria uma leitura melhor.",
    removePhoto: "Tirar a foto",
    chosenPhotoAlt: "A foto que você escolheu",
    notStored:
      "A foto não foi enviada para nenhum servidor. A análise acontece no seu navegador e o que fica na memória são apenas proporções, sem imagem.",
    errorDecode: "Não conseguimos abrir essa imagem. Tente outra.",
    errorPrepare: "Não conseguimos preparar essa imagem. Tente outra.",
    errorLoader:
      "Não conseguimos carregar o analisador. Verifique a conexão e tente de novo.",
    errorProcess: "Não conseguimos processar a imagem. Tente outra foto.",
    rejectedGeneric: "Precisamos de uma foto mais de frente e com luz melhor.",
    issues: {
      "unsupported-type": "Só aceitamos imagens JPG, PNG ou WEBP.",
      "too-large": "A imagem é pesada demais. O máximo é 12 MB.",
      "too-small":
        "A imagem é pequena demais. Precisamos de pelo menos 480 pixels de lado.",
      "too-many-pixels": "A imagem tem resolução demais. Reduza o tamanho.",
      empty: "O arquivo está vazio.",
    },
    quality: {
      "no-face":
        "Não reconhecemos um rosto na foto. Tente uma foto de frente.",
      "multiple-faces":
        "Tem mais de uma pessoa. Precisamos de uma foto só com você.",
      "incomplete-landmarks":
        "Não dá para ver bem os olhos. Tente uma foto mais de frente e sem nada cobrindo.",
      "head-turned":
        "O rosto está virado. Precisamos que você olhe de frente para a câmera.",
      "head-tilted": "Endireite um pouco a cabeça e repita a foto.",
      "eyes-closed":
        "Você está com os olhos fechados ou semicerrados. Tente outra foto.",
      "face-too-small":
        "O rosto ficou muito pequeno. Chegue mais perto ou recorte em volta do rosto.",
      "resolution-too-low":
        "A foto tem resolução baixa. Precisamos de uma imagem com pelo menos 480 pixels de lado.",
    },
  },

  explain: {
    faceShapes: {
      oval: "oval",
      round: "arredondado",
      square: "quadrado",
      oblong: "alongado",
      heart: "de coração",
      diamond: "de diamante",
      unknown: "difícil de classificar",
    },
    frameShapes: {
      rectangular: "retangular",
      square: "quadrada",
      round: "redonda",
      oval: "oval",
      aviator: "aviador",
      "cat-eye": "gatinho",
      wayfarer: "wayfarer",
      geometric: "geométrica",
      oversized: "oversized",
    },
    frameEffects: {
      rectangular: "traz linhas definidas e estrutura o rosto",
      square: "marca ângulos e dá presença",
      round: "suaviza os traços e tira a dureza",
      oval: "passa discreta e equilibra sem chamar atenção",
      aviator: "abre o olhar e alonga visualmente o rosto",
      "cat-eye": "levanta o olhar e valoriza o terço superior",
      wayfarer: "dá largura e um ar clássico reconhecível",
      geometric: "introduz um contraste de forma mais marcante",
      oversized: "acrescenta volume e encurta visualmente o rosto",
    },
    unknownProfile:
      "Não conseguimos estimar o formato do seu rosto com clareza suficiente. Mesmo assim, você pode explorar estilos e experimentar.",
    profileOne:
      "O seu rosto parece combinar principalmente com um perfil {primary}.",
    profileTwo:
      "O seu rosto parece combinar principalmente com um perfil {primary}, com algumas características de um perfil {secondary}.",
    shapeClause: "o formato {shape} {effect}",
    widthClause: "a largura fica proporcional ao seu rosto",
    styleClause: "combina com o estilo que você escolheu",
    fallback: "Uma opção equilibrada para começar a comparar.",
    matchGood: "Boa combinação",
    matchVeryGood: "Ótima combinação",
  },

  brandPicker: {
    suggestedPersonalised: "Combinam com as suas proporções",
    suggestedGeneric: "Marcas",
    rest: "E o resto",
    clear: "Limpar a seleção",
    note:
      "Envie uma foto e dizemos quais combinam melhor com as suas proporções. Sem ela só conseguimos ordenar por ordem alfabética.",
    mostly: "Sobretudo {shapes}",
    and: "e",
  },

  results: {
    yourPhoto: "Sua foto",
    generating: "Gerando… cerca de 30 s",
    retry: "Tentar de novo",
    remove: "Remover",
    removeLabel: "Remover {model}",
    simulationAlt: "Simulação de {model} na sua foto",
    simulationBadge: "Simulação",
    whereToBuy: "Onde comprar",
    widthFit: {
      narrow: "Pode ficar estreita",
      good: "Largura equilibrada",
      wide: "Pode ficar larga",
    },
  },

  frameCard: {
    cta: "Ver no meu rosto",
    remove: "Remover",
    needsPhoto: "Envie uma foto para ver no rosto",
    match: "Boa combinação",
    unavailable: {
      derivative: "Prova indisponível para esta marca",
      trademark: "Aguardando acordo com a marca",
      inactive: "Indisponível",
      unknown: "Indisponível",
    },
  },

  tryOn: {
    errors: {
      rateLimited:
        "Você fez muitos testes seguidos. Espere alguns minutos e tente de novo.",
      providerTimeout: "O fornecedor demorou demais. Tente de novo.",
      providerUnavailable:
        "O fornecedor não está disponível agora. Tente daqui a pouco.",
      contentRejected:
        "Não conseguimos gerar este teste. Tente outra armação ou outra foto.",
      invalidInput: "Tem algo errado com a imagem. Tente outra foto.",
      noFaceDetected: "Não reconhecemos um rosto na foto.",
      freeExhausted:
        "Você usou seus testes gratuitos. Em breve poderá conseguir mais.",
      dailyCap:
        "Chegamos ao limite de testes de hoje. Volte amanhã e tentamos de novo.",
      unknown: "Não conseguimos gerar o teste. Tente de novo.",
    },
    access: {
      title: "Isto ainda é privado",
      body: "Cada geração tem um custo real, então por enquanto é preciso um código para testar.",
      wrong: "Esse código não está certo. Confira se está completo.",
      placeholder: "Código",
      cancel: "Cancelar",
      submit: "Entrar",
    },

    packs: {
      title: "Consiga mais provas",
      body:
        "Você usou as suas. Escolha um pacote e continue provando armações na sua foto.",
      generations: "{count} provas",
      best: "O mais escolhido",
      buy: "Quero",
      note: "O preço final pode variar conforme o seu país e impostos.",
      unavailable: "Ainda não dá para comprar. Voltamos em poucos dias.",
      error: "Não conseguimos abrir o pagamento. Tente de novo.",
    },
  },

  auth: {
    title: "Crie sua conta para experimentar",
    body: "Você chegou até aqui sem dar nada, e o que viu continua grátis.",
    titleAfterFree: "Você já viu. Mais uma?",
    bodyAfterFree:
      "Esse era o seu teste grátis. Crie sua conta e damos mais um, para você comparar duas armações na mesma foto.",
    emailLabel: "Seu e-mail",
    emailPlaceholder: "voce@email.com",
    passwordLabel: "Senha",
    passwordPlaceholder: "Mínimo 8 caracteres",
    confirmLabel: "Repita a senha",
    confirmPlaceholder: "A mesma de novo",
    showPassword: "Mostrar senha",
    hidePassword: "Ocultar senha",
    submit: "Continuar",
    google: "Continuar com o Google",
    or: "ou",
    promise:
      "Usamos seu e-mail só para você entrar. Sem newsletter, sem publicidade e não damos para ninguém. Você pode pedir para apagarmos sua conta quando quiser.",
    signOut: "Sair",
    errors: {
      invalidEmail: "Esse endereço não parece válido. Confira.",
      weakPassword: "A senha precisa de pelo menos 8 caracteres.",
      passwordMismatch: "As duas senhas não coincidem.",
      wrongPassword: "Essa senha não está correta para este e-mail.",
      rateLimited: "Tentativas demais seguidas. Tente daqui a pouco.",
      unavailable: "O cadastro não está disponível agora. Tente mais tarde.",
      generic: "Não conseguimos concluir. Tente de novo.",
    },
  },
  waitlist: {
    prompt: "Não tenho código",
    title: "A gente avisa quando você puder testar",
    body: "Estamos abrindo aos poucos porque cada teste tem um custo real. Deixe seu e-mail e escrevemos quando chegar a sua vez.",
    emailLabel: "Seu e-mail",
    emailPlaceholder: "voce@email.com",
    submit: "Me avise",
    promise:
      "Um único e-mail, quando você puder entrar. Só isso: sem newsletter, sem publicidade e seu endereço não vai para ninguém. Você pode pedir para apagarmos quando quiser.",
    successTitle: "Você está na lista",
    successBody:
      "Vamos escrever para esse endereço quando abrir a sua vez. Pode fechar e continuar olhando.",
    errors: {
      invalidEmail: "Esse endereço não parece válido. Confira.",
      rateLimited: "Tentativas demais seguidas. Tente daqui a pouco.",
      unavailable:
        "Ainda não conseguimos guardar seu e-mail, então não pedimos pela metade. Tente de novo em alguns dias.",
      generic: "Não conseguimos inscrever você. Tente de novo.",
    },
  },

  legal: {
    pendingReview: "Situação deste documento",
    privacy: {
      label: "Privacidade",
      title: "O que fazemos com a sua foto",
      intro: [
        "Este site está em fase de validação e ainda não aceita fotos. O que vem a seguir descreve como o tratamento foi projetado, para você poder julgá-lo antes de ele existir.",
      ],
      sections: [
        {
          heading: "Análise das proporções",
          paragraphs: [
            "As proporções do rosto são calculadas no seu navegador. A única coisa que chega ao nosso servidor é um conjunto de cerca de vinte proporções adimensionais —relações entre larguras e alturas— sem nenhuma imagem associada.",
            "É uma decisão de arquitetura para reduzir a exposição, não uma afirmação jurídica: não presumimos que medidas derivadas do rosto fiquem fora da legislação de proteção de dados. A classificação legal será revisada por um profissional antes de o produto abrir ao público.",
          ],
        },
        {
          heading: "Prova virtual",
          paragraphs: [
            "Se você pedir para experimentar uma armação, a imagem precisa sair do dispositivo para ser processada. Nesse caso vai para um armazenamento privado, com links assinados de validade curta, e é apagada junto com os resultados derivados depois de pouco tempo. Antes disso você verá qual fornecedor a processa e por quanto tempo ela é mantida.",
          ],
        },
        {
          heading: "Se você entrar na lista de espera",
          paragraphs: [
            "É a única coisa que guardamos de você como pessoa identificável, e só se você pedir. Guardamos seu e-mail, o idioma em que se inscreveu, de que ponto do site fez isso e a data em que concordou. Mais nada: nem nome, nem IP, nem nada da sua foto ou do seu rosto.",
            "A lista nunca é cruzada com o analytics do produto. O que medimos sobre o uso é anônimo e continua assim: ligá-lo ao seu e-mail transformaria isso em rastreamento identificado.",
            "Usamos para um único e-mail, quando pudermos liberar seu acesso. Não vendemos nem cedemos a lista. Você pode pedir para apagarmos seu endereço quando quiser e apagamos, sem perguntar por quê.",
          ],
        },
        {
          heading: "O que não fazemos",
          paragraphs: [],
          items: [
            "Não fazemos reconhecimento de identidade nem procuramos saber quem você é.",
            "Não inferimos atributos pessoais sensíveis a partir do seu rosto.",
            "Não treinamos modelos com as suas fotos.",
            "Não vendemos dados nem os usamos para publicidade personalizada.",
            "Não guardamos imagens de rosto em logs nem em analytics.",
            "Não guardamos a sua foto «por via das dúvidas».",
          ],
        },
        {
          heading: "Situação deste documento",
          paragraphs: [
            "Aguardando revisão jurídica profissional. Ainda não é uma política de privacidade completa e não pretende passar por uma.",
          ],
        },
      ],
    },
    terms: {
      label: "Termos",
      title: "Condições de uso",
      intro: [
        "O site está em fase de validação. Não há serviço a contratar, não se aceitam pagamentos e não se tratam dados de usuários.",
      ],
      sections: [
        {
          heading: "O que é este site",
          paragraphs: [
            "Uma camada independente de descoberta de óculos. Não vendemos armações, não somos uma ótica e não temos relação comercial com as marcas que possam aparecer. Quando existir, o link de compra levará à loja do terceiro, que é quem vende e a cujas condições a compra fica sujeita.",
          ],
        },
        {
          heading: "Sobre as recomendações e as provas virtuais",
          paragraphs: [
            "As recomendações são indicativas. Não são uma medição nem um conselho profissional, e não afirmamos que uma armação seja objetivamente a que melhor combina com você.",
            "Qualquer prova virtual é uma simulação e é identificada como tal. Não substitui experimentar a armação.",
          ],
        },
        {
          heading: "Marcas de terceiros",
          paragraphs: [
            "As marcas e modelos que aparecerem pertencem aos seus titulares. A menção não implica acordo, patrocínio ou associação, e não apresentamos como parceiro ninguém com quem não tenhamos um acordo.",
          ],
        },
        {
          heading: "Situação deste documento",
          paragraphs: [
            "Aguardando revisão jurídica profissional. Ainda não é um documento contratual completo.",
          ],
        },
      ],
    },
    cookies: {
      label: "Cookies",
      title: "Cookies e armazenamento",
      intro: [
        "Este site não instala nenhum cookie e não usa analytics de terceiros. Também não há banner de consentimento, porque não há nada a consentir.",
        "Mas medimos como o produto é usado, com analytics próprio: quais passos são concluídos e o que falha. Não usa cookies, não identifica ninguém e nunca inclui a sua foto nem medidas do seu rosto. Para agrupar os passos de uma mesma visita usamos um identificador aleatório guardado na memória da aba, que some ao fechá-la.",
      ],
      sections: [
        {
          heading: "O que será usado quando houver produto",
          paragraphs: [],
          items: [
            "Se você criar uma conta, um cookie técnico para manter sua sessão. É estritamente necessário —sem ele não dá para saber que é você— e por isso não precisa de consentimento, mas fica declarado aqui. Dura 30 dias e some ao sair. Se você não se cadastrar, ele não é instalado.",
            "Armazenamento local no seu navegador para lembrar as preferências que você escolher, que nunca sai do seu dispositivo.",
            "Analytics de produto sem conteúdo de rosto e sem identificar você pessoalmente, para medir o funil.",
          ],
        },
        {
          heading: "Consentimento",
          paragraphs: [
            "O que exigir consentimento será pedido antes de ser instalado, não depois.",
          ],
        },
        {
          heading: "Situação deste documento",
          paragraphs: ["Aguardando revisão jurídica profissional."],
        },
      ],
    },
  },
};
