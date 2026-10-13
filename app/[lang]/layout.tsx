import type { Metadata } from "next";
import { Familjen_Grotesk, Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import {
  LOCALES,
  LOCALE_HREFLANG,
  getDictionary,
  isIndexable,
  isLocale,
} from "@/lib/i18n";
import { localizedMetadata } from "@/lib/i18n/metadata";
import "../globals.css";

/**
 * Layout raíz. Vive bajo `[lang]` porque `<html lang>` tiene que llevar el
 * idioma real de la página y un layout hijo no puede tocar ese atributo.
 *
 * Las cinco variantes se generan en el build (`generateStaticParams`): el
 * HTML servido ya trae el texto traducido, que es lo que §29.5 pide para que
 * sea indexable sin depender de JavaScript.
 */

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

const sans = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-familjen",
  display: "swap",
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL(SITE_URL),
    ...localizedMetadata(lang, "/", {
      title: dict.meta.title,
      description: dict.meta.description,
    }),
    /**
     * Indexabilidad **por idioma**, no global → `INDEXABLE_LOCALES`.
     *
     * Hoy la lista está vacía y por tanto nada se indexa, que es lo correcto
     * en fase de validación (CLAUDE.md §35). Se abre idioma a idioma cuando
     * exista contenido que merezca tráfico y lo haya leído un nativo
     * → docs/GROWTH_SEO.md §4, gate G0.
     *
     * `follow` acompaña a `index`: un idioma cerrado tampoco reparte señal.
     */
    robots: { index: isIndexable(lang), follow: isIndexable(lang) },
  };
}

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={LOCALE_HREFLANG[lang]}>
      <body className={`${display.variable} ${sans.variable} grain antialiased`}>
        {children}
      </body>
    </html>
  );
}
