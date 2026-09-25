# AI Eyewear Finder (nombre provisional)

Web B2C para descubrir gafas de sol que encajen contigo, probártelas virtualmente sobre tu propia foto y llegar al sitio donde comprarlas.

> **Estado actual: Fase 0 — validación. No hay código todavía, y es intencionado.**
> No se escribe una línea de aplicación hasta que el Sprint 0 pase los criterios GO de abajo.

---

## Qué es esto

Una capa independiente de descubrimiento de eyewear, multi-marca. No es una óptica, no es un plugin de ecommerce y no es un generador de imágenes genérico.

El flujo que define el producto:

```
foto -> análisis -> 6 recomendaciones explicadas -> try-on -> comparar -> click al retailer
```

El contexto completo de producto, negocio, arquitectura y reglas está en [CLAUDE.md](CLAUDE.md). Ese es el documento maestro: si algo de este README y de CLAUDE.md se contradice, manda CLAUDE.md.

## Qué NO es

- No es una app nativa.
- No es un producto B2B para ópticas ni retailers.
- No es un SaaS de suscripción.
- No es «una IA que analiza caras». La IA es el mecanismo; lo que compra el usuario es confianza para elegir.

---

## Fase 0 — Sprint 0 de validación (2 días)

El objetivo no es construir, es matar o confirmar el proyecto rápido y barato.

| # | Bloque | Salida |
|---|---|---|
| 1 | Benchmark de proveedores de try-on | Fidelidad, latencia y €/try-on medidos sobre monturas reales |
| 2 | Keyword research real (no Google Trends) | Volumen, CPC y dificultad por cluster, ES + MX |
| 3 | Programas de afiliación de eyewear | Retailers con programa activo, comisión y cookie verificadas |
| 4 | Benchmark de competidores | Tabla comparativa de flujo, precio y privacidad |
| 5 | Smoke test de demanda | CTR y coste por email de lista de espera |
| 6 | Test cualitativo (5 personas) | ¿Subirían su foto? ¿El resultado les ayuda a decidir? |
| 7 | Unit economics | Contribución por usuario activo en 3 escenarios |
| 8 | Dominio y marca | 3 finalistas verificados, 1 dominio comprado |

### Criterios GO / NO-GO

**Puertas técnicas — las tres deben pasar:**

- **Fidelidad:** ≥70 % de las combinaciones con la montura real reconocible.
- **Coste:** ≤0,10 € por try-on a precio de lista.
- **Latencia:** p50 ≤12 s, p95 ≤25 s.

**Puertas de negocio — al menos 3 de 4:**

- **Afiliación:** ≥3 retailers con programa activo que acepten sitio nuevo, comisión ≥5 %, cookie ≥7 días.
- **Demanda:** ≥15 % de clic en el CTA principal del smoke test y coste por email <3 €.
- **Credibilidad:** ≥3 de 5 personas subirían su foto y dirían que el resultado les ayuda a decidir.
- **Economía unitaria:** contribución por usuario activo positiva en escenario base.

Si falla cualquiera de las tres puertas técnicas, el proyecto no arranca en esta forma.

---

## Stack previsto (aún no instalado)

Next.js (App Router) · TypeScript · Tailwind · Supabase (Postgres + Storage privado) · Vercel · Stripe cuando haya monetización · proveedor de try-on detrás de un adapter intercambiable.

Decisión de privacidad que condiciona la arquitectura: **los landmarks faciales se calculan en el navegador**. La foto solo sale del dispositivo si el usuario pide un try-on, va a un bucket privado con TTL corto y se borra después.

## Estructura actual

```
.
├── CLAUDE.md     # documento maestro de producto y arquitectura
├── README.md     # este archivo
└── .gitignore
```

---

## Privacidad

Se manejan fotografías faciales. Reglas no negociables desde el día 1: bucket privado, signed URLs con expiración, borrado duro por TTL, sin reconocimiento de identidad, sin inferencia de atributos sensibles, sin entrenar modelos con las fotos, y sin fotos ni contenido facial en logs ni en analytics.

Antes de producción hay que revisar el flujo con asesoramiento legal, especialmente por la combinación de foto facial + proveedor de IA de terceros.

## Licencia

Privado. Todos los derechos reservados.
