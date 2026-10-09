import { beforeEach, describe, expect, it } from "vitest";
import {
  checkRateLimit,
  pruneRateLimits,
  resetRateLimits,
} from "../lib/server/rate-limit";

/**
 * Límite de uso de los endpoints caros — CLAUDE.md §15.
 *
 * No es una defensa de seguridad: vive en memoria del proceso. Es un freno al
 * abuso accidental, y existe porque **cada generación cuesta dinero real** y
 * un bucle de reintentos puede vaciar una cuenta en minutos.
 */

const CONFIG = { limit: 3, windowMs: 60_000 };

beforeEach(() => resetRateLimits());

describe("ventana de uso", () => {
  it("permite hasta el límite y luego corta", () => {
    for (let i = 0; i < CONFIG.limit; i++) {
      expect(checkRateLimit("ip", CONFIG, 0).allowed).toBe(true);
    }
    expect(checkRateLimit("ip", CONFIG, 0).allowed).toBe(false);
  });

  it("informa de cuánto queda", () => {
    expect(checkRateLimit("ip", CONFIG, 0).remaining).toBe(2);
    expect(checkRateLimit("ip", CONFIG, 0).remaining).toBe(1);
    expect(checkRateLimit("ip", CONFIG, 0).remaining).toBe(0);
  });

  it("devuelve segundos de espera al cortar, para el Retry-After", () => {
    for (let i = 0; i < CONFIG.limit; i++) checkRateLimit("ip", CONFIG, 0);
    const blocked = checkRateLimit("ip", CONFIG, 10_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(50);
  });

  it("vuelve a permitir cuando pasa la ventana", () => {
    for (let i = 0; i < CONFIG.limit; i++) checkRateLimit("ip", CONFIG, 0);
    expect(checkRateLimit("ip", CONFIG, 0).allowed).toBe(false);
    expect(checkRateLimit("ip", CONFIG, CONFIG.windowMs).allowed).toBe(true);
  });

  it("cuenta por clave: un abusón no bloquea a los demás", () => {
    for (let i = 0; i < CONFIG.limit; i++) checkRateLimit("ip-a", CONFIG, 0);
    expect(checkRateLimit("ip-a", CONFIG, 0).allowed).toBe(false);
    expect(checkRateLimit("ip-b", CONFIG, 0).allowed).toBe(true);
  });
});

describe("limpieza", () => {
  it("descarta las ventanas caducadas para que el mapa no crezca sin fin", () => {
    checkRateLimit("vieja", CONFIG, 0);
    pruneRateLimits(CONFIG.windowMs + 1);
    // Si se hubiera limpiado, el siguiente arranca ventana nueva y queda
    // con el cupo completo menos uno.
    expect(checkRateLimit("vieja", CONFIG, CONFIG.windowMs + 2).remaining).toBe(
      CONFIG.limit - 1,
    );
  });
});
