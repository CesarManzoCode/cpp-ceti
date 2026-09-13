# CPP-CETI — UX/UI Master Blueprint

**Documento rector de producto y diseño · 13 de septiembre de 2026**  
**Base evaluada:** producción `cpp-ceti.vercel.app`, capturas suministradas y repositorio `CesarManzoCode/cpp-ceti`, rama `main`, commit `bc8f334`.  
**Alcance:** optimizar la experiencia de las capacidades existentes. No convierte CPP-CETI en LMS, no añade tutor de IA, certificados, panel docente ni integración institucional.

> **Decisión central:** CPP-CETI debe sentirse como un **taller de programación sereno**: el código, la consigna y el avance inmediato dominan; la navegación orienta sin ocupar el espacio de trabajo; la motivación acompaña sin convertir el aprendizaje en un tablero de juego.

---

## Resumen ejecutivo

La base actual es mejor de lo que su repetición de tarjetas deja ver. La landing tiene una propuesta clara, un ejemplo de código real y una composición madura; las lecciones combinan explicación breve, manipulación de código y práctica; el compilador en navegador da retroalimentación inmediata; el mapa de curso, los estados y la metáfora de piezas construidas hacen visible el avance. Esas decisiones deben conservarse.

El salto de calidad no exige otra identidad ni un rediseño ornamental. Exige **reducir interferencia**:

1. En superficies de exploración, conservar la navegación lateral pero convertirla en una guía compacta; el índice completo de unidades deja de competir con la página.
2. En lecciones y prácticas, entrar en un modo de concentración sin barra lateral global. Contexto, progreso y salida caben en una barra de aprendizaje de 60 px.
3. Usar ladrillos solamente cuando representan una secuencia que puede leerse. Para 68, 80 o 92 elementos, emplear barra proporcional, cuenta exacta y hitos; nunca un código de barras decorativo.
4. Reducir tarjetas, píldoras, sombras, redondeos y animaciones continuas. Cada contenedor debe responder a una función: sección, objeto accionable, instrumento o capa flotante.
5. Mantener XP, racha, nivel, liga y amigos, pero fuera del centro de la tarea. La evidencia de aprendizaje aparece antes que la recompensa.
6. Tratar editor, consola, diagnósticos y resultado como un único instrumento. Los errores aparecen junto a su causa, con lenguaje reparable y navegación por teclado.
7. Hacer que cada vista se reconfigure de verdad en móvil; no encoger la interfaz de escritorio.

El sistema final no debe parecer “más diseñado”. Debe parecer **más inevitable**: menos decisiones visibles, mejor jerarquía, más espacio útil para pensar y escribir código.

---

## A. Tesis de experiencia y principios rectores

### A1. Promesa de experiencia

**“Abro CPP-CETI, entiendo qué sigue, practico sin configurar nada y sé exactamente qué aprendí y qué debo corregir.”**

La experiencia se organiza alrededor de cuatro momentos:

| Momento | Pregunta del estudiante | Respuesta de la interfaz |
|---|---|---|
| Orientarse | ¿Dónde estoy y qué sigue? | Curso, unidad, avance y siguiente acción, visibles sin explorar menús. |
| Comprender | ¿Qué concepto necesito ahora? | Una explicación breve, ejemplos reales y ancho de lectura controlado. |
| Hacer | ¿Cómo lo pruebo? | Editor estable, acciones inequívocas, salida y evaluación próximas. |
| Cerrar | ¿Qué logré y cómo continúo? | Evidencia de finalización, corrección pendiente, avance y siguiente lección. |

### A2. Principios no negociables

1. **La tarea antes que el tablero.** La siguiente acción de aprendizaje es más prominente que XP, racha, liga o estadísticas.
2. **Contexto persistente, navegación no persistente.** Durante el estudio siempre se ve curso/unidad/paso, pero no se mantiene abierto el menú global.
3. **Reconocer antes que recordar.** Etiquetas, estados, ejemplos y progreso deben reducir memoria de trabajo; no esconder acciones esenciales detrás de iconos.[^1]
4. **Una región, una decisión primaria.** Cada bloque decisional tiene como máximo un botón sólido primario. Acciones auxiliares son secundarias o de texto.
5. **Progreso legible, no ornamental.** Toda visualización responde “cuánto”, “de cuánto” y, si procede, “qué sigue”.
6. **Error como estado de trabajo.** Nada de sacudidas punitivas ni toasts vagos. El sistema señala dónde, explica qué ocurrió y ofrece una siguiente acción.[^2]
7. **Código auténtico.** La interfaz usa código, salidas, casos de prueba y contenido real; no ilustraciones genéricas de programación.
8. **Misma identidad, distinta densidad.** Marketing, exploración, estudio y administración comparten tokens, no la misma plantilla.
9. **Accesibilidad estructural.** Teclado, foco, reflow, contraste y mensajes no se añaden al final: determinan componentes y flujos desde el inicio.[^3]
10. **Independencia explícita.** “Plataforma no oficial de apoyo para estudiantes del CETI” aparece en contextos de confianza sin simular identidad institucional.

### A3. Criterio de éxito

El rediseño habrá mejorado el producto si una persona nueva puede:

- identificar en menos de cinco segundos qué ofrece la landing y que es gratuito/no oficial;
- crear una cuenta e iniciar la primera lección sin decidir entre elementos equivalentes;
- saber siempre curso, unidad y paso durante una lección;
- ejecutar, corregir y enviar código sin confundir compilación con evaluación;
- navegar toda la experiencia con teclado y a 320 CSS px sin perder contenido ni foco;
- retomar su curso con una sola acción dominante;
- percibir el producto como hecho específicamente para el temario del CETI, no como una plantilla SaaS educativa.

---

## B. Investigación significativa y traducción a decisiones

### B1. Evidencia utilizada

Las decisiones combinan cuatro clases de evidencia. No tienen el mismo peso:

| Clase | Uso en este blueprint | Límite |
|---|---|---|
| Estándar | WCAG 2.2, semántica, teclado, foco, reflow, objetivos táctiles. | Define mínimos; no resuelve por sí solo jerarquía o estética. |
| Investigación educativa | andamiaje, problemas Parsons, recuperación y retroalimentación. | Los efectos dependen de población y contexto; CPP-CETI debe validar con estudiantes. |
| Patrones de producto | Monaco/VS Code, Khan Academy, Codecademy, heurísticas de usabilidad. | Se aprende el principio, no la apariencia ni la marca. |
| Evidencia contextual | producción, código, capturas, contenido y frecuencia real de patrones. | Es una auditoría experta; no sustituye pruebas de usabilidad. |

### B2. Hallazgos que sí cambian el diseño

**Reducir carga extrínseca.** La teoría de carga cognitiva y el principio de coherencia recomiendan retirar información que no ayuda a la tarea inmediata.[^4] En CPP-CETI esto no implica ocultar el currículo, sino sacar la lista completa de unidades, XP y módulos sociales del campo visual mientras se programa.

**Graduar la producción de código.** Los problemas Parsons y sus variantes desvanecidas pueden ayudar especialmente a principiantes con baja autoeficacia antes de pedir generación desde cero.[^5] Por eso se conserva la escalera existente —ejemplo, opción, completar, ordenar/emparejar, escribir— y se hace visualmente consistente. No se homogeneizan todos los pasos como “tarjetas de pregunta”.

**Retroalimentar cerca y pronto.** La visibilidad del estado reduce incertidumbre y acciones repetidas; un mensaje útil debe aparecer cerca del origen y explicar cómo recuperarse.[^1][^2] Compilación, pruebas y verificación muestran fase, resultado y siguiente acción en el propio banco de trabajo. Los toasts se reservan para sucesos globales no ligados a un campo.

**Conservar una medida de lectura corta.** El rango aplicado de 50–75 caracteres por línea respalda el `66ch` actual.[^6] La lectura permanece en 62–68ch; el editor puede usar el ancho restante.

**Gamificación como apoyo, no como interfaz principal.** La metaanálisis disponible encuentra un efecto positivo pequeño sobre motivación intrínseca y efectos heterogéneos según duración y diseño.[^7] Las rachas pueden apoyar hábito, pero la evidencia publicada por productos suele ser correlacional.[^8] Se mantienen las capacidades actuales, se reduce su presencia persistente y se evita que una pérdida de racha parezca una pérdida académica.

**Editor accesible por diseño.** Monaco incluye navegación de diagnósticos, modo de alto contraste, soporte para lector de pantalla y un comando para liberar `Tab` del editor.[^9] La interfaz debe enseñar esos controles en contexto, anunciar resultados y no atrapar el teclado.

**Reflow real.** WCAG 2.2 exige que a 320 CSS px el contenido pueda presentarse sin desplazamiento bidimensional, salvo regiones que lo requieran por su significado, como código o tablas.[^10] El documento completo no debe desplazarse horizontalmente; solo el editor puede hacerlo, con `word wrap` como comportamiento inicial.

**Tamaño táctil operativo.** WCAG 2.2 AA admite un mínimo de 24 × 24 CSS px bajo condiciones; Apple y Material recomiendan regiones mayores.[^11] CPP-CETI adopta 44 × 44 px como objetivo operativo para acciones táctiles y nunca baja de 24 × 24 px con separación suficiente.

### B3. Qué no se convierte en decisión

