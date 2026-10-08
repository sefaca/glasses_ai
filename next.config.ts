import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Next 16 autogenera un AGENTS.md. Lo desactivamos: el documento maestro
  // del proyecto es CLAUDE.md y D-014 es precisamente sobre no mantener dos
  // versiones de la verdad.
  agentRules: false,
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
