# B5 · Keyword research — demanda real de búsqueda

> **Estado:** PENDIENTE · **Investigación a:** — · **Cierra:** ¿es SEO un canal de adquisición viable, y por qué puerta se entra?

**No ejecutar todavía.** Este bloque es B5 en el orden de Fase 0: va **después** de B1 (¿existe la tecnología?) y B3 (¿se puede monetizar?). Investigar keywords es cómodo y se siente productivo, y por eso es la tentación principal de adelantarlo. Un mapa de demanda perfecto no vale nada si B1 sale NO-GO.

Lo único que sí debe hacerse ya: **no gastar en herramientas.** El presupuesto autorizado de Fase 0 son los ~15,50 € de B1 y ninguna suscripción ([D-005](../../docs/DECISION_LOG.md#d-005)).

---

## 1. Lo que ya sabemos y lo que no

**Observado** [T]: en Google Trends, las long-tail explícitas del tipo «qué gafas me quedan bien» muestran interés relativo muy bajo en España, mientras «gafas de sol» domina con claridad ([CLAUDE.md §2.1](../../CLAUDE.md)).

**Lo que eso NO demuestra.** Trends normaliza y redondea a 0 lo que tiene poco volumen relativo; no es una medida de volumen absoluto. De ahí no se deduce ni que la demanda de face-shape sea cero, ni cuánta demanda hay realmente en las cabeceras. Trends sirvió para **descartar una suposición**, no para sustituir el dato.

**Lo que falta es volumen absoluto con fuente.** Sin eso, cualquier plan de contenidos es una opinión ([D-008](../../docs/DECISION_LOG.md#d-008)).

---

## 2. Datos a recoger

Por cada keyword, las columnas de [data/keywords.csv](data/keywords.csv):

| Campo | Notas |
|---|---|
| `keyword` | literal, en el idioma del país |
| `cluster` | A categoría · B forma · C marca · D problema/face-shape · E try-on |
| `country` / `language` | ES, MX, CO, AR, US, UK |
| `monthly_volume` | si la fuente da rango, se anota el rango entero, no la media |
| `cpc_eur` | proxy de intención comercial; un CPC alto con volumen bajo puede valer más que lo contrario |
| `competition` / `difficulty` | qué escala usa cada herramienta es distinto: anotar `source` siempre |
| `intent` | informacional · comercial · transaccional · navegacional |
| `serp_features` | shopping, ads, PLA, imágenes, vídeo, AI Overview, People Also Ask |
| `serp_owners` | **quién ocupa el top 5**: retailer grande, marca, medio, afiliado, foro |
| `source` / `date` / `evidence` | herramienta, fecha de consulta, nivel `[D][T][?][X]` |

`serp_owners` es la columna que más decide y la que se suele omitir. Un volumen de 50.000 con las cinco primeras posiciones en manos de Luxottica, Amazon y El Corte Inglés no es una oportunidad: es un muro.

---

## 3. Clústeres a medir

De [CLAUDE.md §18.2](../../CLAUDE.md). Hipótesis de partida: **la demanda está en A, B y C; la personalización es el puente, no la puerta.**

| | Cluster | Ejemplos | Rol esperado |
|---|---|---|---|
| **A** | Categoría | gafas de sol, gafas de sol hombre/mujer, gafas de ver | Volumen alto, SERP probablemente inabordable para dominio nuevo |
| **B** | Forma | rectangulares, cuadradas, redondas, aviador, cat-eye, oversized | **Candidato principal**: intención de estilo + encaje natural con try-on |
| **C** | Marca | Ray-Ban, Oakley, Hawkers, Meller, Persol, Polaroid | Volumen alto y riesgo de marca; ver [affiliate-programs](../monetization/affiliate-programs.md) y GC-4 de B1 |
| **D** | Problema | gafas para cara redonda, qué gafas me favorecen | Long-tail complementaria, **no la columna vertebral** |
| **E** | Try-on | probar gafas online, probador de gafas, virtual glasses try on | Mide si existe demanda del mecanismo, no solo del producto |

Países en este orden: **España primero**. El resto (MX, CO, AR, US, UK) solo cuando España tenga un cluster abordable identificado; medir seis países a la vez multiplica el coste de la herramienta sin cambiar la decisión inmediata.

---

## 4. Fuentes

Ninguna cifra de precio aquí está verificada: **confirmar antes de contratar nada.**

| Fuente | Coste | Notas |
|---|---|---|
| Google Keyword Planner | Gratis con cuenta de Google Ads [?] | Devuelve **rangos** amplios si no hay campaña activa [?]. Es la fuente canónica de volumen de Google y el punto de partida obvio |
| Bing Webmaster Tools — Keyword Research | Gratis [?] | Volumen de Bing, no de Google. Sirve como orden de magnitud y para detectar estacionalidad |
| DataForSEO | Pago por consulta [?] | Coste marginal bajo, sin suscripción. Hay un skill `claude-seo:seo-dataforseo` en este entorno, pero **requiere credenciales propias** |
| Semrush / Ahrefs | Suscripción [?] | Mejores datos de dificultad y SERP. **No contratar en Fase 0** |
| SERP a mano | Gratis | Imprescindible para `serp_owners` y `serp_features`. Ninguna herramienta sustituye mirar 10 SERP reales en incógnito |
| Google Trends | Gratis | Solo estacionalidad y comparación relativa. **Nunca como volumen** |

Screenshots de cada consulta en [assets/](assets/) con el nombre fechado (convención en [research/README.md §2](../README.md)). Sin screenshot, la cifra no es verificable en tres meses.

---

## 5. Criterios de decisión — propuestos, sin validar

Los umbrales son **hipótesis de trabajo**, no verdades. Se fijan antes de mirar los datos, para no acomodarlos al resultado que nos gusta.

| Gate | Métrica | Propuesta de GO |
|---|---|---|
| **GK-1 · Existe puerta** | Un cluster con volumen agregado ≥10.000 búsquedas/mes en ES y top 5 **sin** dominar por retailers grandes ni marcas | Al menos 1 cluster |
| **GK-2 · Intención de mecanismo** | Volumen agregado del cluster E (probar gafas / probador) en ES | ≥2.000/mes → el try-on se busca solo |
| **GK-3 · Coste alternativo** | CPC medio del cluster elegido | Contexto para decidir SEO vs social vs paid, no un GO aislado |

**Desenlaces y qué implica cada uno:**

- **GK-1 ✅** → SEO es un canal de medio plazo real; el cluster ganador define la primera tanda de páginas.
- **GK-1 ❌** → SEO **no** es el canal de lanzamiento. Eso no mata el proyecto: refuerza social/vídeo ([CLAUDE.md §20](../../CLAUDE.md)), pero obliga a dejar de justificar trabajo con «lo indexaremos».
- **GK-2 ✅ con GK-1 ❌** → la gente busca el probador pero no nuestras categorías: producto de mecanismo, no de descubrimiento. **Contradice la tesis central** de [CLAUDE.md §2](../../CLAUDE.md) y habría que abrir entrada en el log.

---

## 6. Resultados

Vacío. Al cerrar: tabla resumen por cluster/país, los tres gates resueltos con cifras, `serp_owners` del cluster ganador, y **una** conclusión sobre si SEO entra en el plan de lanzamiento o se aplaza.