- No se copia el verde, la mascota, el tono o la economía de Duolingo.
- No se copia la estructura exacta de Codecademy ni se añaden herramientas por paridad.
- No se asume que más animación equivale a más motivación.
- No se añade una característica porque aparezca en una plataforma comparable.
- No se presenta una preferencia estética como hallazgo científico.

---

## C. Diagnóstico actual: conservar, refinar, reemplazar

### C1. Evaluación sintética

| Decisión actual | Veredicto | Razón | Dirección final |
|---|---|---|---|
| Propuesta “aprende programando” | **Conservar** | Clara, demostrable y coherente con el producto. | Mantener como eje de landing y onboarding. |
| Hero con código y salida reales | **Conservar** | Prueba el producto sin ilustración genérica. | Actualizar cifras y pulir responsive; no reemplazar por arte. |
| Figtree + JetBrains Mono | **Conservar** | Legibilidad, personalidad sobria y distinción real entre texto/código. | Formalizar pesos, tamaños y uso; JetBrains también dentro de Monaco. |
| Paleta fría + índigo, ámbar y verde semánticos | **Conservar/refinar** | Funciona en claro y oscuro y no imita marca oficial. | Simplificar superficies y restringir color a función. |
| Terminal oscura en ambos temas | **Conservar** | Estabiliza el entorno de código y evita una relectura visual entre temas. | Unificar editor, consola y resultados como instrumento. |
| Secuencia variada de tipos de paso | **Conservar** | Constituye andamiaje, práctica de recuperación y producción gradual. | Normalizar anatomía y retroalimentación. |
| Próxima lección dominante en Inicio | **Conservar** | Responde de inmediato “qué hago ahora”. | Quitar decoración y métricas competidoras. |
| Mapa vertical del curso | **Conservar/refinar** | Hace visible la ruta y la unidad actual. | Reducir adornos, mejorar estados y hacerlo la fuente principal del detalle. |
| Ladrillos como firma de progreso | **Conservar con límite** | Es propia y significativa en secuencias cortas. | Usar solo en 2–12 elementos; agrupar 13–24; barra proporcional sobre 24. |
| Sidebar con todas las unidades en toda vista | **Reemplazar** | Duplica el mapa, consume ancho y distrae en lecciones. | Rail compacto en exploración; sin sidebar en modo aprendizaje. |
| XP/racha persistentes en topbar | **Refinar** | Son capacidades legítimas, pero compiten con la tarea y generan tono de juego. | Mostrar resumen en Inicio/perfil y recompensa al cerrar; ocultar durante estudio. |
| Tarjeta para casi todo | **Reemplazar** | Aplana jerarquía y produce apariencia de plantilla. | Canvas, sección, pieza, instrumento y overlay con reglas distintas. |
| Píldoras como navegación de unidades | **Reemplazar** | Truncan texto y hacen que 10 unidades compitan como etiquetas. | Selector compacto/lista de unidades con estado y cuenta. |
| Sombras y elevación en superficies comunes | **Refinar** | La elevación deja de comunicar capa. | Sin sombra por defecto; sombra solo en menús, popovers y diálogos. |
| Pulso del estado actual y parpadeo de llama | **Reemplazar** | Movimiento permanente sin información nueva. | Transiciones de estado una sola vez; reposo completamente estático. |
| “Dominaste” al completar una unidad | **Reemplazar** | Completar no demuestra dominio. | “Completaste la unidad”; reservar “dominio” para evidencia que hoy no existe. |
| Modal de finalización celebratoria | **Reemplazar** | Interrumpe y separa el cierre del contenido. | Estado final en flujo con resumen, XP secundario y siguiente lección. |
| Mensajes de compilación/pruebas próximos al editor | **Conservar/refinar** | Buena proximidad causal. | Distinguir ejecutar de enviar y añadir estructura accesible. |
| Aviso de plataforma no oficial | **Conservar** | Necesario para confianza y límites de identidad. | Redacción única y ubicaciones definidas. |
| Estadísticas de landing codificadas por separado | **Reemplazar** | Producción muestra 54/270/217 y repositorio 56/276/227; erosiona confianza. | Una sola fuente de verdad, con fecha o actualización automática. |

### C2. Prueba contra el sesgo de novedad

La dirección no rehace lo que ya es correcto. Conserva estructura curricular, tipos de actividad, arquitectura de cursos, navegación primaria, compilador, editor, tema oscuro/claro, tipografías, colores base, mapa, CTA de continuidad, perfiles y comunidad. Los cambios estructurales se limitan a tres problemas observables: **interferencia durante el estudio, visualizaciones de progreso ilegibles y jerarquía debilitada por contenedores repetidos**.

Regla de desempate: si dos soluciones cumplen accesibilidad, claridad y responsive por igual, gana la que reutiliza el patrón actual con menos cambio.

---

## D. Arquitectura de experiencia

### D1. Modelo de navegación

CPP-CETI opera en tres modos, cada uno con un armazón propio:

| Modo | Incluye | Armazón |
|---|---|---|
| Público | Landing, iniciar sesión, registro | Header público; contenido centrado; footer con independencia. |
| Explorar/retomar | Inicio, cursos, unidad, práctica, liga, amigos, perfil, ajustes | Sidebar compacta en escritorio; topbar; bottom nav en móvil. |
| Aprender/hacer | Lección, reto, práctica en editor | Barra de aprendizaje; área de trabajo; sin sidebar ni bottom nav. |

**Arquitectura primaria existente, conservada:** Inicio, Práctica, Liga, Amigos. **Cursos** vive en el selector de curso, no como quinto destino duplicado. **Perfil/Ajustes** vive en el menú de cuenta.

### D2. Shell de exploración

**Escritorio ≥ 1200 px**

- Sidebar fija de **248 px**, borde derecho de 1 px, fondo `surface-1`; sin sombra.
- Topbar de **64 px** desde el borde de la sidebar hasta el borde derecho.
- Contenido con `max-width: 1200px`, padding lateral 40 px y superior 40–48 px.
- Orden de sidebar: marca; selector de curso; navegación primaria; bloque “Curso actual”; enlaces de ayuda; aviso no oficial.
- “Curso actual” muestra progreso global, unidad actual y botón **Abrir mapa del curso**. Puede revelar la unidad actual y sus dos vecinas; nunca despliega las 10–20 unidades completas dentro de la navegación.
- Topbar muestra breadcrumb corto o título, tema y cuenta. XP/racha no ocupan este nivel.

**Tablet 768–1199 px**

- Sin sidebar fija.
- Topbar de 60 px con botón “Menú”, curso actual y cuenta.
- Navegación principal en panel modal lateral de máximo 320 px, con foco atrapado correctamente y cierre por `Esc`.
- Entre 768 y 1023 px se mantiene bottom nav solo en vistas de exploración; de 1024 a 1199, el menú lateral temporal es suficiente.

**Móvil < 768 px**

- Topbar de 56 px: marca compacta o volver, título truncado a una línea y cuenta/menú.
- Bottom nav de 64 px + `safe-area-inset-bottom`, cinco destinos actuales, etiqueta siempre visible. Cada destino ≥44 × 44 px.
- El contenido reserva `scroll-padding-bottom` para que foco y últimas acciones no queden cubiertos.

### D3. Modo de aprendizaje

Al abrir una lección o práctica, el shell global desaparece. Lo sustituye una **Learning Bar**:

- 60 px en escritorio/tablet; 56 px en móvil.
- Izquierda: “Volver” + nombre corto de unidad (texto en escritorio; botón con nombre accesible en móvil).
- Centro: progreso del paso. Para 2–12 pasos, piezas discretas de 6 × 4 px, separación 4 px, cuenta “2 de 3”. Para 13 o más, barra continua con cuenta.
- Derecha: “Ayuda y reporte” en menú; “Salir”. El aviso “¿No es tu clase?” vive dentro de Ayuda, no como píldora ámbar permanente.
- En móvil, el centro ocupa el ancho disponible y el título se mueve a la cabecera del contenido.
- No aparecen XP, racha, avatar, liga, amigos ni footer.

La barra es `position: sticky; top: 0; z-index` de navegación, con fondo opaco. Todo destino de foco usa `scroll-margin-top: 76px` y nunca queda oculto.[^12]

### D4. Flujos principales

**Primera visita:** Landing → Crear cuenta → seleccionar/confirmar curso → Inicio del curso → Empezar lección → cierre en flujo → Siguiente lección.

**Retorno:** Inicio → tarjeta “Continúa” → paso pendiente exacto → cierre → mapa actualizado.

**Práctica libre:** Práctica → seleccionar unidad mediante lista/filtro → reto → ejecutar → enviar solución → resultado → siguiente reto o volver a práctica.

**Corrección:** acción → estado “Compilando/Evaluando” → error junto al editor o control → indicación específica → foco al primer problema cuando el usuario lo solicita → reintento sin perder trabajo.

### D5. Jerarquía de superficies

| Nivel | Nombre | Uso | Tratamiento |
|---|---|---|---|
| 0 | Canvas | Fondo de página | Color frío, sin borde ni sombra. |
| 1 | Hoja | Lectura y agrupación principal | Generalmente abierta; separación por espacio o regla. |
| 2 | Pieza | Curso, unidad, reto o acción contenida | Borde 1 px, radio 10–14 px, sin sombra. |
| 3 | Instrumento | Editor, consola, pruebas | Superficie terminal, geometría más recta, regiones conectadas. |
| 4 | Overlay | Menú, tooltip, popover, diálogo indispensable | Sombra y elevación reales; fondo opaco. |

