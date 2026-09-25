# B1 · Entregable A — Proveedores: calidad técnica y viabilidad comercial

> Investigación a 2026-09-25. **Dos dimensiones independientes**, porque un proveedor puede ganar una y perder la otra:
>
> - **Dimensión A — Calidad técnica:** ¿puede representar fielmente una montura real sobre una foto?
> - **Dimensión B — Viabilidad comercial:** ¿nos deja montar un agregador multi-marca afiliado?
>
> Cada una tiene su propio GO/NO-GO. **Un ★★★★★ en A con un ❌ en B no es nuestro proveedor, por muy bueno que sea.**

---

## 0. Niveles de evidencia

Ninguna afirmación de este documento se da por buena sin etiqueta. El marketing de un proveedor no es documentación.

| | Significado |
|---|---|
| **[D]** | Documentación oficial o términos del proveedor. **Verificado** |
| **[M]** | Material de marketing del proveedor. Declarado, **no verificado** |
| **[T]** | Tercero (comparativas, prensa). **No verificado** |
| **[?]** | **No publicado.** Requiere pregunta directa — Track 0 |
| **[X]** | Medido por nosotros en el benchmark. Aún vacío |

**El resultado más importante de esta investigación es cuántos [?] hay en la Dimensión B.** No es un fallo de la búsqueda: es que las condiciones comerciales de este sector no son públicas, y eso ya es información.

---

## 1. El marco: dos tecnologías con riesgos opuestos

| | **Clase A — 3D / AR** | **Clase B — Generativo** |
|---|---|---|
| La montura es | Un modelo 3D real | Píxeles dibujados desde una referencia |
| Fidelidad | Garantizada por construcción | Probabilística |
| Coste | Suscripción mensual con topes | Por generación |
| Coste marginal | ≈ 0 | Lineal |
| Barato cuando | **Hay volumen** | **Hay poco volumen** |
| Riesgo principal | **Licencia** | **Fidelidad** |
| Privacidad | Procesado en el navegador [D] | **La foto va a un servidor de terceros** |

> **Corrección a una suposición previa:** dimos por hecho que la Clase A era peor en privacidad porque implica a un proveedor externo. Es al revés. Fittingbox documenta que la imagen se procesa **en el navegador del usuario** y solo vive en la caché del navegador mientras dura el try-on [D]. La Clase B, en cambio, **exige enviar la cara del usuario a un servidor de terceros** en cada try-on. En RGPD, la Clase A tiene mejor postura de partida.

---

## 2. Dimensión A — Calidad técnica

| | **Fittingbox** | **Jeeliz** | **Banuba TINT** | **Perfect Corp** | **Clase B (generativo)** |
|---|---|---|---|---|---|
| **Try-on por foto subida** | **Sí** [D] — citado literalmente en su FAQ | [?] No especificado en su web | [T] | [T] | Sí, es su único modo |
| **Try-on por cámara en vivo** | Sí [D] | Sí [M] | Sí [M] | Sí [M] | No |
| **Fidelidad de montura** | Modelo 3D real → por construcción | 3D generado desde fotos de producto → **hay que medirlo** [X] | Asset 3D | Asset 3D | **Todo el riesgo** [X] |
| **Tracking** | Propio, en navegador [D] | Propio, «3× más ligero» [M] | Face AR SDK | Propio | No aplica |
| **Latencia** | Tiempo real [M] | Tiempo real [M] | Tiempo real [M] | Tiempo real [M] | Segundos [X] |
| **Procesado de la imagen** | **En el navegador**; caché solo durante el try-on [D] | [?] | [?] | [?] | Servidor de terceros |
| **API / SDK** | **API** [D] — «our technology is an API» | API + snippet [M] | SDK web y móvil [D] | SDK / API [M] | API |

### Clase B — precios oficiales por imagen [D]

| Modelo | Vía | $/img | € aprox. | Batch |
|---|---|---:|---:|---|
| Gemini 3 Pro Image (Nano Banana Pro) | Gemini API | 0,134 (1K/2K) · 0,24 (4K) | 0,114 € | −50 % |
| Gemini 3.1 Flash Image (Nano Banana 2) | Gemini API / fal | 0,045 (0,5K) · **0,067** (1K) | 0,057 € | −50 % |
| Gemini 3.1 Flash Lite Image | Gemini API | 0,0336 (1K) | 0,029 € | −50 % |
| FLUX.1 Kontext [pro] | fal / BFL | 0,04 | 0,034 € | — |
| Qwen Image Edit | fal | ~0,021 @1024² | 0,018 € | — |

