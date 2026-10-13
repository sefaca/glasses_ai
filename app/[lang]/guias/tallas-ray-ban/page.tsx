import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideLayout } from "@/components/content/GuideLayout";
import { findGuide } from "@/lib/content/guides";
import { isLocale, localePath } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/i18n/metadata";

/**
 * Guía de tallas Ray-Ban.
 *
 * Lo que hace que esta página exista y no sea una más: el **índice de
 * anchura** (2 × calibre + puente), que permite comparar tallas entre modelos
 * distintos. Es una cuenta nuestra y se dice que lo es, porque no es el ancho
 * del frontal y confundirlo sería dar una precisión que no tenemos.
 *
 * Las medidas vienen de fichas de tienda `[T]`, no de la ficha oficial, que
 * devuelve 403 a una petición automática. El texto lo dice en lugar de
 * presentarlas como dato oficial, y donde las fuentes discrepan se enseña la
 * discrepancia en vez de elegir una en silencio → CLAUDE.md §40.
 */

const SLUG = "tallas-ray-ban";

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
    // Solo existe en español: no se anuncian alternativas que no existen.
    alternates: {
      canonical: localePath(lang, `/guias/${SLUG}`),
    },
  };
}

export default async function TallasRayBanPage({
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
        Las gafas Ray-Ban llevan sus medidas impresas como tres números en
        milímetros, por ejemplo <strong>50□22 150</strong>. El primero es el
        ancho de cada lente, el calibre; el segundo es el puente, la pieza que
        apoya en la nariz; y el tercero es el largo de la varilla. Suelen estar
        en la cara interior de una varilla.
      </p>

      <p>Cada modelo se fabrica en sus propias tallas:</p>
      <ul>
        <li>Aviator Classic (RB3025): 55, 58 y 62.</li>
        <li>Wayfarer Original (RB2140): 50 y 54.</li>
        <li>New Wayfarer (RB2132): 52, 55 y 58.</li>
        <li>Clubmaster (RB3016): 49, 51 y 55.</li>
        <li>Round Metal (RB3447): 47, 50 y 53.</li>
        <li>Justin (RB4165): 51 y 54 o 55, según la tienda.</li>
      </ul>

      <p>
        Un mismo número no significa lo mismo en todos los modelos. Una talla 55
        puede tener un índice de anchura de 124 o de 131 —más abajo explicamos
        qué es— según el modelo, porque el puente varía de 14 a 21 mm.
      </p>

      <p>
        La forma más fiable de elegir es comparar con unas gafas que ya te
        queden bien de ancho. Abajo tienes la tabla completa y los tres pasos
        para hacerlo.
      </p>

      <h2>Medidas por modelo y talla</h2>
      <div className="table-wrap">
        <table>
          <caption>
            Datos de fichas de tienda, comprobados el 13 de octubre de 2026. No
            proceden de la ficha oficial de Ray-Ban, que no hemos podido
            contrastar todavía.
          </caption>
          <thead>
            <tr>
              <th scope="col">Modelo</th>
              <th scope="col">Ref.</th>
              <th scope="col">Calibres (mm)</th>
              <th scope="col">Puente (mm)</th>
              <th scope="col">Varilla (mm)</th>
              <th scope="col">Qué tan firme es el dato</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Aviator Classic</th>
              <td>RB3025</td>
              <td>55 · 58 · 62</td>
              <td>14</td>
              <td>135 · 135 · 140</td>
              <td>Varias tiendas coinciden</td>
            </tr>
            <tr>
              <th scope="row">Wayfarer Original</th>
              <td>RB2140</td>
              <td>50 · 54 (47 en alguna ficha)</td>
              <td>22 en la 50; 18 o 22 en la 54</td>
              <td>150</td>
              <td>
                <strong>Fuentes en desacuerdo</strong>
              </td>
            </tr>
            <tr>
              <th scope="row">New Wayfarer</th>
              <td>RB2132</td>
              <td>52 · 55 · 58</td>
              <td>18</td>
              <td>145</td>
              <td>Una sola tienda con tabla completa</td>
            </tr>
            <tr>
              <th scope="row">Clubmaster</th>
              <td>RB3016</td>
              <td>49 · 51 · 55</td>
              <td>21</td>
              <td>140 · 145 · 150</td>
              <td>Varias coinciden; la 55 solo en una</td>
            </tr>
            <tr>
              <th scope="row">Round Metal</th>
              <td>RB3447</td>
              <td>47 · 50 · 53</td>
              <td>21</td>
              <td>140 · 145 · 145</td>
              <td>Varilla de la 47 solo en una</td>
            </tr>
            <tr>
              <th scope="row">Justin</th>
              <td>RB4165</td>
              <td>51 · 54 o 55</td>
              <td>16</td>
              <td>145</td>
              <td>Varias coinciden; 54 y 55 según tienda</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        <strong>De dónde salen estos datos.</strong> Proceden de fichas de
        tiendas. Donde las fuentes se contradicen lo decimos en lugar de elegir
        una. Si ves una discrepancia con tus gafas, fíate de lo impreso en tu
        varilla.
      </p>

      <h2>Mismo número, distinta anchura: el índice de anchura</h2>
      <p>
        El calibre solo mide la lente. El puente separa las dos lentes y también
        cuenta. Por eso sumamos <strong>2 × calibre + puente</strong> y lo
        llamamos índice de anchura.
      </p>
      <p>
        Es una cuenta nuestra para comparar tallas entre sí dentro de esta
        tabla. <strong>No es el ancho del frontal</strong> que medirías con una
        regla, porque no incluye el aro ni las bisagras. No lo compares con
        cifras de otras webs.
      </p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Índice</th>
              <th scope="col">Modelo y talla</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">115</th>
              <td>Round Metal 47</td>
            </tr>
            <tr>
              <th scope="row">118</th>
              <td>Justin 51</td>
            </tr>
            <tr>
              <th scope="row">119</th>
              <td>Clubmaster 49</td>
            </tr>
            <tr>
              <th scope="row">121</th>
              <td>Round Metal 50</td>
            </tr>
            <tr>
              <th scope="row">122</th>
              <td>Wayfarer Original 50 · New Wayfarer 52</td>
            </tr>
            <tr>
              <th scope="row">123</th>
              <td>Clubmaster 51</td>
            </tr>
            <tr>
              <th scope="row">124</th>
              <td>Aviator 55 · Justin 54</td>
            </tr>
            <tr>
              <th scope="row">126</th>
              <td>Wayfarer Original 54 (si el puente es 18) · Justin 55</td>
            </tr>
            <tr>
              <th scope="row">127</th>
              <td>Round Metal 53</td>
            </tr>
            <tr>
              <th scope="row">128</th>
              <td>New Wayfarer 55</td>
            </tr>
            <tr>
              <th scope="row">130</th>
              <td>Aviator 58</td>
            </tr>
            <tr>
              <th scope="row">131</th>
              <td>Clubmaster 55</td>
            </tr>
            <tr>
              <th scope="row">134</th>
              <td>New Wayfarer 58</td>
            </tr>
            <tr>
              <th scope="row">138</th>
              <td>Aviator 62</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>Tres lecturas útiles:</p>
      <ol>
        <li>
          <strong>Una talla 55 no es una talla 55.</strong> Aviator 55 da 124,
          Justin 55 da 126, New Wayfarer 55 da 128 y Clubmaster 55 da 131. Con
          el mismo calibre hay 7 puntos de diferencia.
        </li>
        <li>
          <strong>
            La talla estándar de la Aviator, la 58 con índice 130, es más ancha
            en conjunto que la Wayfarer Original 54
          </strong>{" "}
          (126, o 130 si su puente fuera 22). Quien pasa de Wayfarer a Aviator
          con el mismo «54-58» de costumbre cambia de anchura.
        </li>
        <li>
          <strong>La Wayfarer Original 50 y la New Wayfarer 52 empatan en 122</strong>
          , pero difieren en puente —22 frente a 18—, varilla y altura de lente.
          Lo desarrollamos en{" "}
          <Link href={localePath(lang, "/guias/ray-ban-wayfarer-vs-new-wayfarer")}>
            Wayfarer vs New Wayfarer
          </Link>
          .
        </li>
      </ol>

      <h2>Cómo leer los tres números</h2>
      <p>
        En <strong>52□18 145</strong>, el cuadrado separa calibre y puente y no
        significa nada más.
      </p>
      <ul>
        <li>
          <strong>Calibre (52):</strong> ancho horizontal de cada lente.
        </li>
        <li>
          <strong>Puente (18):</strong> distancia entre las dos lentes, justo
          donde la montura apoya en la nariz. Un puente más ancho asienta
          distinto que uno estrecho aunque el calibre sea igual.
        </li>
        <li>
          <strong>Varilla (145):</strong> longitud total de la patilla hasta la
          punta. No cambia el ancho frontal, pero sí cómo sujeta detrás de la
          oreja.
        </li>
      </ul>

      <h2>Elegir talla en tres pasos</h2>
      <ol>
        <li>
          <strong>Busca los números en unas gafas que ya uses.</strong> Si te
          quedan bien de ancho, apunta calibre y puente.
        </li>
        <li>
          <strong>Busca en la tabla la talla con índice más parecido</strong> y
          mira si el puente se acerca al tuyo. Con un puente de 18 en las tuyas
          y un 22 en la talla elegida, el apoyo en la nariz cambiará.
        </li>
        <li>
          <strong>Contrástalo con las proporciones de tu cara.</strong> Si{" "}
          <Link href={localePath(lang, "/probar")}>subes una foto</Link>,
          medimos tus proporciones en tu propio navegador y te decimos si una
          montura concreta se te queda ancha, estrecha o equilibrada. Es una
          lectura estimada —usamos una distancia entre pupilas media de
          población, no la tuya—, así que nunca te damos milímetros de tu cara.
        </li>
      </ol>

      <h2>Lo que esta tabla no te dice</h2>
      <ul>
        <li>
          <strong>La altura de la lente.</strong> Las tiendas la publican con
          criterios distintos, y por eso no la incluimos aquí.
        </li>
        <li>
          <strong>El ancho real del frontal.</strong> Casi nadie lo publica.
        </li>
        <li>
          <strong>Cómo te quedarán en la cara.</strong> La talla no sustituye a
          probarlas, y nuestra lectura de anchura tampoco: es orientativa. Lo
          explicamos en{" "}
          <Link href={localePath(lang, "/guias/probar-gafas-online")}>
            qué garantiza cada tipo de probador
          </Link>
          .
        </li>
        <li>
          <strong>Versiones y colores.</strong> Una misma referencia puede
          cambiar de talla según el color o si es de sol o graduada.
        </li>
      </ul>
    </GuideLayout>
  );
}
