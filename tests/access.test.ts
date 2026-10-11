import { afterEach, describe, expect, it } from "vitest";
import { accessIsRequired, checkAccess } from "../lib/server/access";

/**
 * La puerta protege dinero real, así que las dos propiedades que importan son
 * «sin código configurado no molesta» y «con código configurado no se cuela
 * nadie» — incluida la petición que no manda cabecera ninguna.
 */

const original = process.env.ACCESS_CODE;

afterEach(() => {
  if (original === undefined) delete process.env.ACCESS_CODE;
  else process.env.ACCESS_CODE = original;
});

describe("checkAccess", () => {
  it("sin ACCESS_CODE no hay puerta, para no estorbar en local", () => {
    delete process.env.ACCESS_CODE;
    expect(accessIsRequired()).toBe(false);
    expect(checkAccess(null)).toBe("open");
    expect(checkAccess("cualquier-cosa")).toBe("open");
  });

  it("una cadena de espacios no cuenta como puerta configurada", () => {
    process.env.ACCESS_CODE = "   ";
    expect(accessIsRequired()).toBe(false);
    expect(checkAccess(null)).toBe("open");
  });

  it("con ACCESS_CODE, la ausencia de cabecera se rechaza", () => {
    process.env.ACCESS_CODE = "abeja-verde";
    expect(accessIsRequired()).toBe(true);
    expect(checkAccess(null)).toBe("denied");
    expect(checkAccess("")).toBe("denied");
  });

  it("acepta el código exacto y nada más", () => {
    process.env.ACCESS_CODE = "abeja-verde";
    expect(checkAccess("abeja-verde")).toBe("granted");
    // Espacios del portapapeles: no deben costar un intento.
    expect(checkAccess("  abeja-verde  ")).toBe("granted");
    expect(checkAccess("abeja-verd")).toBe("denied");
    expect(checkAccess("abeja-verdes")).toBe("denied");
    expect(checkAccess("Abeja-Verde")).toBe("denied");
  });
});
