import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideLayout } from "@/components/content/GuideLayout";
import { findGuide } from "@/lib/content/guides";
import { isLocale, localePath } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/i18n/metadata";

/**
 * Qué garantiza cada tipo de probador.
 *
 * Esta página es la que obliga RULE #1 a tener: si no vamos a presentar una
 * generación como el producto, hay que explicar por qué, y eso solo se puede
 * hacer siendo igual de explícito sobre lo que **nosotros** no garantizamos.
 *
 * El apartado «Lo que hacemos hoy» describe el producto que existe hoy, no el
 * del plan: la previsualización a escala se eliminó, y lo que queda es la
 * lectura de anchura en cualitativo más una generación tras código privado.
 * Si el producto cambia, esta página cambia el mismo día.
 */

const SLUG = "probar-gafas-online";

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

export default async function ProbarGafasOnlinePage({
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
        Probar gafas online sirve para tres cosas distintas, y ningún tipo de
        probador las cumple todas. Los probadores 3D con cámara te dejan ver una
        montura moviéndose sobre tu cara. Las imágenes generadas por IA te dan
        una foto realista tuya con gafas. Las lecturas de proporción te dicen si
        una montura es demasiado ancha o estrecha para tu rostro.
      </p>

      <p>
        Lo que casi ninguno te garantiza es que la montura que ves sea
        exactamente la que vas a recibir. Antes de fiarte de cualquier probador,
        hazte estas cuatro preguntas:
      </p>
      <ol>
        <li>¿La montura que veo es la real o una «parecida»?</li>
        <li>¿Me dice cuánto mide, o solo cómo se ve?</li>
        <li>¿Qué pasa con mi foto o con mi cámara?</li>
        <li>¿Avisa de que es una simulación?</li>
      </ol>

      <h2>Tres tipos de probador</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">3D o realidad aumentada</th>
              <th scope="col">Imagen generada con IA</th>
              <th scope="col">Lectura de proporción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Cómo funciona</th>
              <td>
                Superpone un modelo 3D de la montura sobre tu cara en cámara o
                foto
              </td>
              <td>Crea una imagen nueva a partir de tu foto y de la montura</td>
              <td>
                Mide las proporciones de tu rostro y las compara con las medidas
                de la montura
              </td>
            </tr>
            <tr>
              <th scope="row">Te dice bien</th>
              <td>
                Cómo se mueve y cómo asienta, si la montura está digitalizada
              </td>
              <td>Cómo podría verse el conjunto: luz, sombra, estilo</td>
              <td>Si la montura es ancha o estrecha para tu cara</td>
            </tr>
            <tr>
              <th scope="row">No te garantiza</th>
              <td>
                Que esté la montura que buscas: solo existen las que alguien
                modeló en 3D
              </td>
              <td>
                Que la montura sea la real: el modelo puede generar una parecida
              </td>
              <td>Material, color ni acabado</td>
            </tr>
            <tr>
              <th scope="row">Tu foto</th>
              <td>Según el proveedor: en tu navegador o en un servidor</td>
              <td>Se envía a un servidor de terceros para generar</td>
              <td>Se procesa en tu navegador</td>
            </tr>
            <tr>
              <th scope="row">Para qué sirve</th>
              <td>Probar un modelo concreto, si existe</td>
              <td>Inspirarte</td>
              <td>Descartar monturas que no te encajan</td>
            </tr>
          </tbody>
          <caption>
            La fila «Tu foto» describe dónde se procesa, no una calificación
            legal de los datos.
          </caption>
        </table>
      </div>

      <h2>Por qué la pregunta de la «montura real» importa</h2>
      <p>
        Cuando un probador te muestra una imagen bonita con unas gafas
        concretas, es fácil asumir que esas son las gafas que comprarás. Si la
        imagen no representa la montura real y haces clic para comprarla,
        recibirás algo distinto de lo que viste. Por eso, aquí{" "}
        <strong>
          una imagen generada nunca se presenta como la montura de un producto
        </strong>{" "}
        mientras no hayamos medido que se reconoce.
      </p>

      <h2>Lo que hacemos hoy</h2>
      <p>
        Analizamos las proporciones de tu rostro{" "}
        <strong>en tu propio navegador</strong> —la foto no sale de tu
        dispositivo para eso— y con ellas ordenamos el catálogo: te damos seis
        monturas con una razón concreta por la que aparecen, y para cada una una
        lectura de anchura en palabras: equilibrada, puede quedarte ancha o
        puede quedarte estrecha.
      </p>
      <p>
        Esa lectura es una estimación. Calculamos la escala con una distancia
        entre pupilas media de población adulta, no con la tuya, así que{" "}
        <strong>nunca te damos milímetros de tu cara</strong>. Sirve para
        descartar, no para decidir.
      </p>
      <p>
        También generamos imágenes sobre tu foto, que hoy están{" "}
        <strong>detrás de un código privado</strong> mientras medimos si la
        montura real se reconoce en el resultado. Cuando una imagen sea una
        simulación, lo dirá, y no la usaremos para venderte un modelo concreto
        como si fuera ese modelo.
      </p>
      <p>
        Lo que no hacemos: enseñarte el acetato, el color o el acabado, ni
        decirte cómo te sentarán de verdad. Para eso hay que probárselas.
      </p>

      <h2>Cinco comprobaciones antes de fiarte de un probador</h2>
      <ul>
        <li>
          <strong>¿Aparece la referencia exacta</strong> —marca, modelo y
          talla— o solo «gafas estilo aviador»?
        </li>
        <li>
          <strong>¿Marca la imagen como simulación?</strong>
        </li>
        <li>
          <strong>¿Te da la talla de la montura en milímetros?</strong> Un
          probador que no la da no te ayuda con el ajuste. Las de Ray-Ban están
          en{" "}
          <Link href={localePath(lang, "/guias/tallas-ray-ban")}>
            nuestra tabla de tallas
          </Link>
          .
        </li>
        <li>
          <strong>¿Te explica qué hace con tu foto</strong>: dónde se procesa,
          cuánto se guarda?
        </li>
        <li>
          <strong>¿Te lleva a una tienda concreta</strong> o te pide registrarte
          antes de enseñarte nada?
        </li>
      </ul>
    </GuideLayout>
  );
}