Una sección no se convierte en tarjeta por estar agrupada. Un conjunto de métricas usa columnas y separadores. Un estado vacío usa texto, acción y quizá una regla; no necesita borde punteado salvo que sea una zona de carga/soltar.

---

## E. Sistema visual final

### E1. Dirección: “Taller sereno”

La identidad se apoya en cuatro materiales: **papel técnico** para lectura, **piezas** para hitos discretos, **banco oscuro** para código y **tinta índigo** para acción. No hay gradientes, halos, vidrio, ilustraciones 3D, blobs, mascota, confeti ni adornos “tech”. La personalidad nace de la precisión, del contenido del CETI y de la continuidad visual entre explicación y código.

### E2. Color

Se mantiene el espacio OKLCH existente, con menos niveles visibles. Los valores son contratos de token, no colores ad hoc:

| Token | Claro | Oscuro | Uso |
|---|---:|---:|---|
| `canvas` | `oklch(.972 .005 255)` | `oklch(.183 .024 266)` | Fondo de página. |
| `text` | `oklch(.235 .024 266)` | `oklch(.962 .006 255)` | Texto principal. |
| `surface-1` | `oklch(1 0 0)` | `oklch(.222 .026 266)` | Sidebar, piezas, controles. |
| `surface-2` | `oklch(.968 .006 255)` | `oklch(.248 .027 266)` | Hover, filas alternas, agrupación sutil. |
| `surface-3` | `oklch(.934 .009 256)` | `oklch(.290 .029 266)` | Selección/pressed neutral. |
| `primary` | `oklch(.474 .178 267)` | `oklch(.735 .145 267)` | Acción, foco y avance actual. |
| `primary-hover` | `oklch(.418 .172 267)` | `oklch(.785 .132 267)` | Hover del primario. |
| `primary-soft` | `oklch(.945 .032 267)` | `oklch(.318 .078 267)` | Selección y estado actual. |
| `muted-text` | `oklch(.462 .021 264)` | `oklch(.762 .014 264)` | Texto secundario que debe seguir pasando AA. |
| `subtle-text` | `oklch(.548 .019 264)` | `oklch(.672 .016 264)` | Metadato no esencial; no usar en cuerpo pequeño sobre fondos complejos. |
| `border` | `oklch(.907 .008 258)` | `oklch(.312 .027 266)` | División ordinaria. |
| `border-strong` | `oklch(.842 .012 258)` | `oklch(.412 .030 266)` | Input, hover, contorno importante. |
| `success` | `oklch(.480 .126 158)` | `oklch(.735 .132 158)` | Correcto/completado. |
| `warning` | `oklch(.545 .132 62)` | `oklch(.760 .145 70)` | Advertencia recuperable, pistas/XP solo como acento. |
| `danger` | `oklch(.512 .196 25)` | `oklch(.710 .175 25)` | Error/destrucción. |
| `info` | `oklch(.508 .122 232)` | `oklch(.735 .115 232)` | Estado informativo. |
| `terminal` | `oklch(.235 .031 266)` | `oklch(.175 .026 266)` | Editor/consola/pruebas. |
| `terminal-elevated` | `oklch(.282 .032 266)` | `oklch(.222 .030 266)` | Línea activa/toolbar. |
| `terminal-text` | `oklch(.945 .008 255)` | `oklch(.945 .008 255)` | Texto de instrumento. |

Reglas:

- Ningún significado depende solo del color: siempre se combina con icono, texto, patrón o posición.
- Ámbar significa advertencia o recompensa puntual; no navegación ni marca.
- Verde significa resultado correcto/completado; no acción primaria.
- La selección usa `primary-soft` + borde/indicador, no una masa azul diferente en cada pantalla.
- Todo par final se prueba con WCAG 2.2: 4.5:1 para texto normal, 3:1 para texto grande, componentes y foco; no se aprueba por inspección visual.[^13]

### E3. Tipografía

**Figtree** para interfaz y lectura; **JetBrains Mono** para código, salida, atajos y valores que necesitan alineación. Ambas familias son aptas para producción y se cargan localmente o mediante el pipeline actual; no se introduce una tercera fuente.

| Rol | Tamaño / línea | Peso | Uso |
|---|---|---:|---|
| Display | `clamp(44px, 5vw, 64px) / .98` | 800 | Solo hero público. |
| H1 aplicación | 32 / 38 px | 750–800 | Un título por página. |
| H1 lección | 36 / 42 px escritorio; 30 / 36 px móvil | 750–800 | Nombre del paso/lección. |
| H2 | 24 / 30 px | 700 | Secciones principales. |
| H3 | 18 / 24 px | 700 | Pieza o subsección. |
| Cuerpo lectura | 18 / 31 px | 400 | Explicación y consigna. |
| Cuerpo UI | 15 / 22 px | 400–500 | Navegación, tarjetas, formularios. |
| Meta | 13 / 18 px | 500 | Estado y datos secundarios. |
| Micro | 12 / 16 px | 650 | Eyebrow excepcional, no como plantilla universal. |
| Código escritorio | 14 / 22 px | 400 | Monaco y bloques. |
| Código móvil | 16 / 25 px | 400 | Evita zoom del navegador y mejora edición táctil. |

- Medida de lectura: **62–68ch**; consignas de retos: **58–62ch**.
- Títulos usan balanceo de línea solo si no genera saltos impredecibles.
- Mayúsculas + tracking se reservan a nombres de unidad o tipo de actividad; máximo una por viewport.
- Cifras de métricas usan Figtree con `font-variant-numeric: tabular-nums`; monospace no se usa como decoración.
- Monaco usa JetBrains Mono y `fontLigatures: false` para que cada carácter conserve forma inequívoca.

### E4. Espacio, geometría y elevación

Escala: **4, 8, 12, 16, 24, 32, 48, 64, 96 px**. Se permiten 20 y 40 solo en layouts, no como nuevos tokens.

| Token | Valor | Uso |
|---|---:|---|
| `radius-control` | 6 px | Botones compactos, inputs de código, tags rectangulares. |
| `radius-piece` | 10 px | Tarjetas accionables, formularios, editor interno. |
| `radius-panel` | 14 px | Módulo “Continúa”, paneles principales, diálogo. |
| `radius-round` | 999 px | Avatar, status chip y contador; nunca un contenedor ordinario. |

- Borde estándar 1 px; foco 2 px + offset 2 px.
- Sin sombra en piezas, módulos, editor o sidebar en reposo.
- `shadow-float`: `0 8px 24px rgb(15 23 42 / .14)` solo para menús/popovers.
- `shadow-dialog`: `0 20px 60px rgb(15 23 42 / .22)` solo para modal verdadero.
- Hover no traslada ni escala tarjetas. Cambia fondo/borde en 120–160 ms.

### E5. Iconografía e imágenes

- Un solo set lineal (Lucide actual), trazo 1.75–2 px; tamaños 16, 18, 20 y 24 px.
- Icono solo cuando mejora reconocimiento; toda acción crítica tiene etiqueta visible o nombre accesible inequívoco.
- Flecha derecha significa continuar/abrir; chevron significa revelar; “play” significa ejecutar. No intercambiarlos.
- Landing y estados vacíos usan producto real, código o composición tipográfica. Si una imagen no explica algo que el texto no puede, se omite.

---


## F. Movimiento y respuesta temporal

El movimiento comunica cambio; nunca ambienta la interfaz.

| Evento | Duración | Curva | Comportamiento |
|---|---:|---|---|
| Hover/focus/pressed | 120–160 ms | `ease-out` | Color, borde u opacidad; sin desplazamiento. |
| Abrir menú/popover | 160 ms | `cubic-bezier(.2,.8,.2,1)` | Opacidad + 4 px vertical. |
| Panel/drawer | 200–220 ms | misma | Traslación máxima 16 px + opacidad. |
| Cambio de paso | 180–220 ms | `ease-out` | Fundido de contenido; foco al nuevo H1. |
| Progreso ganado | 320–480 ms | `ease-out` | Relleno una sola vez; el texto cambia de inmediato. |
| Resultado correcto/error | 140–180 ms | `ease-out` | Borde, icono y mensaje; sin shake ni bounce. |

Reglas:

- El estado “estás aquí”, la llama y los indicadores quedan inmóviles en reposo.
- No hay parallax, partículas, gradientes animados, confeti ni contadores que “ruedan”.
- El loading que supera 300 ms muestra skeleton o estado textual de la geometría final. Compilar/evaluar siempre muestra verbo de fase.
- `prefers-reduced-motion: reduce` elimina traslación, escala, parpadeo, scroll suave y animación de progreso. Mantiene cambios instantáneos de color, texto y foco.
- Ninguna animación bloquea interacción ni es la única prueba de que algo sucedió.

---

## G. Gramática de componentes

### G1. Acciones

