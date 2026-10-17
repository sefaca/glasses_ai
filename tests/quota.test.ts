import { afterEach, describe, expect, it } from "vitest";
import {
  FREE_ALLOWANCE,
  dailyCap,
  decide,
  type Subject,
} from "../lib/usage/quota";
import { LOCALES, getDictionary } from "../lib/i18n";

/**
 * Las reglas que acotan el gasto.
 *
 * Es el código del proyecto donde un fallo cuesta dinero literal: cada
 * generación son ~0,10 € reales. Lo que se prueba aquí no es que el cupo
 * funcione en el caso normal, sino que **no se abre en los raros**.
 */

const anon: Subject = { type: "anon", id: "a1" };
const user: Subject = { type: "user", id: "u1" };

const originalCap = process.env.DAILY_GENERATION_CAP;
afterEach(() => {
  if (originalCap === undefined) delete process.env.DAILY_GENERATION_CAP;
  else process.env.DAILY_GENERATION_CAP = originalCap;
});

describe("cupo gratuito", () => {
  it("una sin cuenta, dos con cuenta", () => {
    expect(FREE_ALLOWANCE.anon).toBe(1);
    expect(FREE_ALLOWANCE.user).toBe(2);
  });

  it("deja generar mientras quede", () => {
    const d = decide(anon, { subject: 0, today: 0, purchased: 0 });
    expect(d.allowed).toBe(true);
    if (d.allowed) expect(d.remaining).toBe(0);
  });

  it("corta al agotarlo", () => {
    expect(decide(anon, { subject: 1, today: 0, purchased: 0 })).toEqual({
      allowed: false,
      reason: "free_exhausted",
    });
  });

  it("la cuenta tiene una más que el anónimo", () => {
    expect(decide(user, { subject: 1, today: 0, purchased: 0 }).allowed).toBe(true);
    expect(decide(user, { subject: 2, today: 0, purchased: 0 })).toEqual({
      allowed: false,
      reason: "free_exhausted",
    });
  });

  it("las compradas se suman a las gratuitas", () => {
    // Una cuenta con dos gratis y diez compradas tiene doce.
    expect(decide(user, { subject: 11, today: 0, purchased: 10 }).allowed).toBe(
      true,
    );
    expect(decide(user, { subject: 12, today: 0, purchased: 10 })).toEqual({
      allowed: false,
      reason: "free_exhausted",
    });
  });

  it("el tope diario manda también sobre lo comprado", () => {
    // Pagar no salta el límite de gasto del sitio: lo que protege la factura
    // no puede depender de que alguien haya pagado.
    expect(
      decide(user, { subject: 0, today: 50, purchased: 100 }, 50),
    ).toEqual({ allowed: false, reason: "daily_cap" });
  });

  it("un contador por encima del cupo tampoco abre la puerta", () => {
    // Si una incidencia dejara el contador descuadrado hacia arriba, lo
    // correcto es seguir denegando, no volver a permitir.
    expect(decide(anon, { subject: 99, today: 0, purchased: 0 }).allowed).toBe(false);
  });
});

describe("tope global diario", () => {
  it("manda sobre el cupo individual", () => {
    // A alguien le quedan gratis, pero el sitio llegó a su límite. Lo que se
    // protege es la factura, no su cupo.
    expect(decide(anon, { subject: 0, today: 50, purchased: 0 }, 50)).toEqual({
      allowed: false,
      reason: "daily_cap",
    });
  });

  it("se comprueba antes que nada", () => {
    // Con las dos condiciones incumplidas, gana el tope global: es el que
    // explica mejor lo que pasa y el que no es culpa del usuario.
    expect(decide(user, { subject: 99, today: 99, purchased: 0 }, 50).allowed).toBe(false);
    const d = decide(user, { subject: 99, today: 99, purchased: 0 }, 50);
    if (!d.allowed) expect(d.reason).toBe("daily_cap");
  });

  it("justo por debajo del tope todavía deja pasar", () => {
    expect(decide(anon, { subject: 0, today: 49, purchased: 0 }, 50).allowed).toBe(true);
  });

  it("por defecto son 50, que a 0,10 € son 5 € al día", () => {
    delete process.env.DAILY_GENERATION_CAP;
    expect(dailyCap()).toBe(50);
  });

  it("se puede subir por entorno, sin desplegar", () => {
    process.env.DAILY_GENERATION_CAP = "200";
    expect(dailyCap()).toBe(200);
  });

  it("un valor absurdo cae al de por defecto, nunca a ilimitado", () => {
    for (const malo of ["0", "-5", "muchas", ""]) {
      process.env.DAILY_GENERATION_CAP = malo;
      expect(dailyCap(), malo).toBe(50);
    }
  });
});

describe("mensajes", () => {
  it("los cinco idiomas explican el cupo agotado y el tope del día", () => {
    for (const locale of LOCALES) {
      const errors = getDictionary(locale).tryOn.errors;
      expect(errors.freeExhausted.trim(), locale).not.toBe("");
      expect(errors.dailyCap.trim(), locale).not.toBe("");
      if (locale !== "es") {
        expect(errors.dailyCap, locale).not.toBe(
          getDictionary("es").tryOn.errors.dailyCap,
        );
      }
    }
  });
});
