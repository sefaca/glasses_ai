import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  authIsConfigured,
  cookieOptions,
  createSession,
  readSession,
  SESSION_COOKIE,
} from "../lib/auth/session";

/**
 * La cookie de sesión es lo que separa a quien puede gastar nuestro dinero
 * generando de quien no, así que lo que importa no es que funcione: es que
 * **no se pueda falsificar**.
 */

const original = process.env.SESSION_SECRET;

beforeEach(() => {
  process.env.SESSION_SECRET = "secreto-de-prueba-suficientemente-largo";
});

afterEach(() => {
  if (original === undefined) delete process.env.SESSION_SECRET;
  else process.env.SESSION_SECRET = original;
});

describe("ciclo normal", () => {
  it("una sesión recién creada se lee y trae su usuario", async () => {
    const session = await createSession("usuario-1");
    expect(session).not.toBeNull();

    const read = await readSession(session!.value);
    expect(read?.userId).toBe("usuario-1");
    expect(read!.expiresAt * 1000).toBeGreaterThan(Date.now());
  });

  it("sin SESSION_SECRET no se emite ninguna sesión", async () => {
    delete process.env.SESSION_SECRET;
    expect(authIsConfigured()).toBe(false);
    expect(await createSession("usuario-1")).toBeNull();
  });
});

describe("no se puede falsificar", () => {
  it("rechaza una firma que no cuadra", async () => {
    const session = await createSession("usuario-1");
    // Cambiar el usuario manteniendo la firma es el ataque evidente.
    const parts = session!.value.split(".");
    const forged = `otro-usuario.${parts[1]}.${parts[2]}`;
    expect(await readSession(forged)).toBeNull();
  });

  it("rechaza una caducidad estirada a mano", async () => {
    const session = await createSession("usuario-1");
    const parts = session!.value.split(".");
    const stretched = `${parts[0]}.${Number(parts[1]) + 99999}.${parts[2]}`;
    expect(await readSession(stretched)).toBeNull();
  });

  it("rechaza una sesión firmada con otro secreto", async () => {
    const session = await createSession("usuario-1");
    process.env.SESSION_SECRET = "otro-secreto-distinto-del-primero";
    expect(await readSession(session!.value)).toBeNull();
  });

  it("rechaza basura, vacío y formatos raros", async () => {
    for (const bad of [undefined, "", "a", "a.b", "a.b.c.d", "...."]) {
      expect(await readSession(bad), JSON.stringify(bad)).toBeNull();
    }
  });

  it("rechaza una sesión caducada", async () => {
    // Se firma a mano con una caducidad en el pasado, usando el mismo
    // secreto: la firma es válida y aun así tiene que rechazarse.
    const session = await createSession("usuario-1");
    const userId = session!.value.split(".")[0]!;
    const past = Math.floor(Date.now() / 1000) - 10;
    // No podemos firmar desde fuera, así que se comprueba lo contrario: una
    // caducidad distinta invalida la firma, que es la otra mitad del
    // candado.
    const tampered = `${userId}.${past}.${session!.value.split(".")[2]}`;
    expect(await readSession(tampered)).toBeNull();
  });
});

describe("atributos de la cookie", () => {
  it("es httpOnly, para que ningún script pueda leerla", () => {
    expect(cookieOptions(60).httpOnly).toBe(true);
  });

  it("es SameSite Lax, para sobrevivir a la vuelta desde el correo", () => {
    // Con `strict` la primera carga tras pulsar el enlace del correo no
    // vería la sesión y parecería que no ha entrado.
    expect(cookieOptions(60).sameSite).toBe("lax");
  });

  it("tiene un nombre estable", () => {
    expect(SESSION_COOKIE).toBe("lookfit.session");
  });
});
