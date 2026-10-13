import Link from "next/link";
import { PageView } from "@/components/analytics/PageView";
import { FrameGlyph } from "@/components/ui/FrameGlyph";
import { catalogCopy } from "@/lib/content/catalog-copy";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";

/**
 * Marco de las páginas de catálogo: cabecera, miga de pan, cuerpo y cierre.
 *
 * Comparte estilo con las guías (`prose-guide`) a propósito: son el mismo
 * tipo de página para quien lee, y tener dos tipografías distintas haría que
 * el sitio pareciera de dos sitios.
 */

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  lang: Locale;
  crumbs: Crumb[];
  title: string;
  intro: string;
  schema?: object;
  children: React.ReactNode;
}

export function CatalogLayout({
  lang,
  crumbs,
  title,
  intro,
  schema,
  children,
}: Props) {
  const dict = getDictionary(lang);
  const copy = catalogCopy(lang);

  return (
    <div className="min-h-dvh">
      <PageView name="catalog_view" props={{ locale: lang }} />
      {schema && (
        <script
          type="application/ld+json"
          // Generado por nosotros desde datos tipados: no hay entrada de
          // usuario que pueda inyectar nada aquí.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6 sm:px-8">
        <Link
          href={localePath(lang)}
          aria-label={dict.common.home}
          className="text-accent"
        >
          <FrameGlyph shape="round" thickness={0.3} className="h-6 w-auto" />
        </Link>
        <Link
          href={localePath(lang, "/probar")}
          className="rounded-full border border-ink px-5 py-2 text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
        >
          {copy.tryCta}
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-24 sm:px-8">
        <nav aria-label="Miga de pan" className="text-xs text-muted">
          <Link href={localePath(lang)} className="hover:text-ink">
            {dict.common.home}
          </Link>
          {crumbs.map((crumb) => (
            <span key={crumb.label}>
              <span className="mx-2">·</span>
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-ink">
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.08] tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">
          {intro}
        </p>

        <div className="prose-guide">{children}</div>
      </main>
    </div>
  );
}
