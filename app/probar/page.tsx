"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { BrandPicker } from "@/components/brands/BrandPicker";
import { FrameCard } from "@/components/recommendations/FrameCard";
import { CompareTray, MAX_COMPARE } from "@/components/tryon/CompareTray";
import { PhotoAnalyzer } from "@/components/upload/PhotoAnalyzer";
import { FrameGlyph } from "@/components/ui/FrameGlyph";
import { brandsWithFrames, listableFrames } from "@/lib/catalog";
import type { FrameShape } from "@/lib/catalog/types";
import type { FaceSession } from "@/lib/face/analyze";
import { NEUTRAL_FACE } from "@/lib/face/neutral";
import type { UserPreferences } from "@/lib/face/types";
import { getDictionary } from "@/lib/i18n";
import {
  suggestBrands,
  suggestionsAreMeaningful,
} from "@/lib/recommendations/brands";
import { recommend } from "@/lib/recommendations/score";

/**
 * El flujo: **foto → marcas → simulaciones**.
 *
 * Es el orden en que se compran gafas de verdad, y corrige el que tenía
 * antes. Yo había puesto las recomendaciones primero para bajar la barrera de
 * subir la foto, pero ese trabajo le corresponde a la landing —enseñar qué
 * vas a obtener— y aquí sobra: quien llega a esta página ya ha decidido
 * probar.
 *
 * Poner la foto primero además desbloquea lo que hace útil al paso 2:
 * **sugerir marcas según tus proporciones**, que sin cara no se puede hacer
 * sin mentir.
 */

const dict = getDictionary("es");

const STYLE_OPTIONS = [
  { id: "clasicas", label: "Clásicas" },
  { id: "modernas", label: "Modernas" },
  { id: "oversized", label: "Oversized" },
  { id: "minimalistas", label: "Minimalistas" },
  { id: "retro", label: "Retro" },
  { id: "deportivas", label: "Deportivas" },
] as const;

