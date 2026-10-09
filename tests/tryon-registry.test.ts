import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { resolveProviderId } from "../lib/tryon/registry";

/**
 * Selección de proveedor.
 *
 * Lo que se comprueba es que **cambiar de proveedor sea configuración, no
 * código**. Añadir OpenAI junto a Gemini costó un archivo y una rama; si esto
 * se rompe, el adaptador de §10.1 ha dejado de cumplir su función.
 */

const KEYS = ["OPENAI_API_KEY", "GEMINI_API_KEY", "TRYON_PROVIDER"] as const;
const saved: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const key of KEYS) {
    saved[key] = process.env[key];
    delete process.env[key];
  }
});

afterEach(() => {
  for (const key of KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
});

describe("resolución de proveedor", () => {
  it("sin ninguna clave, el mock", () => {
    // Desarrollar no puede costar dinero en cada recarga.
    expect(resolveProviderId()).toBe("mock");
  });

  it("con clave de OpenAI, OpenAI", () => {
    process.env.OPENAI_API_KEY = "sk-test";
    expect(resolveProviderId()).toBe("openai");
  });

  it("con clave de Gemini y nada más, Gemini", () => {
    process.env.GEMINI_API_KEY = "g-test";
    expect(resolveProviderId()).toBe("gemini");
  });

  it("con las dos claves, gana OpenAI", () => {
    process.env.OPENAI_API_KEY = "sk-test";
    process.env.GEMINI_API_KEY = "g-test";
    expect(resolveProviderId()).toBe("openai");
  });

  it("la elección explícita manda sobre las claves presentes", () => {
    process.env.OPENAI_API_KEY = "sk-test";
    process.env.GEMINI_API_KEY = "g-test";
    process.env.TRYON_PROVIDER = "gemini";
    expect(resolveProviderId()).toBe("gemini");
  });

  it("se puede forzar el mock aunque haya claves", () => {
    // Para desarrollar una pantalla sin quemar creditos en cada guardado.
    process.env.OPENAI_API_KEY = "sk-test";
    process.env.TRYON_PROVIDER = "mock";
    expect(resolveProviderId()).toBe("mock");
  });

  it("un valor desconocido no rompe: se ignora y se mira la clave", () => {
    process.env.OPENAI_API_KEY = "sk-test";
    process.env.TRYON_PROVIDER = "lo-que-sea";
    expect(resolveProviderId()).toBe("openai");
  });

  it("tolera espacios y mayúsculas en la elección", () => {
    process.env.GEMINI_API_KEY = "g-test";
    process.env.TRYON_PROVIDER = "  GEMINI ";
    expect(resolveProviderId()).toBe("gemini");
  });
});
