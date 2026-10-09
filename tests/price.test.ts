import { describe, expect, it } from "vitest";
import { reliablePriceCents } from "../lib/catalog/price";
import { BLOCKED_FRAMES, DEV_FRAMES } from "../lib/catalog/seed";
import type { FrameProfile } from "../lib/catalog/types";
import { NEUTRAL_FACE } from "../lib/face/neutral";
import { EMPTY_PREFERENCES } from "../lib/face/types";
import { recommend } from "../lib/recommendations/score";

/**
 * El precio es un dato interno y **no se muestra en nuestra UI** → D-019.
 *
 * Lo que sí hace es filtrar. Y filtrar con un precio del que no nos podemos
 * fiar sería peor que no filtrar: enseñaríamos algo que puede costar el triple
 * a alguien que acaba de decir cuánto quiere gastar.
 */

const base = DEV_FRAMES[0]!;

describe("precio fiable", () => {
  it("un precio verificado sirve para filtrar", () => {
    const frame: FrameProfile = {
      ...base,
      priceCents: 5900,
      priceStatus: "verified",
      priceCheckedAt: "2026-10-09",
    };
    expect(reliablePriceCents(frame)).toBe(5900);
  });

  it("un precio de referencia también sirve para filtrar", () => {
    expect(reliablePriceCents({ ...base, priceStatus: "indicative" })).toBe(
      base.priceCents,
    );
  });

  it("un precio desconocido no sirve, aunque haya un número guardado", () => {
    // Tener un número no autoriza a usarlo.
    const frame: FrameProfile = {
      ...base,
      priceCents: 9900,
      priceStatus: "unknown",
    };
    expect(reliablePriceCents(frame)).toBeNull();
  });

  it("sin precio no hay precio", () => {
    expect(
      reliablePriceCents({ ...base, priceCents: null, priceStatus: "verified" }),
    ).toBeNull();
  });
});

describe("filtro de presupuesto", () => {
  it("excluye las monturas sin precio fiable cuando hay presupuesto declarado", () => {
    const sinPrecio: FrameProfile = {
      ...base,
      id: "dev-sin-precio",
      priceCents: null,
      priceStatus: "unknown",
    };
    const frames = [...DEV_FRAMES, sinPrecio];

    const conPresupuesto = recommend(
      NEUTRAL_FACE,
      { ...EMPTY_PREFERENCES, budgetMaxCents: 20000 },
      frames,
      { limit: 50 },
    );
    expect(conPresupuesto.map((r) => r.frame.id)).not.toContain(
      "dev-sin-precio",
    );
  });

  it("sin presupuesto declarado, la falta de precio no excluye a nadie", () => {
    const sinPrecio: FrameProfile = {
      ...base,
      id: "dev-sin-precio",
      priceCents: null,
      priceStatus: "unknown",
    };
    const todas = recommend(NEUTRAL_FACE, EMPTY_PREFERENCES, [sinPrecio], {
      limit: 50,
    });
    expect(todas.map((r) => r.frame.id)).toContain("dev-sin-precio");
  });
});

describe("catálogo semilla", () => {
  it("las monturas de desarrollo llevan precio de referencia, no verificado", () => {
    for (const frame of DEV_FRAMES) {
      expect(frame.priceStatus).toBe("indicative");
      expect(frame.priceCheckedAt).toBeNull();
    }
  });

  it("las monturas bloqueadas no tienen precio del que fiarse", () => {
    for (const frame of BLOCKED_FRAMES) {
      expect(reliablePriceCents(frame)).toBeNull();
    }
  });

  it("ninguna montura tiene precio verificado todavía", () => {
    // Se pondrá en verde cuando haya un feed real con fecha de verificación.
    // Hasta entonces, que falle si alguien marca un precio como verificado sin
    // tener la fuente detrás.
    const verified = [...DEV_FRAMES, ...BLOCKED_FRAMES].filter(
      (f) => f.priceStatus === "verified",
    );
    expect(verified).toHaveLength(0);
  });
});
