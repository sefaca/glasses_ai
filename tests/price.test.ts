import { describe, expect, it } from "vitest";
import { reliablePriceCents } from "../lib/catalog/price";
import { FRAMES } from "../lib/catalog/frames";
import { NEUTRAL_FACE } from "../lib/face/neutral";
import { EMPTY_PREFERENCES } from "../lib/face/types";
import { recommend } from "../lib/recommendations/score";
import { makeFrame } from "./helpers/frame";

/**
 * El precio es un dato interno y **no se muestra en nuestra UI** → D-019.
 *
 * Lo que sí hace es filtrar. Y filtrar con un precio del que no nos podemos
 * fiar sería peor que no filtrar.
 */

describe("precio fiable", () => {
  it("un precio verificado sirve para filtrar", () => {
    const frame = makeFrame({
      priceCents: 5900,
      priceStatus: "verified",
      priceCheckedAt: "2026-10-09",
    });
    expect(reliablePriceCents(frame)).toBe(5900);
  });

  it("un precio de referencia también sirve", () => {
    expect(
      reliablePriceCents(makeFrame({ priceCents: 5900, priceStatus: "indicative" })),
    ).toBe(5900);
  });

  it("un precio desconocido no sirve, aunque haya un número guardado", () => {
    // Tener un número no autoriza a usarlo.
    expect(
      reliablePriceCents(makeFrame({ priceCents: 9900, priceStatus: "unknown" })),
    ).toBeNull();
  });

  it("sin precio no hay precio", () => {
    expect(
      reliablePriceCents(makeFrame({ priceCents: null, priceStatus: "verified" })),
    ).toBeNull();
  });
});

describe("filtro de presupuesto", () => {
  it("excluye las monturas sin precio fiable cuando hay presupuesto", () => {
    const conPrecio = makeFrame({ id: "con-precio", priceCents: 9900 });
    const sinPrecio = makeFrame({
      id: "sin-precio",
      priceCents: null,
      priceStatus: "unknown",
    });

    const recs = recommend(
      NEUTRAL_FACE,
      { ...EMPTY_PREFERENCES, budgetMaxCents: 20000 },
      [conPrecio, sinPrecio],
      { limit: 10 },
    );
    const ids = recs.map((r) => r.frame.id);
    expect(ids).toContain("con-precio");
    expect(ids).not.toContain("sin-precio");
  });

  it("sin presupuesto declarado, la falta de precio no excluye a nadie", () => {
    const sinPrecio = makeFrame({
      id: "sin-precio",
      priceCents: null,
      priceStatus: "unknown",
    });
    const recs = recommend(NEUTRAL_FACE, EMPTY_PREFERENCES, [sinPrecio], {
      limit: 10,
    });
    expect(recs.map((r) => r.frame.id)).toContain("sin-precio");
  });

  it("respeta la tolerancia del 15 % por encima del presupuesto", () => {
    const justo = makeFrame({ id: "justo", priceCents: 5700 }); // 5000 × 1,14
    const pasado = makeFrame({ id: "pasado", priceCents: 6000 }); // 5000 × 1,20

    const recs = recommend(
      NEUTRAL_FACE,
      { ...EMPTY_PREFERENCES, budgetMaxCents: 5000 },
      [justo, pasado],
      { limit: 10 },
    );
    const ids = recs.map((r) => r.frame.id);
    expect(ids).toContain("justo");
    expect(ids).not.toContain("pasado");
  });
});

describe("catálogo real", () => {
  it("ninguna montura afirma un precio: no hay feed todavía", () => {
    // GA-5 sin resolver. Se pondrá en verde cuando haya un feed con fecha de
    // verificación; hasta entonces, que falle si alguien mete precios a mano.
    for (const frame of FRAMES) {
      expect(frame.priceStatus).toBe("unknown");
      expect(reliablePriceCents(frame)).toBeNull();
    }
  });
});