| Nivel | Tratamiento | Uso |
|---|---|---|
| Primaria | Fondo `primary`, alto 44 px (48 móvil), texto semibold | Una por región decisional: Crear cuenta, Empezar, Continuar, Enviar solución. |
| Secundaria | Fondo transparente/surface, borde fuerte | Ejecutar, guardar cambio, acción alternativa. |
| Terciaria | Texto + icono opcional, fondo solo en hover | Volver, reiniciar, revelar detalle. |
| Destructiva | `danger`, confirmación contextual | Eliminar cuenta/amigo cuando corresponda. |

Los estados son default, hover, pressed, focus-visible, loading y disabled. `disabled` no baja el contraste del texto por debajo de AA: se usa fondo/borde distintos y `aria-disabled`; el motivo se explica cerca cuando no es obvio. Un botón en loading conserva ancho, cambia verbo (“Compilando…”) y no depende solo de spinner.

### G2. Inputs y formularios

- Alto 44 px escritorio y 48 px táctil; label encima, siempre visible.
- Ayuda debajo antes del error; error reemplaza o sigue a la ayuda sin mover el foco de forma inesperada.
- Validar formato al salir del campo; validar credenciales al enviar; disponibilidad de usuario puede ser asíncrona con estado textual.
- Error: borde `danger`, icono, mensaje concreto y vínculo semántico con `aria-describedby`. Ejemplo: “La contraseña necesita al menos 8 caracteres”, no “Valor inválido”.
- Nunca usar placeholder como label. Mostrar contraseña ofrece texto e icono, no ojo solo.
- El formulario enfoca el primer error al enviar y conserva todos los datos válidos.

### G3. Piezas accionables

Una pieza representa un objeto que se puede abrir: curso, unidad, lección o reto.

Anatomía: tipo/estado opcional → título → descripción breve → progreso o metadatos → acción implícita o explícita. La pieza completa puede ser enlace solo si no contiene otras acciones. En hover cambia `border` a `border-strong` y `surface-2`; en focus muestra anillo externo. No se eleva.

**No usar pieza/tarjeta para:** encabezados, grupos de texto, tres métricas contiguas, un estado vacío simple, filtros o navegación primaria.

### G4. Tags, badges y contadores

- **Tag:** categoría estable (“C++”, “Intermedio”); radio 6 px, no píldora total.
- **Status chip:** estado vivo (“Curso actual”, “Completada”); puede ser píldora e incluye icono/texto si el color comunica.
- **Contador:** cantidad compacta asociada a control; píldora mínima.
- **Eyebrow:** etiqueta de contexto (“Unidad 1”); texto, no contenedor salvo tipo de ejercicio.

### G5. Gramática de progreso

| Cardinalidad | Representación | Detalle |
|---:|---|---|
| 1 | Estado textual | “Sin empezar”, “En curso”, “Completada”. |
| 2–12 | Ladrillos discretos | Cada bloque corresponde a un paso/lección; 6–10 px; actual, completo y pendiente. |
| 13–24 | Segmentos agrupados | Agrupar por subunidad/hito; tooltip y nombre accesible. |
| >24 | Barra proporcional | 6 px de alto, cuenta `completadas/total` y porcentaje redondeado. |

Todas las variantes tienen un nombre accesible completo, por ejemplo: “Curso C++ desde cero: 14 de 67 lecciones, 21 %”. Nunca se generan 80 nodos de foco. El mapa vertical puede usar un nodo por **unidad**, no uno por cada lección del curso.

### G6. Learning Bar

Orden DOM: Volver → contexto → progreso → ayuda → salir. En escritorio, el contexto no excede 280 px; truncar visualmente pero conservar nombre completo en título accesible. “Salir” vuelve a la unidad o al origen de la práctica y, si hay edición sin guardar, confirma. `Esc` cierra menús, no abandona la lección.

### G7. Banco de trabajo de código

Editor, controles, consola, pruebas y feedback forman un solo componente compuesto:

1. **Toolbar** de 40 px: archivo/lenguaje a la izquierda; accesibilidad/atajos en menú a la derecha.
2. **Editor**: mínimo 280 px de alto en lección, 420 px en reto de escritorio; redimensionable verticalmente donde ya sea viable.
3. **Action row**: “Ejecutar” como secundaria/instrumental; “Enviar solución” como primaria solo en ejercicios calificables; “Reiniciar” terciaria.
4. **Output tabs**: Consola, Pruebas y Problemas solo si existen; badge de cuenta en Problemas.
5. **Feedback**: encabezado de estado, resumen, ubicación y acción. Persiste hasta el siguiente intento.

Semántica verbal:

- **Ejecutar:** compila y corre para observar salida; no implica corrección.
- **Enviar solución:** ejecuta evaluación/pruebas y decide resultado.
- Fases visibles: “Preparando…”, “Compilando…”, “Ejecutando…”, “Evaluando 2 de 5 pruebas…”.
- Resultados: “Se ejecutó sin errores” no equivale a “Solución correcta”.

Monaco:

- JetBrains Mono, ligaduras desactivadas, `wordWrap: on` inicial, minimapa desactivado en ejercicios cortos.
- Ayuda accesible expone: `Ctrl/Cmd + Enter` ejecutar, `Ctrl + M` liberar `Tab` en Windows/Linux, equivalente documentado en macOS, `F8`/`Shift + F8` siguiente/anterior problema.[^9]
- Los atajos no se activan cuando el foco está en otro botón, input, select o contenido editable.
- Los diagnósticos se anuncian en una región `aria-live="polite"`; el resumen de ejecución recibe foco solo a petición o después de enviar, no tras cada tecla.
- En móvil, fuente 16 px, teclado no provoca zoom y el documento no hace scroll horizontal; el propio editor puede desplazarse cuando el usuario desactiva wrap.

### G8. Feedback de aprendizaje

- **Correcto:** icono + “Correcto” + explicación de una línea si aporta aprendizaje; botón Continuar.
- **Incorrecto:** icono + “Aún no” o mensaje específico; conserva selección/código; explica el principio o caso fallido; permite corregir en el mismo contexto.
- **Pista:** se revela en flujo bajo la consigna, numerada y acumulativa; no modal, no tooltip, no penalización visual humillante.
- **Intentos:** se comunica de forma neutra. Si el modelo actual revela respuesta tras tres intentos, se mantiene, pero “Ver explicación” sustituye un lenguaje de derrota.
- **Completado:** estado en flujo, no modal. Muestra “Lección completada”, qué práctica se realizó, XP recibido como dato secundario, progreso actualizado y un CTA “Siguiente lección”.

### G9. Estados transversales

| Estado | Patrón |
|---|---|
| Vacío inicial | Título factual, una frase y acción posible; sin ilustración ni borde punteado ornamental. |
| Vacío filtrado | “No hay resultados con estos filtros” + “Limpiar filtros”. |
| Loading | Skeleton con geometría final o verbo de fase; nunca rejilla genérica ajena a la pantalla. |
| Error recuperable | Mensaje local, causa comprensible, Reintentar; conserva datos. |
| Error de página | Qué no cargó, impacto, Reintentar y Volver a Inicio; identificador técnico copiable en detalle. |
| Offline/interrupción | Banner persistente no bloqueante; explicar qué trabajo sigue local y qué no puede enviarse. |
| Guardado | Estado discreto junto al control; no toast por cada autosave. |

---

## H. Especificación pantalla por pantalla

### H1. Landing pública

**Conservar:** header sobrio, titular “Aprende a programar escribiendo código”, dos CTA, demostración de código/salida, prueba de amplitud curricular, explicación práctica y FAQ.

**Composición final:**

- Header: 72 px escritorio, 60 px móvil; marca independiente, anclas “Por qué”, “Cómo funciona”, “Temario”, “Preguntas”; tema, Iniciar sesión y Crear cuenta. En móvil: marca, Iniciar sesión y menú; Crear cuenta reaparece como CTA del hero.
- Hero escritorio: grid 7/5, `max-width: 1120px`, padding vertical 104/96 px, gap 72 px. Titular máximo 11–12 palabras visibles en tres líneas; párrafo 55–62ch; CTA primaria y secundaria; línea de confianza “Sin instalar nada · En español · Gratis”.
- Demostración: editor real estático o interacción controlada, no mockup flotante. Debe incluir nombre de archivo, código sintácticamente válido, acción y salida. En móvil queda bajo el CTA y permite scroll local si es indispensable.
- Franja de cifras: datos desde una sola fuente del currículo. Con el estado evaluado: **56 unidades, 276 lecciones, 227 ejercicios, $0**; si cambia el contenido, cambia la vista. Añadir `aria-label` semántico a cada cifra.
- Orden de cuerpo: La idea → cómo se aprende → cuatro cursos → tipos de paso/práctica → preguntas → CTA final.
- Temario: cuatro paneles resumen con curso, semestres, unidades/lecciones/ejercicios y objetivos; detalle de unidades bajo `details`/acordeón accesible por curso. No renderizar de inicio 56 unidades como una pared de texto.
- Footer y zona de confianza: “CPP-CETI es una plataforma independiente y no oficial, creada como apoyo para estudiantes del CETI.” No usar escudo, logotipo o lenguaje que sugiera aprobación institucional.

**Copy prohibido:** promesas de dominar, transformar el futuro, aprender sin esfuerzo o resultados no demostrados. La prueba debe ser el producto.

### H2. Inicio de sesión y registro

