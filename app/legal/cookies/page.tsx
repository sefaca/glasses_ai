import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cookies" };

export default function CookiesPage() {
  return (
    <>
      <p className="rule-label text-[0.7rem] text-accent">Cookies</p>
      <h1 className="mt-4">Cookies y almacenamiento</h1>

      <p>
        Hoy este sitio <strong>no instala ninguna cookie</strong> y no usa
        analítica de terceros. Tampoco hay un banner de consentimiento, porque
        no habría nada que consentir.
      </p>

      <h2>Qué se usará cuando haya producto</h2>
      <ul>
        <li>
          Una cookie técnica de sesión anónima, para no exigir registro y poder
          aplicar límites de uso. Sin ella el producto no puede funcionar.
        </li>
        <li>
          Almacenamiento local en tu navegador para recordar las preferencias
          que elijas, que nunca sale de tu dispositivo.
        </li>
        <li>
          Analítica de producto sin contenido facial y sin identificarte
          personalmente, para medir el embudo.
        </li>
      </ul>
      <p>
        Lo que requiera consentimiento se pedirá antes de instalarse, no
        después.
      </p>

      <h2>Estado de este documento</h2>
      <p>Pendiente de revisión jurídica profesional.</p>
    </>
  );
}
