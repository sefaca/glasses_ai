import { describe, expect, it } from "vitest";
import { parsePurchase, verifySignature } from "../lib/billing/paddle";
import { PACKS, packByPriceId } from "../lib/billing/packs";

/**
 * La puerta del dinero.
 *
 * Lo que se prueba aquí no es que un pago legítimo acredite —eso se ve a la
 * primera compra—, sino que **un aviso que no venga de Paddle no acredite
 * nunca**, y que un reenvío no regale un pack.
 */

const SECRET = "pdl_ntfset_test_0123456789";

const generationsFor = (priceId: string) =>
  packByPriceId(priceId)?.generations ?? null;

/** Firma como lo hace Paddle: HMAC-SHA256 sobre `<ts>:<cuerpo>`. */
async function sign(body: string, ts: number): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${ts}:${body}`),
  );
  const hex = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `ts=${ts};h1=${hex}`;
}

describe("firma del aviso", () => {
  const body = '{"event_type":"transaction.completed"}';
  const now = Date.now();
  const ts = Math.floor(now / 1000);

  it("acepta la de Paddle", async () => {
    const header = await sign(body, ts);
    expect(await verifySignature({ rawBody: body, header, secret: SECRET, now })).toBe(
      true,
    );
  });

  it("rechaza si el cuerpo cambió aunque sea un carácter", async () => {
    const header = await sign(body, ts);
    expect(
      await verifySignature({
        rawBody: body + " ",
        header,
        secret: SECRET,
        now,
      }),
    ).toBe(false);
  });

  it("rechaza con otro secreto", async () => {
    const header = await sign(body, ts);
    expect(
      await verifySignature({ rawBody: body, header, secret: "otro", now }),
    ).toBe(false);
  });

  it("rechaza un aviso viejo reenviado", async () => {
    // Firma válida, pero de hace una hora: es la defensa contra capturar un
    // aviso legítimo y repetirlo más tarde.
    const header = await sign(body, ts - 3600);
    expect(await verifySignature({ rawBody: body, header, secret: SECRET, now })).toBe(
      false,
    );
  });

  it("rechaza sin cabecera, sin secreto y con cabecera inventada", async () => {
    for (const header of [null, "", "h1=abc", "ts=;h1=", "cualquier cosa"]) {
      expect(
        await verifySignature({ rawBody: body, header, secret: SECRET, now }),
        String(header),
      ).toBe(false);
    }
    expect(
      await verifySignature({
        rawBody: body,
        header: await sign(body, ts),
        secret: "",
        now,
      }),
    ).toBe(false);
  });
});

describe("lectura del aviso", () => {
  const pack = PACKS[1]!; // 25 generaciones

  function event(overrides: Record<string, unknown> = {}) {
    return {
      event_type: "transaction.completed",
      data: {
        id: "txn_01h",
        currency_code: "EUR",
        custom_data: { user_id: "u-1" },
        items: [{ quantity: 1, price: { id: pack.priceId } }],
        details: { totals: { grand_total: "999" } },
        ...overrides,
      },
    };
  }

  it("saca cuenta, cantidad e importe", () => {
    expect(parsePurchase(event(), generationsFor)).toEqual({
      userId: "u-1",
      generations: pack.generations,
      transactionId: "txn_01h",
      priceId: pack.priceId,
      amountCents: 999,
      currency: "EUR",
    });
  });

  it("la cantidad del precio en Paddle manda sobre la nuestra", () => {
    // Para poder crear un pack nuevo desde su panel sin desplegar.
    const parsed = parsePurchase(
      event({
        items: [
          { quantity: 1, price: { id: pack.priceId, custom_data: { generations: 60 } } },
        ],
      }),
      generationsFor,
    );
    expect(parsed?.generations).toBe(60);
  });

  it("multiplica por la cantidad comprada", () => {
    const parsed = parsePurchase(
      event({ items: [{ quantity: 3, price: { id: pack.priceId } }] }),
      generationsFor,
    );
    expect(parsed?.generations).toBe(pack.generations * 3);
  });

  it("ignora lo que no sea una compra completada", () => {
    for (const type of ["transaction.created", "subscription.updated", ""]) {
      expect(parsePurchase({ ...event(), event_type: type }, generationsFor)).toBeNull();
    }
  });

  it("no acredita sin saber a quién", () => {
    // Sin user_id no hay a quién sumarle: apuntarlo a alguien sería peor.
    expect(parsePurchase(event({ custom_data: {} }), generationsFor)).toBeNull();
    expect(parsePurchase(event({ custom_data: undefined }), generationsFor)).toBeNull();
  });

  it("no acredita un precio desconocido", () => {
    expect(
      parsePurchase(
        event({ items: [{ quantity: 1, price: { id: "pri_inventado" } }] }),
        generationsFor,
      ),
    ).toBeNull();
  });

  it("no revienta con basura", () => {
    for (const malo of [null, undefined, 1, "texto", [], {}, { data: {} }]) {
      expect(parsePurchase(malo, generationsFor), JSON.stringify(malo)).toBeNull();
    }
  });
});
