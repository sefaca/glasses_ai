"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { BrandPicker } from "@/components/brands/BrandPicker";
import { AccessGate } from "@/components/flow/AccessGate";
import { StepHeader } from "@/components/flow/StepHeader";
import { StaggerItem, StepPanel } from "@/components/flow/StepPanel";
import { FrameCard } from "@/components/recommendations/FrameCard";
import {
  MAX_COMPARE,
  ResultGrid,
  type GenerationState,
} from "@/components/tryon/ResultGrid";
import { PhotoAnalyzer } from "@/components/upload/PhotoAnalyzer";
import { FrameGlyph } from "@/components/ui/FrameGlyph";
import { brandsWithFrames, listableFrames } from "@/lib/catalog";
import type { FrameShape } from "@/lib/catalog/types";
import type { FaceSession } from "@/lib/face/analyze";
import { NEUTRAL_FACE } from "@/lib/face/neutral";
import type { UserPreferences } from "@/lib/face/types";
import { track } from "@/lib/analytics/client";
import { format, type Dictionary, type Locale, localePath } from "@/lib/i18n";
import {
  suggestBrands,
  suggestionsAreMeaningful,
} from "@/lib/recommendations/brands";
import { recommend } from "@/lib/recommendations/score";
import { readAccessCode, requestTryOn } from "@/lib/tryon/client";

/**
 * Flujo de una sola pantalla: **foto → marcas → elegir → resultado**.
 *
 * Antes era una página larga con secciones apiladas, y obligaba a scrollear
 * buscando qué venía después. Ahora se comporta como un generador de
 * imágenes: un panel, un paso cada vez, y al completar uno se pasa al
 * siguiente sin moverse del sitio.
 *
 * El estado de generación vive aquí, no en la rejilla de resultados, porque
 * quien recibe el click es la tarjeta de recomendación. Así la petición se
 * dispara desde un manejador y no desde un efecto.
 */

const STEP_IDS = ["photo", "brands", "choose", "result"] as const;

const STYLE_IDS = [
  "clasicas",
  "modernas",
  "oversized",
  "minimalistas",
  "retro",
  "deportivas",
] as const;

