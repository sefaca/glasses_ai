import { describe, expect, it } from "vitest";
import { EVENT_NAMES, isEventName } from "../lib/analytics/events";

/**
 * Lo que protege la analítica.
 *
 * El riesgo real no es perder un evento: es que un día alguien añada una
 * medida facial, una ruta con datos dentro o un identificador persistente
 * «solo para depurar» y eso acabe en un registro. CLAUDE.md reglas 13, 14 y
 * 15 lo prohíben, y la lista cerrada de metadatos es lo que lo hace
 * cumplible sin depender de que nadie se acuerde.
 */

describe("nombres de evento", () => {
  it("cubre el embudo mínimo de §17", () => {
    const required = [
      "landing_view",
      "upload_started",
      "upload_completed",
      "upload_failed",
      "face_detected",
      "face_analysis_completed",
      "recommendations_viewed",
      "try_on_started",
      "try_on_completed",
      "try_on_failed",
      "compare_opened",
      "outbound_product_click",
    ];
    for (const name of required) {
      expect(EVENT_NAMES, name).toContain(name);
    }
  });

  it("no se repiten", () => {
    expect(new Set(EVENT_NAMES).size).toBe(EVENT_NAMES.length);
  });

  it("rechaza lo que no esté en la lista", () => {
    expect(isEventName("landing_view")).toBe(true);
    expect(isEventName("Landing_View")).toBe(false);
    expect(isEventName("evento_inventado")).toBe(false);
    expect(isEventName("")).toBe(false);
  });

  it("usa snake_case, para que el embudo no se llene de variantes", () => {
    for (const name of EVENT_NAMES) {
      expect(name, name).toMatch(/^[a-z]+(?:_[a-z0-9]+)*$/);
    }
  });
});

/**
 * El saneado del servidor, probado a través de la ruta.
 *
 * Se importa dinámicamente para que la ruta de Next no se cargue si el resto
 * del archivo falla antes.
 */
describe("saneado de metadatos", () => {
  async function post(body: unknown) {
    process.env.ANALYTICS_SINK = "null";
    const { POST } = await import("../app/api/events/route");
    return POST(
      new Request("https://lookfit.app/api/events", {
        method: "POST",
        headers: { "x-forwarded-for": `10.0.0.${Math.random() * 250}` },
        body: typeof body === "string" ? body : JSON.stringify(body),
      }),
    );
  }

  it("acepta un evento válido", async () => {
    const res = await post({
      name: "landing_view",
      props: { locale: "es", path: "/es" },
      sessionId: "abc",
    });
    expect(res.status).toBe(204);
  });

  it("rechaza un nombre que no está en la lista", async () => {
    const res = await post({ name: "robar_datos", props: {}, sessionId: "a" });
    expect(res.status).toBe(400);
  });

  it("rechaza un cuerpo que no es JSON", async () => {
    expect((await post("{no es json")).status).toBe(400);
  });

  it("rechaza un cuerpo desmesurado", async () => {
    const res = await post({
      name: "landing_view",
      props: { path: "x".repeat(4000) },
      sessionId: "a",
    });
    expect(res.status).toBe(413);
  });

  it("no revela nada en el cuerpo de la respuesta", async () => {
    const res = await post({ name: "landing_view", sessionId: "a" });
    expect(await res.text()).toBe("");
  });
});
