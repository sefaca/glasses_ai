"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALES, LOCALE_NAMES, isLocale, type Locale } from "@/lib/i18n";

/**
 * Cambio de idioma.
 *
 * Un `<select>` nativo a propósito: es accesible por teclado sin escribir
 * nada, se comporta como la gente espera en móvil y no arrastra dependencias.
 *
 * **No se redirige por idioma del navegador ni por IP en ninguna parte.**
 * Googlebot rastrea desde Estados Unidos y sin `Accept-Language`, así que una
 * redirección automática le escondería las demás versiones. El idioma lo
 * cambia la persona, aquí, y la URL siempre dice en cuál está.
 */

interface Props {
  current: Locale;
  label: string;
}

export function LanguageSwitcher({ current, label }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  /** Misma página, otro idioma: se sustituye solo el primer segmento. */
  function hrefFor(next: Locale): string {
    const segments = (pathname ?? `/${current}`).split("/").filter(Boolean);
    if (segments.length > 0 && isLocale(segments[0]!)) segments[0] = next;
    else segments.unshift(next);
    return `/${segments.join("/")}`;
  }

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      <select
        value={current}
        onChange={(event) => router.push(hrefFor(event.target.value as Locale))}
        className="cursor-pointer appearance-none rounded-full border border-line bg-transparent py-1.5 pr-7 pl-3 text-xs text-muted transition-colors hover:border-ink hover:text-ink focus-visible:border-accent focus-visible:outline-none"
      >
        {LOCALES.map((locale) => (
          <option key={locale} value={locale}>
            {LOCALE_NAMES[locale]}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute right-2.5 text-[0.6rem] text-muted"
      >
        ▾
      </span>
    </label>
  );
}
