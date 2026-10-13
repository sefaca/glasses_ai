import { describe, expect, it } from "vitest";
import {
  isLeadSource,
  isValidEmail,
  normalizeEmail,
} from "../lib/leads/types";
import { LOCALES, getDictionary } from "../lib/i18n";

/**
 * La lista de espera es el único sitio del producto donde se guarda un dato
 * personal, así que lo que se prueba aquí no es sobre todo la lógica: es la
 * disciplina alrededor.
 */

describe("validación de correo", () => {
  it("acepta direcciones normales", () => {
    for (const email of [
      "a@b.co",
      "nombre.apellido@dominio.es",
      "con+etiqueta@correo.com",
      "guion-medio@sub.dominio.org",
    ]) {
      expect(isValidEmail(email), email).toBe(true);
    }
  });

  it("rechaza lo que claramente no es una dirección", () => {
    for (const bad of ["", "   ", "sinarroba", "a@b", "a@@b.com", "a b@c.com"]) {
      expect(isValidEmail(bad), JSON.stringify(bad)).toBe(false);
    }
  });

  it("rechaza una dirección desmesurada", () => {
    expect(isValidEmail(`${"a".repeat(250)}@b.com`)).toBe(false);
  });

  it("normaliza para que la misma persona no entre dos veces", () => {
    expect(normalizeEmail("  Nombre@Correo.COM ")).toBe("nombre@correo.com");
  });
});

describe("origen", () => {
  it("solo acepta los orígenes declarados", () => {
    expect(isLeadSource("access_gate")).toBe(true);
    expect(isLeadSource("content")).toBe(true);
    expect(isLeadSource("inventado")).toBe(false);
  });
});

describe("la promesa", () => {
  it("está traducida en los cinco idiomas y no se quedó en español", () => {
    for (const locale of LOCALES) {
      const list = getDictionary(locale).waitlist;
      expect(list.promise.trim(), locale).not.toBe("");
      if (locale !== "es") {
        expect(list.promise, locale).not.toBe(
          getDictionary("es").waitlist.promise,
        );
      }
    }
  });

  it("dice qué se recibe y que se puede borrar, en todos los idiomas", () => {
    // Si alguien recorta esta frase a «te avisamos», deja de cumplir lo que
    // §14 exige informar antes de recoger el dato.
    const borrar = {
      es: /borr/i,
      en: /delete/i,
      it: /cancell/i,
      pt: /apag/i,
      de: /l(ö|oe)sch/i,
    } as const;

    for (const locale of LOCALES) {
      const { promise } = getDictionary(locale).waitlist;
      expect(promise.length, locale).toBeGreaterThan(60);
      expect(promise, `${locale}: debe mencionar el borrado`).toMatch(
        borrar[locale],
      );
    }
  });

  it("la política de privacidad menciona la lista en los cinco idiomas", () => {
    for (const locale of LOCALES) {
      const headings = getDictionary(locale).legal.privacy.sections.map(
        (section) => section.heading,
      );
      expect(headings.length, locale).toBeGreaterThanOrEqual(5);
    }
  });
});
