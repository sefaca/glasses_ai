"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FrameCard } from "@/components/recommendations/FrameCard";
import { FrameGlyph } from "@/components/ui/FrameGlyph";
import { listableFrames } from "@/lib/catalog";
import type { FrameShape } from "@/lib/catalog/types";
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

const BUDGET_OPTIONS = [
  { id: 5000, label: "Menos de 50 €" },
  { id: 10000, label: "50 – 100 €" },
  { id: 20000, label: "100 – 200 €" },
  { id: null, label: "Sin límite" },
] as const;

export default function ProbarPage() {
  const [styles, setStyles] = useState<string[]>([]);
  const [budgetMaxCents, setBudget] = useState<number | null>(null);

  const prefs: UserPreferences = useMemo(
    () => ({ category: "sunglasses", styles, budgetMaxCents }),
    [styles, budgetMaxCents],
  );

  const frames = useMemo(() => listableFrames(), []);
  const recommendations = useMemo(
    () => recommend(NEUTRAL_FACE, prefs, frames),
    [prefs, frames],
  );

  function toggleStyle(id: string) {
    setStyles((current) =>
      current.includes(id)
        ? current.filter((s) => s !== id)
        : [...current, id],
    );
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

        {/* ---------- Presupuesto ---------- */}
        <fieldset className="mt-10 border-t border-line pt-6">
          <legend className="rule-label text-[0.7rem] text-muted">
            Presupuesto
          </legend>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {BUDGET_OPTIONS.map((option) => {
              const active = budgetMaxCents === option.id;
              return (
                <button
                  key={String(option.id)}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setBudget(option.id)}
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

        {/* ---------- Resultados ---------- */}
        <section className="mt-16" aria-live="polite">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4">
            <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
              {recommendations.length === 0
                ? "Nada encaja con ese filtro"
                : "Empezaría por estas"}
            </h2>
            <p className="text-xs text-muted">
              Selección orientativa, sin tu foto todavía
            </p>
          </div>

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
                />
              ))}
            </div>
          )}
        </section>

        {/* ---------- Siguiente paso ---------- */}
        <section className="mt-20 rounded-2xl border border-line bg-surface p-7 sm:p-10">
          <p className="rule-label text-[0.7rem] text-accent">Paso 2 de 2</p>
          <h2 className="mt-4 max-w-lg font-display text-2xl leading-tight tracking-tight sm:text-3xl">
            Sube una foto y afinamos la selección con tus proporciones.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
            El análisis se ejecuta en tu navegador: para ese paso la foto no sale
            de tu dispositivo. {dict.privacy.link.toLowerCase()}.
          </p>
          <p className="mt-6 inline-block rounded-full border border-dashed border-line px-6 py-3 text-sm text-muted">
            Subida de foto — en construcción
          </p>
        </section>
      </main>
    </div>
  );
}
