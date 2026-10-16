"use client";

import { useState } from "react";
import { track } from "@/lib/analytics/client";
import { signIn } from "@/lib/auth/client";
import type { Dictionary, Locale } from "@/lib/i18n";
import { joinWaitlist, type LeadResult } from "@/lib/leads/client";
import { saveAccessCode } from "@/lib/tryon/client";

/**
 * La puerta: **registro**, con dos salidas laterales.
 *
 * Aparece solo cuando el servidor rechaza una generación, nunca antes. Es el
 * momento de más intención del producto: quien llega ha subido su foto, ha
 * visto sus seis recomendaciones y acaba de ver una sobre su cara.
 *
 * **No bloquea la primera experiencia** → CLAUDE.md §0. Lo que pide cuenta es
 * la **segunda** generación. El titular lo dice, porque explicar por qué se
 * pide algo convierte mejor que pedirlo a secas.
 *
 * Entrar y registrarse son el mismo gesto: el servidor intenta entrar y, si
 * no, crea la cuenta. Nadie debería tener que recordar si ya tenía una.
 */

type Panel = "signin" | "waitlist" | "joined" | "shared";

interface Props {
  reason: "no_code" | "free_used";
  retry: boolean;
  dict: Dictionary;
  lang: Locale;
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
  const [panel, setPanel] = useState<Panel>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [visible, setVisible] = useState(false);
  const [shared, setShared] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = dict.auth;
  const list = dict.waitlist;
  const access = dict.tryOn.access;
  const afterFree = reason === "free_used";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    // Se comprueba antes de salir a la red: es un error del formulario, no
    // del servidor, y no merece un viaje de ida y vuelta.
    if (!visible && password !== confirm) {
      setBusy(false);
      setError(auth.errors.passwordMismatch);
      return;
    }

    const result = await signIn(email, password);
    setBusy(false);

    if (result === "ok") {
      track("click_try_free", { step: "auth_completed", locale: lang });
      // La generación se reintenta sola: pulsó generar hace un minuto y no
      // debería tener que volver a buscarlo.
      onSubmit();
      return;
    }

    setError(
      result === "invalid_email"
        ? auth.errors.invalidEmail
        : result === "weak_password"
          ? auth.errors.weakPassword
          : result === "wrong_password"
            ? auth.errors.wrongPassword
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
    setError(
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
        {/* ---------- Registro / entrada ---------- */}
        {panel === "signin" && (
          <div>
            <h2 className="font-display text-xl tracking-tight">
              {afterFree ? auth.titleAfterFree : auth.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {afterFree ? auth.bodyAfterFree : auth.body}
            </p>

            {/*
              Google primero y en grande. Es el camino que más convierte y el
              único que no depende de que sepamos enviar correo.
            */}
            <a
              href={`/api/auth/google?lang=${lang}`}
              onClick={() =>
                track("click_try_free", { step: "auth_google", locale: lang })
              }
              className="mt-5 flex w-full items-center justify-center gap-3 rounded-full border border-line bg-paper px-5 py-3 text-sm font-medium transition-colors hover:border-ink"
            >
              <GoogleMark />
              {auth.google}
            </a>

            <div className="my-5 flex items-center gap-3 text-[0.7rem] text-muted">
              <span className="h-px flex-1 bg-line" />
              {auth.or}
              <span className="h-px flex-1 bg-line" />
            </div>

            <form onSubmit={submit}>
              <label htmlFor="auth-email" className="sr-only">
                {auth.emailLabel}
              </label>
              <input
                id="auth-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={auth.emailPlaceholder}
                className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none focus-visible:border-accent"
              />

              {/*
                El interruptor de ver la contraseña no es un adorno: evita la
                mitad de los errores de tecleo, que es precisamente lo que la
                segunda casilla intenta atrapar después.
              */}
              <div className="relative mt-3">
                <label htmlFor="auth-password" className="sr-only">
                  {auth.passwordLabel}
                </label>
                <input
                  id="auth-password"
                  name="password"
                  type={visible ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={auth.passwordPlaceholder}
                  className="w-full rounded-xl border border-line bg-paper px-4 py-3 pr-24 text-sm outline-none focus-visible:border-accent"
                />
                <button
                  type="button"
                  onClick={() => setVisible((current) => !current)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[0.7rem] text-muted underline decoration-line underline-offset-4 hover:text-ink"
                >
                  {visible ? auth.hidePassword : auth.showPassword}
                </button>
              </div>

              {/*
                La segunda casilla desaparece al mostrar la contraseña: si ya
                se ve lo que se ha escrito, repetirlo no comprueba nada y solo
                añade un campo más al formulario que peor convierte.
              */}
              {!visible && (
                <>
                  <label htmlFor="auth-confirm" className="sr-only">
                    {auth.confirmLabel}
                  </label>
                  <input
                    id="auth-confirm"
                    name="password-confirm"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={confirm}
                    onChange={(event) => setConfirm(event.target.value)}
                    placeholder={auth.confirmPlaceholder}
                    className="mt-3 w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none focus-visible:border-accent"
                  />
                </>
              )}

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
                  disabled={
                    busy ||
                    !email.trim() ||
                    password.length < 8 ||
                    (!visible && confirm.length < 8)
                  }
                  className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent transition-transform active:translate-y-px disabled:opacity-40"
                >
                  {auth.submit}
                </button>
              </div>
            </form>

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
          </div>
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
                  setPanel("signin");
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
                onClick={() => setPanel("signin")}
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

/** La «G» de Google, con sus colores de marca. */
function GoogleMark() {
  return (
    <svg viewBox="0 0 18 18" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.35 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.96 10.71a5.41 5.41 0 0 1 0-3.42V4.96H.96a9 9 0 0 0 0 8.08l3-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3 2.33C4.67 5.16 6.65 3.58 9 3.58Z"
      />
    </svg>
  );
}
