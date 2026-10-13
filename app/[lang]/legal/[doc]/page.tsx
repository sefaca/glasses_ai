import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FrameGlyph } from "@/components/ui/FrameGlyph";
import { LOCALES, getDictionary, isLocale, localePath } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/i18n/metadata";
import type { Dictionary } from "@/lib/i18n";

/**
 * Los tres documentos legales, en los cinco idiomas, desde una sola
 * plantilla.
 *
 * El texto vive en el diccionario y no en el JSX a propósito: con tres
 * documentos × cinco idiomas, quince componentes copiados garantizan que uno
 * se quede desactualizado. Así, cambiar una frase la cambia en el sitio
 * entero o no compila.
 *
 * Los slugs son estables en inglés (`privacy`, `terms`, `cookies`) porque
 * estas páginas no compiten por tráfico. Los slugs localizados llegan con las
 * páginas de categoría y de forma, que es donde sí importan.
 *
 * **Siguen pendientes de revisión jurídica profesional**, y cada uno lo dice
 * en su último apartado → CLAUDE.md §14. Traducir un texto no revisado no lo
 * convierte en revisado: en alemán hace falta además Impressum.
 */

const DOCS = ["privacy", "terms", "cookies"] as const;
type DocKey = (typeof DOCS)[number];

function isDoc(value: string): value is DocKey {
  return (DOCS as readonly string[]).includes(value);
}

function pick(dict: Dictionary, doc: DocKey) {
  return dict.legal[doc];
}

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => DOCS.map((doc) => ({ lang, doc })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; doc: string }>;
}): Promise<Metadata> {
  const { lang, doc } = await params;
  if (!isLocale(lang) || !isDoc(doc)) return {};
  const content = pick(getDictionary(lang), doc);

  return localizedMetadata(lang, `/legal/${doc}`, { title: content.title });
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ lang: string; doc: string }>;
}) {
  const { lang, doc } = await params;
  if (!isLocale(lang) || !isDoc(doc)) notFound();

  const dict = getDictionary(lang);
  const content = pick(dict, doc);

  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6 sm:px-8">
        <Link
          href={localePath(lang)}
          aria-label={dict.common.home}
          className="text-accent"
        >
          <FrameGlyph shape="round" thickness={0.3} className="h-6 w-auto" />
        </Link>
        <Link
          href={localePath(lang)}
          className="text-sm text-muted hover:text-ink"
        >
          {dict.common.back}
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
        <article>
          <p className="rule-label text-[0.7rem] text-accent">
            {content.label}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight tracking-tight">
            {content.title}
          </h1>

          {content.intro.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-4 text-sm leading-relaxed text-muted"
            >
              {paragraph}
            </p>
          ))}

          {content.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="mt-10 font-display text-2xl tracking-tight">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-4 text-sm leading-relaxed text-muted"
                >
                  {paragraph}
                </p>
              ))}
              {section.items && (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </main>
    </div>
  );
}