**Limitación documentada que coincide con nuestro modo de fallo:** estos modelos pierden nitidez en **accesorios** y detalle fino [T]. Nuestro producto depende justo de eso: grosor de montura, forma del puente, doble puente del aviador, terminal de las patillas. «Consistencia de personaje» ≠ «fidelidad de producto»; el marketing de estos modelos habla de lo primero.

**No existe modelo generativo específico de gafas** en fal ni Replicate: sus modelos de try-on son de prendas de ropa [T]. Nadie ha especializado un modelo para accesorios faciales.

---

## 3. Dimensión B — Viabilidad comercial (el Gate de verdad)

Las diez preguntas que decidieron si existe el negocio, con lo que se ha podido verificar:

| | **Fittingbox** | **Jeeliz** | **Banuba TINT** |
|---|---|---|---|
| **¿Uso comercial?** | Sí, bajo licencia [M] | Sí [M] | Sí, licencia no exclusiva e intransferible «for the normal business purposes of the Customer» [D] |
| **¿Podemos mostrar múltiples marcas?** | **[?]** | **[?]** | **No lo prohíbe** [D] — el texto guarda silencio |
| **¿Podemos mostrar productos que NO vendemos?** | **[?]** — su FAQ no lo aborda | **[?]** | **No lo prohíbe** [D] |
| **¿Podemos usar sus assets 3D de terceros?** | **[?]** ← la pregunta de los 195.000 | No aplica: genera el 3D desde nuestras fotos [M] | No aplica: aportamos el asset |
| **¿Podemos enviar tráfico fuera / afiliación?** | **[?]** | **[?]** | No se aborda [D] |
| **¿Restricciones de marca / trademark?** | **[?]** | **[?]** | **Nos traslada todo el riesgo** [D] — ver abajo |
| **¿UI propia?** | API → sí [D] | Snippet + API [M] | SDK → sí [D] |
| **Límites** | Shopify: 500 / 1.500 usuarios únicos/mes [T]. Contrato directo **[?]** | Starter 10.000 sesiones, Advanced 100.000 [M] | Por MAU / try-ons, a presupuesto [M] |
| **Términos de prueba** | Free trial [T] | «1 mes gratis **para marcas establecidas**» [M] — no somos eso | Periodo de evaluación [D] |
| **Condiciones publicadas** | **No.** Su página «Terms» es **solo privacidad** [D] | **No hay ninguna página legal** en su web [D] | **Sí, publicadas** [D] |

### Los tres hallazgos que importan

**1. Fittingbox y Jeeliz no publican condiciones comerciales.**
La página «Terms» de Fittingbox es una política de privacidad; no dice quién puede ser cliente, ni qué se puede mostrar, ni nada sobre marcas de terceros. Jeeliz no enlaza ninguna página legal. **Conclusión: G4 no se puede responder para ninguno de los dos sin hablar con ellos.** Eso convierte el Track 0 en el camino crítico real del sprint, no en un trámite.

**2. Banuba sí publica, y la respuesta es más sutil que un sí o un no.**
No prohíbe mostrar marcas de terceros. Lo que hace es **trasladarnos el riesgo entero por contrato** [D]:

> «You agree to defend, indemnify and hold harmless Banuba … from and against any claims … resulting from or relating to: (i) Your use of TINT, **(ii) Your Content**, (iii) Your violation of these Terms and Conditions»

Es decir: el problema de licencia no será «el proveedor nos dice que no». Será **«el proveedor dice que adelante, y que si Luxottica reclama, es asunto nuestro»**. La pregunta correcta a los otros dos no es «¿puedo?», es **«¿quién responde si una marca reclama?»**.

También prohíbe expresamente sublicenciar, distribuir o poner TINT a disposición de terceros [D]. Eso no nos bloquea —los usuarios finales usan nuestro producto, no el SDK— pero sí bloquearía cualquier intento futuro de revender la capa de try-on.

