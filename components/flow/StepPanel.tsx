"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Transición entre pasos del flujo.
 *
 * Justifica una dependencia porque con CSS solo no se puede: una animación de
 * **salida** necesita que el elemento siga montado mientras se va, y React lo
 * desmonta en cuanto cambia el estado. `AnimatePresence` existe justo para
 * eso → CLAUDE.md regla 2.
 *
 * La dirección importa: avanzar y retroceder tienen que sentirse distintos, o
 * el usuario pierde la noción de dónde está en el flujo.
 *
 * La altura se anima también, porque los pasos miden cosas muy distintas —el
 * de la foto es corto, el de las seis monturas es largo— y sin ello el panel
 * da un salto brusco.
 */

interface StepPanelProps {
  /** Clave del paso. Al cambiar, se dispara la transición. */
  stepKey: string;
  /** 1 avanzando, -1 retrocediendo. */
  direction: number;
  children: ReactNode;
}

export function StepPanel({ stepKey, direction, children }: StepPanelProps) {
  const reduced = useReducedMotion();
  const shift = reduced ? 0 : 24;

  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div
        key={stepKey}
        custom={direction}
        initial={{ opacity: 0, x: direction * shift }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction * -shift }}
        transition={{
          duration: reduced ? 0 : 0.26,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Entrada escalonada para listas.
 *
 * Una rejilla de seis tarjetas que aparece de golpe se lee como un parpadeo;
 * escalonada se lee como que algo se ha calculado. El retardo es corto a
 * propósito: lo contrario es hacer esperar al usuario por una animación.
 */
export function StaggerItem({
  index,
  children,
}: {
  index: number;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduced ? 0 : 0.35,
        delay: reduced ? 0 : Math.min(index * 0.045, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
