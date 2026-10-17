/**
 * Abrir el checkout de Paddle desde el navegador.
 *
 * Paddle.js se carga **solo cuando alguien va a pagar**, no en cada visita.
 * Es un script de un tercero en todas las páginas a cambio de una acción que
 * hace una minoría: cargarlo siempre pagaría el coste de rendimiento del
 * 100% del tráfico para el 1% que compra.
 *
 * El precio en euros, libras o dólares no lo decide esta función: lo decide
 * Paddle por el país de quien paga, con las tres tarifas que ya están
 * configuradas en cada precio → D-030 y D-031.
 */

const SCRIPT_URL = "https://cdn.paddle.com/paddle/v2/paddle.js";

interface PaddleGlobal {
  Environment: { set(name: string): void };
  Initialize(options: { token: string }): void;
  Checkout: {
    open(options: {
      items: Array<{ priceId: string; quantity: number }>;
      customData?: Record<string, string>;
      settings?: Record<string, unknown>;
    }): void;
  };
}

declare global {
  interface Window {
    Paddle?: PaddleGlobal;
  }
}

export type CheckoutResult = "opened" | "anonymous" | "unconfigured" | "error";

interface Config {
  status: string;
  token?: string;
  environment?: string;
  userId?: string;
}

let loaded: Promise<PaddleGlobal | null> | null = null;

function loadScript(): Promise<PaddleGlobal | null> {
  // Una sola carga por pestaña aunque se abra el checkout varias veces.
  loaded ??= new Promise<PaddleGlobal | null>((resolve) => {
    if (window.Paddle) {
      resolve(window.Paddle);
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(window.Paddle ?? null);
    script.onerror = () => {
      // Se olvida el fallo para que un segundo intento vuelva a probar: lo
      // normal es que fuera la red, no el script.
      loaded = null;
      resolve(null);
    };
    document.head.appendChild(script);
  });
  return loaded;
}

export async function openCheckout(
  priceId: string,
  locale: string,
): Promise<CheckoutResult> {
  let config: Config;
  try {
    const response = await fetch("/api/billing/config");
    if (response.status === 401) return "anonymous";
    config = await response.json();
  } catch {
    return "error";
  }

  if (config.status !== "ok" || !config.token || !config.userId) {
    return "unconfigured";
  }

  const paddle = await loadScript();
  if (!paddle) return "error";

  try {
    paddle.Environment.set(config.environment ?? "sandbox");
    paddle.Initialize({ token: config.token });
    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      // Viaja con el pago y vuelve en el aviso. Es lo que permite saber a
      // quién acreditar sin preguntarle el correo a nadie.
      customData: { user_id: config.userId },
      settings: { displayMode: "overlay", locale },
    });
    return "opened";
  } catch {
    return "error";
  }
}
