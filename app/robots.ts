import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * `robots.txt`.
 *
 * **Hoy prohíbe todo**, en coherencia con el `noindex` de las páginas. Tener
 * un `robots.txt` que invita a rastrear mientras cada página dice «no me
 * indexes» es contradecirse, y Google resuelve esas contradicciones como le
 * parece.
 *
 * En el gate G0 esto se invierte: `allow: "/"`, se quita el `noindex` de las
 * rutas con contenido y **entonces** se envía el sitemap
 * → docs/GROWTH_SEO.md §4.
 *
 * La línea `Sitemap:` se declara ya porque no cuesta nada y evita olvidarla
 * el día del cambio.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
