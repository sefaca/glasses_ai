import type { Subject, UsageCounts } from "./quota";

/**
 * Contador en memoria, **solo para desarrollo**.
 *
 * Existe para poder ver el embudo entero en local sin montar Supabase ni
 * pegar la clave de servicio en un fichero. Sin él, en local no hay cupo, la
 * generación nunca se agota y **la pantalla de registro no llega a salir
 * nunca** — que es justo la parte del producto que más falta hace revisar.
 *
 * **Nunca en el despliegue real.** En serverless cada instancia tendría su
 * propio contador, así que esto no limitaría nada: es exactamente el fallo
 * que D-032 vino a arreglar. El guardia no es decorativo, es lo que impide
 * que esto se convierta en una factura.
 *
 * Se mira `VERCEL` y no `NODE_ENV` porque la pregunta correcta es «¿estoy en
 * el despliegue?», no «¿es una compilación optimizada?». `next start` en
 * local corre en modo producción y es exactamente el caso que hay que poder
 * probar: sin esto, en local no había cupo y la pantalla de registro no
 * salía nunca.
 */

const counts = new Map<string, number>();
let today: { day: string; total: number } = { day: "", total: 0 };

function key(subject: Subject): string {
  return `${subject.type}:${subject.id}`;
}

function currentDay(): string {
  return new Date().toISOString().slice(0, 10);
}

export function memoryUsageAvailable(): boolean {
  return !process.env.VERCEL;
}

export function readMemoryCounts(subject: Subject): UsageCounts {
  const day = currentDay();
  if (today.day !== day) today = { day, total: 0 };

  // En local no se compra nada: el checkout va contra el sandbox de Paddle
  // y los créditos solo existen con Supabase detrás.
  return {
    subject: counts.get(key(subject)) ?? 0,
    today: today.total,
    purchased: 0,
  };
}

export function recordMemoryGeneration(subject: Subject): void {
  const day = currentDay();
  if (today.day !== day) today = { day, total: 0 };

  counts.set(key(subject), (counts.get(key(subject)) ?? 0) + 1);
  today = { day, total: today.total + 1 };
}

/** Para poder repetir una prueba sin reiniciar el servidor. */
export function resetMemoryUsage(): void {
  counts.clear();
  today = { day: "", total: 0 };
}
