---
name: Ignacio Garbayo
description: CV web trilingüe con voz de cuaderno técnico, una sola tinta de señal y superficies planas de un píxel
colors:
  background: "#FAFAFA"
  surface: "#FFFFFF"
  foreground: "#1A1A1A"
  muted: "#4B5563"
  accent: "#2563EB"
  border: "#E5E7EB"
  threshold-pass: "#059669"
  background-dark: "#0D1117"
  surface-dark: "#161B22"
  foreground-dark: "#E6EDF3"
  muted-dark: "#C9D1D9"
  accent-dark: "#60A5FA"
  border-dark: "#2A313C"
  threshold-pass-dark: "#34D399"
typography:
  display:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.111
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.375
    letterSpacing: "normal"
  body:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.1em"
  data:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.375
    letterSpacing: "normal"
rounded:
  sm: "0.25rem"
  md: "0.5rem"
  lg: "0.75rem"
  full: "9999px"
spacing:
  stack-tight: "0.375rem"
  gutter-wide: "0.75rem"
  card-padding: "1.25rem"
  section-rhythm: "2rem"
  gutter-narrow: "1.5rem"
  header-offset: "7rem"
components:
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card-padding}"
  skill-badge:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.data}"
    rounded: "{rounded.sm}"
    padding: "0.125rem 0.5rem"
  skill-badge-hover:
    textColor: "{colors.accent}"
  link-chip:
    textColor: "{colors.accent}"
    rounded: "{rounded.md}"
    padding: "0.25rem 0.75rem"
  link-chip-hover:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
  section-title:
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
  nav-link:
    textColor: "{colors.muted}"
    padding: "0"
  nav-link-active:
    textColor: "{colors.accent}"
  score-pill:
    textColor: "{colors.accent}"
    rounded: "{rounded.md}"
    padding: "0.375rem 0.75rem"
---

# Design System: Ignacio Garbayo

## Overview

**Creative North Star: "Un cuaderno técnico personal"**

No es un cuaderno de laboratorio ni un panel de control. Es la mezcla de tres registros que ya conviven en el código: terminal, documentación técnica y portfolio personal. El contenido se presenta de forma directa, monoespaciada donde toca, estructurada y funcional. La página no simula una aplicación, documenta quién es Ignacio, qué ha estudiado, dónde ha trabajado y qué ha construido.

La densidad es media y deliberadamente escaneable. Cada sección abre con un rótulo en versalitas monoespaciadas sobre un filete de un píxel, igual que un apartado numerado de una especificación. Debajo, tarjetas de superficie clara con borde fino y esquinas suaves de 0,75 rem sostienen el contenido sin pedir protagonismo. El texto manda, el envase se retira, pero el envase está medido: nada sobra y el cuidado se nota en el detalle. Ese es el carácter de los componentes, preciso y contenido.

El color trabaja con una única tinta. Todo lo accionable, todo lo que marca estado, actividad o dirección, es azul de señal. El resto de la página vive en neutros. El sistema es plano por defecto y la profundidad viene del salto entre fondo y superficie más el filete de un píxel, no de sombras. Las tres sombras que existen no son decoración, elevan lo que flota sobre el contenido o lo que es una imagen real. El único gesto de personalidad explícito es el guion bajo en acento que cierra el apellido en la portada, un cursor de terminal incrustado en el nombre.

**Key Characteristics:**

- Seis tokens de color por tema, ni uno más, definidos como canales RGB para poder modularse en opacidad.
- Una sola tinta de señal para todo lo accionable.
- Rótulos de sección en monoespaciada, versalitas y tracking ancho sobre filete de un píxel.
- Superficies planas delimitadas por borde de un píxel, esquinas de 0,25 / 0,5 / 0,75 rem según el peso de la pieza.
- Modo oscuro real, no una inversión: la paleta oscura tiene su propia identidad de azules apagados.
- Movimiento en dos registros y solo dos: respuesta a interacción, y un revelado de entrada de una sola pasada que dibuja los elementos que ya son firma del sistema.

## Colors

Una paleta de seis papeles funcionales por tema, sin colores de apoyo. La fuente normativa es `src/frontend/app/globals.css`, donde cada token vive como triplete de canales RGB (`--color-accent: 37 99 235`) para que Tailwind pueda componer opacidades con `rgb(var(--color-accent) / <alpha-value>)`. Los hexadecimales del frontmatter son la conversión exacta de esos tripletes.

