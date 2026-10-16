import {
  isTerminal,
  type TryOnInput,
  type TryOnJob,
  type TryOnProvider,
  type TryOnResult,
} from "./provider";

/**
 * Proveedor de desarrollo. **No llama a nada y no produce una imagen real.**
 *
 * Existe porque el muro de gates de D-017 deja deliberadamente sin construir
 * la integración con un proveedor real: D-016 está sin ratificar y GC-1…GC-4
 * sin responder. Lo que sí se puede construir y probar ya es todo lo que rodea
 * al try-on — estados, polling, reintentos, contabilidad de coste, UI de
 * carga, fallos — y eso necesita un proveedor que se comporte como tal.
 *
 * Simula latencia y una tasa de fallo configurable, porque la mitad del
 * trabajo de esta parte del producto es manejar bien el camino triste
 * → CLAUDE.md §8.7 y reglas 9, 10 y 11.
 */

export interface MockProviderOptions {
  /** Milisegundos hasta `completed`. */
  latencyMs?: number;
  /** Probabilidad 0..1 de acabar en `failed`. */
  failureRate?: number;
  /** Inyectable para que los tests sean deterministas. */
  now?: () => number;
  random?: () => number;
}

export class MockTryOnProvider implements TryOnProvider {
  readonly name = "mock";
  readonly assetOwnership = "mock" as const;
  readonly costPerTryOnCents = 0;
  readonly supportsPhotoInput = true;
  readonly supportsLiveCamera = false;

  private readonly jobs = new Map<string, TryOnResult>();
  private readonly latencyMs: number;
  private readonly failureRate: number;
  private readonly now: () => number;
  private readonly random: () => number;
  private counter = 0;

  constructor(options: MockProviderOptions = {}) {
    this.latencyMs = options.latencyMs ?? 2500;
    this.failureRate = options.failureRate ?? 0;
    this.now = options.now ?? (() => Date.now());
    this.random = options.random ?? (() => Math.random());
  }

  async createTryOn(input: TryOnInput): Promise<TryOnJob> {
    // La foto puede llegar como URL firmada o en línea, según el proveedor.
    const hasImage = Boolean(input.userImageUrl || input.userImage);
    if (!hasImage || !input.frameId) {
      const job = this.record({
        input,
        status: "failed",
        errorCode: "invalid_input",
        // Un input inválido es culpa nuestra, no del usuario: no se cobra.
        billable: false,
      });
      return job;
    }
    return this.record({ input, status: "queued", errorCode: null, billable: true });
  }

  async getJob(jobId: string): Promise<TryOnResult> {
    const job = this.jobs.get(jobId);
    if (!job) throw new Error(`mock: job desconocido ${jobId}`);
    if (isTerminal(job.status)) return { ...job };

    const elapsed = this.now() - Date.parse(job.createdAt);
    if (elapsed < this.latencyMs) {
      const advanced: TryOnResult = { ...job, status: "processing" };
      this.jobs.set(jobId, advanced);
      return { ...advanced };
    }

    const failed = this.random() < this.failureRate;
    const settled: TryOnResult = failed
      ? {
          ...job,
          status: "failed",
          errorCode: "provider_unavailable",
          completedAt: new Date(this.now()).toISOString(),
          // Regla 11: una generación fallida nunca consume crédito.
          billable: false,
        }
      : {
          ...job,
          status: "completed",
          resultUrl: mockImage(job.frameId, job.id),
          errorCode: null,
          completedAt: new Date(this.now()).toISOString(),
        };

    this.jobs.set(jobId, settled);
    return { ...settled };
  }

  private record(args: {
    input: TryOnInput;
    status: TryOnJob["status"];
    errorCode: TryOnResult["errorCode"];
    billable: boolean;
  }): TryOnResult {
    const id = `mock-${++this.counter}`;
    const job: TryOnResult = {
      id,
      provider: this.name,
      providerJobId: id,
      status: args.status,
      frameId: args.input.frameId,
      costEstimateCents: this.costPerTryOnCents,
      createdAt: new Date(this.now()).toISOString(),
      resultUrl: null,
      errorCode: args.errorCode,
      completedAt: args.status === "failed" ? new Date(this.now()).toISOString() : null,
      billable: args.billable,
    };
    this.jobs.set(id, job);
    return job;
  }
}

/**
 * Una imagen que **se ve de verdad**.
 *
 * Antes devolvía una ruta inventada —`mock/<montura>/<id>.svg`— que no existe
 * en ningún sitio, así que la pantalla de resultados mostraba el icono de
 * imagen rota. Nadie lo notó durante semanas porque las pruebas automáticas
 * miran el código de respuesta y el `resultUrl`, no si el navegador puede
 * pintarlo.
 *
 * Ahora es un `data:` con un SVG, así que no depende de que exista ningún
 * fichero ni de ninguna red. Lleva el identificador de la montura escrito
 * encima, que es lo que hace útil al proveedor de prueba: ver de un vistazo
 * que cada tarjeta recibió **su** generación y no la de al lado.
 */
function mockImage(frameId: string, jobId: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
  <rect width="300" height="400" fill="#e3ded5"/>
  <g fill="none" stroke="#7e4420" stroke-width="7" stroke-linecap="round">
    <circle cx="112" cy="170" r="42"/>
    <circle cx="208" cy="170" r="42"/>
    <path d="M154 163c6-5 12-5 18 0"/>
    <path d="M70 158c-6-4-10-10-10-17"/>
    <path d="M250 158c6-4 10-10 10-17"/>
  </g>
  <text x="150" y="268" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#1c1a17">simulación de prueba</text>
  <text x="150" y="292" text-anchor="middle" font-family="monospace" font-size="12" fill="#6b6258">${frameId}</text>
  <text x="150" y="312" text-anchor="middle" font-family="monospace" font-size="11" fill="#6b6258">${jobId}</text>
</svg>`;

  // `encodeURIComponent` y no base64: el SVG queda legible en las
  // herramientas de desarrollo, que es justo lo que se quiere de un mock.
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
