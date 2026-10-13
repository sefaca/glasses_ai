import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // El mismo alias que `tsconfig.json`. Sin esto no se puede testear nada que
  // viva bajo `app/`, porque las rutas de Next importan con `@/`.
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
