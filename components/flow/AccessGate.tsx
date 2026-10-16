"use client";

import { useState } from "react";
import { track } from "@/lib/analytics/client";
import { requestCode, verifyCode } from "@/lib/auth/client";
import type { Dictionary, Locale } from "@/lib/i18n";
import { format } from "@/lib/i18n";
import { joinWaitlist, type LeadResult } from "@/lib/leads/client";
import { saveAccessCode } from "@/lib/tryon/client";

/**
 * La puerta: **registro**, con dos salidas laterales.
 *
 * Aparece solo cuando el servidor rechaza una generación, nunca antes. Es el
 * momento de más intención del producto: quien llega ha subido su foto, ha
 * visto sus seis recomendaciones y ha pulsado para generar.
 *
 * **No bloquea la primera experiencia** → CLAUDE.md §0. Lo que hay detrás es
 * la generación, que cuesta dinero real; el análisis y las recomendaciones ya
 * se han visto gratis y sin dar nada. El propio texto lo dice, porque
 * explicar por qué se pide algo convierte mejor que pedirlo a secas.
 *
 * Las dos salidas laterales no son adorno:
 *
 * - **Lista de espera**, para quien no quiere cuenta.
 * - **Código compartido**, que sigue existiendo porque si el envío de correos
 *   falla —y el plan gratuito de Supabase limita bastante— sin él nadie
 *   podría entrar, ni siquiera nosotros.
 */

type Panel = "email" | "code" | "waitlist" | "joined" | "shared";

interface Props {
  /**
   * Por qué aparece. Cambia el titular, y eso cambia la conversión: no es lo
   * mismo pedirle una cuenta a alguien que no ha visto nada que a alguien que
   * acaba de ver su cara con unas gafas puestas.
   */
  reason: "no_code" | "free_used";
  retry: boolean;
  dict: Dictionary;
  lang: Locale;
  /** Se llama al entrar: la generación se reintenta sola. */
  onSubmit: () => void;
  onCancel: () => void;
}

