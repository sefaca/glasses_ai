import Link from "next/link";
import { FrameGlyph } from "@/components/ui/FrameGlyph";
import type { Guide } from "@/lib/content/guides";
import { guideSchema } from "@/lib/content/schema";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";

/**
 * Marco común de las guías: cabecera, miga de pan, firma, cuerpo y FAQ.
 *
 * La FAQ se pinta aquí a partir del mismo array que alimenta el schema, para
 * que no puedan divergir. El cuerpo lo pone cada guía: una tabla de medidas
 * con sus notas no sobrevive a ser estructura de datos.
 */

interface Props {
  guide: Guide;
  lang: Locale;
  children: React.ReactNode;
}

const CHECKED_LABEL = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function GuideLayout({ guide, lang, children }: Props) {
  const dict = getDictionary(lang);
  const checked = CHECKED_LABEL.format(new Date(`${guide.checkedOn}T00:00:00Z`));

  return (
    <div className="min-h-dvh">
      <script
        type="application/ld+json"
        // El contenido lo generamos nosotros desde datos tipados, no viene de
        // fuera: no hay entrada de usuario que pueda inyectar nada.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(guideSchema(guide, lang)),
        }}
      />

      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6 sm:px-8">
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
          {dict.hero.ctaPrimary}
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
        <nav aria-label="Miga de pan" className="text-xs text-muted">
          <Link href={localePath(lang)} className="hover:text-ink">
            Inicio
          </Link>
          <span className="mx-2">·</span>
          <Link href={localePath(lang, "/guias")} className="hover:text-ink">
            Guías
          </Link>
        </nav>

        <article className="prose-guide">
          <h1 className="mt-5 font-display text-4xl leading-[1.08] tracking-tight text-balance sm:text-5xl">
            {guide.h1}
          </h1>

          {/*
            Sin firma de persona: la decisión de quién firma está abierta y
            un autor inventado es peor que ninguno. Lo que sí importa a quien
            lee una tabla de medidas es cuándo se comprobó.
          */}
          <p className="mt-5 border-y border-line py-3 text-xs text-muted">
            Datos comprobados el {checked}. Las fuentes de cada medida y las
            que no coinciden están indicadas en la propia tabla.
          </p>

          {children}

          <section>
            <h2>Preguntas frecuentes</h2>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {guide.faqs.map((faq) => (
                <div key={faq.question} className="py-5">
                  <dt className="text-sm font-medium">{faq.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </article>

        <aside className="mt-12 rounded-2xl border border-line bg-surface p-6">
          <p className="rule-label text-[0.7rem] text-accent">
            Compruébalo con tu cara
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Medimos las proporciones de tu rostro en tu navegador y te decimos
            qué monturas del catálogo encajan mejor y si cada una se te queda
            ancha o estrecha. La foto no sale de tu dispositivo para eso.
          </p>
          <Link
            href={localePath(lang, "/probar")}
            className="mt-5 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent transition-transform active:translate-y-px"
          >
            Ver qué me encaja
          </Link>
        </aside>
      </main>
    </div>
  );
}