**Escritorio:** split 40/60. Izquierda es una hoja de contexto sobria con propuesta, tres beneficios concretos y aviso no oficial; derecha contiene un formulario de máximo 420 px. No encerrar ambos lados en tarjetas adicionales.

**Móvil:** una columna; marca, título, formulario, opción Google y enlace alternativo. El texto promocional se reduce a una frase y el aviso permanece al final.

- Mantener labels; separar OAuth con “o continúa con correo”.
- Password manager y pegado siempre permitidos; la autenticación no depende de acertijos ni memoria artificial, conforme a autenticación accesible de WCAG 2.2.[^3]
- Registro muestra requisitos antes de error. Username explica formato y disponibilidad sin parpadeo.
- Tras éxito, volver a la intención original si el usuario llegó desde una lección; si no, Inicio del curso.

### H3. Selección de cursos

- Header de página con H1 “Tus cursos” y una explicación de máximo dos líneas.
- Grid de dos columnas ≥960 px; una columna debajo. Gap 16 px.
- Cada curso: tag lenguaje + status, título, alcance/semestres, barra proporcional, `0/67 lecciones · 0 %`, y un botón cuyo verbo refleja estado: Empezar, Continuar o Ver curso.
- Curso actual se identifica por status chip y borde izquierdo/alto en `primary`, no solo por botón azul.
- Los cuatro botones no son primarios simultáneos: solo el curso actual/último usado tiene acción primaria; los demás son secundarios.
- No dibujar una marca por cada lección. La barra es continua.

### H4. Inicio del curso

- Layout escritorio ≥1100: contenido principal 2fr y columna contextual 320 px; debajo de 1100, una columna.
- Saludo breve, sin heroización del nombre.
- Módulo **Continúa**: nombre de unidad, título de lección/paso, duración estimada, avance de la unidad y CTA. Superficie `primary-soft` moderada, sin pulse, sin sombra, máximo 760 px.
- Banner “Encuentra a tus compañeros” pasa bajo el mapa o a la columna contextual; no se sitúa entre continuar y currículo. Puede cerrarse y no reaparece en esa sesión.
- Columna contextual: nivel/progreso en un módulo; racha y XP como dos filas compactas; Amigos como lista/estado. Ningún número excede visualmente el título de la siguiente lección.
- Mapa: título, cuenta global y agrupación por semestre. Cada unidad es una pieza de una fila: número, título, `x/y lecciones`, status y chevron. La línea vertical conecta unidades; solo el nodo actual usa índigo. Unidades futuras son visibles, no bloqueadas visualmente salvo requisito real.

### H5. Unidad

- Breadcrumb Inicio / Unidad; título, objetivo en una frase, progreso y duración agregada.
- Lista de lecciones en una sola columna hasta 900 px de ancho. Cada fila: número, título, tipo dominante/duración, status, acción.
- El paso actual recibe indicador de 3 px + “Sigue aquí”; completado usa check + texto accesible; futuro no se representa como disabled si se puede abrir.
- La teoría descriptiva de la unidad aparece antes de la lista solo si orienta; máximo 68ch.
- El CTA de la lección actual es el único primario.

### H6. Lección: marco común

- Learning Bar según D3.
- Contenido teórico `max-width: 720px`, padding superior 40 px escritorio/24 px móvil y fondo canvas.
- Eyebrow “Unidad 1 · Tu primer programa en C++”; H1; objetivo en una línea; regla a 24 px; contenido del paso.
- Una consigna por viewport siempre que el contenido lo permita. No envolver consigna, editor y feedback en tarjetas independientes.
- Navegación al pie: Anterior terciario a la izquierda; acción de verificación/Continuar a la derecha. En móvil, acciones apiladas, primaria primero visualmente pero después en DOM si preserva lectura lógica.
- Al cambiar de paso, foco programático al H1 y anuncio “Paso 2 de 3”. El scroll vuelve al inicio del contenido, no al documento global si hay paneles internos.

### H7. Paso de ejemplo de código

- Explicación y ejemplo comparten columna. El banco de trabajo ocupa hasta 900 px y puede superar la medida de lectura sin estirar el párrafo.
- Botón **Ejecutar**; `Ctrl/Cmd + Enter` como ayuda secundaria, nunca como único modo.
- Consola conectada visualmente bajo el editor; output preserva espacios y permite copiar.
- “Reiniciar” pide confirmación solo si el código difiere del inicial; permite deshacer inmediatamente cuando sea técnicamente viable.

### H8. Opción múltiple

- Pregunta 62ch; opciones como radios grandes de ancho completo, separación 8 px, target ≥44 px.
- Antes de verificar no hay color correcto/incorrecto. Tras verificar, selección errónea mantiene marca, añade icono y explicación; las demás opciones vuelven a estar disponibles. Botón “Verificar otra opción” se activa con nueva selección.
- Nunca revelar la correcta solo con verde. Usar icono, etiqueta y explicación.
- No barajar respuestas mientras se reintenta.

### H9. Completar código

- El bloque es código, no formulario genérico. Inputs se adaptan al número esperado con mínimo táctil de 44 × 36 px y label accesible “Hueco 1 de 2, objeto de salida”.
- `Tab` recorre huecos; `Shift+Tab` vuelve; al verificar, el foco llega al primer hueco incorrecto o al resumen de correcto.
- El ancho del input no revela de forma precisa la respuesta. En móvil puede ocupar una línea propia sin romper sintaxis ni causar scroll del documento.
- Pistas aparecen bajo el bloque, numeradas y acumulativas; no como dos botones equivalentes siempre visibles si aún no se pidió ayuda. Acción inicial: “Ver una pista”.

### H10. Ordenar y emparejar

- Arrastrar es opcional, no requisito. Cada elemento ofrece controles “Subir/Bajar” o selección origen-destino por teclado, con anuncios de posición.
- Columnas pasan a una sola secuencia en móvil. Líneas de conexión nunca son la única representación de una pareja.
- Estado correcto identifica pares/orden por texto e icono. No mover elementos automáticamente antes de que el usuario pueda comprender el resultado.

### H11. Reto de código y práctica

**≥1100 px:** banco de trabajo en dos columnas, prompt 38 % y editor/resultado 62 %, gap 24 px, `max-width: 1280px`. El lado del editor puede quedar sticky bajo la Learning Bar si su altura total cabe en viewport; si no, fluye normalmente.

**768–1099 px:** una columna; prompt, ejemplos/casos, editor, acciones, resultado, pistas.  
**<768 px:** misma secuencia, padding 16 px, editor 320–420 px de alto; acciones inmediatamente debajo, no fijas sobre el teclado.

- El prompt incluye objetivo, entrada, salida, restricciones y ejemplos solo cuando aplican. Metadatos en definición/lista, no en cinco tarjetas.
- “Ejecutar” prueba libremente y presenta consola; “Enviar solución” evalúa. Envío recibe jerarquía primaria; ejecutar tiene tratamiento de instrumento claramente visible.
- Resultado de pruebas usa tabla/lista: caso, esperado, obtenido, estado. Datos largos tienen scroll local; la página conserva reflow.
- Mensaje superior resume “3 de 5 pruebas pasaron”; detalles explican la primera diferencia accionable. No revelar casos ocultos si son parte del modelo actual, pero describir la categoría del fallo.
- El código del estudiante no se pierde al navegar por pista, cambiar tema, abrir salida o recibir error de red.

### H12. Índice de Práctica

- H1, descripción breve, progreso global como barra proporcional `x/80` (o total vigente).
- Sustituir la nube de 10 píldoras por un **selector de unidad**: en escritorio lista/tab vertical compacta de 260 px junto a retos; en tablet/móvil, botón “Unidad: Tu primer programa…” que abre sheet/select accesible.
- Retos en una lista de una columna hasta 960 px; en escritorio ancho puede dividirse en dos columnas solo si cada tarjeta conserva títulos completos.
- Cada reto: título, una línea de objetivo, dificultad, XP y status. Dificultad usa texto + color; XP es secundario.
- Filtros adicionales solo si ya existen; no añadir búsqueda ornamental para 80 elementos agrupados.

### H13. Perfil propio y público

- `max-width: 880px`. Cabecera con avatar, nombre, usuario, fecha y bio; Editar perfil junto a la identidad propia, no flotando a distancia.
- Nivel es un módulo principal plano; estadísticas son tres columnas con divisores, no otra tarjeta anidada.
- Actividad reciente es lista cronológica. Vacío: “Todavía no hay actividad. Completa una lección y aparecerá aquí.” Sin borde punteado.
- En perfil público se ocultan controles propios; se muestra Agregar/Estado de amistad con verbo claro. No exponer datos no necesarios.
- En móvil, identidad y acción se apilan; estadísticas conservan dos columnas + una fila o una columna según traducción/zoom.

### H14. Liga y Amigos

- Liga: periodo y posición en header; ranking como filas/tabla responsive, no tarjetas individuales. Avatar, nombre, nivel/XP pertinente y posición. Primeros lugares pueden tener indicador sutil, sin podio, coronas animadas ni escala desproporcionada.
- Amigos: búsqueda/agregar arriba; solicitudes en sección propia; lista con nombre, progreso reciente permitido y acción contextual. No mostrar racha ajena como presión social si no es esencial.
- Estados vacíos explican valor real y una acción. Bloqueo/eliminación exige confirmación contextual y no depende de un icono.

