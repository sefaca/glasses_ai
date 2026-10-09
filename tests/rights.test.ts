import { describe, expect, it } from "vitest";
import { listableFrames } from "../lib/catalog";
import { FRAMES } from "../lib/catalog/frames";
import {
  GENERATIVE_FIDELITY_VERIFIED,
  canDeriveOfficialImage,
  canDisplayOfficialImage,
  canLabelAsProduct,
  canTryOn,
  canUseLogo,
  isPubliclyListable,
  outboundUrl,
} from "../lib/catalog/rights";
import { unverifiedRights } from "../lib/catalog/types";
import { makeFrame } from "./helpers/frame";

/**
 * El muro de gates, revisado el 2026-10-09 → D-021.
 *
 * El cambio respecto a la versión anterior: **nombrar una montura ya no
 * requiere permiso**, porque es uso nominativo. Lo que requiere permiso son
 * los activos del anunciante, y son tres permisos distintos, no uno.
 *
 * Si alguno de estos tests se pone rojo, el repo está en condiciones de usar
 * material de marca sin derechos o de afirmar que una imagen generada es un
 * producto concreto sin haberlo medido.
 */

describe("listar y nombrar", () => {
  it("una montura activa se puede listar aunque no tengamos ningún permiso", () => {
    // Uso nominativo: nombrar el producto al que enlazas es lo que hace todo
    // el sector de referencia. Exigir permiso escrito para esto era el error
    // de la versión anterior.
    const frame = makeFrame({ rights: unverifiedRights("feed-nuevo") });
    expect(isPubliclyListable(frame)).toBe(true);
  });

  it("una montura inactiva nunca se lista", () => {
    expect(isPubliclyListable(makeFrame({ active: false }))).toBe(false);
  });

  it("el catálogo real es listable entero", () => {
    expect(listableFrames().length).toBe(FRAMES.length);
    expect(listableFrames().length).toBeGreaterThan(0);
  });
});

describe("activos del anunciante: tres permisos distintos", () => {
  it("los derechos por defecto no autorizan ningún activo ajeno", () => {
    const rights = unverifiedRights("feed-nuevo");
    expect(rights.displayOfficialImage).toBe("pending");
    expect(rights.useLogo).toBe("pending");
    // D-015: los términos estándar cubren publicar «without modification».
    expect(rights.deriveOfficialImage).toBe("denied");
    expect(rights.verifiedAt).toBeNull();
  });

  it("ninguna montura del catálogo tiene autorizada la imagen oficial", () => {
    for (const frame of FRAMES) {
      expect(canDisplayOfficialImage(frame)).toBe(false);
      expect(canDeriveOfficialImage(frame)).toBe(false);
      expect(canUseLogo(frame)).toBe(false);
    }
  });

  it("mostrar la imagen y derivarla son permisos independientes", () => {
    // Lo habitual con un feed: puedes mostrarla, no modificarla.
    const frame = makeFrame({
      rights: {
        ...unverifiedRights("awin"),
        displayOfficialImage: "cleared",
        deriveOfficialImage: "denied",
      },
    });
    expect(canDisplayOfficialImage(frame)).toBe(true);
    expect(canDeriveOfficialImage(frame)).toBe(false);
  });
});

describe("try-on según el origen del activo", () => {
  const frame = makeFrame();

  it("Clase B sobre imagen oficial queda bloqueada sin permiso de derivación", () => {
    expect(canTryOn(frame, "advertiser-image")).toBe(false);
  });

  it("Clase B sobre imagen oficial se desbloquea con permiso escrito", () => {
    const authorised = makeFrame({
      rights: { ...unverifiedRights("marca"), deriveOfficialImage: "cleared" },
    });
    expect(canTryOn(authorised, "advertiser-image")).toBe(true);
  });

  it("Clase A puede: el activo 3D es del proveedor, no del anunciante", () => {
    expect(canTryOn(frame, "provider")).toBe(true);
  });

  it("generar desde el conocimiento del modelo no toca ningún activo ajeno", () => {
    // No hay archivo del anunciante de por medio, así que los términos de
    // afiliación no aplican. Su límite es la fidelidad, no el permiso.
    expect(canTryOn(frame, "model-prior")).toBe(true);
  });

  it("nada se prueba si no se puede listar", () => {
    const inactive = makeFrame({ active: false });
    for (const ownership of [
      "provider",
      "advertiser-image",
      "model-prior",
      "mock",
    ] as const) {
      expect(canTryOn(inactive, ownership)).toBe(false);
    }
  });
});

describe("afirmar que la imagen ES ese producto — RULE #1", () => {
  const frame = makeFrame();

  it("hoy no se puede etiquetar una imagen generada como ese producto", () => {
    // GT-1 sin medir: la imagen se presenta como simulación de estilo, no
    // como esa montura. Cuando el test ciego pase, esto cambia solo.
    expect(GENERATIVE_FIDELITY_VERIFIED).toBe(false);
    expect(canLabelAsProduct(frame, "model-prior")).toBe(false);
  });

  it("con un activo del proveedor sí, porque es el producto", () => {
    expect(canLabelAsProduct(frame, "provider")).toBe(true);
  });

  it("con la imagen oficial autorizada sí", () => {
    const authorised = makeFrame({
      rights: { ...unverifiedRights("marca"), deriveOfficialImage: "cleared" },
    });
    expect(canLabelAsProduct(authorised, "advertiser-image")).toBe(true);
  });

  it("el mock nunca afirma ser un producto", () => {
    expect(canLabelAsProduct(frame, "mock")).toBe(false);
  });

  it("poder probar no implica poder afirmar", () => {
    // La distinción que sostiene todo: se puede generar la imagen y aun así
    // no poder decir que es la RB3025.
    expect(canTryOn(frame, "model-prior")).toBe(true);
    expect(canLabelAsProduct(frame, "model-prior")).toBe(false);
  });
});

describe("salida al exterior", () => {
  it("sin URL de afiliado se enlaza la ficha pública, nunca un tag inventado", () => {
    const frame = makeFrame({
      productUrl: "https://example.com/p/1",
      affiliateUrl: null,
    });
    expect(outboundUrl(frame)).toBe("https://example.com/p/1");
  });

  it("la URL de afiliado tiene prioridad cuando existe", () => {
    const frame = makeFrame({
      productUrl: "https://example.com/p/1",
      affiliateUrl: "https://awin.example/deeplink",
    });
    expect(outboundUrl(frame)).toBe("https://awin.example/deeplink");
  });

  it("sin ninguna URL devuelve null en vez de un enlace roto", () => {
    expect(outboundUrl(makeFrame())).toBeNull();
  });

  it("el catálogo real todavía no tiene ninguna URL de afiliado", () => {
    // GA-3 sin resolver: no se inventa un tag que no existe.
    for (const frame of FRAMES) {
      expect(frame.affiliateUrl).toBeNull();
    }
  });
});