export function AccessGate({
  reason,
  retry,
  dict,
  lang,
  onSubmit,
  onCancel,
}: Props) {
  const [panel, setPanel] = useState<Panel>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [shared, setShared] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = dict.auth;
  const afterFree = reason === "free_used";
  const list = dict.waitlist;
  const access = dict.tryOn.access;

  function fail(message: string) {
    setError(message);
    setBusy(false);
  }

  async function sendCode(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    const result = await requestCode(email);
    setBusy(false);

    if (result === "sent") {
      track("click_try_free", { step: "auth_code_sent", locale: lang });
      setPanel("code");
      setError(null);
      return;
    }
    fail(
      result === "invalid_email"
        ? auth.errors.invalidEmail
        : result === "rate_limited"
          ? auth.errors.rateLimited
          : result === "unavailable"
            ? auth.errors.unavailable
            : auth.errors.generic,
    );
  }

  async function submitCode(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    const result = await verifyCode(email, code);
    setBusy(false);

    if (result === "ok") {
      track("click_try_free", { step: "auth_completed", locale: lang });
      // La generación se reintenta sola: la persona pulsó generar hace un
      // minuto y no debería tener que volver a buscarlo.
      onSubmit();
      return;
    }
    fail(
      result === "invalid_code"
        ? auth.errors.invalidCode
        : result === "rate_limited"
          ? auth.errors.rateLimited
          : result === "unavailable"
            ? auth.errors.unavailable
            : auth.errors.generic,
    );
  }

  async function join(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    const result: LeadResult = await joinWaitlist(email, lang, "access_gate");
    setBusy(false);

    if (result === "ok") {
      track("click_try_free", { step: "waitlist_joined", locale: lang });
      setPanel("joined");
      return;
    }
    fail(
      result === "invalid_email"
        ? list.errors.invalidEmail
        : result === "rate_limited"
          ? list.errors.rateLimited
          : result === "unavailable"
            ? list.errors.unavailable
            : list.errors.generic,
    );
  }

  function useSharedCode(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = shared.trim();
    if (!trimmed) return;
    saveAccessCode(trimmed);
    onSubmit();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-5 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-xl">
        {/* ---------- Registro: el correo ---------- */}
        {panel === "email" && (
          <form onSubmit={sendCode}>
            <h2 className="font-display text-xl tracking-tight">
              {afterFree ? auth.titleAfterFree : auth.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {afterFree ? auth.bodyAfterFree : auth.body}
            </p>

            <label htmlFor="auth-email" className="sr-only">
              {auth.emailLabel}
            </label>
            <input
              id="auth-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoFocus
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={auth.emailPlaceholder}
              className="mt-5 w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none focus-visible:border-accent"
            />

            <p className="mt-3 text-[0.7rem] leading-relaxed text-muted">
              {auth.promise}
            </p>

            {error && (
              <p className="mt-3 text-xs text-ink" role="alert">
                {error}
              </p>
            )}

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="text-sm text-muted hover:text-ink"
              >
                {access.cancel}
              </button>
              <button
                type="submit"
                disabled={busy || email.trim().length === 0}
                className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent transition-transform active:translate-y-px disabled:opacity-40"
              >
                {auth.sendCode}
              </button>
            </div>

            <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-line pt-4 text-[0.7rem] text-muted">
              <button
                type="button"
                onClick={() => {
                  track("click_try_free", {
                    step: "waitlist_opened",
                    locale: lang,
                  });
                  setError(null);
                  setPanel("waitlist");
                }}
                className="underline decoration-line underline-offset-4 hover:text-ink"
              >
                {list.prompt}
              </button>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setPanel("shared");
                }}
                className="underline decoration-line underline-offset-4 hover:text-ink"
              >
                {access.title}
              </button>
            </div>
          </form>
        )}

        {/* ---------- Registro: el código ---------- */}
        {panel === "code" && (
          <form onSubmit={submitCode}>
            <h2 className="font-display text-xl tracking-tight">
              {auth.codeTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {format(auth.codeBody, { email })}
            </p>

            <label htmlFor="auth-code" className="sr-only">
              {auth.codeLabel}
            </label>
            <input
              id="auth-code"
              name="one-time-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              autoFocus
              required
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, ""))
              }
              placeholder={auth.codePlaceholder}
              className="mt-5 w-full rounded-xl border border-line bg-paper px-4 py-3 text-center font-display text-2xl tracking-[0.4em] outline-none focus-visible:border-accent"
            />

            {error && (
              <p className="mt-3 text-xs text-ink" role="alert">
                {error}
              </p>
            )}

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setCode("");
                  setError(null);
                  setPanel("email");
                }}
                className="text-sm text-muted hover:text-ink"
              >
                {auth.useAnotherEmail}
              </button>
              <button
                type="submit"
                disabled={busy || code.length !== 6}
                className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent transition-transform active:translate-y-px disabled:opacity-40"
              >
                {auth.verify}
              </button>
            </div>

            <button
              type="button"
              onClick={sendCode}
              disabled={busy}
              className="mt-5 w-full border-t border-line pt-4 text-[0.7rem] text-muted underline decoration-line underline-offset-4 hover:text-ink"
            >
              {auth.resend}
            </button>
          </form>
        )}

        {/* ---------- Lista de espera ---------- */}
        {panel === "waitlist" && (
          <form onSubmit={join}>
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

            <p className="mt-3 text-[0.7rem] leading-relaxed text-muted">
              {list.promise}
            </p>

            {error && (
              <p className="mt-3 text-xs text-ink" role="alert">
                {error}
              </p>
            )}

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setPanel("email");
                }}
                className="text-sm text-muted hover:text-ink"
              >
                {dict.common.back}
              </button>
              <button
                type="submit"
                disabled={busy || email.trim().length === 0}
                className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent transition-transform active:translate-y-px disabled:opacity-40"
              >
                {list.submit}
              </button>
            </div>
          </form>
        )}

        {panel === "joined" && (
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

        {/* ---------- Código compartido ---------- */}
        {panel === "shared" && (
          <form onSubmit={useSharedCode}>
            <h2 className="font-display text-xl tracking-tight">
              {access.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {retry ? access.wrong : access.body}
            </p>

            <label htmlFor="shared-code" className="sr-only">
              {access.placeholder}
            </label>
            <input
              id="shared-code"
              name="shared-code"
              type="text"
              autoComplete="off"
              autoFocus
              value={shared}
              onChange={(event) => setShared(event.target.value)}
              placeholder={access.placeholder}
              className="mt-5 w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none focus-visible:border-accent"
            />

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setPanel("email")}
                className="text-sm text-muted hover:text-ink"
              >
                {dict.common.back}
              </button>
              <button
                type="submit"
                disabled={shared.trim().length === 0}
                className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent transition-transform active:translate-y-px disabled:opacity-40"
              >
                {access.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
