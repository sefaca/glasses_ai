import type { Subject, UsageCounts } from "./quota";

/**
 * Los contadores, contra Supabase.
 *
 * **Falla cerrado, y es deliberado.** Si no se puede consultar el contador,
 * se deniega la generación. La alternativa —seguir adelante y ya veremos— es
 * exactamente el fallo que vacía una cuenta de OpenAI: basta con que la base
 * esté caída para que el tope desaparezca.
 *
 * Denegar deja a alguien sin probar un rato. Permitir deja la factura abierta.
 * No es simétrico.
 */

export type CountsResult =
  | { ok: true; counts: UsageCounts }
  | { ok: false };

function config(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return url && key ? { url, key } : null;
}

export function usageIsConfigured(): boolean {
  return config() !== null;
}

function headers(key: string, extra: Record<string, string> = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

/**
 * Cuenta sin traerse las filas.
 *
 * `Prefer: count=exact` con `head` hace que PostgREST devuelva el total en la
 * cabecera `content-range` y **ningún cuerpo**. Importa: traerse las filas
 * para contarlas crecería con el uso justo cuando más tráfico hubiera.
 */
async function countRows(
  url: string,
  key: string,
  query: string,
): Promise<number | null> {
  try {
    const response = await fetch(`${url}/rest/v1/generations?${query}`, {
      method: "HEAD",
      headers: headers(key, { Prefer: "count=exact" }),
    });
    if (!response.ok) return null;

    // content-range llega como «0-24/25», o «*/0» cuando no hay nada.
    const total = response.headers.get("content-range")?.split("/")[1];
    const parsed = Number(total);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function readCounts(subject: Subject): Promise<CountsResult> {
  const conf = config();
  if (!conf) return { ok: false };

  // Medianoche UTC. No se usa la hora local a propósito: el servidor puede
  // estar en otra zona y el tope diario tiene que ser el mismo para todos.
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);

  const [subjectCount, todayCount] = await Promise.all([
    countRows(
      conf.url,
      conf.key,
      `select=id&subject_type=eq.${encodeURIComponent(subject.type)}&subject_id=eq.${encodeURIComponent(subject.id)}`,
    ),
    countRows(
      conf.url,
      conf.key,
      `select=id&created_at=gte.${encodeURIComponent(since.toISOString())}`,
    ),
  ]);

  if (subjectCount === null || todayCount === null) return { ok: false };
  return { ok: true, counts: { subject: subjectCount, today: todayCount } };
}

/**
 * Anota una generación consumida.
 *
 * Se llama **solo cuando el proveedor devolvió algo cobrable**: una
 * generación fallida no gasta cupo → CLAUDE.md regla 11.
 */
export async function recordGeneration(input: {
  subject: Subject;
  frameId: string;
  provider: string;
  costCents: number;
}): Promise<void> {
  const conf = config();
  if (!conf) return;

  try {
    await fetch(`${conf.url}/rest/v1/generations`, {
      method: "POST",
      headers: headers(conf.key, { Prefer: "return=minimal" }),
      body: JSON.stringify({
        subject_type: input.subject.type,
        subject_id: input.subject.id,
        frame_id: input.frameId,
        provider: input.provider,
        cost_cents: input.costCents,
      }),
    });
  } catch {
    // Si no se pudo anotar, la generación ya se hizo y se entregó. Dejarla
    // sin contar regala una, que es mejor que negársela a quien ya pagó el
    // tiempo de espera. Se registra para poder verlo.
    console.error("[usage] no se pudo anotar la generacion");
  }
}