### H15. Ajustes y edición de perfil

- Formulario de una columna, máximo 640 px, agrupado por Identidad, Apariencia, Cuenta.
- Tema usa radio/segmented control con Claro, Oscuro y Sistema si la capacidad existe; la selección tiene texto y check.
- Acciones destructivas viven al final, separadas por regla, con descripción de consecuencia y confirmación.
- Guardar cambios solo se activa si existe modificación; al guardar, confirma junto al botón y no reinicia el formulario.

### H16. Administración

La administración hereda tokens y accesibilidad, no la densidad del área de aprendizaje:

- navegación secundaria clara; filtros y búsqueda en toolbar sticky solo si no cubren foco;
- tablas para usuarios/reportes/contenido con encabezados, orden y acciones nombradas;
- status tags rectangulares; números tabulares; máximo una métrica destacada por vista;
- detalle en página o drawer ancho, no cascada de modales;
- prioridad funcional: triage, lectura, decisión, confirmación. Sin gamificación ni decoración.

---

## I. Sistema responsive

### I1. Breakpoints funcionales

Los breakpoints responden a la tarea, no a dispositivos concretos:

| Rango | Shell exploración | Contenido | Banco de trabajo |
|---|---|---|---|
| 320–479 | Topbar 56 + bottom nav | Padding 16; 1 columna | Apilado; editor 16 px; scroll local solo en código. |
| 480–767 | Igual | Padding 20–24 | Apilado; actions wrap sin truncar. |
| 768–1023 | Topbar 60 + drawer + bottom nav | Padding 32; hasta 2 columnas auxiliares | Apilado; mayor altura de editor. |
| 1024–1199 | Topbar 60 + drawer | Padding 40 | Split solo si prompt/editor conservan mínimos. |
| ≥1200 | Sidebar 248 + topbar 64 | Max 1200/1280 | Split 38/62 en retos; lectura centrada. |

### I2. Transformaciones, no encogimiento

- Sidebar → drawer → desaparece en aprendizaje.
- Grid de cursos 2 → 1; no tarjetas de 50 % demasiado estrechas.
- Columna contextual de Inicio → secciones debajo del mapa; “Continúa” siempre primero.
- Tabla de pruebas → filas apiladas con labels, excepto la región de valores que puede hacer scroll local.
- Selector lateral de unidades → select/sheet; no carrusel interminable de chips.
- Texto de breadcrumb largo → contexto corto + título en página; no cadena truncada sin sentido.
- Botones en fila → wrap y luego stack; la primaria mantiene ancho completo móvil.

### I3. Reflow, zoom y teclado móvil

- A 400 % en viewport de 1280 px, la página equivale a 320 CSS px y no tiene scroll horizontal global.[^10]
- Código, tablas de casos o diagramas pueden tener scroll horizontal **dentro de una región etiquetada**, con indicación visual y acceso por teclado.
- Headers sticky y bottom nav reservan espacio; `scroll-padding` y `scroll-margin` impiden foco oculto.
- Con teclado virtual abierto, no se fija una barra de acciones sobre el editor. La acción queda tras el editor y es alcanzable mediante scroll normal.
- Orientación landscape de móvil no se bloquea; se aprovecha para aumentar editor, sin reducir targets.

---

## J. Accesibilidad: especificación y verificación

Objetivo mínimo: **WCAG 2.2 AA** en landing, autenticación, aplicación, lecciones, prácticas, perfiles, comunidad y administración. La accesibilidad de Monaco se prueba aparte y en relación con el documento, no se da por resuelta por la librería.

### J1. Semántica y estructura

- Un `h1` por vista; encabezados sin saltos arbitrarios; landmarks `header`, `nav`, `main`, `aside` y `footer` con nombres cuando se repiten.
- Skip link “Saltar al contenido” como primer elemento enfocable del shell. En aprendizaje: “Saltar a la consigna” y “Saltar al editor” cuando ambos existen.
- Listas de cursos, unidades, lecciones, opciones y resultados usan listas/tablas reales. Un `div` clicable no sustituye botón/enlace.
- Breadcrumb tiene `nav aria-label="Ruta"` y el elemento actual no es enlace.
- El progreso usa `progress` o atributos equivalentes con valor, mínimo, máximo y nombre contextual; los ladrillos visuales son decorativos para tecnología asistiva.
- Código usa semántica apropiada, idioma del documento `es-MX` y términos en inglés marcados cuando su pronunciación/lectura lo necesite.

### J2. Teclado y foco

- Todas las acciones funcionan con teclado sin tiempo límite. Orden de foco coincide con orden visual y de lectura.
- Foco visible: anillo exterior continuo de 2 px, offset 2 px, contraste ≥3:1 contra estados adyacentes.[^14]
- Ningún sticky header, bottom nav, toast o teclado superpuesto cubre por completo el elemento enfocado.[^12]
- `Esc` cierra la capa superior; no borra contenido ni navega atrás. Los diálogos devuelven foco al disparador.
- Drawers/diálogos modales atrapan foco; popovers no modales respetan patrón ARIA aplicable.
- Monaco documenta cómo liberar `Tab`; tras salir del editor, el siguiente foco lógico es la fila de acciones.
- Shortcuts de una tecla no se activan globalmente. `Ctrl/Cmd + Enter` ejecuta solo dentro del banco de trabajo o cuando éste tiene contexto activo.

### J3. Lectores de pantalla y anuncios

- Cambio de ruta: título de documento único y foco al H1.
- Cambio de paso: anuncio “Paso n de total: título”.
- Compilación/evaluación: región de estado `polite`; fallos críticos de envío `assertive` solo cuando requieren atención inmediata.
- Resultado no se lee carácter por carácter. Se anuncia resumen; detalles permanecen navegables.
- Editor tiene label que incluye ejercicio y archivo. Consola y pruebas son regiones con encabezado; sus tabs implementan patrón de tabs completo.
- Iconos de decoración son `aria-hidden`; icon-only controls tienen nombre específico, no “botón”.
- Toasts pausables y descartables; no desaparecen antes de 6 s si contienen texto no disponible en otro lugar.

### J4. Visión, color y ampliación

- Contraste de texto normal 4.5:1, texto grande 3:1, controles/foco/gráficos necesarios 3:1.[^13]
- Estados correcto/error/actual combinan icono, texto y forma. Syntax highlighting conserva contraste y no es el único modo de entender el código.
- Zoom 200 % sin pérdida; reflow 320 CSS px según I3; texto respeta ajustes de espaciado del usuario.
- Dark theme no usa texto gris demasiado tenue para información necesaria. `subtle-text` se limita a metadata prescindible y se audita en cada superficie.
- No hay texto incrustado en imágenes.

### J5. Motricidad, táctil y tiempo

- Objetivo operativo 44 × 44 px para controles táctiles; mínimo normativo de 24 × 24 solo para controles densos con separación suficiente.[^11]
- Drag siempre tiene alternativa por click/teclado. Hover nunca revela una acción sin equivalente persistente/focus.
- No se exige precisión fina para huecos de código; sus cajas tienen target ampliado aunque el ancho visual del token sea pequeño.
- Sesiones y compilaciones no caducan sin aviso. Si existe timeout, se permite extender.
- No se introduce interacción basada en movimiento del dispositivo.

### J6. Cognición y lenguaje

- Un término por concepto: `lección`, `paso`, `unidad`, `reto`, `ejecutar`, `enviar solución`. No alternar `ejercicio/desafío/reto` en la misma jerarquía.
- Mensajes indican qué pasó y qué hacer. Se conservan entradas correctas y código.
- Instrucciones complejas se dividen en lista; ejemplos aparecen junto a la regla que ilustran.
- Duraciones son aproximadas y nunca promesa/penalización.
- Evitar presión: “Empieza hoy” puede acompañar racha cero; no usar culpa, pérdida o urgencia falsa.

### J7. Matriz de prueba obligatoria

| Dimensión | Casos mínimos | Criterio |
|---|---|---|
| Teclado | Landing→registro; Inicio→lección→cierre; Práctica→reto→resultado; menú, dialog, Monaco | Sin trampa, orden lógico, acción posible, foco visible. |
| Lector de pantalla | NVDA + Chrome/Firefox; VoiceOver + Safari | Títulos, landmarks, labels, progreso, errores y resultados comprensibles. |
| Reflow/zoom | 320 CSS px; 200 % y 400 %; texto espaciado | Sin pérdida/solapamiento/scroll global horizontal. |
| Contraste | Ambos temas, todos los estados | AA automatizado + revisión manual de foco/syntax. |
| Táctil | 390 × 844 y 360 × 800 | Targets, teclado virtual, acciones y scroll funcionales. |
| Movimiento | Reduced motion | Sin movimiento no esencial; estados siguen claros. |
| Contenido | Títulos/usuarios/bios largos, 0 y 100 %, 20 unidades | Sin truncar significado ni romper geometría. |
| Red/estado | lento, offline, error compilador, error API, doble click | Feedback de fase, idempotencia, recuperación y datos conservados. |

No se declara conformidad solo con Lighthouse/axe. Automatización detecta una fracción; teclado, lector, zoom y comprensión se prueban manualmente.

---

## K. Identidad propia y sistema anti-AI-slop

