import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckoutResume } from "@/components/flow/CheckoutResume";
import { getDictionary, isLocale } from "@/lib/i18n";

/**
 * Destino del enlace de pago que guarda Paddle.
 *
 * La URL que se configura allí es `/checkout`, sin idioma, porque Paddle la
 * pega en correos que escribe él y solo admite una. La redirección a `/es`
 * vive en `next.config.ts` y conserva la query.
 *
 * **Fuera del índice, siempre.** Es una página de tránsito con un parámetro
 * que identifica una transacción concreta: no tiene contenido que posicionar
 * y no debería aparecer en ningún buscador.
 */

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <CheckoutResume lang={lang} dict={getDictionary(lang)} />;
}
