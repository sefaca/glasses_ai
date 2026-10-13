import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TryFlow } from "@/components/flow/TryFlow";
import { getDictionary, isLocale } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/i18n/metadata";

/**
 * El flujo es interactivo de principio a fin, así que vive en un componente
 * cliente. Esta página es la capa servidor que resuelve el idioma y le pasa
 * el diccionario ya elegido: así el texto se decide en el build y no hay un
 * salto de idioma al hidratar.
 *
 * El slug es `/probar` en los cinco idiomas. No es un descuido: esta página
 * está en `noindex` y no compite por tráfico, así que un slug localizado no
 * aporta nada hoy. Los slugs traducidos llegan con las páginas de categoría y
 * de forma, que es donde sí deciden el posicionamiento.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);

  return localizedMetadata(lang, "/probar", {
    title: dict.flow.photo.title,
    description: dict.meta.description,
  });
}

export default async function ProbarPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <TryFlow lang={lang} dict={getDictionary(lang)} />;
}