### K1. Lo que hace reconocible a CPP-CETI

1. Contenido y ejemplos ligados al temario real, en español de México.
2. Transición inmediata de explicación a código ejecutable.
3. Metáfora de piezas construidas, usada con disciplina en secuencias cortas.
4. Papel técnico claro/oscuro y banco de trabajo terminal estable.
5. Tono directo, compañero y competente; no infantil ni institucional.
6. Transparencia: gratuito, sin instalación y no oficial.

La identidad no depende de aplicar el logotipo a más lugares. Depende de que cada decisión parezca hecha para estudiar programación en este contexto.

### K2. Lista de prohibiciones concretas

- Gradientes de marca, glow, glassmorphism, ruido/grano decorativo o fondos de “aurora”.
- Tarjeta redondeada detrás de cada grupo, card dentro de card o tablero de métricas por defecto.
- Píldoras para navegación ordinaria, encabezados o todo metadato.
- Radios de 20–24 px sistemáticos; sombras en objetos que no flotan.
- Hover con elevación/escala; iconos de destellos; emojis funcionales; confeti.
- Eyebrow en mayúsculas antes de cada título; monospace usado para “hacerlo tech”.
- Ilustraciones genéricas de laptops, robots, cerebros o estudiantes 3D.
- Copy como “desbloquea tu potencial”, “experiencia inmersiva”, “lleva tus habilidades al siguiente nivel”, “domina” por completar o “magia”.
- Métricas heroicas sin contexto, testimonios inventados, urgencia o prueba social no verificable.
- Componentes creados solo para variar visualmente una pantalla equivalente.
- Animación permanente de llama, nodo, borde o fondo.

### K3. Reglas positivas de composición

- Antes de añadir un contenedor, intentar resolver jerarquía con espacio, alineación y tipografía.
- Antes de añadir un color, comprobar si texto/icono/posición ya expresan el estado.
- Antes de añadir una métrica, preguntar qué decisión permite tomar.
- Antes de añadir una ilustración, usar una muestra auténtica del producto.
- Cada pantalla tiene una silueta reconocible por su tarea: landing editorial, mapa vertical, hoja de lección, banco de código, lista social y tabla administrativa.
- Reutilizar anatomía y comportamiento; variar solo contenido, densidad y jerarquía justificadas.

### K4. Tono y microcopy

| Situación | Sí | No |
|---|---|---|
| Inicio | “Continúa: Tu primer cout” | “¡Sigue brillando!” |
| Correcto | “Correcto. `cout` envía texto a la salida.” | “¡Increíble! Lo dominaste.” |
| Error | “Falta `;` al final de la línea 5.” | “Algo salió mal.” |
| Racha cero | “Empieza hoy” | “¡No pierdas tu racha!” |
| Cierre | “Lección completada · +10 XP” | “¡Nivel de genio desbloqueado!” |
| Independencia | “Plataforma independiente y no oficial…” | “La plataforma del CETI”. |

---

## L. Referencias comparables: aprender sin copiar

| Referencia | Qué aprender | Qué no copiar |
|---|---|---|
| **Khan Academy** | Una siguiente acción clara, continuidad, progreso visible y motivación ligera en la experiencia reciente.[^15] | Lenguaje de aula escolar, marca, layout exacto o dependencia de video. |
| **Codecademy** | Entorno estable, contexto del curso, navegación siguiente/anterior, herramientas y ayuda accesible alrededor del editor.[^16] | Densidad comercial, upsells, panelización rígida o paridad de features. |
| **Monaco / VS Code** | Convenciones de teclado, diagnósticos, lector de pantalla, alto contraste y salida como herramienta.[^9] | Complejidad de IDE profesional, paneles no necesarios o iconografía sin etiqueta para principiantes. |
| **Duolingo** | La racha como recordatorio opcional y la claridad de la siguiente actividad.[^8] | Mascota, culpa por pérdida, economía de recompensas, animación y tono infantil. |
| **WCAG 2.2 / WAI** | Reflow, foco, targets, errores, autenticación y semántica como condiciones del layout.[^3] | Tratar conformidad como sustituto de usabilidad o identidad. |
| **Heurísticas de Nielsen Norman** | Estado visible, control, consistencia, prevención y recuperación.[^1][^2] | Aplicarlas como checklist abstracto sin evidencia contextual. |

CPP-CETI no debe “parecerse a una plataforma líder”. Debe alcanzar su claridad operacional conservando su currículo, lenguaje y firma de construcción.

---

## M. Contrato de implementación para Claude Sonnet

Esta sección prevalece como handoff operativo. La implementación puede variar internamente; el resultado observable no.

### M1. Invariantes

1. No modificar currículo, evaluación, permisos, datos ni capacidades salvo lo necesario para presentar el UX descrito.
2. Mantener Figtree, JetBrains Mono, paleta OKLCH base, terminal oscura, temas claro/oscuro y marca independiente.
3. Mantener las cuatro áreas actuales: cursos/Inicio, Práctica, Liga, Amigos, perfil/ajustes.
4. Mantener tipos de paso y progresión pedagógica; no convertirlos en un componente genérico indistinto.
5. Lecciones y retos usan modo aprendizaje sin sidebar ni bottom nav.
6. Secuencias >24 nunca se dibujan como una pieza por elemento.
7. Máximo una acción sólida primaria por región decisional.
8. Feedback de campo, respuesta, compilación y prueba aparece junto al origen y persiste hasta corrección/reintento.
9. XP/racha/nivel no aparecen en la Learning Bar ni dominan una vista de aprendizaje.
10. No usar color como único estado; foco visible; targets; reflow; reduced motion y teclado cumplen J.
11. El aviso de independencia conserva el texto acordado y no se introduce branding oficial del CETI.
12. No gradients, glows, glass, confetti, hover lift, animación continua ni ilustración genérica.
13. Monaco usa JetBrains Mono, ligaduras desactivadas y escape de `Tab` documentado.
14. Completar una unidad/lección no se llama “dominar”.
15. Estadísticas públicas se derivan de una sola fuente vigente.

### M2. Libertad de implementación

Sonnet puede decidir:

- división exacta de componentes React y nombres internos;
- uso de CSS Grid/Flex cuando produce las medidas y transformaciones definidas;
- orden de migración y reutilización de primitives actuales;
- detalles de skeleton compatibles con geometría final;
- si el selector de unidad móvil es sheet, dialog o select enriquecido, siempre que sea accesible;
- si el resumen de finalización reemplaza el paso o se añade después, siempre que permanezca en flujo y el foco sea correcto;
- pequeños ajustes de OKLCH para superar contraste, conservando roles y carácter;
- puntos de corte ±32 px cuando el contenido demuestre una ruptura real, documentándolo.

No tiene libertad para reintroducir patrones prohibidos por conveniencia o para escoger una dirección artística alternativa.

### M3. Orden de prioridad de implementación

1. **Fundamentos:** tokens, tipografía, foco, superficies, botones, inputs, progreso.
2. **Shells:** exploración responsive y modo aprendizaje.
3. **Ciclo crítico:** Inicio → lección → editor/feedback → cierre.
4. **Práctica:** índice, reto, pruebas y recuperación.
5. **Cursos/unidad:** selección, mapa y listas.
6. **Auth/landing:** consistencia, datos y responsive.
7. **Perfil/comunidad/ajustes.**
8. **Administración y estados raros.**

Cada fase debe terminar con auditoría de teclado, 320 px, ambos temas y estados async antes de avanzar.

### M4. Criterios de aceptación observables

**Arquitectura y jerarquía**

- A 1440 px una vista de exploración usa sidebar de 248 px ±8 y topbar de 64 px ±4; una lección no muestra sidebar, topbar global ni bottom nav.
- Inicio presenta una sola acción dominante para retomar; el mapa se entiende sin consultar la sidebar.
- La sidebar nunca contiene el índice completo de 10–20 unidades como lista persistente.
- En ninguna región hay dos botones sólidos primarios equivalentes.

**Aprendizaje y código**

- Curso, unidad y “n de total” son identificables en toda lección.
- “Ejecutar” y “Enviar solución” producen estados y lenguaje distintos.
- Error de compilación, caso fallido y respuesta incorrecta aparecen junto al instrumento/pregunta y contienen una acción de recuperación.
- Cambiar tema, abrir pista o recibir error de red no borra código.
- Finalización es un estado en flujo; evidencia de actividad precede al XP; “Siguiente lección” es el CTA.

**Sistema visual**

- Curso, reto, editor, sección, métricas y overlay no comparten indiscriminadamente el mismo contenedor.
- Superficies ordinarias no tienen sombra; píldora completa solo aparece en status/contador/avatar.
- No hay animación cuando la pantalla está en reposo.
- Ladrillos se usan solo dentro de umbral; 67/80/92 se muestran con barra + cuenta.
- Monaco usa la fuente y configuración indicadas.

**Responsive**

- A 390 × 844 no hay scroll horizontal del documento, texto cortado ni acción tras bottom nav.
- En lección móvil no aparece bottom nav; la barra de aprendizaje y el editor permanecen utilizables con teclado virtual.
- A 768–1099 el reto se apila; a ≥1100 solo se divide si cada columna conserva sus mínimos.
- A 400 % no se pierde información ni foco; scroll bidimensional queda confinado a regiones justificadas.