### Primary

- **Azul de señal** (claro `#2563EB`, oscuro `#60A5FA`): marca estado, actividad y dirección. Lo llevan los enlaces, el ítem activo de navegación y su subrayado deslizante, el subtítulo de cada tarjeta, las viñetas, el punto y la línea de la cronología, las barras de puntuación de idiomas y el guion bajo del nombre en portada. Aparece diluido al 10 % como fondo de las píldoras de puntuación.

### Neutral

- **Papel** (claro `#FAFAFA`, oscuro `#0D1117`): fondo de página. En claro es un blanco roto que evita el brillo del blanco puro, en oscuro es el gris azulado de GitHub.
- **Superficie** (claro `#FFFFFF`, oscuro `#161B22`): fondo de tarjetas, insignias de competencia y el desplegable de idioma. Es el único mecanismo de capa del sistema.
- **Tinta** (claro `#1A1A1A`, oscuro `#E6EDF3`): texto principal, titulares y rótulos de sección. Negro suavizado, nunca `#000`.
- **Tinta apagada** (claro `#4B5563`, oscuro `#C9D1D9`): metadatos y todo lo secundario. Fechas de la cronología, notas al pie, categorías de competencias, iconos en reposo, navegación inactiva y el pie de página. Más intensa que un gris neutro a propósito, para que siga leyéndose con fuerza aun siendo el registro secundario.
- **Filete** (claro `#E5E7EB`, oscuro `#2A313C`): bordes de tarjeta, divisores internos, la regla bajo cada rótulo de sección, los segmentos verticales del raíl de contacto y el canal vacío de las barras de puntuación.

### Tertiary

- **Verde de umbral** (claro `#059669`, oscuro `#34D399`): un solo uso en todo el sitio, la marca de nota mínima aprobatoria sobre las barras de la certificación de idioma. Es la única señal semántica que no puede ser azul, porque su significado es aprobado y no accionable.

### Named Rules

**La regla de la tinta única.** El azul de señal es el único color no neutro con papel general. Si un elemento nuevo necesita destacar, se resuelve con peso, tamaño o superficie antes que con un color nuevo. Test: si añades un segundo acento, tienes que poder decir qué significado tiene que el azul no pueda expresar.

**La regla del canal RGB.** Todo color nuevo se declara en `globals.css` como triplete de canales, nunca como hexadecimal ni como clase de la paleta de Tailwind. Un color escrito como `bg-blue-600` en un componente rompe el modo oscuro en silencio.

## Typography

**Display Font:** Public Sans (con `system-ui`, `sans-serif`), cargada por `next/font/google` en la variable `--font-sans` desde `SiteShell.tsx` (sitio público) y `cms-template/layout.tsx` (panel, copiado a `app/admin/` en build). La clase `font-sans` de Tailwind apunta a esa variable.
**Body Font:** Public Sans, la misma. El sistema es de una sola familia real para prosa y titulares.
**Label/Mono Font:** IBM Plex Mono, cargada en los pesos 400/500/600/700 en la variable `--font-mono`, junto a Public Sans en los mismos dos ficheros. La clase `font-mono` de Tailwind apunta a esa variable. Es una decisión de diseño, no un fallback.

**Character:** una geométrica neutra de alta legibilidad llevando todo el peso, con la monoespaciada usada como marca de registro y no como voz. La mono no cuenta nada, señala: esto es un rótulo, esto es un dato, esto es una anotación. El contraste entre las dos familias es lo que da el aire de documento técnico sin recurrir a ninguna serif.

### Hierarchy

