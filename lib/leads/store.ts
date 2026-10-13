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
 * Una sola petición `POST` con `Prefer: resolution=merge-duplicates` hace el
 * upsert contra la clave única del correo. Traer `@supabase/supabase-js`
 * entero para esto añadiría una dependencia considerable a cambio de nada
 * → CLAUDE.md regla 2.
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
        const response = await fetch(`${url}/rest/v1/waitlist`, {
          method: "POST",
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
            Prefer: "resolution=merge-duplicates,return=representation",
          },
          body: JSON.stringify({
            email: lead.email,
            locale: lead.locale,
            source: lead.source,
            consent_at: lead.consentAt,
          }),
        });

        if (!response.ok) {
          // Nunca se devuelve el cuerpo de Supabase al cliente → regla 5.
          console.error("[lead] supabase", response.status);
          return { ok: false, reason: "error" };
        }

        const rows = (await response.json()) as Array<{ consent_at?: string }>;
        // Si la fecha de consentimiento que vuelve no es la que acabamos de
        // mandar, la fila ya existía: la persona ya estaba en la lista.
        const alreadyOnList =
          rows.length > 0 && rows[0]?.consent_at !== lead.consentAt;

        return { ok: true, alreadyOnList };
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
