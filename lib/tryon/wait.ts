import { isTerminal, type TryOnProvider, type TryOnResult } from "./provider";

/**
 * Espera a que un job llegue a estado terminal.
 *
 * Existe porque los dos tipos de proveedor se comportan distinto y la ruta no
 * tiene por qué saber cuál tiene detrás: el generativo resuelve dentro de
 * `createTryOn`, y uno con cola devuelve `queued` y hay que preguntarle. Sin
 * esto, la ruta funcionaba con uno y fallaba con el otro — que es exactamente
 * la fuga de abstracción que el adaptador debe evitar.
 *
 * El sondeo espacia los intentos para no castigar a un proveedor lento, y
 * corta por tiempo en vez de girar indefinidamente.
 */

export interface WaitOptions {
  timeoutMs?: number;
  /** Espera inicial entre sondeos, que va creciendo. */
  initialDelayMs?: number;
  maxDelayMs?: number;
  now?: () => number;
  sleep?: (ms: number) => Promise<void>;
}

const defaultSleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function waitForResult(
  provider: TryOnProvider,
  jobId: string,
  options: WaitOptions = {},
): Promise<TryOnResult> {
  const {
    timeoutMs = 55_000,
    initialDelayMs = 400,
    maxDelayMs = 2_500,
    now = () => Date.now(),
    sleep = defaultSleep,
  } = options;

  const deadline = now() + timeoutMs;
  let delay = initialDelayMs;
  let last = await provider.getJob(jobId);

  while (!isTerminal(last.status)) {
    if (now() >= deadline) {
      return {
        ...last,
        status: "failed",
        errorCode: "provider_timeout",
        // Regla 11: lo que no llega a completarse no se factura.
        billable: false,
        completedAt: new Date(now()).toISOString(),
      };
    }
    await sleep(delay);
    delay = Math.min(delay * 1.6, maxDelayMs);
    last = await provider.getJob(jobId);
  }

  return last;
}
