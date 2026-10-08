import type { TryOnAssetOwnership } from "../catalog/rights";

/**
 * Abstracción de proveedor de try-on → CLAUDE.md §10.1 y D-011.
 *
 * No es una buena práctica decorativa: es el mecanismo por el que se ejecuta
 * una migración ya prevista. Las dos clases de tecnología se cruzan en coste
 * alrededor de los ~1.800 usuarios activos/mes (ver `providers.md §4`), así
 * que cambiar de proveedor es un cuándo, no un si.
 *
 * `assetOwnership` es el campo que importa de verdad: declara de dónde sale
 * lo que se pinta sobre la cara, y de él depende si una montura se puede
 * probar siquiera → `canTryOn()` en `lib/catalog/rights.ts`, D-015 y D-016.
 */

export type TryOnStatus = "queued" | "processing" | "completed" | "failed";

export interface TryOnInput {
  /** Imagen del usuario. URL firmada de corta duración, nunca pública. */
  userImageUrl: string;
  frameId: string;
  /**
   * Imagen de producto. Solo se envía a proveedores de Clase B y solo cuando
   * la montura tiene derechos de derivación. En Clase A no hace falta: el
   * activo 3D es del proveedor.
   */
  frameImageUrl?: string;
}

export interface TryOnJob {
  id: string;
  provider: string;
  providerJobId: string | null;
  status: TryOnStatus;
  frameId: string;
  /** Coste estimado en céntimos. Para observabilidad → CLAUDE.md §29.6. */
  costEstimateCents: number;
  createdAt: string;
}

export interface TryOnResult extends TryOnJob {
  /** Ruta del resultado en storage privado. `null` salvo `completed`. */
  resultPath: string | null;
  /** Código estable, nunca el error crudo del proveedor → regla 5. */
  errorCode: TryOnErrorCode | null;
  completedAt: string | null;
  /**
   * Si un job falla, no se cobra crédito → regla 11. Lo marca el proveedor
   * para que la capa de créditos no tenga que interpretar el error.
   */
  billable: boolean;
}

export type TryOnErrorCode =
  | "provider_unavailable"
  | "provider_timeout"
  | "invalid_input"
  | "no_face_detected"
  | "content_rejected"
  | "rate_limited"
  | "unknown";

export interface TryOnProvider {
  readonly name: string;
  /** De dónde sale el activo que se pinta. Decide los derechos exigibles. */
  readonly assetOwnership: TryOnAssetOwnership;
  /** Coste de lista por generación, en céntimos. 0 en suscripción y en mock. */
  readonly costPerTryOnCents: number;
  /** ¿Acepta foto subida? Si no, el producto cambia → D-012. */
  readonly supportsPhotoInput: boolean;
  readonly supportsLiveCamera: boolean;

  createTryOn(input: TryOnInput): Promise<TryOnJob>;
  getJob(jobId: string): Promise<TryOnResult>;
}

/** Estados en los que ya no tiene sentido seguir haciendo polling. */
export function isTerminal(status: TryOnStatus): boolean {
  return status === "completed" || status === "failed";
}
