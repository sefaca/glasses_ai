import { frameFrontWidthMm, type FrameProfile } from "../catalog/types";

/**
 * Descripción de una montura para un modelo generativo.
 *
 * Esta es la ruta `model-prior` de D-022: **no se le pasa ninguna imagen del
 * anunciante**, solo una descripción construida con datos públicos —marca,
 * modelo, referencia, forma, material, color y medidas—. Por eso los términos
 * de afiliación no entran en juego.
 *
 * Y por eso la fidelidad es el problema: el modelo dibuja **su idea** de una
 * RB3016. Cuanto más precisa sea la descripción, menos margen tiene para
 * inventar, que es todo lo que podemos hacer desde aquí. Lo que no podemos
 * hacer desde aquí es garantizarla: eso lo mide GT-1.
 */

const SHAPE_DESCRIPTION: Record<string, string> = {
  rectangular: "rectangular frame, lenses wider than tall, straight top line",
  square: "square frame with near-equal lens width and height, defined corners",
  round: "perfectly circular lenses",
  oval: "oval lenses, wider than tall with soft continuous curve",
  aviator: "classic teardrop aviator, double brow bar, thin wire rims",
  "cat-eye": "cat-eye frame, upswept outer top corners",
  wayfarer: "wayfarer silhouette, trapezoidal lenses, thick top rim, flared temples",
  geometric: "browline frame, bold upper rim with thin metal lower rim",
  oversized: "oversized frame with large lenses covering brow to cheekbone",
};

const MATERIAL_DESCRIPTION: Record<string, string> = {
  acetate: "thick glossy acetate",
  metal: "thin metal wire",
  titanium: "ultra-thin matte titanium",
  mixed: "acetate upper combined with metal lower rim and temples",
  other: "injected polymer",
};

/** Lo que el modelo tiene terminantemente prohibido tocar. */
const CONSTRAINTS = [
  "Do NOT alter the person: face, skin tone, skin texture, hair, facial hair, age, weight or expression must remain exactly as in the photo.",
  "Do NOT retouch or beautify. Keep every blemish, line and asymmetry.",
  "Do NOT change the background, framing, crop or lighting of the photo.",
  "Match the lighting direction and colour temperature of the photo on the glasses.",
  "Add realistic contact shadows where the frame meets the nose and temples.",
  "Keep the glasses in correct anatomical position: lens centres over the pupils, bridge on the nose, temples towards the ears.",
  "Output only the edited photograph, with no text, watermark or border.",
].join("\n");

export function buildTryOnPrompt(frame: FrameProfile): string {
  const parts: string[] = [];

  const name = [frame.brand, frame.model, frame.reference]
    .filter(Boolean)
    .join(" ");
  parts.push(
    `Photorealistically place a pair of ${name} sunglasses on the face of the person in this photograph.`,
  );

  const spec: string[] = [];
  spec.push(
    `Shape: ${SHAPE_DESCRIPTION[frame.shape] ?? frame.shape}.`,
  );
  spec.push(
    `Material: ${MATERIAL_DESCRIPTION[frame.material] ?? frame.material}.`,
  );
  spec.push(`Frame colour: ${frame.colorName}.`);
  spec.push(`Lens: ${frame.lensName}.`);

  // Las medidas, cuando las tenemos, acotan las proporciones mucho mejor que
  // un adjetivo. Solo se incluyen si están publicadas.
  const { lensWidthMm, lensHeightMm, bridgeMm } = frame.measurements;
  if (lensWidthMm !== null && bridgeMm !== null) {
    spec.push(
      `Proportions: ${lensWidthMm}mm lens width, ${bridgeMm}mm bridge${
        lensHeightMm !== null ? `, ${lensHeightMm}mm lens height` : ""
      }.`,
    );
  }
  const frontWidth = frameFrontWidthMm(frame);
  if (frontWidth !== null) {
    spec.push(
      `The frame front spans roughly ${frontWidth}mm, so size it against the face accordingly.`,
    );
  }

  parts.push(spec.join(" "));
  parts.push(CONSTRAINTS);

  return parts.join("\n\n");
}

/** Identifica el prompt para poder re-ejecutar y comparar versiones. */
export const PROMPT_VERSION = "v1";
