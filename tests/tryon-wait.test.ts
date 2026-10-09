import { describe, expect, it } from "vitest";
import { MockTryOnProvider } from "../lib/tryon/mock";
import { waitForResult } from "../lib/tryon/wait";

/**
 * Espera a estado terminal.
 *
 * Existe por un fallo real: la ruta asumía que `createTryOn` termina al
 * instante. Es cierto para el generativo y falso para uno con cola, así que
 * funcionaba con un proveedor y devolvía 502 con el otro. Eso es una fuga de
 * abstracción, justo lo que el adaptador debe impedir.
 */

/** Reloj y espera controlados: los tests no dependen del tiempo real. */
function harness(start = 0) {
  let t = start;
  return {
    now: () => t,
    sleep: async (ms: number) => {
      t += ms;
    },
    advance: (ms: number) => (t += ms),
  };
}

describe("waitForResult", () => {
  it("espera a que un proveedor con cola termine", async () => {
    const h = harness();
    const provider = new MockTryOnProvider({ latencyMs: 3000, now: h.now });
    const job = await provider.createTryOn({
      userImage: { mimeType: "image/jpeg", base64: "x" },
      frameId: "f1",
    });
    expect(job.status).toBe("queued");

    const result = await waitForResult(provider, job.id, {
      now: h.now,
      sleep: h.sleep,
    });
    expect(result.status).toBe("completed");
    expect(result.resultUrl).not.toBeNull();
  });

  it("devuelve de inmediato lo que ya está terminal", async () => {
    const h = harness();
    const provider = new MockTryOnProvider({ now: h.now });
    const job = await provider.createTryOn({ frameId: "", userImage: undefined });
    expect(job.status).toBe("failed");

    const result = await waitForResult(provider, job.id, {
      now: h.now,
      sleep: h.sleep,
    });
    expect(result.status).toBe("failed");
    expect(result.errorCode).toBe("invalid_input");
  });

  it("corta por tiempo en vez de girar indefinidamente", async () => {
    const h = harness();
    // Latencia mayor que el tiempo de espera: nunca llegará a completarse.
    const provider = new MockTryOnProvider({ latencyMs: 10_000, now: h.now });
    const job = await provider.createTryOn({
      userImage: { mimeType: "image/jpeg", base64: "x" },
      frameId: "f1",
    });

    const result = await waitForResult(provider, job.id, {
      timeoutMs: 2_000,
      now: h.now,
      sleep: h.sleep,
    });
    expect(result.status).toBe("failed");
    expect(result.errorCode).toBe("provider_timeout");
    // Regla 11: lo que no llega a completarse no se factura.
    expect(result.billable).toBe(false);
  });

  it("propaga un fallo del proveedor tal cual", async () => {
    const h = harness();
    const provider = new MockTryOnProvider({
      latencyMs: 500,
      failureRate: 1,
      random: () => 0,
      now: h.now,
    });
    const job = await provider.createTryOn({
      userImage: { mimeType: "image/jpeg", base64: "x" },
      frameId: "f1",
    });

    const result = await waitForResult(provider, job.id, {
      now: h.now,
      sleep: h.sleep,
    });
    expect(result.status).toBe("failed");
    expect(result.billable).toBe(false);
  });
});
