/**
 * Límite de uso para los endpoints caros — CLAUDE.md §15.
 *
 * **Limitación conocida y deliberada:** esto vive en memoria del proceso, así
 * que no sobrevive a un reinicio ni se comparte entre instancias. En un
 * despliegue serverless cada instancia lleva su propia cuenta, lo que lo
 * convierte en un freno al abuso accidental, **no en una defensa**. Cuando
 * exista Supabase, el contador se mueve allí.
 *
 * Se construye igualmente porque cada generación cuesta dinero real y un bucle
 * de reintentos puede vaciar una cuenta en minutos.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitConfig {
  /** Peticiones permitidas por ventana. */
  limit: number;
  /** Duración de la ventana en milisegundos. */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Segundos hasta que se libera, para la cabecera `Retry-After`. */
  retryAfterSeconds: number;
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
  now: number = Date.now(),
): RateLimitResult {
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + config.windowMs });
    return {
      allowed: true,
      remaining: config.limit - 1,
      retryAfterSeconds: 0,
    };
  }

  if (bucket.count >= config.limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return {
    allowed: true,
    remaining: config.limit - bucket.count,
    retryAfterSeconds: 0,
  };
}

/** Limpia las ventanas caducadas. Sin esto el Map crece sin fin. */
export function pruneRateLimits(now: number = Date.now()): void {
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) buckets.delete(key);
  }
}

/** Para los tests: deja el estado limpio entre casos. */
export function resetRateLimits(): void {
  buckets.clear();
}
