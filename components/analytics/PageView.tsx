"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics/client";
import type { EventName, EventProps } from "@/lib/analytics/events";

/**
 * Emite una vista de página desde un componente servidor.
 *
 * Es un cliente mínimo y sin interfaz: existe solo porque un evento necesita
 * ejecutarse en el navegador y las páginas de contenido son de servidor.
 *
 * El `ref` evita el doble disparo del modo estricto de React en desarrollo,
 * que si no infla todas las métricas por dos y hace que los primeros datos
 * no se parezcan a la realidad.
 */
export function PageView({
  name,
  props,
}: {
  name: EventName;
  props?: EventProps;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    track(name, props);
    // Las props vienen de parámetros de ruta y no cambian sin remontar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
