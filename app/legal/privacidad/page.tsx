import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacidad" };

/**
 * Describe lo que el sistema hace **hoy**, no lo que hará.
 *
 * Deliberadamente no contiene texto legal de plantilla: una política inventada
 * es peor que no tener ninguna, porque afirma compromisos que nadie ha
 * revisado. CLAUDE.md §14 exige revisión profesional antes de producción, y
 * hasta entonces esto es una descripción técnica honesta.
 */
export default function PrivacidadPage() {
  return (
    <>
      <p className="rule-label text-[0.7rem] text-accent">Privacidad</p>
      <h1 className="mt-4">Qué hacemos con tu foto</h1>

      <p>
        Este sitio está en fase de validación y todavía no acepta fotos. Lo que
        sigue describe cómo está diseñado el tratamiento, para que puedas
        juzgarlo antes de que exista.
      </p>

      <h2>Análisis de proporciones</h2>
      <p>
        Las proporciones faciales se calculan <strong>en tu navegador</strong>.
        Lo único que viaja a nuestro servidor es un conjunto de unas veinte
        proporciones adimensionales —relaciones entre anchos y altos— sin
        ninguna imagen asociada.
      </p>
      <p>
        Es una decisión de arquitectura para minimizar la exposición, no una
        afirmación jurídica: no damos por hecho que unas medidas derivadas del
        rostro queden fuera de la normativa de protección de datos. La
        clasificación legal la revisará un profesional antes de que el producto
        se abra al público.
      </p>

      <h2>Prueba virtual</h2>
      <p>
        Si pides probarte una montura, la imagen sí tiene que salir del
        dispositivo para procesarse. En ese caso irá a un almacenamiento
        privado, con enlaces firmados de caducidad corta, y se eliminará junto
        con los resultados derivados pasado un plazo breve. Antes de que eso
        ocurra verás qué proveedor la procesa y durante cuánto tiempo se
        conserva.
      </p>

      <h2>Lo que no hacemos</h2>
      <ul>
        <li>No hacemos reconocimiento de identidad ni buscamos quién eres.</li>
        <li>No inferimos atributos personales sensibles a partir de tu cara.</li>
        <li>No entrenamos modelos con tus fotos.</li>
        <li>No vendemos datos ni los usamos para publicidad personalizada.</li>
        <li>No guardamos imágenes faciales en registros ni en analítica.</li>
        <li>No conservamos tu foto «por si acaso».</li>
      </ul>

      <h2>Estado de este documento</h2>
      <p>
        Pendiente de revisión jurídica profesional. No es todavía una política
        de privacidad completa y no pretende pasar por una.
      </p>
    </>
  );
}