export function TryFlow({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const steps = STEP_IDS.map((id, i) => ({ id, label: dict.flow.steps[i]! }));
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  // Avanzar y retroceder tienen que sentirse distintos, o se pierde la noción
  // de dónde se está en el flujo.
  const [direction, setDirection] = useState(1);

  const [session, setSession] = useState<FaceSession | null>(null);
  const [brandIds, setBrandIds] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [chosenIds, setChosenIds] = useState<string[]>([]);
  const [generations, setGenerations] = useState<
    Record<string, GenerationState | undefined>
  >({});
  /** Montura que espera a que se introduzca el código de acceso. */
  const [pendingAccess, setPendingAccess] = useState<{
    frameId: string;
    retry: boolean;
  } | null>(null);

  const profile = session?.profile ?? null;
  const shapeLabels = dict.frames.shapes as Record<string, string>;

  const allFrames = useMemo(() => listableFrames(), []);
  const allBrands = useMemo(() => brandsWithFrames(), []);

  const prefs: UserPreferences = useMemo(
    () => ({ category: "sunglasses", styles, budgetMaxCents: null }),
    [styles],
  );

  const suggestions = useMemo(
    () => suggestBrands(profile ?? NEUTRAL_FACE, prefs, allFrames, allBrands),
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

  const chosenFrames = chosenIds
    .map((id) => allFrames.find((frame) => frame.id === id))
    .filter((frame): frame is NonNullable<typeof frame> => Boolean(frame));

  function goTo(index: number) {
    setDirection(index >= step ? 1 : -1);
    setStep(index);
    setReached((current) => Math.max(current, index));
    // Se emiten aqui, en el manejador, y no en un efecto: un efecto se
    // dispararia tambien al volver atras y al rehidratar.
    if (index === 2 && reached < 2) {
      track("recommendations_viewed", { count: recommendations.length });
    }
    if (index === 3 && chosenIds.length > 1) {
      track("compare_opened", { count: chosenIds.length });
    }
  }

  const startGeneration = useCallback(
    async (frameId: string) => {
      if (!session) return;
      setGenerations((current) => ({
        ...current,
        [frameId]: { phase: "generating" },
      }));
      track("try_on_started", { frameId });
      const startedAt = Date.now();

      // Si había código guardado y aun así se rechaza, es que está mal.
      const hadCode = Boolean(readAccessCode());
      const result = await requestTryOn(
        frameId,
        session.photo,
        dict.tryOn.errors,
      );

      if (result.status === "needs-access") {
        // Sin estado de fallo: no ha fallado nada, falta un paso. La tarjeta
        // vuelve a quedar como estaba y el panel pide el código.
        setGenerations((current) => {
          const next = { ...current };
          delete next[frameId];
          return next;
        });
        setPendingAccess({ frameId, retry: hadCode });
        track("try_on_failed", { frameId, errorCode: "access_denied" });
        return;
      }

      track(
        result.status === "completed" ? "try_on_completed" : "try_on_failed",
        {
          frameId,
          durationMs: Date.now() - startedAt,
          ...(result.status === "failed" ? { errorCode: "provider" } : {}),
        },
      );

      setGenerations((current) => ({
        ...current,
        [frameId]:
          result.status === "completed"
            ? {
                phase: "done",
                url: result.resultUrl,
                labelAsProduct: result.labelAsProduct,
              }
            : { phase: "failed", message: result.message },
      }));
    },
    [session, dict],
  );

  function handleAnalysis(next: FaceSession | null) {
    setSession(next);
    setChosenIds([]);
    setGenerations({});
    // Al completar el paso 1 se avanza solo: es lo que hace que el flujo se
    // sienta de una sola pantalla y no de una página con secciones.
    if (next) goTo(1);
  }

  /** Elegir una montura genera directamente y lleva al resultado. */
  function chooseFrame(frameId: string) {
    track("recommendation_clicked", { frameId });
    setChosenIds((current) => {
      if (current.includes(frameId)) return current;
      return [...current, frameId].slice(-MAX_COMPARE);
    });
    void startGeneration(frameId);
    goTo(3);
  }

  function removeFrame(frameId: string) {
    setChosenIds((current) => current.filter((id) => id !== frameId));
    setGenerations((current) => {
      const next = { ...current };
      delete next[frameId];
      return next;
    });
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

  return (
    <div className="min-h-dvh">
      {pendingAccess && (
        <AccessGate
          retry={pendingAccess.retry}
          dict={dict}
          lang={lang}
          onSubmit={() => {
            const { frameId } = pendingAccess;
            setPendingAccess(null);
            void startGeneration(frameId);
          }}
          onCancel={() => setPendingAccess(null)}
        />
      )}

      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6 sm:px-8">
        <Link
          href={localePath(lang)}
          aria-label={dict.common.home}
          className="text-accent"
        >
          <FrameGlyph shape="round" thickness={0.3} className="h-6 w-auto" />
        </Link>
        <Link
          href={localePath(lang)}
          className="text-sm text-muted hover:text-ink"
        >
          {dict.common.exit}
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-24 sm:px-8">
        <div className="rounded-2xl border border-line bg-surface p-6 sm:p-9">
          <StepHeader
            steps={steps}
            currentIndex={step}
            reachedIndex={reached}
            onNavigate={goTo}
          />

          <div className="mt-8">
            <StepPanel stepKey={steps[step]!.id} direction={direction}>
            {/* ---------- 1 · Foto ---------- */}
            {step === 0 && (
              <section>
                <h1 className="max-w-lg font-display text-3xl leading-tight tracking-tight text-balance sm:text-4xl">
                  {dict.flow.photo.title}
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                  {dict.flow.photo.subtitle}
                </p>
                <div className="mt-7">
                  <PhotoAnalyzer onAnalysis={handleAnalysis} dict={dict} />
                </div>
              </section>
            )}

            {/* ---------- 2 · Marcas ---------- */}
            {step === 1 && (
              <section>
                <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
                  {dict.flow.brands.title}
                </h2>
                <p className="mt-3 max-w-xl text-sm text-muted">
                  {dict.flow.brands.subtitle}
                </p>

                <div className="mt-7">
                  <BrandPicker
                    suggestions={suggestions}
                    personalised={personalised}
                    selectedIds={brandIds}
                    onToggle={(id) => toggleIn(setBrandIds, id)}
                    onClear={() => setBrandIds([])}
                    shapeLabels={shapeLabels}
                    dict={dict}
                  />
                </div>

                <fieldset className="mt-9">
                  <legend className="rule-label text-[0.7rem] text-muted">
                    {dict.flow.brands.styleLegend}
                  </legend>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {STYLE_IDS.map((styleId) => {
                      const active = styles.includes(styleId);
                      return (
                        <button
                          key={styleId}
                          type="button"
                          aria-pressed={active}
                          onClick={() => toggleIn(setStyles, styleId)}
                          className={[
                            "rounded-full border px-4 py-2 text-sm transition-all active:translate-y-px",
                            active
                              ? "border-accent bg-accent text-on-accent"
                              : "border-line hover:border-ink",
                          ].join(" ")}
                        >
                          {dict.flow.styles[styleId]}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-9 flex items-center justify-between border-t border-line pt-6">
                  <button
                    type="button"
                    onClick={() => goTo(0)}
                    className="text-sm text-muted hover:text-ink"
                  >
                    {dict.flow.brands.changePhoto}
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(2)}
                    className="rounded-full bg-accent px-7 py-3 text-sm font-medium text-on-accent transition-transform active:translate-y-px"
                  >
                    {dict.flow.brands.next}
                  </button>
                </div>
              </section>
            )}

            {/* ---------- 3 · Elegir ---------- */}
            {step === 2 && (
              <section>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
                    {recommendations.length === 0
                      ? dict.flow.choose.empty
                      : dict.flow.choose.title}
                  </h2>
                  <p className="text-xs text-muted">{dict.flow.choose.hint}</p>
                </div>

                {recommendations.length === 0 ? (
                  <p className="py-12 text-sm text-muted">
                    {format(dict.flow.choose.emptyBody, {
                      frames: allFrames.length,
                      brands: allBrands.length,
                    })}
                  </p>
                ) : (
                  <div className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                    {recommendations.map((rec, index) => (
                      <StaggerItem key={rec.frame.id} index={index}>
                        <FrameCard
                          frame={rec.frame}
                          score={rec.score}
                          position={rec.position}
                          shapeLabel={
                            shapeLabels[rec.frame.shape as FrameShape]!
                          }
                          dict={dict}
                          selected={chosenIds.includes(rec.frame.id)}
                          canSelect
                          onToggle={chooseFrame}
                        />
                      </StaggerItem>
                    ))}
                  </div>
                )}

                <div className="mt-9 flex items-center justify-between border-t border-line pt-6">
                  <button
                    type="button"
                    onClick={() => goTo(1)}
                    className="text-sm text-muted hover:text-ink"
                  >
                    {dict.flow.choose.back}
                  </button>
                  {chosenIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => goTo(3)}
                      className="rounded-full border border-ink px-6 py-3 text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
                    >
                      {format(dict.flow.choose.seeResults, {
                        count: chosenIds.length,
                      })}
                    </button>
                  )}
                </div>
              </section>
            )}

            {/* ---------- 4 · Resultado ---------- */}
            {step === 3 && session && (
              <section>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
                    {chosenFrames.length > 1
                      ? dict.flow.result.titleMany
                      : dict.flow.result.titleOne}
                  </h2>
                  <p className="text-xs text-muted">
                    {format(dict.flow.result.counter, {
                      chosen: chosenFrames.length,
                      max: MAX_COMPARE,
                    })}
                  </p>
                </div>

                <div className="mt-6">
                  <ResultGrid
                    photoUrl={session.photoUrl}
                    placement={session.placement}
                    frames={chosenFrames}
                    states={generations}
                    shapeLabels={shapeLabels}
                    dict={dict}
                    onRetry={(id) => void startGeneration(id)}
                    onRemove={removeFrame}
                  />
                </div>

                {chosenFrames.length === 0 && (
                  <p className="py-12 text-sm text-muted">
                    {dict.flow.result.empty}
                  </p>
                )}

                <div className="mt-9 flex items-center justify-between border-t border-line pt-6">
                  <button
                    type="button"
                    onClick={() => goTo(2)}
                    className="text-sm text-muted hover:text-ink"
                  >
                    {dict.flow.result.back}
                  </button>
                  {chosenFrames.length < MAX_COMPARE && (
                    <button
                      type="button"
                      onClick={() => goTo(2)}
                      className="rounded-full border border-ink px-6 py-3 text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
                    >
                      {dict.flow.result.another}
                    </button>
                  )}
                </div>
              </section>
            )}
            </StepPanel>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-5xl px-1 text-xs leading-relaxed text-muted">
          {dict.flow.disclaimer}
        </p>
      </main>
    </div>
  );
}