**Accesibilidad**

- Flujos críticos completables solo con teclado; ningún foco invisible/oculto/trap no intencional.
- Estados, progreso, dificultad y validación comprensibles sin color.
- Contraste AA demostrado en ambos temas, incluidos disabled, focus, syntax y mensajes.
- NVDA/VoiceOver anuncian página, paso, editor, fase y resumen de resultado en orden.
- Reduced motion elimina todas las animaciones no esenciales.

**Confianza y contenido**

- Landing y footer comunican independencia/no oficial sin ambigüedad.
- Cifras de unidades/lecciones/ejercicios coinciden con el contenido publicado.
- No aparece “dominio” como consecuencia de completar.
- Texto largo, usuarios largos, progreso 0/100 %, curso de 20 unidades y errores extensos no rompen layout.

### M5. Regresiones prohibidas

- Perder acceso visible a Práctica, Liga o Amigos por simplificar el shell.
- Ocultar mapa/avance hasta volver a cursos.
- Hacer que el editor claro/oscuro cambie de forma que reduzca consistencia o contraste.
- Convertir el CTA de ejecución en icono sin etiqueta.
- Hacer drag obligatorio, atrapar `Tab` sin salida o interceptar Enter fuera del editor.
- Mostrar éxito de ejecución como éxito de solución.
- Reducir densidad a costa de más scroll sin jerarquía, especialmente en práctica.
- Sustituir contenido real por ilustración o copy aspiracional.
- Eliminar gamificación/social en vez de jerarquizarla.
- Ocultar el aviso no oficial, usar identidad visual institucional o insinuar aval.
- Introducir dependencias visuales que impidan SSR, carga progresiva o estados de error actuales.
- Reescribir componentes funcionales solo para cumplir estética cuando una variante/tokens resuelve el resultado.

### M6. Checklist de cierre para cada pantalla

Antes de marcar una pantalla como terminada, responder sí a todo:

1. ¿La acción principal se identifica sin leer todo?
2. ¿El usuario sabe dónde está, qué cambió y cómo salir?
3. ¿Cada contenedor tiene una función distinta y necesaria?
4. ¿Progreso y estado son legibles en texto, no solo color/forma?
5. ¿Funciona con teclado, foco visible y lector de pantalla?
6. ¿Funciona a 320 CSS px, 200/400 % y con texto largo?
7. ¿El estado loading, vacío, error, disabled, offline y éxito está resuelto?
8. ¿Reduced motion conserva toda la información?
9. ¿La pantalla se reconoce como CPP-CETI por su contenido y gramática, no por decoración?
10. ¿Se preservó una solución actual cuando seguía siendo la mejor?

---

## Apéndice 1. Inventario de tokens de layout

| Token | Valor final |
|---|---:|
| Sidebar desktop | 248 px |
| Topbar desktop | 64 px |
| Topbar tablet | 60 px |
| Learning Bar | 60 px desktop / 56 px móvil |
| Bottom nav | 64 px + safe area |
| Contenido app | 1200 px máximo |
| Banco de reto | 1280 px máximo |
| Lectura | 720 px / 62–68ch |
| Prompt de reto | 58–62ch |
| Padding desktop | 40 px |
| Padding tablet | 32 px |
| Padding móvil | 16–24 px |
| Gap grid | 16–24 px |
| Target estándar | 44 × 44 px |
| Borde | 1 px |
| Foco | 2 px + offset 2 px |

---

## Apéndice 2. Matriz de decisiones por tipo de paso

| Tipo actual | Superficie | Acción primaria | Feedback | Móvil |
|---|---|---|---|---|
| Teoría | Hoja de lectura | Continuar | Estado de paso | 1 columna, 18/31 px |
| Ejemplo código | Hoja + instrumento | Continuar tras ejecutar cuando proceda | Consola conectada | Editor 16 px, acciones debajo |
| Opción múltiple | Grupo de radios | Verificar | Bajo opciones | Targets 44 px, sin 2 columnas |
| Completar código | Instrumento compacto | Verificar código | Primer hueco + resumen | Huecos pueden saltar línea |
| Ordenar | Lista manipulable | Verificar orden | Lista + posiciones | Una columna, subir/bajar |
| Emparejar | Dos conjuntos/selección | Verificar pares | Texto + icono por pareja | Selección secuencial |
| Reto guiado | Prompt + instrumento | Enviar solución | Consola/pruebas | Todo apilado |
| Práctica libre | Prompt + instrumento | Enviar solución | Pruebas y caso fallido | Todo apilado |

---

## Fuentes

[^1]: Nielsen Norman Group, [10 Usability Heuristics for User Interface Design](https://www.nngroup.com/articles/ten-usability-heuristics/) y [Visibility of System Status](https://www.nngroup.com/articles/visibility-system-status/).
[^2]: Nielsen Norman Group, [Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/).
[^3]: W3C WAI, [Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/), incluyendo estructura, teclado, foco, errores y autenticación accesible.
[^4]: NSW Department of Education, [Cognitive load theory in practice](https://education.nsw.gov.au/about-us/education-data-and-research/cese/publications/practical-guides-for-educators/cognitive-load-theory-in-practice); Digital Learning Institute, [Mayer’s Principles of Multimedia Learning](https://www.digitallearninginstitute.com/blog/mayers-principles-multimedia-learning).
[^5]: Ericson et al., [A Review of Parsons Problems](https://dl.acm.org/doi/10.1145/3560266); [Investigating the Effects of Parsons Problems on Programming Ability, Self-Efficacy, and Problem-Solving Efficiency](https://arxiv.org/abs/2311.18115); Harms et al., [Using Faded Parsons Problems to Scaffold Code Writing](https://dl.acm.org/doi/fullHtml/10.1145/3411764.3445228).
[^6]: Baymard Institute, [Readability: the Optimal Line Length](https://baymard.com/blog/line-length-readability). Se usa como guía aplicada; el contenido real y el zoom mandan.
[^7]: Li, Hew y Du, [Gamification enhances student intrinsic motivation, perceptions of autonomy and relatedness, but minimal impact on competency](https://link.springer.com/article/10.1007/s11423-023-10337-7), metaanálisis de 35 intervenciones.
[^8]: Duolingo, [How Duolingo’s streak builds a learning habit](https://blog.duolingo.com/how-duolingo-streak-builds-habit/). Fuente de producto; sus asociaciones no se tratan como causalidad general.
[^9]: Microsoft, [Monaco Editor Accessibility Guide](https://github.com/microsoft/monaco-editor/wiki/Monaco-Editor-Accessibility-Guide) y [Visual Studio Code Accessibility](https://code.visualstudio.com/docs/configure/accessibility/accessibility).
[^10]: W3C WAI, [Understanding Success Criterion 1.4.10: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).
[^11]: W3C WAI, [Understanding Success Criterion 2.5.8: Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html); Apple, [Accessibility — Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/accessibility); Material Design 3, [Designing layout and structure](https://m3.material.io/foundations/designing/structure).
[^12]: W3C WAI, [Understanding Success Criterion 2.4.11: Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html).
[^13]: W3C WAI, [Understanding Success Criterion 1.4.3: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
[^14]: W3C WAI, [Understanding Success Criterion 2.4.13: Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html). Se adopta como objetivo robusto aunque 2.4.13 sea AAA; el mínimo AA sigue siendo 2.4.7/2.4.11.
[^15]: Khan Academy, [Meet the new Khan Academy classroom experience](https://blog.khanacademy.org/meet-the-new-khan-academy-classroom-experience/), 2026.
[^16]: Codecademy Help Center, [Updates to our Learning Environment](https://help.codecademy.com/hc/en-us/articles/1260803449210-Updates-to-our-Learning-Environment) y [Tools within the Learning Environment](https://help.codecademy.com/hc/en-us/articles/23368252603163-Tools-within-the-Learning-Environment).

### Fuentes primarias del producto

- [CPP-CETI en producción](https://cpp-ceti.vercel.app/).
- [Repositorio público CesarManzoCode/cpp-ceti](https://github.com/CesarManzoCode/cpp-ceti).
- [Sistema visual actual (`globals.css`)](https://github.com/CesarManzoCode/cpp-ceti/blob/main/src/app/globals.css).
- [Arquitectura del visor de lecciones](https://github.com/CesarManzoCode/cpp-ceti/blob/main/src/features/lessons/components/lesson-viewer.tsx).
- [Editor Monaco del producto](https://github.com/CesarManzoCode/cpp-ceti/blob/main/src/components/editor/code-editor.tsx).

---

## Cierre de dirección

La mejor versión de CPP-CETI no borra el producto actual. **Lo enfoca.** Conserva el contenido curricular, la práctica inmediata, el editor, la claridad del hero, los dos temas, la progresión y la firma de construcción; reemplaza únicamente aquello que hoy diluye esas fortalezas: navegación invasiva durante el estudio, progreso convertido en textura, gamificación persistente y una gramática de tarjetas demasiado uniforme.

La prueba final es simple: cuando el estudiante programa, la interfaz debe retirarse lo suficiente para que piense en C++, C#, métodos o SQL; cuando necesita orientarse, el mapa y el estado deben estar exactamente donde los espera. Ese equilibrio —no una capa nueva de estilo— es la dirección UX/UI definitiva de CPP-CETI.
