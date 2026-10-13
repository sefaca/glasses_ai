"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { saveAccessCode } from "@/lib/tryon/client";

/**
 * Petición del código de la alfa privada.
 *
 * Aparece solo cuando el servidor rechaza una generación por falta de código,
 * nunca antes: quien llega con el código ya guardado no ve esto jamás, y en
 * local (sin `ACCESS_CODE`) no existe.
 *
 * No valida nada por su cuenta — guarda y reintenta. Si el código es
 * incorrecto, el servidor vuelve a rechazar y el panel vuelve a salir, que es
 * la única comprobación que no se puede falsear desde el navegador.
 */

interface Props {
  /** `true` si ya se intentó un código y el servidor lo rechazó. */
  retry: boolean;
  dict: Dictionary;
  onSubmit: () => void;
  onCancel: () => void;
}

export function AccessGate({ retry, dict, onSubmit, onCancel }: Props) {
  const [code, setCode] = useState("");
  const texts = dict.tryOn.access;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    saveAccessCode(trimmed);
    onSubmit();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-5 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-xl"
      >
        <h2 className="font-display text-xl tracking-tight">{texts.title}</h2>
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
      </form>
    </div>
  );
}
