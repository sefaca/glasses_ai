---
name: growth-seo
description: Invoca al director de growth/SEO (posicionamiento, rankings, competidores, GEO, contenido, captación) para diagnosticar, proponer o ejecutar la siguiente acción
disable-model-invocation: true
arguments: [tarea]
allowed-tools: Agent
---

Lanza el agente `growth-seo-expert` (subagent_type) con el siguiente input.

**Tarea o pregunta de growth**:

$tarea

---

El agente arranca siempre leyendo `docs/GROWTH_SEO.md` (documento
vivo) y el último snapshot de `growth/snapshots/`, y TERMINA siempre proponiendo la
actualización de ese doc (registro de acciones + aprendizajes).

Si `$tarea` está vacío, pídele que proponga la siguiente acción de mayor impacto del
backlog del doc.

Ejemplos de uso habitual:
- `/growth-seo haz el análisis semanal de los lunes`
- `/growth-seo revisión semanal frente a los competidores`
- `/growth-seo research de keywords para {tema}: volumen y negocio`
