/**
 * Los packs de generaciones → D-029, D-030 y D-031.
 *
 * Los identificadores de precio **no son secretos**: viajan al navegador para
 * abrir el checkout. Lo que no puede salir de aquí es la clave de API de
 * Paddle, que vive en una variable de entorno y solo toca el servidor.
 *
 * Las cantidades están aquí **y también en Paddle**, en el `custom_data` de
 * cada precio. No es duplicar por duplicar: esta copia sirve para pintar la
 * tabla de precios, y la de Paddle es la que viaja en el aviso de pago, para
 * que crear un pack nuevo desde su panel no obligue a tocar código.
 * Si alguna vez discrepan, **manda la de Paddle**: es la que acompaña al
 * dinero.
 */

export interface Pack {
  id: "p10" | "p25" | "p150";
  generations: number;
  /** `null` mientras no esté creado en Paddle. */
  priceId: string | null;
  /** Para pintar la tabla sin consultar a Paddle en cada carga. */
  display: {
    eur: string;
    gbp: string;
    usd: string;
  };
  /** El del medio se marca, que es el que queremos que elijan. */
  featured: boolean;
}

export const PACKS: readonly Pack[] = [
  {
    id: "p10",
    generations: 10,
    priceId: "pri_01m558waqsdqxes19svm241pfn",
    display: { eur: "4,99 €", gbp: "£5.99", usd: "$9.99" },
    featured: false,
  },
  {
    id: "p25",
    generations: 25,
    priceId: "pri_01m558t13pmtf0p40nf7ysk9ft",
    display: { eur: "9,99 €", gbp: "£11.99", usd: "$19.99" },
    featured: true,
  },
  {
    id: "p150",
    generations: 150,
    priceId: "pri_01m558myfqne4481cye96wnwrk",
    display: { eur: "49,99 €", gbp: "£59.99", usd: "$99.99" },
    featured: false,
  },
];

/** Los que ya se pueden vender. El resto no se pinta. */
export function sellablePacks(): Pack[] {
  return PACKS.filter((pack) => pack.priceId !== null);
}

export function packByPriceId(priceId: string): Pack | null {
  return PACKS.find((pack) => pack.priceId === priceId) ?? null;
}
