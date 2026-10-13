import type { Lead } from "./types";

/**
 * Dónde se guarda la lista de espera.
 *
 * Mismo patrón que el proveedor de try-on y el destino de analítica (§29.2):
 * la interfaz primero, el servicio después. Así el embudo se construye y se
 * prueba hoy, y encender Supabase es pegar dos variables de entorno.
 *
 * **Sin configurar, no se guarda nada y la interfaz lo dice.** Prometerle a
 * alguien que le avisaremos y tirar su correo a un log que caduca es
 * exactamente la clase de cosa que no vamos a hacer: por eso el endpoint
 * responde «no disponible» en vez de «gracias».
 */

export type StoreResult =
  | { ok: true; alreadyOnList: boolean }
  | { ok: false; reason: "unavailable" | "error" };

export interface LeadStore {
  readonly name: string;
  readonly ready: boolean;
  save(lead: Lead): Promise<StoreResult>;
}

/**
 * Sin destino configurado.
 *
 * Registra que alguien lo intentó —el dato de producto que interesa es
 * «cuánta gente querría apuntarse»— pero **sin el correo**, porque guardar un
 * dato personal en un log sin base ni retención es peor que no guardarlo.
 */
export const unavailableStore: LeadStore = {
  name: "unavailable",
  ready: false,
  async save(lead) {
    console.info(
      "[lead] intento sin destino configurado",
      JSON.stringify({ source: lead.source, locale: lead.locale }),
    );
    return { ok: false, reason: "unavailable" };
  },
};

/**
 * Supabase a través de su API REST, sin cliente oficial.
 *
 * Traer `@supabase/supabase-js` entero para una sola inserción añadiría una
 * dependencia considerable a cambio de nada → CLAUDE.md regla 2.
 *
 * Dos detalles que costaron un fallo en producción y conviene no deshacer:
 *
 * - **`on_conflict=email`.** Sin esto PostgREST resuelve el conflicto contra
 *   la clave primaria, que es el `id` generado, y como nunca choca, la
 *   segunda alta del mismo correo revienta contra la restricción única.
 * - **`ignore-duplicates`, no `merge-duplicates`.** Si alguien se apunta dos
 *   veces, la fila existente se deja intacta. Lo importante es `consent_at`:
 *   es la prueba de **cuándo consintió por primera vez**, y sobrescribirla
 *   con la fecha de hoy borraría justo el dato que habría que enseñar si
 *   alguien reclama.
 *
 * Usa la **clave de servicio**, que salta las políticas de fila. Por eso esta
 * ruta es de servidor y la clave no lleva prefijo `NEXT_PUBLIC_`: con ella en
 * el navegador, cualquiera podría leer la lista entera.
 */
function supabaseStore(url: string, key: string): LeadStore {
  return {
    name: "supabase",
    ready: true,
    async save(lead) {
      try {
        const response = await fetch(
          `${url}/rest/v1/waitlist?on_conflict=email`,
          {
            method: "POST",
            headers: {
              apikey: key,
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
              Prefer: "resolution=ignore-duplicates,return=representation",
            },
            body: JSON.stringify({
              email: lead.email,
              locale: lead.locale,
              source: lead.source,
              consent_at: lead.consentAt,
            }),
          },
        );

        if (!response.ok) {
          // Nunca se devuelve el cuerpo de Supabase al cliente → regla 5.
          console.error("[lead] supabase", response.status);
          return { ok: false, reason: "error" };
        }

        // Con `ignore-duplicates`, una fila ya existente no se devuelve.
        // Un array vacío significa «ya estaba en la lista».
        const rows = (await response.json()) as unknown[];
        return { ok: true, alreadyOnList: rows.length === 0 };
      } catch {
        return { ok: false, reason: "error" };
      }
    },
  };
}

export function getLeadStore(): LeadStore {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return url && key ? supabaseStore(url, key) : unavailableStore;
}