**3. Jeeliz tiene un programa de resellers** para agencias web, agencias AR y empresas de desarrollo [M]. No somos exactamente eso, pero es la única vía publicada por la que un tercero que no es marca ni retailer entra en su ecosistema. Merece preguntarse por ahí.

### El catálogo de Fittingbox: la pregunta de mayor valor del sprint

Fittingbox declara **~200.000 referencias de más de 1.200 marcas, actualizadas a diario** [D], y que si una montura no está, su estudio fotográfico la digitaliza [D].

```
Opción 1 — nosotros            Opción 2 — Fittingbox
30 productos                   200.000 referencias
curación manual                1.200+ marcas
~20 min/montura                matching automático
techo bajo                     nosotros solo seleccionamos
```

Si su licencia permitiera usar ese catálogo en un agregador independiente, **no resolvería el try-on: resolvería el problema de catálogo entero**, que es el segundo cuello de botella del proyecto. Su FAQ **no aborda** si un cliente puede usar monturas de la base que él mismo no vende [D]. Esa sola pregunta vale más que todo el benchmark visual.

Contrapartida honesta: sería una **dependencia crítica de un proveedor único** para las dos piezas centrales del producto. Eso hay que ponerlo en la balanza antes de celebrarlo.

---

## 4. Economía: dónde se cruzan las dos clases

Coste por usuario activo, asumiendo **2,5 try-ons por usuario** (hipótesis a validar). Tipo 1 $ ≈ 0,85 €.

| Usuarios activos/mes | Qwen Edit (0,018 €/try-on) | Gemini 3.1 Flash (0,057 €) | Jeeliz Starter (254 €/mes fijo) | Fittingbox Bronze (50 €/mes, tope 500 usr) |
|---:|---:|---:|---:|---:|
| 100 | 4,50 € · **0,045 €/u** | 14 € · 0,143 €/u | 254 € · 2,54 €/u | 50 € · 0,50 €/u |
| 500 | 23 € · **0,045 €/u** | 72 € · 0,143 €/u | 254 € · 0,51 €/u | 50 € · **0,10 €/u** ← al tope |
| 2.000 | 90 € · 0,045 €/u | 286 € · 0,143 €/u | 254 € · **0,13 €/u** | requiere plan superior |
| 10.000 | 450 € · 0,045 €/u | 1.430 € · 0,143 €/u | 254 € · **0,025 €/u** ← al tope de sesiones | — |
| 40.000 | 1.800 € · 0,045 €/u | 5.720 € · 0,143 €/u | Advanced 424 € · **0,011 €/u** | — |

**Puntos de cruce:**

- Jeeliz Starter deja de ser más caro que Gemini 3.1 Flash a partir de **~1.800 usuarios activos/mes**.
- Frente a Qwen Edit, el cruce se va a **~5.600 usuarios/mes**.

**Lectura:**

> **La Clase A es carísima al arrancar y baratísima a escala. La Clase B es exactamente lo contrario.**

Consecuencias directas, y son decisiones, no observaciones:

1. **El gate de coste (G3) hay que evaluarlo al volumen del mes 1–3, no en régimen.** Un «0,025 €/try-on» de Jeeliz es real solo si llenamos 10.000 sesiones. Con 200 usuarios, ese mismo plan cuesta 1,27 €/usuario y quema la economía unitaria.
2. **Lanzar con Clase B y migrar a Clase A cuando el volumen cruce el punto de equilibrio** es, con estos números, la ruta por defecto. Requiere que la fidelidad de la Clase B pase G1.
3. **Esto convierte el adapter `TryOnProvider` (ADR-02) de principio de ingeniería en requisito económico con fecha.** No es «buena práctica»: es el mecanismo por el que se ejecuta la migración de ~1.800 usuarios/mes.

---

## 5. Clase C — la ruta autoconstruida

