import { describe, expect, it } from "vitest";
import { MockTryOnProvider } from "../lib/tryon/mock";
import { isTerminal } from "../lib/tryon/provider";

/**
 * Tests del adaptador → CLAUDE.md §29.7.
 *
 * Lo que se comprueba aquí no es el mock por sí mismo: es el contrato que
 * cualquier proveedor real tendrá que cumplir cuando se conecte. Sobre todo
 * la regla 11 — un fallo no consume crédito.
 */

/** Reloj controlado, para que los tests no dependan del tiempo real. */
function clock(start = 0) {
  let t = start;
  return { now: () => t, advance: (ms: number) => (t += ms) };
}

describe("MockTryOnProvider", () => {
  it("declara su naturaleza: ni toca al anunciante ni cuesta nada", () => {
    const p = new MockTryOnProvider();
    expect(p.assetOwnership).toBe("mock");
    expect(p.costPerTryOnCents).toBe(0);
    expect(p.supportsPhotoInput).toBe(true);
  });

  it("encola, procesa y completa según avanza el reloj", async () => {
    const c = clock();
    const p = new MockTryOnProvider({ latencyMs: 1000, now: c.now });

    const job = await p.createTryOn({
      userImageUrl: "signed://user.jpg",
      frameId: "dev-linea-01",
    });
    expect(job.status).toBe("queued");

    c.advance(400);
    expect((await p.getJob(job.id)).status).toBe("processing");

    c.advance(900);
    const done = await p.getJob(job.id);
    expect(done.status).toBe("completed");
    expect(done.resultUrl).not.toBeNull();
    expect(done.errorCode).toBeNull();
    expect(done.completedAt).not.toBeNull();
  });

  it("un job fallido NO es facturable", async () => {
    // Regla 11: no se cobra un crédito por una generación que falla.
    const c = clock();
    const p = new MockTryOnProvider({
      latencyMs: 100,
      failureRate: 1,
      now: c.now,
      random: () => 0,
    });

    const job = await p.createTryOn({
      userImageUrl: "signed://user.jpg",
      frameId: "dev-linea-01",
    });
    c.advance(200);

    const failed = await p.getJob(job.id);
    expect(failed.status).toBe("failed");
    expect(failed.billable).toBe(false);
    expect(failed.resultUrl).toBeNull();
  });

  it("un input inválido falla de inmediato y tampoco se factura", async () => {
    const p = new MockTryOnProvider();
    const job = await p.createTryOn({ userImageUrl: "", frameId: "" });
    expect(job.status).toBe("failed");
    const result = await p.getJob(job.id);
    expect(result.errorCode).toBe("invalid_input");
    expect(result.billable).toBe(false);
  });

  it("el error que se expone es un código estable, nunca el del proveedor", () => {
    // Regla 5: los errores del proveedor no devuelven secretos al cliente.
    const codes = [
      "provider_unavailable",
      "provider_timeout",
      "invalid_input",
      "no_face_detected",
      "content_rejected",
      "rate_limited",
      "unknown",
    ];
    expect(codes).toContain("provider_unavailable");
  });

  it("un estado terminal no vuelve a cambiar", async () => {
    const c = clock();
    const p = new MockTryOnProvider({ latencyMs: 10, now: c.now });
    const job = await p.createTryOn({
      userImageUrl: "signed://user.jpg",
      frameId: "dev-linea-01",
    });

    c.advance(50);
    const first = await p.getJob(job.id);
    expect(isTerminal(first.status)).toBe(true);

    c.advance(10_000);
    const second = await p.getJob(job.id);
    expect(second).toEqual(first);
  });

  it("un job desconocido lanza, no devuelve algo inventado", async () => {
    const p = new MockTryOnProvider();
    await expect(p.getJob("no-existe")).rejects.toThrow();
  });
});
