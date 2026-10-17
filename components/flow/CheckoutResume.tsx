"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { openTransaction } from "@/lib/billing/checkout";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";

/**
 * Retomar un pago que se quedó a medias.
 *
 * Aquí aterriza quien pulsa el enlace del correo de recuperación de Paddle,
 * que llega con `?_ptxn=<transacción>`. La página abre ese checkout tal cual
 * estaba, con su importe y su divisa ya fijados.
 *
 * **El parámetro se lee del navegador, no del servidor.** Leerlo en el
 * componente servidor volvería dinámica una página que, por lo demás, es
 * estática en los cinco idiomas. Y no hay nada que decidir en el servidor:
 * el identificador va directo a Paddle.
 */

type State = "idle" | "opening" | "missing" | "unavailable" | "error";

export function CheckoutResume({
  dict,
  lang,
}: {
  dict: Dictionary;
  lang: Locale;
}) {
  const copy = dict.checkout;
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    const txn = new URLSearchParams(window.location.search).get("_ptxn");
    if (!txn) {
      // Alguien llegó aquí sin venir del correo. No es un error: se le manda
      // de vuelta al producto en lugar de enseñarle un fallo.
      setState("missing");
      return;
    }

    setState("opening");
    let cancelled = false;
    openTransaction(txn, lang).then((result) => {
      if (cancelled) return;
      if (result === "opened") return;
      setState(result === "unconfigured" ? "unavailable" : "error");
    });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16 text-center">
      <h1 className="font-display text-3xl tracking-tight">{copy.title}</h1>

      <p className="mt-3 text-sm leading-relaxed text-muted" role="status">
        {state === "opening"
          ? copy.opening
          : state === "missing"
            ? copy.missing
            : state === "unavailable"
              ? copy.unavailable
              : state === "error"
                ? copy.error
                : copy.body}
      </p>

      <Link
        href={localePath(lang, "/probar")}
        className="mt-8 self-center rounded-full border border-ink px-6 py-3 text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
      >
        {copy.back}
      </Link>
    </main>
  );
}
