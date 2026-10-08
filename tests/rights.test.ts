import { describe, expect, it } from "vitest";
import { listableFrames } from "../lib/catalog";
import {
  canDeriveFrameImage,
  canTryOn,
  isPubliclyListable,
  outboundUrl,
  tryOnBlockedReason,
} from "../lib/catalog/rights";
import { BLOCKED_FRAMES, DEV_FRAMES } from "../lib/catalog/seed";
import { unverifiedRights, type FrameProfile } from "../lib/catalog/types";

/**
 * El muro de gates de D-017.
 *
 * Si alguno de estos tests se pone rojo, el repo está en condiciones de
 * publicar material de marca sin derechos o de ofrecer un try-on que D-015
 * demostró que los términos estándar no autorizan. No es un test de estilo.
 */

describe("muro de gates · listado público", () => {
  it("ninguna montura con derechos sin verificar es listable", () => {
    for (const frame of BLOCKED_FRAMES) {
      expect(isPubliclyListable(frame)).toBe(false);
    }
  });

  it("las monturas de marca real bloqueadas no aparecen en el catálogo público", () => {
    const slugs = listableFrames().map((f) => f.slug);
    for (const frame of BLOCKED_FRAMES) {
      expect(slugs).not.toContain(frame.slug);
    }
  });

  it("las monturas sintéticas propias sí son listables", () => {
    expect(DEV_FRAMES.length).toBeGreaterThan(0);
    for (const frame of DEV_FRAMES) {
      expect(isPubliclyListable(frame)).toBe(true);
    }
  });

  it("una montura inactiva nunca es listable, tenga los derechos que tenga", () => {
    const frame: FrameProfile = { ...DEV_FRAMES[0]!, active: false };
    expect(isPubliclyListable(frame)).toBe(false);
  });

  it("los derechos por defecto de un dato nuevo niegan la derivación", () => {
    const rights = unverifiedRights("feed-nuevo");
    expect(rights.deriveImage).toBe("denied");
    expect(rights.displayImage).toBe("pending");
    expect(rights.verifiedAt).toBeNull();
  });
});

describe("muro de gates · try-on", () => {
  const blocked = BLOCKED_FRAMES[0]!;
  const dev = DEV_FRAMES[0]!;

  it("Clase B no puede probar una montura sin derechos de derivación", () => {
    expect(canDeriveFrameImage(blocked)).toBe(false);
    expect(canTryOn(blocked, "advertiser-image")).toBe(false);
    expect(tryOnBlockedReason(blocked, "advertiser-image")).toBe(
      "trademark-not-cleared",
    );
  });

  it("una marca con uso autorizado pero sin derivación sigue bloqueada en Clase B", () => {
    // Este es el caso exacto de D-015: podemos nombrarla y mostrarla, pero no
    // generar una imagen nueva a partir de su foto oficial.
    const frame: FrameProfile = {
      ...blocked,
      rights: {
        ...blocked.rights,
        displayImage: "cleared",
        useTrademark: "cleared",
        deriveImage: "denied",
      },
    };
    expect(isPubliclyListable(frame)).toBe(true);
    expect(canTryOn(frame, "advertiser-image")).toBe(false);
    expect(tryOnBlockedReason(frame, "advertiser-image")).toBe(
      "derivative-rights-not-cleared",
    );
  });

  it("Clase A puede probar esa misma montura: el activo 3D es del proveedor", () => {
    // D-016: un proveedor de Clase A no reproduce ni altera la imagen del
    // anunciante, así que la restricción de derivación no le aplica.
    const frame: FrameProfile = {
      ...blocked,
      rights: { ...blocked.rights, useTrademark: "cleared", deriveImage: "denied" },
    };
    expect(canTryOn(frame, "provider")).toBe(true);
    expect(tryOnBlockedReason(frame, "provider")).toBeNull();
  });

  it("no hay try-on de algo que no se puede listar, ni con Clase A", () => {
    expect(canTryOn(blocked, "provider")).toBe(false);
  });

  it("las monturas de desarrollo se pueden probar con el mock", () => {
    expect(canTryOn(dev, "mock")).toBe(true);
  });
});

describe("salida al exterior", () => {
  it("sin URL de afiliado se enlaza la ficha pública, nunca un tag inventado", () => {
    const frame: FrameProfile = {
      ...DEV_FRAMES[0]!,
      productUrl: "https://example.com/p/1",
      affiliateUrl: null,
    };
    expect(outboundUrl(frame)).toBe("https://example.com/p/1");
  });

  it("sin ninguna URL devuelve null en vez de un enlace roto", () => {
    expect(outboundUrl(DEV_FRAMES[0]!)).toBeNull();
  });
});
