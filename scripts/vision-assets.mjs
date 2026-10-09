// Prepara los binarios de MediaPipe en `public/mediapipe/`.
//
// Se autoalojan en lugar de cargarlos de un CDN por tres razones: el analisis
// facial no debe depender de que un tercero este disponible, no queremos que un
// CDN externo vea quien usa el producto, y la politica de contenidos del sitio
// queda cerrada sobre nuestro propio origen.
//
// Son artefactos derivados: no se versionan (ver .gitignore) y este script
// corre en `predev` y `prebuild`, asi que tambien se preparan solos en CI.

import { createWriteStream } from "node:fs";
import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "mediapipe");
const WASM_OUT = path.join(OUT_DIR, "wasm");
const WASM_SRC = path.join(
  ROOT,
  "node_modules",
  "@mediapipe",
  "tasks-vision",
  "wasm",
);

// Modelo de 478 puntos con refinado de iris: es el que da distancia
// interpupilar real, y sin ella media geometria se cae.
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
const MODEL_OUT = path.join(OUT_DIR, "face_landmarker.task");

/** Un archivo que existe y tiene contenido. Una descarga a medias no cuenta. */
async function fileExists(target) {
  try {
    const info = await stat(target);
    return info.isFile() && info.size > 0;
  } catch {
    return false;
  }
}

/**
 * Un directorio.
 * Ojo: en Windows `stat` le da tamano 0, asi que no sirve comprobarlo con
 * `size > 0` como a un archivo.
 */
async function dirExists(target) {
  try {
    return (await stat(target)).isDirectory();
  } catch {
    return false;
  }
}

async function copyWasm() {
  if (!(await dirExists(WASM_SRC))) {
    throw new Error(
      `No encuentro el wasm de MediaPipe en ${WASM_SRC}. Falta 'npm install'?`,
    );
  }
  await mkdir(WASM_OUT, { recursive: true });

  const files = await readdir(WASM_SRC);
  let copied = 0;
  for (const file of files) {
    const dest = path.join(WASM_OUT, file);
    if (await fileExists(dest)) continue;
    await copyFile(path.join(WASM_SRC, file), dest);
    copied++;
  }
  console.log(
    copied > 0
      ? `wasm: ${copied} archivos copiados a public/mediapipe/wasm`
      : "wasm: ya estaba al dia",
  );
}

async function downloadModel() {
  if (await fileExists(MODEL_OUT)) {
    console.log("modelo: ya estaba descargado");
    return;
  }
  await mkdir(OUT_DIR, { recursive: true });

  console.log("modelo: descargando face_landmarker.task...");
  const response = await fetch(MODEL_URL);
  if (!response.ok || !response.body) {
    throw new Error(
      `No se pudo descargar el modelo (${response.status} ${response.statusText}).`,
    );
  }
  await pipeline(Readable.fromWeb(response.body), createWriteStream(MODEL_OUT));

  const info = await stat(MODEL_OUT);
  console.log(`modelo: ${(info.size / 1024 / 1024).toFixed(1)} MB descargados`);
}

try {
  await copyWasm();
  await downloadModel();
} catch (error) {
  console.error(`\nvision-assets fallo: ${error.message}`);
  process.exit(1);
}
