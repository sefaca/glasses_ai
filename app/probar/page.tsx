"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FrameCard } from "@/components/recommendations/FrameCard";
import { CompareTray, MAX_COMPARE } from "@/components/tryon/CompareTray";
import { PhotoAnalyzer } from "@/components/upload/PhotoAnalyzer";
import { FrameGlyph } from "@/components/ui/FrameGlyph";
import { listableFrames } from "@/lib/catalog";
import type { FrameShape } from "@/lib/catalog/types";
import type { FaceSession } from "@/lib/face/analyze";
import { NEUTRAL_FACE } from "@/lib/face/neutral";
import type { UserPreferences } from "@/lib/face/types";
import { getDictionary } from "@/lib/i18n";
import { recommend } from "@/lib/recommendations/score";

/**
 * Selector inicial — CLAUDE.md §8.2.
 *
 * Decisión de funnel: las seis recomendaciones se muestran **antes** de pedir
 * la foto, calculadas con un perfil facial neutro. Dos razones:
 *
 * 1. Enseña el valor antes de pedir lo que más cuesta dar. U1 —que la gente
 *    suba su cara a un dominio desconocido— es la barrera más alta del
 *    producto, y pedirla a cambio de nada la hace más alta.
 * 2. Con perfil neutro la geometría puntúa plano, así que la lista cambia solo
 *    con estilo y presupuesto. Subir la foto es lo que la vuelve personal, y
 *    eso se nota: es el argumento para subirla.
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
  const [styles, setStyles] = useState<string[]>([]);
  const [session, setSession] = useState<FaceSession | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const profile = session?.profile ?? null;

  const prefs: UserPreferences = useMemo(
    () => ({ category: "sunglasses", styles, budgetMaxCents: null }),
    [styles],
  );

  const frames = useMemo(() => listableFrames(), []);
  // Sin foto se usa el perfil neutro, que puntúa la geometría plana: la lista
  // se ordena solo por lo que el usuario ha declarado. Al llegar el perfil
  // real, la geometría entra con su 35 % y la lista cambia — y ese cambio es
  // justo el argumento para subir la foto.
  const recommendations = useMemo(
    () => recommend(profile ?? NEUTRAL_FACE, prefs, frames),
    [profile, prefs, frames],
  );

  // Las recomendaciones están por encima del formulario de foto, porque
  // enseñar el valor antes de pedir la cara es deliberado. La contrapartida es
  // que al analizar, el cambio ocurre fuera de pantalla: por eso se devuelve
  // al usuario a la lista cuando hay perfil.
  const resultsRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!profile) return;
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [profile]);

  // La comparación se vacía en el mismo evento que cambia la foto, no
  // reaccionando a ella con un efecto: sin cara no hay nada sobre lo que
  // superponer, y una selección huérfana solo confunde.
  function handleAnalysis(next: FaceSession | null) {
    setSession(next);
    setSelectedIds([]);
  }

  // La comparación aparece debajo, así que al seleccionar la primera montura
  // hay que llevar al usuario hasta ella. Solo la primera: después ya sabe
  // dónde está, y seguir moviéndole la página sería molesto.
  const compareRef = useRef<HTMLDivElement>(null);
  const hadSelection = useRef(false);
  useEffect(() => {
    const has = selectedIds.length > 0;
    if (has && !hadSelection.current) {
      compareRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    hadSelection.current = has;
  }, [selectedIds]);

  function toggleStyle(id: string) {
    setStyles((current) =>
      current.includes(id)
        ? current.filter((s) => s !== id)
        : [...current, id],
    );
  }

  function toggleCompare(frameId: string) {
    setSelectedIds((current) => {
      if (current.includes(frameId)) {
        return current.filter((id) => id !== frameId);
      }
      // Al llegar al tope entra la nueva y sale la más antigua, en vez de
      // bloquear el botón sin explicar por qué no pasa nada.
      const next = [...current, frameId];
      return next.slice(-MAX_COMPARE);
    });
  }

  const selectedFrames = selectedIds
    .map((id) => frames.find((frame) => frame.id === id))
    .filter((frame): frame is NonNullable<typeof frame> => Boolean(frame));

  const shapeLabels = dict.frames.shapes as Record<string, string>;

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
        <p className="rule-label text-[0.7rem] text-accent">Paso 1 de 2</p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
          Dinos qué buscas y te damos seis.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          Puedes cambiarlo cuando quieras. Después, si subes una foto, afinamos
          la selección con tus proporciones.
        </p>

        {/* ---------- Estilo ---------- */}
        <fieldset className="mt-12 border-t border-line pt-6">
          <legend className="rule-label text-[0.7rem] text-muted">
            Estilo
          </legend>
          <p className="mt-3 text-sm text-muted">
            Elige los que te atraigan, o ninguno y te recomendamos nosotros.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {STYLE_OPTIONS.map((option) => {
              const active = styles.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleStyle(option.id)}
                  className={[
                    "rounded-full border px-5 py-2.5 text-sm transition-all active:translate-y-px",
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

        {/*
          Aquí había un selector de presupuesto. Retirado: con un catálogo de
          muestra y sin precios a la vista (D-019) no aportaba nada.
          La capacidad sigue en el dominio —`budgetMaxCents` y el filtro duro,
          con tests— y vuelve cuando haya catálogo real con precios del feed.
        */}

        {/* ---------- Resultados ---------- */}
        <section ref={resultsRef} className="mt-16" aria-live="polite">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4">
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

          {recommendations.length > 0 && (
            // Honestidad explícita: el catálogo de hoy es una muestra propia de
            // desarrollo, no producto comprable.
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Catálogo de muestra: estas monturas son nuestras, de desarrollo.
              Todavía no hay producto comprable.
            </p>
          )}

          {recommendations.length === 0 ? (
            <p className="py-14 text-sm text-muted">
              Prueba a subir el presupuesto o a quitar algún estilo. El catálogo
              es pequeño a propósito: {frames.length} monturas, todas revisadas.
            </p>
          ) : (
            <div className="mt-2 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((rec) => (
                <FrameCard
                  key={rec.frame.id}
                  frame={rec.frame}
                  score={rec.score}
                  position={rec.position}
                  shapeLabel={
                    dict.frames.shapes[rec.frame.shape as FrameShape]
                  }
                  selected={selectedIds.includes(rec.frame.id)}
                  canSelect={session !== null}
                  onToggle={toggleCompare}
                />
              ))}
            </div>
          )}
        </section>

        {/* ---------- Foto ---------- */}
        <section
          id="foto"
          className="mt-20 rounded-2xl border border-line bg-surface p-7 sm:p-10"
        >
          <p className="rule-label text-[0.7rem] text-accent">Paso 2 de 2</p>
          <h2 className="mt-4 max-w-lg font-display text-2xl leading-tight tracking-tight sm:text-3xl">
            {profile
              ? "Selección afinada con tus proporciones."
              : "Sube una foto y afinamos la selección con tus proporciones."}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
            El análisis se ejecuta en tu navegador: la foto no sale de tu
            dispositivo.
          </p>
          <div className="mt-7">
            <PhotoAnalyzer onAnalysis={handleAnalysis} />
          </div>
        </section>

        {/* ---------- Comparación sobre la foto ---------- */}
        <div ref={compareRef}>
          {session && (
            <CompareTray
              photoUrl={session.photoUrl}
              placement={session.placement}
              frames={selectedFrames}
              shapeLabels={shapeLabels}
              onRemove={toggleCompare}
              onClear={() => setSelectedIds([])}
            />
          )}
        </div>
      </main>
    </div>
  );
}
