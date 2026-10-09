"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  analyzeFaceImage,
  releaseFaceAnalysis,
  warmUpFaceAnalysis,
} from "@/lib/face/analyze";
import type { FaceProfile } from "@/lib/face/types";
import { describeFaceProfile } from "@/lib/recommendations/explain";
import {
  ACCEPT_ATTRIBUTE,
  checkUploadDimensions,
  checkUploadMetadata,
} from "@/lib/upload/validate";

/**
 * Subida y análisis de la foto — CLAUDE.md §8.3, §8.4 y §8.5.
 *
 * La foto **no se sube a ningún sitio**. Se decodifica en el navegador, se
 * analiza ahí con MediaPipe y lo único que sale del componente es un
 * `FaceProfile`: una veintena de proporciones, sin imagen. La vista previa es
 * un `blob:` local que se revoca al cambiar de foto.
 *
 * Estados visibles en todo momento, porque cargar el modelo la primera vez
 * tarda y un spinner mudo durante seis segundos se lee como que está roto.
 */

type Phase = "idle" | "decoding" | "analyzing" | "rejected" | "done";

interface PhotoAnalyzerProps {
  onProfile: (profile: FaceProfile | null) => void;
}

export function PhotoAnalyzer({ onProfile }: PhotoAnalyzerProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [profile, setProfile] = useState<FaceProfile | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<string | null>(null);

  // El modelo pesa ~16 MB entre wasm y pesos. Se empieza a traer al montar,
  // mientras el usuario lee, en vez de al pulsar el botón.
  useEffect(() => {
    warmUpFaceAnalysis();
    return () => {
      void releaseFaceAnalysis();
    };
  }, []);

  // Revocar el blob al desmontar: es memoria viva en el navegador.
  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    [],
  );

  const setPreview = useCallback((url: string | null) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = url;
    setPreviewUrl(url);
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      setProfile(null);
      onProfile(null);

      // Metadatos antes de decodificar: lo caro y lo peligroso es decodificar.
      const meta = checkUploadMetadata(file);
      if (!meta.ok) {
        setPreview(null);
        setPhase("rejected");
        setMessage(meta.message);
        return;
      }

      setPhase("decoding");
      setMessage(null);
      setPreview(URL.createObjectURL(file));

      let bitmap: ImageBitmap;
      try {
        bitmap = await createImageBitmap(file);
      } catch {
        setPhase("rejected");
        setMessage("No hemos podido abrir esa imagen. Prueba con otra.");
        return;
      }

      const dimensions = checkUploadDimensions(bitmap);
      if (!dimensions.ok) {
        bitmap.close();
        setPhase("rejected");
        setMessage(dimensions.message);
        return;
      }

      setPhase("analyzing");
      const outcome = await analyzeFaceImage(bitmap);
      bitmap.close();

      if (outcome.status === "ok") {
        setProfile(outcome.profile);
        onProfile(outcome.profile);
        setPhase("done");
        setMessage(null);
        return;
      }

      setPhase("rejected");
      setMessage(outcome.message);
    },
    [onProfile, setPreview],
  );

  function reset() {
    setPreview(null);
    setProfile(null);
    onProfile(null);
    setPhase("idle");
    setMessage(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const busy = phase === "decoding" || phase === "analyzing";

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      {phase === "idle" && (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-on-accent shadow-[0_8px_20px_-8px_rgba(0,0,0,0.45)] transition-transform active:translate-y-px"
          >
            Elegir una foto
          </button>
          <ul className="mt-6 grid gap-1.5 text-xs text-muted sm:grid-cols-2">
            <li>De frente y con buena luz</li>
            <li>Los ojos visibles</li>
            <li>Sin filtros</li>
            <li>Mejor sin gafas puestas</li>
            <li>Solo tú en la foto</li>
            <li>JPG, PNG o WEBP</li>
          </ul>
        </>
      )}

      {(busy || phase === "rejected" || phase === "done") && (
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {previewUrl && (
            <div className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- blob local, nunca se sube; next/image no aplica */}
              <img
                src={previewUrl}
                alt="La foto que has elegido"
                className="h-32 w-32 rounded-xl border border-line object-cover"
              />
            </div>
          )}

          <div className="min-w-0 grow" aria-live="polite">
            {busy && (
              <p className="flex items-center gap-2.5 text-sm">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"
                />
                {phase === "decoding"
                  ? "Abriendo la foto…"
                  : "Analizando proporciones en tu navegador…"}
              </p>
            )}

            {phase === "rejected" && message && (
              <>
                <p className="text-sm text-ink">{message}</p>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="mt-4 rounded-full border border-ink px-5 py-2.5 text-sm font-medium transition-colors hover:bg-ink hover:text-paper active:translate-y-px"
                >
                  Probar con otra foto
                </button>
              </>
            )}

            {phase === "done" && profile && (
              <>
                <p className="rule-label text-[0.7rem] text-accent">
                  Tu perfil
                </p>
                <p className="mt-2 text-sm leading-relaxed">
                  {describeFaceProfile(profile)}
                </p>
                {profile.confidence < 0.5 && (
                  <p className="mt-2 text-xs text-muted">
                    La estimación es poco firme con esta foto. Una más frontal
                    daría una lectura mejor.
                  </p>
                )}
                <button
                  type="button"
                  onClick={reset}
                  className="mt-4 text-xs text-muted underline decoration-line underline-offset-4 hover:text-ink"
                >
                  Quitar la foto
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {phase !== "idle" && (
        <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-muted">
          La foto no se ha subido a ningún servidor. El análisis se ejecuta en
          tu navegador y lo único que guardamos en memoria son proporciones, sin
          imagen.
        </p>
      )}
    </div>
  );
}