- **Display** (700, `3rem`, `3.75rem` a partir de 640 px, interlineado 1, tracking `-0.025em`): solo el nombre en la portada, partido en dos líneas y con el guion bajo en acento tras el segundo componente.
- **Headline** (700, `2.25rem`, `3rem` a partir de 640 px, tracking `-0.025em`): el `h1` de las páginas de experiencia, educación y proyectos, y el de la 404.
- **Title** (700, `1.125rem`, interlineado `1.375`): el titular de cada tarjeta de la cronología. En la tarjeta de certificación de idioma baja a `1rem`.
- **Body** (400, `1rem`, interlineado `1.625`): resumen, viñetas y descripciones. Sin límite de medida declarado, la contención viene del contenedor de 64 rem.
- **Label** (700, mono, `1rem`, versalitas, tracking `0.1em`): los rótulos de sección, siempre seguidos de un filete de un píxel. Es la firma tipográfica del sistema.
- **Data** (400, mono, `0.875rem`, tinta apagada): fechas del canal izquierdo de la cronología, insignias de competencia, códigos de idioma, notas en cursiva y el año del pie.

Fuera de la escala principal: el subtítulo de portada es `1.25rem` en tinta apagada, las categorías de competencias son `0.875rem` en semibold, versalitas y tracking `0.05em`, y los rótulos de las píldoras de puntuación bajan a `10px`.

### Named Rules

**La regla del rótulo mono.** La monoespaciada es exclusivamente para rótulos, datos tabulados y anotaciones. Nunca para prosa. Si un párrafo entero está en mono, el sistema se ha roto.

**La regla de la anchura reservada.** Los enlaces de navegación pasan a semibold cuando están activos o en hover, así que cada uno lleva una copia fantasma en negrita que reserva el ancho. El texto de la interfaz no debe desplazar la maquetación al cambiar de peso.

## Layout

Una sola columna centrada de `max-w-5xl` (64 rem), sin rejilla multicolumna en ningún punto. El `body` es una columna flexible de altura mínima completa con el pie anclado abajo por `mt-auto`, de modo que las páginas cortas no dejan el pie flotando.

El acolchado horizontal se estrecha al subir de tamaño: `1.5rem` en móvil y `0.75rem` a partir de 640 px (`0.75rem` desde `1.25rem` en la barra de navegación). Es decir, la respiración lateral la da el contenedor de 64 rem, no el acolchado.

La barra de navegación es fija, de `3.5rem` de altura mínima, con fondo de página al 80 % y desenfoque de fondo de 12 px. Todas las páginas compensan con `7rem` de acolchado superior, y las secciones anclables llevan `scroll-mt-20` para que el rótulo no quede debajo de la barra al saltar.

El ritmo vertical es constante: `2rem` de acolchado por sección, `1.5rem` de separación bajo cada rótulo, `1rem` entre tarjetas hermanas y `0.375rem` en las pilas más apretadas.

La cronología reparte el ancho en tres carriles a partir de 640 px: canal de fecha de `4rem` alineado a la derecha, columna de punto y línea, y la tarjeta ocupando el resto con `1.25rem` de separación. Por debajo de 640 px los dos primeros carriles desaparecen y la fecha reaparece como línea de `0.75rem` sobre la tarjeta.

Puntos de corte en uso: **640 px** (`sm`) es el corte real entre móvil y escritorio y gobierna casi todo el sistema, **768 px** (`md`) cambia la navegación de hamburguesa a enlaces, **1024 px** (`lg`) solo controla un salto de línea del nombre, **1280 px** (`xl`) saca el bloque de contacto del pie y lo convierte en raíl vertical fijo a la izquierda.

### Named Rules

**La regla del contenedor único.** Toda página nueva se monta dentro del mismo `main` de 64 rem con el mismo acolchado. Ninguna sección se sale a ancho completo, ni siquiera para una imagen.

## Elevation & Depth

Plano con elevación funcional. La profundidad de reposo se construye con dos recursos y solo dos: el salto de fondo a superficie y el filete de un píxel. Ninguna tarjeta, insignia, divisor ni chip lleva sombra. Las tres sombras del sistema existen porque elevan algo que de verdad está por encima del contenido o porque es una imagen real que necesita despegarse del papel.

### Shadow Vocabulary

