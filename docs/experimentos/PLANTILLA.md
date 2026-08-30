# <Título corto del cambio>

<!--
Cómo usar esto:
  1. Copia este archivo a docs/experimentos/AAAA-MM-DD-slug.md
  2. Llena de "Observación" a "Métrica objetivo" ANTES de hacer el cambio.
     Elegir la métrica después de ver el resultado es hacer trampa.
  3. Vuelve a abrirlo cuando cierre la ventana de seguimiento y llena
     "Resultado" y "Decisión".
  4. Si el resultado fue "no pasó nada", escríbelo igual. Un experimento
     nulo documentado vale más que uno exitoso recordado de memoria.

Mantenlo corto: si no cabe en una pantalla, sobra texto.
-->

- **Estado:** propuesto | en curso | cerrado
- **Fecha:** AAAA-MM-DD
- **Responsable:** @usuario

## Observación
<!-- Qué vimos. Un párrafo. -->

## Evidencia
<!--
De dónde salió. Sé específico y verificable:
  - métrica del panel + ventana usada (ej. "first-pass 22%, 30 días, n=41")
  - ids de feedback/bug reports
  - consulta o pantalla concreta
-->

## Hipótesis
<!-- "Creemos que <cambio> hará <efecto> porque <razón>." -->

## Cambio
<!-- Qué se modificó exactamente: archivo de contenido, texto, test, pista, UI. -->

## Issue / PR
<!-- Enlaces. Si el reporte se resolvió desde /app/admin/reportes, ahí quedaron guardados. -->

## Revisión de contenido
<!--
Hash ANTES → hash DESPUÉS y su firstSeenAt (tabla `content_revision`).
Sin esto, el before/after mezcla dos versiones distintas del contenido.

  antes:   ______________
  después: ______________  (firstSeenAt: AAAA-MM-DD HH:MM UTC)
-->

## Métrica objetivo
<!--
UNA métrica principal, con su definición en docs/product-analytics.md.
Di también qué te haría concluir que salió mal (métrica de guardia).

  principal: ______________  (baseline: ____)
  guardia:   ______________
-->

## Ventana base
<!-- Rango exacto usado como "antes" y su n. -->

## Ventana de seguimiento
<!-- Rango exacto para el "después", definido de antemano, y su n mínimo. -->

## Resultado
<!--
Números, no impresiones. Si el n es chico, dilo: a escala de un grupo del CETI
la mayoría de las diferencias no son concluyentes, y está bien decirlo.
-->

## Decisión / siguiente paso
<!-- Se queda | se revierte | se itera | hace falta más datos. -->