| Proyecto | Qué resuelve | Qué NO resuelve | Licencia |
|---|---|---|---|
| `jeeliz/jeelizGlassesVTOWidget` | Widget WebGL de try-on en vivo | **Legacy, descontinuado** por Jeeliz | **Licencia comercial Jeeliz — NO es software libre** [D]. Aparece en GitHub y parece gratis. No lo es |
| MediaPipe Face Landmarker + three.js | Tracking facial 3D en navegador, gratis y resuelto | El modelo 3D de cada montura | Abiertas |
| MediaPipe + rembg + warp OpenCV | Aproximación 2.5D | Calidad insuficiente | Abierta |

> El tracking facial es un problema **resuelto y gratuito**: MediaPipe da 468 landmarks 3D en el navegador sin coste.
> **El cuello de botella no es poner gafas en una cara: es tener un 3D fiel por montura.**
> Eso es exactamente lo que venden Fittingbox (200.000 digitalizadas) y Jeeliz (generación automática desde foto).

Por eso el Track C del protocolo no implementa nada: solo responde a **cuánto cuesta conseguir o generar 30 modelos 3D**. Si esa cifra es baja, existe una salida con coste marginal cero que no depende de ningún proveedor — y es la única que elimina el riesgo de dependencia del §3.

---

## 6. Estado de la decisión

| | Dimensión A (técnica) | Dimensión B (comercial) |
|---|---|---|
| Fittingbox | Fuerte [D] en foto, cámara, API y privacidad | **Desconocida.** Todo [?] |
| Jeeliz | Prometedora, sin verificar. Modo foto [?] | **Desconocida.** Sin página legal |
| Banuba | Correcta [M] | **Permisiva pero con el riesgo IP de nuestro lado** [D] |
| Perfect Corp | Sin investigar a fondo | Sin investigar |
| Clase B | **Todo el riesgo**, pendiente de medir [X] | Libre: sin licencia de por medio |

**Ninguna casilla de la Dimensión B está resuelta para los dos proveedores más interesantes.** Ese es el estado real, y por eso el Track 0 se ejecuta antes que ninguna imagen.

---

## 7. Fuentes

**Documentación oficial y términos [D]**
- Fittingbox — Terms (solo privacidad): https://fittingbox.com/en/resources/help-center/terms
- Fittingbox — FAQ de tecnología: https://fittingbox.com/en/resources/faq-eyewear-virtual-try-on-technology
- Fittingbox — privacidad y VTO: https://fittingbox.com/en/resources/blog/expert-talks-data-privacy-compliance-virtual-try-on
- Banuba — Terms of Service TINT: https://www.banuba.com/terms-of-service-tint
- Banuba — Licensing Terms: https://www.banuba.com/licensing-terms
- Gemini API — precios: https://ai.google.dev/gemini-api/docs/pricing
- Jeeliz — licencia del widget legacy: https://github.com/jeeliz/jeelizGlassesVTOWidget

**Marketing del proveedor [M]**
- Jeeliz: https://jeeliz.com/
- Fittingbox — VTO: https://fittingbox.com/en/glasses-virtual-try-on
- Banuba — precios TINT: https://www.banuba.com/blog/banuba-tint-virtual-try-on-pricing-guide
- Perfect Corp — eyewear: https://www.perfectcorp.com/business/showcase/eye-wear

**Terceros [T]**
- Comparativa 2026: https://auglio.com/en/best-virtual-try-on-eyewear-2026
- Fittingbox en Shopify (precios): https://apps.shopify.com/glasses-virtual-try-on-by-fittingbox
- Jeeliz en Shopify (precios): https://apps.shopify.com/jeeliz-live-virtual-try-on
- Adquisición de Ditto por Fittingbox en 2023: https://en.wikipedia.org/wiki/DITTO
- fal — precios: https://pricepertoken.com/fal-ai-pricing
- Límites de detalle en modelos generativos: https://www.fotor.com/blog/google-nano-banana-vs-flux-kontext-max/
- MediaPipe + three.js: https://github.com/bensonruan/Virtual-Glasses-Try-on

> **Discrepancia de precios detectada en Jeeliz:** su web publica Starter $299/mes y Advanced $499/mes [M], mientras que su app de Shopify publica $39–$199/mes [T]. No son lo mismo: la app de Shopify es para comerciantes de Shopify. **Para nuestro caso aplica el precio directo, 8× superior.** Confirmarlo en el Track 0 antes de meter ningún número en la economía unitaria.
