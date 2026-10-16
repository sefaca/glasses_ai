"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  analyzeFaceImage,
  releaseFaceAnalysis,
  warmUpFaceAnalysis,
  type FaceSession,
} from "@/lib/face/analyze";
import type { FaceProfile } from "@/lib/face/types";
import { track } from "@/lib/analytics/client";
import type { Dictionary } from "@/lib/i18n";
import { describeFaceProfile } from "@/lib/recommendations/explain";
import { prepareUpload } from "@/lib/upload/prepare";
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
  onAnalysis: (session: FaceSession | null) => void;
  dict: Dictionary;
}

export function PhotoAnalyzer({ onAnalysis, dict }: PhotoAnalyzerProps) {
  const texts = dict.upload;
  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
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

  /*
   * **No se revoca el blob al desmontar**, y es a propósito.
   *
   * Este componente se desmonta al avanzar de paso, pero la URL que creó
   * sigue viva en el `FaceSession` que recibió la página: es la foto que se
   * enseña mientras se genera y cuando algo falla. Revocarla aquí dejaba la
   * imagen rota en la pantalla de resultados —se veía el icono de imagen
   * ausente con el texto alternativo— y no había forma de recuperarla sin
   * volver a subir la foto.
   *
   * La fuga está acotada: un blob por foto subida, liberado al cerrar la
   * pestaña. Quien revoca es quien manda la foto a la basura —`setPreview`
   * al reemplazarla, y la página al limpiar la sesión—, no quien deja de
   * pintarla.
   */

  const setPreview = useCallback((url: string | null) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = url;
    setPreviewUrl(url);
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      // Se avisa al padre ANTES de revocar el blob anterior: si lo revocásemos
      // primero, lo que esté mostrando esa foto se quedaría con una URL muerta.
      setProfile(null);
      onAnalysis(null);
      track("upload_started");

      // Metadatos antes de decodificar: lo caro y lo peligroso es decodificar.
      const meta = checkUploadMetadata(file);
      if (!meta.ok) {
        setPreview(null);
        setPhase("rejected");
        setMessage(texts.issues[meta.issue!]);
        track("upload_failed", { errorCode: meta.issue! });
        return;
      }

      setPhase("decoding");
      setMessage(null);
      const photoUrl = URL.createObjectURL(file);
      setPreview(photoUrl);

      let bitmap: ImageBitmap;
      try {
        bitmap = await createImageBitmap(file);
      } catch {
        setPhase("rejected");
        setMessage(texts.errorDecode);
        return;
      }

      const dimensions = checkUploadDimensions(bitmap);
      if (!dimensions.ok) {
        bitmap.close();
        setPhase("rejected");
        setMessage(texts.issues[dimensions.issue!]);
        track("upload_failed", { errorCode: dimensions.issue! });
        return;
      }

      setPhase("analyzing");
      track("upload_completed");
      const outcome = await analyzeFaceImage(bitmap, texts);
      bitmap.close();

      if (outcome.status === "ok") {
        // Se prepara ya la versión reducida y sin EXIF que se enviaría al
        // generativo, para que al pedir una prueba no haya que esperar dos
        // veces. Prepararla no la envía a ningún sitio.
        let photo;
        try {
          photo = await prepareUpload(file);
        } catch {
          setPhase("rejected");
          setMessage(texts.errorPrepare);
          return;
        }

        setProfile(outcome.profile);
        track("face_detected");
        // El perfil no viaja: solo la forma estimada, que es una etiqueta de
        // catalogo, y la confianza redondeada. Sin medidas faciales -> regla 15.
        track("face_analysis_completed", {
          shape: outcome.profile.shapePrimary,
          count: Math.round(outcome.profile.confidence * 100),
        });
        onAnalysis({
          profile: outcome.profile,
          placement: outcome.placement,
          photoUrl,
          photo,
        });
        setPhase("done");
        setMessage(null);
        return;
      }

      setPhase("rejected");
      setMessage(outcome.message);
      track("upload_failed", {
        errorCode: outcome.status === "rejected" ? "quality" : "analysis",
      });
    },
    [onAnalysis, setPreview, texts],
  );

  /**
   * Pegar con Ctrl+V.
   *
   * Es la mitad del gesto que la gente ya tiene aprendido de cualquier
   * generador de imágenes: recortas una foto, la copias y la pegas. Se
   * escucha en la ventana y no en un campo porque no hay dónde enfocar, y
   * solo mientras no hay foto, para no secuestrar el portapapeles del resto
   * del flujo.
   */
  useEffect(() => {
    if (phase !== "idle") return;

    function onPaste(event: ClipboardEvent) {
      const file = [...(event.clipboardData?.items ?? [])]
        .filter((item) => item.kind === "file")
        .map((item) => item.getAsFile())
        .find((candidate) => candidate?.type.startsWith("image/"));
      if (file) {
        event.preventDefault();
        void handleFile(file);
      }
    }

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  });

  function reset() {
    // Mismo orden que arriba: primero se desengancha el padre, luego se revoca.
    setProfile(null);
    onAnalysis(null);
    setPreview(null);
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
          {/*
            Zona de arrastre, no un botón. Es el gesto que la gente trae
            aprendido de cualquier generador de imágenes, y hacerle buscar un
            botón para abrir un diálogo de archivos es fricción gratuita justo
            en el primer paso.

            Es un `button` de verdad y no un `div` con un manejador: así
            funciona con teclado y lo anuncian los lectores de pantalla sin
            tener que fingirlo con atributos.
          */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragEnter={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              // Solo al salir del contenedor: los hijos disparan `leave` al
              // pasar de uno a otro y el borde parpadearía.
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setDragging(false);
              }
            }}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              const file = [...event.dataTransfer.files].find((candidate) =>
                candidate.type.startsWith("image/"),
              );
              if (file) void handleFile(file);
            }}
            className={[
              "flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors",
              dragging
                ? "border-accent bg-accent-soft"
                : "border-line bg-surface hover:border-ink",
            ].join(" ")}
          >
            <span className="text-accent">
              <svg
                viewBox="0 0 40 20"
                className="h-7 w-auto"
                fill="none"
                aria-hidden
              >
                <circle cx="9" cy="10" r="8" stroke="currentColor" strokeWidth="2.2" />
                <circle cx="31" cy="10" r="8" stroke="currentColor" strokeWidth="2.2" />
                <path
                  d="M17 9.2c2.6-1.6 4.4-1.6 6 0"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <span className="mt-4 font-display text-xl tracking-tight">
              {dragging ? texts.dropActive : texts.dropTitle}
            </span>
            <span className="mt-1 text-sm text-muted">{texts.dropAction}</span>
            <span className="mt-4 text-xs text-muted">{texts.dropPaste}</span>
          </button>

          <ul className="mt-5 grid gap-1.5 text-xs text-muted sm:grid-cols-2">
            {texts.hints.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
            <li>{texts.formats}</li>
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
                alt={texts.chosenPhotoAlt}
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
                {phase === "decoding" ? texts.opening : texts.analyzing}
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
                  {texts.tryAnother}
                </button>
              </>
            )}

            {phase === "done" && profile && (
              <>
                <p className="rule-label text-[0.7rem] text-accent">
                  {texts.yourProfile}
                </p>
                <p className="mt-2 text-sm leading-relaxed">
                  {describeFaceProfile(dict, profile)}
                </p>
                {profile.confidence < 0.5 && (
                  <p className="mt-2 text-xs text-muted">
                    {texts.lowConfidence}
                  </p>
                )}
                <button
                  type="button"
                  onClick={reset}
                  className="mt-4 text-xs text-muted underline decoration-line underline-offset-4 hover:text-ink"
                >
                  {texts.removePhoto}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {phase !== "idle" && (
        <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-muted">
          {texts.notStored}
        </p>
      )}
    </div>
  );
}