- **Barra flotante** (`box-shadow: 0 4px 20px rgba(0,0,0,0.035)`): solo la barra de navegación fija. Es casi imperceptible a propósito, su trabajo es separar la barra del contenido que pasa por debajo, junto con el fondo al 80 % y el desenfoque.
- **Retrato** (`box-shadow: 0 8px 40px rgba(0,0,0,0.12)`): solo la fotografía de la portada, en sus dos variantes de móvil y escritorio. Es la sombra más marcada del sitio y la única que se ve sin buscarla.
- **Capa emergente** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`): el desplegable del selector de idioma, la única superficie que se abre sobre otra.

### Named Rules

**La regla de la sombra con trabajo.** Una sombra nueva necesita justificar que su elemento flota sobre el contenido o que es una imagen. Un elemento estático dentro del flujo se eleva con superficie y filete, nunca con sombra.

## Shapes

Tres radios escalonados por peso de la pieza, más el círculo completo para lo que mide o marca:

- **0,25 rem**: piezas pequeñas y densas. Insignias de competencia, desplegable de idioma, etiqueta emergente del raíl de contacto.
- **0,5 rem**: piezas medianas. Imágenes de galería, cajas de logotipo, chips de enlace, píldoras de puntuación.
- **0,75 rem**: contenedores. Tarjetas de la cronología, tarjeta de certificación, retrato de portada.
- **Círculo completo**: punto de la cronología, barras de puntuación y su canal, indicador deslizante de navegación, marcas del umbral.

El borde es siempre de un píxel en color filete, salvo dos excepciones declaradas en la interfaz de `TimelineEntry`: un borde de tres píxeles con color arbitrario para logotipos que necesitan separarse de su propio fondo, y una caja de fondo blanco con borde transparente en claro y filete en oscuro para logotipos que solo existen en versión oscura.

Los divisores internos no son bordes sino bloques de un píxel de alto en color filete. El raíl de contacto usa el mismo recurso en vertical, dos segmentos de un píxel por doce de alto que enmarcan la columna de iconos.

### Named Rules

**La regla del filete.** Los divisores se dibujan con un bloque de `1px` en color filete, no con `border-top`. Mantiene el mismo grosor óptico en todos los contextos y evita colapsos de margen.

## Motion

El movimiento vive en dos registros y no hay un tercero. El primero es la **respuesta a interacción**: transiciones de color en insignias, chips y navegación, el crecimiento del 5 % de un chip de enlace, el filete de acento que se dibuja alrededor de una foto de galería al pasar por encima, y los 300 ms del indicador deslizante. La tarjeta no participa: no responde al hover. El segundo es el **revelado de entrada**, una sola pasada por elemento la primera vez que aparece en pantalla.

El revelado no introduce estética nueva. Anima exactamente los recursos gráficos que ya son firma del sistema: el filete de un píxel bajo cada rótulo, la línea vertical de la cronología y las barras de puntuación de idiomas. La lectura buscada es la de un documento componiéndose, no la de una web de escaparate.

La fuente normativa son los tokens de `src/frontend/app/globals.css`, declarados junto a los de color: `--reveal-dist` (10 px), `--reveal-dur` (700 ms), `--reveal-ease` (`cubic-bezier(0.16, 1, 0.3, 1)`), `--reveal-stagger` (70 ms), `--reveal-rule-dur` (900 ms), `--reveal-bar-dur` (700 ms), `--reveal-bar-delay` (200 ms), `--reveal-media-offset` (200 ms), `--reveal-media-stagger` (90 ms), `--reveal-media-zoom` (1,03) y `--reveal-media-hover-dur` (450 ms).

### Vocabulario

- **Unidad de revelado**: 10 px de subida más opacidad, 700 ms. Es el gesto por defecto de cualquier tarjeta o bloque.
- **Filete del rótulo**: se dibuja de izquierda a derecha en 900 ms, 120 ms después de su bloque. Es el gesto firma, y por eso corre más lento que el resto del vocabulario.
- **Línea de cronología**: se dibuja de arriba abajo con el mismo retardo de 120 ms. Solo existe en experiencia y certificaciones.
- **Barra de puntuación**: crece de cero a su nota en 700 ms tras 200 ms de espera. La marca de umbral entra en opacidad cuando la barra ya está puesta.
- **Foto de galería, al aparecer**: entra 200 ms después de su tarjeta y escalonada a 90 ms entre hermanas. El retardo se **suma** al de la tarjeta en vez de sustituirlo, para que ninguna foto se adelante a su propio contenedor.
- **Foto de galería, en hover**: un filete de acento de dos píxeles se dibuja recorriendo el contorno en 700 ms, a 4 px por fuera de la foto, mientras esta crece un 3 % en 450 ms dentro de su marco, que no se mueve. Al salir el trazo se retira por el mismo camino. El filete va fuera y no pegado al borde porque sobre contenido fotográfico una línea fina se pierde; fuera cae sobre la superficie plana de la tarjeta, que es su sitio natural en este sistema. Es el único trazo del sitio que se recorre en lugar de aparecer, y por eso es el gesto de interacción más marcado del vocabulario. El marco recorta y aparece, la foto se amplía: son dos elementos porque `transform` es una sola propiedad y de otro modo los dos gestos se cortarían entre sí.
- **Escalonado**: 70 ms entre hermanos, saturado en el sexto. Más allá, el escalonado se lee como lentitud y no como ritmo. Las galerías van aparte, a 90 ms y sin saturar, porque nunca pasan de cinco fotos.

### Named Rules

**La regla de la pasada única.** Un elemento se revela la primera vez que entra y no vuelve a animarse. Nada se re-anima al volver a pasar por delante.

**La regla del contenido visible.** El estado inicial oculto solo existe bajo el marcador `data-motion`, que pone un script bloqueante del `<head>` antes del primer pintado y que se retira solo a los 2,5 s si el JavaScript no llega. Sin JavaScript el marcador no aparece nunca y la página se lee entera. El movimiento es una capa que se añade, jamás un requisito para leer.

**La regla del pliegue.** Lo que está sobre el pliegue entra al pintar, no al hacer scroll, y se mueve **solo con `transform`**: una opacidad de partida en cero excluye al elemento del cálculo de LCP. El retrato de portada no se anima en absoluto.

**La regla del origen.** Todo gesto nuevo tiene que derivar de un elemento que ya exista en el sistema. Si hay que inventar una forma para poder animarla, el gesto sobra.

**La regla de la preferencia.** Todo el bloque de revelado vive dentro de `prefers-reduced-motion: no-preference`. Quien pida menos movimiento recibe la hoja intacta, no un parche que deshaga reglas una a una. Lo mismo vale para el desplazamiento suave.

**La regla del papel.** Un CV se imprime. `@media print` fuerza opacidad completa, barras llenas y líneas dibujadas. Ningún gesto puede dejar una página en blanco.

## Components

El proyecto no tiene botones de acción. Los únicos elementos con forma de botón son iconos de interfaz sin fondo (tema, idioma, menú) y los chips de enlace externo. Documentar un botón primario aquí sería inventarlo.

### Chips

- **Chip de enlace** (enlaces externos al pie de una tarjeta): borde de un píxel en color filete, sin fondo, texto en azul de señal, `0.875rem`, radio de 0,5 rem, acolchado `0.25rem 0.75rem`, con un icono de flecha diagonal de 12 px delante. En hover invierte a fondo azul de señal y texto blanco, y crece un 5 % en 200 ms. Es el único elemento del sistema que cambia de tamaño al interactuar, y se lo permite por ser el único de verdad accionable dentro de una tarjeta.
- **Insignia de competencia**: monoespaciada de `0.875rem`, fondo de superficie, borde de un píxel, radio de 0,25 rem, acolchado `0.125rem 0.5rem`, con icono opcional de 20 px de la biblioteca de marcas. En hover el borde y el texto pasan a azul de señal, el fondo no cambia.
- **Píldora de puntuación**: fondo de azul de señal al 10 %, radio de 0,5 rem, con el valor en mono negrita de `1.125rem` y un rótulo de `10px` en versalitas debajo, ambos en azul de señal.

### Cards / Containers

- **Corner Style:** 0,75 rem.
- **Background:** superficie sobre papel.
- **Shadow Strategy:** ninguna, ver Elevation & Depth.
- **Border:** un píxel en color filete, sin estados. La tarjeta **no responde al hover**: es un contenedor de lectura, no un elemento accionable, y señalarla al pasar por encima prometía una interacción que no existe. Lo accionable de una tarjeta son sus chips de enlace, y son ellos los que responden.
- **Internal Padding:** 1,25 rem.
- **Estructura interna:** cabecera de logotipo más titular y subtítulo, divisor de un píxel a `1rem` de margen vertical, cuerpo de viñetas o descripción, chips de enlace y rejilla de imágenes. Las viñetas usan un punto medio en azul de señal como marcador, alineado por línea base con una separación de `0.6875rem`.

### Inputs / Fields

El sitio no tiene ningún campo de formulario. No hay estilo de entrada que documentar ni conviene inventarlo antes de que exista el primero.

### Navigation

- **Escritorio (≥768 px):** enlaces de `1rem` en tinta apagada que pasan a azul de señal y semibold en activo o en hover, con una copia fantasma en negrita que reserva el ancho. Bajo el conjunto corre un indicador de dos píxeles con radio completo en azul de señal que se desliza a la posición del ítem activo en 300 ms con salida suavizada, remidiéndose al redimensionar y al terminar de cargar la tipografía.
- **Móvil (<768 px):** hamburguesa de 18 px que abre una capa a pantalla completa con fondo de página opaco, enlaces de `1.875rem` en semibold centrados, el activo subrayado en azul de señal a dos píxeles con desplazamiento de ocho, y al pie el selector de idioma y el conmutador de tema en su variante en línea.
- **Marca:** el nombre completo a `1.25rem` en semibold, que pasa a azul de señal en hover.

### Signature: raíl de contacto

A partir de 1280 px los cuatro enlaces de contacto abandonan el pie y se fijan como columna vertical centrada a 1,5 rem del borde izquierdo. La columna se enmarca arriba y abajo con un segmento de un píxel por doce de alto en color filete. Cada icono mide 20 px, vive en tinta apagada y pasa a azul de señal en hover, momento en el que revela a su derecha una etiqueta emergente de fondo tinta y texto papel con la dirección completa. Por debajo de 1280 px la misma lista se dibuja como fila horizontal centrada sobre la línea de copyright.

### Signature: cronología

Punto de 0,625 rem con borde de dos píxeles y relleno en azul de señal, y una línea vertical de un píxel del mismo color que arranca en el centro del punto y se prolonga por debajo del contenido hasta alcanzar el punto siguiente, quedando continua a lo largo de toda la lista. La última entrada oculta su tramo. Es el único recurso gráfico del sistema que no es ni texto ni caja.

### Signature: barras de puntuación

Nombre de destreza en `4rem` de ancho fijo, canal de dos píxeles de alto con radio completo en color filete, relleno en azul de señal proporcional a la nota, y valor en mono a la derecha en `2rem` de ancho. Cruzando todas las barras, una marca vertical de tres píxeles en verde de umbral con un punto en cada extremo y su rótulo debajo, posicionada por cálculo sobre el ancho real del canal.

## Panel de edición

El panel del CMS (`src/frontend/cms-template/`) se monta sobre las mismas piezas que la página que edita: `SectionTitle`, `cardSurface`, los seis tokens de color y la tipografía del sistema. Es la web con huecos editables dentro, no una aplicación aparte. Tres puntos se apartan del resto del sitio, y aquí queda escrito el porqué de cada uno.

**El contenedor se ensancha.** La regla del contenedor único fija 64 rem para el sitio público, pero el panel muestra tres columnas de texto editable por campo (ES / EN / GL) y no caben ahí. El `main`, la cabecera y la barra de pestañas del panel usan `max-w-[1600px]` en su lugar. El carril de fecha y la columna de logotipo conservan su anchura real (el carril pasa de 4 a 8 rem porque aloja un campo editable y no solo texto, la columna de logotipo se queda en `sm:w-32`), así que la proporción de la tarjeta se sigue leyendo, solo se ensancha el cuerpo.

**No hay movimiento.** Ni respuesta a interacción ni revelado de entrada. El panel es la hoja que ve alguien con `prefers-reduced-motion: reduce`. Ningún componente de `components/cms/**` lleva `transition`, `animate-*` ni los atributos `data-reveal*`; `SectionTitle` se usa siempre con `reveal="none"` en este contexto.

**Dos tokens de estado nuevos, no accionables.** `--color-ok` (claro `#059669`, oscuro `#34D399`) y `--color-danger` (claro `#DC2626`, oscuro `#F87171`), declarados como tripletes RGB junto a los seis tokens del sitio y consumidos como `ok` y `danger` en Tailwind. Señalan guardado sincronizado, error de validación y borrado, el mismo tipo de estado no accionable que ya cubría el verde de umbral de `Languages.tsx`, y por el mismo motivo no pueden ser el azul de señal: su significado no es "esto es accionable". No hay ámbar: "cambios pendientes" se resuelve con el propio azul de señal, porque sí es accionable y apunta al botón de publicar.

### Campos de formulario

El primer campo de formulario del sistema. Fondo `bg-background` sobre la tarjeta en `bg-surface`, para que lea como un hueco y no como una capa nueva. Borde de 1 px en color filete, radio `0.5 rem`. En foco, borde a azul de señal más un anillo de 1 px del mismo color, sin transición: el cambio es instantáneo, igual que el resto del panel.

### Campo trilingüe

`components/cms/TrilingualField.tsx` es la pieza que reemplaza cualquier texto del sitio público dentro del panel: tres columnas ES / EN / GL a partir de `lg`, apiladas y con su rótulo de idioma debajo de ese punto de corte. El rótulo de cada columna es mono en versalitas, en azul de señal cuando la columna está vacía y en tinta apagada cuando tiene contenido — la señal de "falta traducir" es el propio color del rótulo, no un punto con `animate-pulse`. El campo admite un registro tipográfico (`variant`) para que lea como el elemento público que sustituye: título, subtítulo, cuerpo o dato.

### Maqueta de entrada (`CmsEntryFrame`)

Reproduce el armazón de `TimelineEntry` — carril de fecha, punto y línea, columna de logotipo, filete, cuerpo — con huecos editables en vez de texto fijo. Es una reimplementación deliberada del lado del panel y no una generalización de `TimelineEntry`: ese componente sirve al sitio público con `renderText`, `next/image` y los atributos de revelado, y forzarlo a aceptar ranuras arbitrarias pondría en riesgo invariantes de LCP que están razonadas en el propio fichero. La tarjeta interior sí es la misma pieza, `cardSurface`, así que el radio, el borde y el acolchado no pueden divergir entre panel y web. La fila de número de entrada y el botón de eliminar viven fuera de esa tarjeta a propósito, para que el andamiaje de edición se distinga de un vistazo del contenido que va a publicarse.

## Do's and Don'ts

### Do:

- **Do** declarar todo color nuevo en `globals.css` como triplete de canales RGB en los dos temas, y consumirlo por su nombre semántico.
- **Do** abrir cada sección con `SectionTitle`, que impone el rótulo en mono, versalitas y tracking `0.1em` sobre filete de un píxel.
- **Do** montar cualquier entrada de contenido sobre `TimelineEntry`, con `timeline={false}` cuando la lista no sea cronológica.
- **Do** reservar el ancho del texto de interfaz cuando cambie de peso entre estados, con la copia fantasma que ya usa la navegación.
- **Do** mantener el movimiento dentro de los dos registros declarados en Motion: respuesta a interacción, y revelado de entrada de una sola pasada. Cualquier gesto nuevo tiene que derivar de un elemento que ya exista en el sistema.
- **Do** dejar que todo el contenido nazca visible y que el estado oculto del revelado dependa del marcador `data-motion`, para que sin JavaScript la página se lea entera.
- **Do** verificar cada pieza nueva en los dos temas, porque la paleta oscura no es una inversión de la clara.

### Don't:

- **Don't** traer estéticas de portfolio. Nada de gradientes, glassmorphism, tarjetas flotantes, cuadrículas tipo mosaico ni las convenciones habituales de las webs personales de referencia. Este sitio se lee como documentación, no como escaparate.
- **Don't** usar clases de color literales de Tailwind (`bg-blue-600`, `text-gray-500`) en componentes. Rompen el modo oscuro sin avisar. La única excepción viva es el verde de umbral, y está acotada a una tarjeta.
- **Don't** añadir sombras a elementos estáticos del flujo. El vocabulario de sombra tiene tres entradas y cada una tiene su trabajo.
- **Don't** escribir prosa en monoespaciada. La mono es para rótulos, datos y anotaciones.
- **Don't** sacar contenido fuera del contenedor de 64 rem, ni siquiera una imagen a ancho completo.
- **Don't** hacer depender del JavaScript nada que sea contenido. El conmutador de tema y el menú móvil son la frontera, y no debe moverse.
