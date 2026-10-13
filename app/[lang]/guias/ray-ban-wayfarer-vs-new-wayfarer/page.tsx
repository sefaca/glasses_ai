import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideLayout } from "@/components/content/GuideLayout";
import { findGuide } from "@/lib/content/guides";
import { isLocale, localePath } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/i18n/metadata";

/**
 * Wayfarer Original frente a New Wayfarer.
 *
 * Lo propio es la **equivalencia de tallas por índice de anchura** y la
 * lectura que sale de ahí: mismo ancho, distinto puente. Es una conclusión
 * derivada de los datos, no copiada de nadie.
 *
 * No lleva el diagrama comparativo que proponía el plan. Dibujarlo hoy usaría
 * las alturas de lente de `frames.ts`, que están marcadas `indicative` y no
 * cuadran con lo que publican las tiendas: el dibujo contradiría a la tabla de
 * esta misma página. Entra cuando las medidas estén verificadas.
 */

const SLUG = "ray-ban-wayfarer-vs-new-wayfarer";

export function generateStaticParams() {
  return [{ lang: "es" }];
}

/*
 * No se declara `dynamicParams`: con `cacheComponents` Next no lo admite. El
 * filtro por idioma lo hace `notFound()` cuando la guía no existe en esa
 * lengua, que además es la comprobación correcta: depende del contenido, no
 * de la configuración de la ruta.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const guide = findGuide(SLUG);
  if (!isLocale(lang) || !guide) return {};

  return {
    ...localizedMetadata(lang, `/guias/${SLUG}`, {
      title: guide.title,
      description: guide.description,
    }),
    alternates: { canonical: localePath(lang, `/guias/${SLUG}`) },
  };
}

export default async function WayfarerPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const guide = findGuide(SLUG);
  if (!isLocale(lang) || !guide || !guide.locales.includes(lang)) notFound();

  return (
    <GuideLayout guide={guide} lang={lang}>
      <p>
        La diferencia más útil entre la Wayfarer Original (RB2140) y la New
        Wayfarer (RB2132) no es el estilo, es el ajuste. Según las tiendas que
        hemos consultado, la Original se fabrica en 50 y 54, con varilla de
        150 mm, un frontal más inclinado y una lente más alta. La New se fabrica
        en 52, 55 y 58, con puente de 18 mm, varilla de 145 mm y una lente más
        baja.
      </p>

      <p>
        A igual anchura, la 50 de la Original y la 52 de la New suman lo mismo
        en nuestro índice de anchura —122, explicado en la{" "}
        <Link href={localePath(lang, "/guias/tallas-ray-ban")}>
          guía de tallas
        </Link>
        —. Pero la Original tiene un puente 4 mm más ancho, 22 frente a 18, y
        unos 3 mm más de altura de lente.
      </p>

      <p>
        Si tus gafas actuales tienen puente 18, la New tiene el puente más
        parecido. Si tienen 22, lo tiene la Original 50. Y si necesitas una
        talla grande, solo la New llega a 58.
      </p>

      <h2>Las medidas, lado a lado</h2>
      <div className="table-wrap">
        <table>
          <caption>
            Datos de fichas de tienda, comprobados el 13 de octubre de 2026.
          </caption>
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Wayfarer Original RB2140</th>
              <th scope="col">New Wayfarer RB2132</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Tallas</th>
              <td>50 · 54 (47 en alguna ficha)</td>
              <td>52 · 55 · 58</td>
            </tr>
            <tr>
              <th scope="row">Puente (mm)</th>
              <td>22 en la 50; 18 o 22 en la 54</td>
              <td>18</td>
            </tr>
            <tr>
              <th scope="row">Varilla (mm)</th>
              <td>150</td>
              <td>145</td>
            </tr>
            <tr>
              <th scope="row">Altura de lente (mm)</th>
              <td>41 (talla 50)</td>
              <td>37,6 · 40,8 · 43,2</td>
            </tr>
            <tr>
              <th scope="row">Índice de anchura</th>
              <td>122 (50) · 126 o 130 (54)</td>
              <td>122 · 128 · 134</td>
            </tr>
            <tr>
              <th scope="row">Inclinación del frontal</th>
              <td>Más pronunciada</td>
              <td>Menor, según tiendas y blogs</td>
            </tr>
            <tr>
              <th scope="row">Material</th>
              <td>Acetato</td>
              <td>Sin confirmar: unas fuentes dicen acetato, otra nailon</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        La altura de la talla 54 de la Original la omitimos a propósito: la
        cifra que circula no es coherente con la de la 50.
      </p>

      <h2>Qué talla de una equivale a la otra</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Si miras…</th>
              <th scope="col">Lo más parecido en la otra</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Original 50 (122)</th>
              <td>New 52 (122)</td>
            </tr>
            <tr>
              <th scope="row">Original 54 (126 o 130)</th>
              <td>New 55 (128)</td>
            </tr>
            <tr>
              <th scope="row">New 58 (134)</th>
              <td>
                No hay equivalente en la Original: la 54 es su talla mayor
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Cuidado con el resto de medidas. A igual índice, la Original lleva un
        puente más ancho y, en las tallas pequeñas, una lente más alta. La New
        55 y la Original 50 tienen casi la misma altura de lente —40,8 y 41 mm—
        con 5 mm de diferencia en calibre.
      </p>

      <h2>Cuándo tiene sentido una u otra, solo con lo medible</h2>
      <ul>
        <li>
          <strong>Tu puente actual es 22</strong> → Original 50.
        </li>
        <li>
          <strong>Tu puente actual es 18</strong> → New, en 52, 55 o 58.
        </li>
        <li>
          <strong>Quieres una lente más baja</strong> → New, sobre todo la 52,
          con 37,6 mm.
        </li>
        <li>
          <strong>Necesitas más de 54 de calibre</strong> → New 55 o 58.
        </li>
        <li>
          <strong>Tus gafas actuales tienen varilla de 145</strong> → New. Si
          tienen 150, Original.
        </li>
      </ul>

      <p>
        Sobre cuál «favorece más» según la forma de la cara: ambas son wayfarer
        y la orientación clásica del sector es que es una forma versátil.{" "}
        <strong>
          No tenemos datos propios que digan cuál te favorece más.
        </strong>{" "}
        Varias tiendas afirman que la New es más cómoda por tener menos
        inclinación, pero es una opinión de vendedores, no una medida.
      </p>

      <h2>Contrástalo con tu cara</h2>
      <p>
        Si <Link href={localePath(lang, "/probar")}>subes una foto</Link>,
        medimos tus proporciones en tu navegador y te decimos, para cada una de
        las dos, si se te queda ancha, estrecha o equilibrada. Es una lectura
        estimada a partir de una distancia entre pupilas media de población, no
        de la tuya, así que sirve para descartar y no para decidir. Lo que
        garantiza cada tipo de probador lo explicamos en{" "}
        <Link href={localePath(lang, "/guias/probar-gafas-online")}>
          esta guía
        </Link>
        .
      </p>
    </GuideLayout>
  );
}
