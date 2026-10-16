import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Ningún fichero puede tener texto doblemente codificado.
 *
 * Esto existe por un fallo real y vergonzoso: editar un fichero con acentos
 * usando `Set-Content -Encoding utf8` de PowerShell lo reescribe con BOM y
 * convierte cada `ñ` en dos caracteres basura. Llegó a producción y el
 * selector de idiomas mostró «Espa-n-ol» con mojibake en medio.
 *
 * Lo peor no fue el mojibake: al editarlo **una segunda vez**, los caracteres
 * ya rotos se convirtieron en U+FFFD y la información se perdió del todo. Hubo
 * que recuperar el fichero de git.
 *
 * Es imposible de ver revisando un diff —parece texto— y trivial de detectar
 * por bytes. De ahí este test.
 */

const RAIZ = path.resolve(import.meta.dirname, "..");

const IGNORAR = new Set([
  "node_modules",
  ".next",
  ".git",
  "raw",
  "outputs",
  "faces",
]);

/**
 * Este mismo fichero queda fuera del escaneo.
 *
 * No es una excepción cómoda: contiene por fuerza las secuencias que busca
 * —están en la expresión regular y en los ejemplos del comentario— así que
 * se señalaría a sí mismo en cada ejecución. Es el único excluido.
 */
const ESTE_FICHERO = "encoding.test.ts";

const EXTENSIONES = [".ts", ".tsx", ".md", ".css", ".json", ".sql", ".mjs"];

/** Secuencias que delatan UTF-8 leído como Latin-1. */
const MOJIBAKE = /[ÃÂ][\u0080-¿]|â€|Ã¢â‚¬/;

function ficheros(dir: string): string[] {
  const encontrados: string[] = [];
  for (const entrada of readdirSync(dir)) {
    if (IGNORAR.has(entrada)) continue;
    const completo = path.join(dir, entrada);
    if (statSync(completo).isDirectory()) {
      encontrados.push(...ficheros(completo));
    } else if (
      EXTENSIONES.includes(path.extname(entrada)) &&
      entrada !== ESTE_FICHERO
    ) {
      encontrados.push(completo);
    }
  }
  return encontrados;
}

describe("codificación de los ficheros", () => {
  const todos = ficheros(RAIZ);

  it("encuentra ficheros que revisar", () => {
    expect(todos.length).toBeGreaterThan(50);
  });

  it("ninguno tiene texto doblemente codificado", () => {
    const rotos: string[] = [];
    for (const fichero of todos) {
      const contenido = readFileSync(fichero, "utf8");
      if (MOJIBAKE.test(contenido)) {
        rotos.push(path.relative(RAIZ, fichero));
      }
    }
    expect(rotos, `doble codificación en:\n${rotos.join("\n")}`).toEqual([]);
  });

  it("ninguno tiene caracteres destruidos", () => {
    // U+FFFD significa que la información ya se perdió: no se recupera
    // reparando, hay que ir a git.
    const rotos: string[] = [];
    for (const fichero of todos) {
      if (readFileSync(fichero, "utf8").includes("�")) {
        rotos.push(path.relative(RAIZ, fichero));
      }
    }
    expect(rotos, `caracteres perdidos en:\n${rotos.join("\n")}`).toEqual([]);
  });

  it("ninguno empieza con BOM", () => {
    // Lo añade PowerShell y en un fichero de TypeScript no pinta nada.
    const conBom: string[] = [];
    for (const fichero of todos) {
      const bytes = readFileSync(fichero);
      if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
        conBom.push(path.relative(RAIZ, fichero));
      }
    }
    expect(conBom, `BOM en:\n${conBom.join("\n")}`).toEqual([]);
  });
});
