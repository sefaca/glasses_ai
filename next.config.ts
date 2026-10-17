import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Next 16 autogenera un AGENTS.md. Lo desactivamos: el documento maestro
  // del proyecto es CLAUDE.md y D-014 es precisamente sobre no mantener dos
  // versiones de la verdad.
  agentRules: false,
  async redirects() {
    return [
      {
        /**
         * La raíz no es una página: todos los idiomas llevan prefijo, el
         * español incluido. Se manda al español porque es el mercado
         * inicial.
         *
         * **Temporal (307) a propósito.** Un 308 lo cachean los navegadores
         * para siempre, y el día que esta redirección dependa del idioma del
         * visitante, o que cambie el idioma por defecto, habría gente
         * atrapada en `/es` sin forma de arreglarlo desde el servidor.
         */
        source: "/",
        destination: "/es",
        permanent: false,
      },
      {
        /**
         * El enlace de pago que guarda Paddle **no puede llevar idioma**: es
         * uno solo para todo el mundo y lo pega en correos que escribe él.
         * Aquí se le da una URL estable y se resuelve el idioma dentro.
         *
         * Next conserva la query, que es justo lo que importa: el `_ptxn`
         * con la transacción a medias viaja intacto hasta la página.
         */
        source: "/checkout",
        destination: "/es/checkout",
        permanent: false,
      },
    ];
  },
  turbopack: {
    // Fijado explícitamente: hay un package-lock.json suelto en el directorio
    // de usuario y, sin esto, Turbopack infiere ahí la raíz del workspace.
    root: path.resolve(import.meta.dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