export default function ProbarPage() {
  const [session, setSession] = useState<FaceSession | null>(null);
  const [brandIds, setBrandIds] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const profile = session?.profile ?? null;
  const shapeLabels = dict.frames.shapes as Record<string, string>;

  const allFrames = useMemo(() => listableFrames(), []);
  const allBrands = useMemo(() => brandsWithFrames(), []);

  const prefs: UserPreferences = useMemo(
    () => ({ category: "sunglasses", styles, budgetMaxCents: null }),
    [styles],
  );

  // Las marcas se ordenan por cómo puntúa su catálogo contra esta cara. Sin
  // cara todas empatan, y entonces no se presentan como personalizadas.
  const suggestions = useMemo(
    () =>
      suggestBrands(profile ?? NEUTRAL_FACE, prefs, allFrames, allBrands),
    [profile, prefs, allFrames, allBrands],
  );
  const personalised = useMemo(
    () => Boolean(profile) && suggestionsAreMeaningful(suggestions),
    [profile, suggestions],
  );

  const frames = useMemo(
    () =>
      brandIds.length === 0
        ? allFrames
        : allFrames.filter((frame) => brandIds.includes(frame.brandId)),
    [allFrames, brandIds],
  );

  const recommendations = useMemo(
    () => recommend(profile ?? NEUTRAL_FACE, prefs, frames),
    [profile, prefs, frames],
  );

  const compareFrames = compareIds
    .map((id) => allFrames.find((frame) => frame.id === id))
    .filter((frame): frame is NonNullable<typeof frame> => Boolean(frame));

  // La comparación aparece al final, así que al elegir la primera montura hay
  // que llevar al usuario hasta ella. Solo la primera: después ya sabe dónde
  // está y seguir moviéndole la página sería molesto.
  const compareRef = useRef<HTMLDivElement>(null);
  const hadSelection = useRef(false);
  useEffect(() => {
    const has = compareIds.length > 0;
    if (has && !hadSelection.current) {
      compareRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    hadSelection.current = has;
  }, [compareIds]);

  function handleAnalysis(next: FaceSession | null) {
    setSession(next);
    // Sin cara no hay nada sobre lo que superponer: una selección huérfana
    // solo confunde.
    setCompareIds([]);
  }

  function toggleIn(
    setter: (updater: (current: string[]) => string[]) => void,
    id: string,
  ) {
    setter((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }

  function toggleCompare(frameId: string) {
    setCompareIds((current) => {
      if (current.includes(frameId)) {
        return current.filter((id) => id !== frameId);
      }
      // Al llegar al tope entra la nueva y sale la más antigua, en vez de
      // bloquear el botón sin explicar por qué no pasa nada.
      return [...current, frameId].slice(-MAX_COMPARE);
    });
  }

  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/" aria-label="Inicio" className="text-accent">
          <FrameGlyph shape="round" thickness={0.3} className="h-6 w-auto" />
        </Link>
        <Link href="/" className="text-sm text-muted hover:text-ink">
          Volver
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <h1 className="max-w-2xl font-display text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
          Sube una foto y te decimos qué probarte.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          El análisis se ejecuta en tu navegador: la foto no sale de tu
          dispositivo.
        </p>

        {/* ---------- Paso 1 · Foto ---------- */}
        <section
          id="foto"
          className="mt-12 rounded-2xl border border-line bg-surface p-7 sm:p-10"
        >
          <p className="rule-label text-[0.7rem] text-accent">Paso 1</p>
          <h2 className="mt-3 font-display text-2xl tracking-tight">
            Tu foto
          </h2>
          <div className="mt-6">
            <PhotoAnalyzer onAnalysis={handleAnalysis} />
          </div>
        </section>

        {/* ---------- Paso 2 · Marcas ---------- */}
        <section className="mt-14 border-t border-line pt-8">
          <p className="rule-label text-[0.7rem] text-accent">Paso 2</p>
          <h2 className="mt-3 font-display text-2xl tracking-tight">
            Marcas
          </h2>
          <p className="mt-3 max-w-xl text-sm text-muted">
            Elige las que te interesen, o déjalo en blanco y miramos todo el
            catálogo.
          </p>

          <div className="mt-7">
            <BrandPicker
              suggestions={suggestions}
              personalised={personalised}
              selectedIds={brandIds}
              onToggle={(id) => toggleIn(setBrandIds, id)}
              onClear={() => setBrandIds([])}
              shapeLabels={shapeLabels}
            />
          </div>

          <fieldset className="mt-10">
            <legend className="rule-label text-[0.7rem] text-muted">
              Estilo, si tienes preferencia
            </legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {STYLE_OPTIONS.map((option) => {
                const active = styles.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleIn(setStyles, option.id)}
                    className={[
                      "rounded-full border px-4 py-2 text-sm transition-all active:translate-y-px",
                      active
                        ? "border-accent bg-accent text-on-accent"
                        : "border-line hover:border-ink",
                    ].join(" ")}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </section>

        {/* ---------- Paso 3 · Recomendaciones ---------- */}
        <section className="mt-14 border-t border-line pt-8" aria-live="polite">
          <p className="rule-label text-[0.7rem] text-accent">Paso 3</p>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4">
            <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
              {recommendations.length === 0
                ? "Nada encaja con ese filtro"
                : profile
                  ? "Tus seis"
                  : "Empezaría por estas"}
            </h2>
            <p className="text-xs text-muted">
              {profile
                ? "Afinadas con tus proporciones"
                : "Selección orientativa, sin tu foto todavía"}
            </p>
          </div>

          {recommendations.length === 0 ? (
            <p className="py-14 text-sm text-muted">
              Prueba a quitar alguna marca o algún estilo. El catálogo tiene{" "}
              {allFrames.length} monturas de {allBrands.length} marcas.
            </p>
          ) : (
            <>
              <div className="mt-2 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommendations.map((rec) => (
                  <FrameCard
                    key={rec.frame.id}
                    frame={rec.frame}
                    score={rec.score}
                    position={rec.position}
                    shapeLabel={shapeLabels[rec.frame.shape as FrameShape]!}
                    selected={compareIds.includes(rec.frame.id)}
                    canSelect={session !== null}
                    onToggle={toggleCompare}
                  />
                ))}
              </div>

              <p className="mt-8 text-xs leading-relaxed text-muted">
                Catálogo en construcción: tenemos marca, modelo y referencia,
                pero todavía no sus imágenes oficiales ni sus precios. Las
                monturas se dibujan con nuestro propio esquema.
              </p>
            </>
          )}
        </section>

        {/* ---------- Comparación sobre la foto ---------- */}
        <div ref={compareRef}>
          {session && (
            <CompareTray
              photoUrl={session.photoUrl}
              placement={session.placement}
              frames={compareFrames}
              shapeLabels={shapeLabels}
              onRemove={toggleCompare}
              onClear={() => setCompareIds([])}
            />
          )}
        </div>
      </main>
    </div>
  );
}
