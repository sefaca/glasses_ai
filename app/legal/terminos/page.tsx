import type { Metadata } from "next";

export const metadata: Metadata = { title: "Términos" };

export default function TerminosPage() {
  return (
    <>
      <p className="rule-label text-[0.7rem] text-accent">Términos</p>
      <h1 className="mt-4">Condiciones de uso</h1>

      <p>
        El sitio está en fase de validación. No hay servicio contratable, no se
        aceptan pagos y no se procesan datos de usuarios.
      </p>

      <h2>Qué es este sitio</h2>
      <p>
        Una capa independiente de descubrimiento de gafas. No vendemos
        monturas, no somos una óptica y no tenemos relación comercial con las
        marcas que puedan aparecer. Cuando exista, el enlace de compra llevará a
        la tienda del tercero, que es quien vende y a cuyas condiciones queda
        sujeta la compra.
      </p>

      <h2>Sobre las recomendaciones y las pruebas virtuales</h2>
      <p>
        Las recomendaciones son orientativas. No son una medición ni un consejo
        profesional, y no afirmamos que una montura sea objetivamente la que
        mejor te queda.
      </p>
      <p>
        Cualquier prueba virtual es una <strong>simulación</strong> y se
        identifica como tal. No sustituye a probarse la montura.
      </p>

      <h2>Marcas de terceros</h2>
      <p>
        Las marcas y modelos que aparezcan son propiedad de sus titulares. Su
        mención no implica acuerdo, patrocinio ni asociación, y no presentamos
        como socio a nadie con quien no tengamos un acuerdo.
      </p>

      <h2>Estado de este documento</h2>
      <p>
        Pendiente de revisión jurídica profesional. No es todavía un documento
        contractual completo.
      </p>
    </>
  );
}
