"use client";

import { useState } from "react";
import { track } from "@/lib/analytics/client";
import type { Dictionary, Locale } from "@/lib/i18n";
import { joinWaitlist, type LeadResult } from "@/lib/leads/client";
import { saveAccessCode } from "@/lib/tryon/client";

/**
 * Petición del código de la alfa privada, **y captación**.
 *
 * Aparece solo cuando el servidor rechaza una generación por falta de
 * código, nunca antes: quien llega con el código guardado no ve esto jamás,
 * y en local (sin `ACCESS_CODE`) no existe.
 *
 * Este es el momento de más intención de todo el producto. Quien está aquí
 * ha subido su foto, ha visto sus seis recomendaciones y ha pulsado para
 * generar. Hasta ahora se encontraba un callejón sin salida; ahora puede
 * dejar su correo para que le avisemos.
 *
 * Dos cosas que no se negocian:
 *
 * - **La lista de espera no bloquea nada.** CLAUDE.md §0 prohíbe poner la
 *   primera experiencia detrás de un registro, y lo que hay detrás de esta
 *   pared es la generación, no el producto: el análisis y las
 *   recomendaciones ya se han visto gratis y sin dar nada.
 * - **La promesa va antes de enviar, no después.** Quien deja su correo lee
 *   exactamente qué recibirá mientras decide, no en un correo de
 *   confirmación cuando ya lo ha dado.
 */

type Panel = "code" | "waitlist" | "done";

interface Props {
  /** `true` si ya se intentó un código y el servidor lo rechazó. */
  retry: boolean;
  dict: Dictionary;
  lang: Locale;
  onSubmit: () => void;
  onCancel: () => void;
}

export function AccessGate({ retry, dict, lang, onSubmit, onCancel }: Props) {
  const [panel, setPanel] = useState<Panel>("code");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<LeadResult | null>(null);

  const texts = dict.tryOn.access;
  const list = dict.waitlist;

  function submitCode(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    saveAccessCode(trimmed);
    onSubmit();
  }

  async function submitEmail(event: React.FormEvent) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setFailure(null);

    const result = await joinWaitlist(email, lang, "access_gate");
    setSending(false);

    if (result === "ok") {
      // Sin el correo: el evento dice que alguien se apuntó, no quién.
      track("click_try_free", { step: "waitlist_joined", locale: lang });
      setPanel("done");
      return;
    }
    setFailure(result);
  }

  const errorText =
    failure === "invalid_email"
      ? list.errors.invalidEmail
      : failure === "rate_limited"
        ? list.errors.rateLimited
        : failure === "unavailable"
          ? list.errors.unavailable
          : failure
            ? list.errors.generic
            : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-5 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-xl">
        {panel === "code" && (
          <form onSubmit={submitCode}>
            <h2 className="font-display text-xl tracking-tight">
              {texts.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {retry ? texts.wrong : texts.body}
            </p>

            <label htmlFor="access-code" className="sr-only">
              {texts.placeholder}
            </label>
            <input
              id="access-code"
              name="access-code"
              type="text"
              autoComplete="off"
              autoFocus
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder={texts.placeholder}
              className="mt-5 w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none focus-visible:border-accent"
            />

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="text-sm text-muted hover:text-ink"
              >
                {texts.cancel}
              </button>
              <button
                type="submit"
                disabled={code.trim().length === 0}
                className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent transition-transform active:translate-y-px disabled:opacity-40"
              >
                {texts.submit}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                track("click_try_free", {
                  step: "waitlist_opened",
                  locale: lang,
                });
                setPanel("waitlist");
              }}
              className="mt-5 w-full border-t border-line pt-4 text-xs text-muted underline decoration-line underline-offset-4 hover:text-ink"
            >
              {list.prompt}
            </button>
          </form>
        )}

        {panel === "waitlist" && (
          <form onSubmit={submitEmail}>
            <h2 className="font-display text-xl tracking-tight">
              {list.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {list.body}
            </p>

            <label htmlFor="waitlist-email" className="sr-only">
              {list.emailLabel}
            </label>
            <input
              id="waitlist-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoFocus
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={list.emailPlaceholder}
              className="mt-5 w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none focus-visible:border-accent"
            />

            {/* La promesa, visible mientras decide. */}
            <p className="mt-3 text-[0.7rem] leading-relaxed text-muted">
              {list.promise}
            </p>

            {errorText && (
              <p className="mt-3 text-xs text-ink" role="alert">
                {errorText}
              </p>
            )}

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setPanel("code")}
                className="text-sm text-muted hover:text-ink"
              >
                {dict.common.back}
              </button>
              <button
                type="submit"
                disabled={sending || email.trim().length === 0}
                className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent transition-transform active:translate-y-px disabled:opacity-40"
              >
                {list.submit}
              </button>
            </div>
          </form>
        )}

        {panel === "done" && (
          <div>
            <h2 className="font-display text-xl tracking-tight">
              {list.successTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {list.successBody}
            </p>
            <button
              type="button"
              onClick={onCancel}
              className="mt-5 w-full rounded-full border border-ink px-6 py-3 text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
            >
              {dict.common.back}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
