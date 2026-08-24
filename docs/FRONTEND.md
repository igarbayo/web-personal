# Frontend — Documentación técnica

Web CV personal de Ignacio Garbayo Fernández. Stack: **Next.js 14** (App Router) + **Tailwind CSS** + **TypeScript**. Las rutas se sirven desde la raíz del dominio (sin basePath). El antiguo `basePath: '/web-personal'` ya no se usa.

La configuración de red del dominio (DNS, TLS, caché de edge y analíticas) está documentada aparte, fuera de este repositorio.

---

## Arquitectura

### Routing

App multi-página con 4 secciones, servidas por **dos familias de rutas**:

| Ruta | Secciones renderizadas |
|---|---|
| `/[lang]` | Home: foto de perfil + Header + Summary |
| `/[lang]/experience` | Experience, Skills, Volunteering |
| `/[lang]/education` | Education, LeadershipAwards, Languages, Certifications |
| `/[lang]/projects` | ProjectsCompetitions |

Las 12 rutas prefijadas por idioma son las **canónicas**. Además existen 4 rutas **sin prefijo** (`/`, `/experience/`, `/education/`, `/projects/`) que sirven el mismo contenido en inglés y declaran `canonical` hacia su equivalente `/en/…`. Son puertas de entrada para crawlers y para quien teclee la URL obvia; ver la sección [SEO](#seo).
- **`trailingSlash: true`** en `next.config.js`: el export genera `en/index.html` en vez de `en.html`, de modo que GitHub Pages sirve `/en/` con `200` y redirige `/en` → `/en/` con `301`. Sin esta opción, cualquier URL con barra final devolvía `404`. Consecuencias: `next/link` emite los `href` con barra final automáticamente, y `usePathname()` la incluye — por eso `Navbar.isActive()` normaliza el path antes de comparar
- Rutas generadas estáticamente con `generateStaticParams` en `app/(i18n)/[lang]/layout.tsx`
- No se usa ninguna librería de i18n; el contenido está en JSONs por idioma
- Las imágenes en `public/` se referencian con rutas absolutas desde la raíz (`/imagen.png`). El antiguo prefijo `${process.env.NEXT_PUBLIC_BASE_PATH}/` (ligado al basePath de GitHub Pages) ya no se usa

### i18n

| Archivo | Descripción |
|---|---|
| `lib/types.ts` | Interface `Dictionary` completa + todos los subtipos |
| `lib/dictionaries.ts` | Loader dinámico: `getDictionary(lang)` → `Promise<Dictionary>` |
| `dictionaries/en.json` | Contenido inglés (base: PDF CV English) |
| `dictionaries/es.json` | Contenido español (base: PDF CV Spanish) |
| `dictionaries/gl.json` | Contenido gallego (traducción del español) |

Los diccionarios incluyen **todas** las certificaciones de ambos CVs en los 3 idiomas. Los nombres propios de instituciones gallegas se usan en gallego (ej: "Universidade de Santiago de Compostela", "Federación Galega de Baloncesto").

### Layout chain

```
app/layout.tsx                  → <>{children}</> (pasarela, sin <html>)
app/not-found.tsx               → out/404.html — monta su propio SiteShell
app/robots.ts, app/sitemap.ts   → out/robots.txt, out/sitemap.xml
│
├── app/(default)/              → rutas SIN prefijo, contenido inglés
│   layout.tsx                    SiteShell lang="en" + script de detección de idioma
│   page.tsx                      /
│   experience|education|projects/page.tsx
│
└── app/(i18n)/[lang]/          → rutas prefijadas, las canónicas
    layout.tsx                    SiteShell lang={params.lang}
    page.tsx                      /[lang]
    experience|education|projects/page.tsx

components/SiteShell.tsx        → <html><head>…</head><body><Navbar/>{children}<footer/></body></html>
components/pages/*.tsx          → cuerpo de cada sección, compartido por ambos grupos
```

Los **route groups** `(default)` y `(i18n)` no aparecen en las URLs. Existen para poder tener **dos layouts raíz** con distinto `<html lang>`: `app/layout.tsx` es una pasarela que no renderiza `<html>`, y de eso se encarga cada layout de grupo a través de `SiteShell`.

`components/pages/` existe para que la versión prefijada y la sin prefijo rendericen exactamente lo mismo desde una sola fuente. Las `page.tsx` quedan en cinco líneas: cargar el diccionario y pasarlo al componente.

---

## SEO

El punto de partida: dos chatbots distintos intentaron leer el sitio y fallaron. La raíz era una cáscara —`app/page.tsx` era `'use client'`, devolvía `null` y redirigía desde un `useEffect`, así que el export producía un `/index.html` con `<title>` y `<body>` vacío— y las rutas sin prefijo (`/experience`) devolvían 404, porque solo existían las 12 con prefijo. Sin `robots.txt` ni `sitemap.xml`, un buscador no tenía forma de descubrir nada salvo siguiendo un redirect JS que solo se ejecuta en una segunda pasada diferida.

**Rutas sin prefijo.** Las 4 del grupo `(default)` sirven contenido inglés completo y prerenderizado. No son canónicas: cada una declara `<link rel="canonical">` hacia `/en/…`. No se listan en el sitemap.

**Detección de idioma.** El grupo `(default)` inyecta en el `<head>` un `<script>` inline y **bloqueante** que lee `navigator.languages`: gana el primer idioma que matchee gl/es/en, y el inglés se queda donde está. Dos propiedades que importan:

- Al ser síncrono y estar antes del `<body>`, corre **antes del primer paint**: cero parpadeo de inglés para usuarios es/gl. El `useEffect` anterior corría después de pintar, y por eso la página tenía que ir vacía.
- **Preserva el pathname**, así que `/experience/` lleva a `/es/experience/` y no a `/es/`.

Lleva una guarda `if (/^\/(en|es|gl)(\/|$)/.test(location.pathname)) return`. No es decorativa: `404.html` se sirve también para rutas que ya llevan prefijo, y sin ella `/es/loquesea` entraría en un bucle infinito de prefijado (`/es/es/…`). El script no existe en el grupo `(i18n)` ni en la 404.

**Canonical, hreflang y `og:url`.** Los construye `lib/seo.ts`. Cada una de las 8 páginas exporta un `generateMetadata` que llama a `buildPageMetadata(subpath, lang, description)`. No pueden vivir en el layout: se heredarían a las subpáginas con el canonical de la home, que es exactamente el bug que tenía `og:url` (todas las páginas de un idioma declaraban `og:url` = home de ese idioma).

`buildPageMetadata` repite el bloque `openGraph` **entero**, no solo `url`. Es obligatorio: Next hace merge **superficial** de la metadata, así que un `openGraph` definido en la página reemplaza al del layout en vez de fusionarse, y definir solo `url` dejaría la página sin título, descripción ni imagen.

**`sitemap.ts` y `robots.ts`.** Generan las 12 URLs canónicas con su bloque de `alternates`, y el `robots.txt` apuntando al sitemap. Con `output: 'export'` + `trailingSlash: true` había riesgo de que Next los emitiera como `out/sitemap.xml/index.html`; **no ocurre** con 14.2.29 — salen como ficheros. Si una actualización lo rompiera, el fallback es `public/robots.txt` y `public/sitemap.xml` estáticos, que se copian verbatim y son inmunes al `trailingSlash`.

**404.** `app/not-found.tsx` alimenta `out/404.html`, que GitHub Pages sirve ante cualquier ruta desconocida. Tiene que estar en la raíz de `app/`: una not-found dentro de un route group **no** alimenta ese fichero — Next emite ahí su 404 genérica, comprobado. Y como el layout raíz es una pasarela sin `<html>`, esta página monta su propio `SiteShell`. Ese es además el único motivo por el que `app/layout.tsx` sigue existiendo: sin él, el build falla con «not-found.tsx doesn't have a root layout».

**Datos estructurados.** `SiteShell` inyecta en el `<head>` un `<script type="application/ld+json">` con un `Person` de schema.org construido por `buildPersonJsonLd(dict, lang)`. Sale en las 12 rutas canónicas, en las 4 sin prefijo y en la 404, traducido, porque se alimenta del diccionario: nunca se desincroniza del contenido visible. Va como `<script>` y no en el objeto `metadata` porque Next no expone JSON-LD en esa API. `serializeJsonLd` escapa los `<`: sin eso, un `</script>` dentro de una cadena del diccionario cerraría la etiqueta antes de tiempo y abriría un XSS.

Dos campos van deliberadamente en inglés y sin traducir, porque son los términos contra los que casan las entidades de schema.org: `knowsLanguage` (códigos BCP-47, no los nombres traducidos del diccionario) y las áreas de `knowsAbout`, que preceden a la lista de tecnologías de `skills` — esa lista sola son herramientas, y lo que un grafo de conocimiento necesita para situar a una persona es el campo.

No lleva `jobTitle` ni `worksFor`: saldrían de `experience.entries[0]`, y eso ataría el dato a que la entrada más reciente siga siendo siempre la primera del diccionario.

**`llms.txt`.** Lo genera `scripts/gen-llms-txt.mjs` desde `dictionaries/en.json`, encadenado en los scripts `build` y `dev`. Es una apuesta barata, no una optimización con retorno medido: a día de hoy ningún proveedor grande ha confirmado que lo consuma, y el problema que resuelve —documentación enorme envuelta en HTML— no es el de este sitio, que son 4 páginas de HTML semántico ya legible. Lo que sí sería un coste real es que se quedase desactualizado, así que **no se versiona**: está en `.gitignore` y se regenera en cada build. `verify` comprueba que el generador sigue casando con la forma del diccionario.

**Navbar y LanguageSwitcher.** Ambos asumían que el primer segmento del path era siempre un idioma. `Navbar.isActive` acepta ahora las dos formas, prefijada y sin prefijar, o en `/experience/` no se marcaría ningún ítem activo. `LanguageSwitcher.getLangHref` sustituye el segmento si es un idioma conocido y **prefija** si no lo es; antes convertía `/experience/` en `/es/` y perdía la sección. Los enlaces del Navbar siguen apuntando a `/${lang}${path}`: al primer clic el usuario pasa a las rutas canónicas.

---

## Diseño visual

| Token | Claro | Oscuro |
|---|---|---|
| Background | `#FAFAFA` | `#0D1117` |
| Surface (cards) | `#FFFFFF` | `#161B22` |
| Foreground | `#1A1A1A` | `#E6EDF3` |
| Muted (secondary) | `#6B7280` | `#8B949E` |
| Accent | `#2563EB` | `#60A5FA` |
| Border | `#E5E7EB` | `#2A313C` |
| Font (sans) | Inter (via `next/font/google`, variable `--font-inter`) | |
| Font (mono) | system monospace (variable `--font-mono`) | |

**Toques nerd:** skill badges en `font-mono`, cursor parpadeante (`_`) tras el nombre en el Header usando `cursor-blink::after` (CSS animation + Tailwind `animate-blink`).

**Layout:** `max-w-4xl` centrado, `px-4 sm:px-6`, secciones con `py-8`. El navbar es `fixed top-0` con `backdrop-blur-md` y `bg-background/80`.

---

## Dark mode

Paleta **slate frío** (blueprint). Coherente con el acento azul, que se aclara solo en oscuro para mejorar contraste.

**Cómo funciona:**

- Los 6 tokens de color son **variables CSS en canales RGB** (ej. `--color-background: 13 17 23;`) definidas en `app/globals.css`: valores claros en `:root`, oscuros bajo `.dark`. Tailwind los consume como `rgb(var(--color-x) / <alpha-value>)`, por lo que los modificadores de opacidad (`bg-background/80`) siguen funcionando.
- `darkMode: 'class'` en `tailwind.config.ts`: el modo oscuro se activa con la clase `.dark` en `<html>`.
- **Sin flash (FOUC):** un `<script>` inline en el `<head>` de `app/[lang]/layout.tsx` corre antes del primer paint. Lee `localStorage.theme`; si no hay valor, usa `matchMedia('(prefers-color-scheme: dark)')`. Añade `.dark` según corresponda. También hay un `<meta name="color-scheme" content="light dark">` para que los controles nativos y el scrollbar se adapten.
- **Toggle:** `components/ThemeToggle.tsx` (`'use client'`) — botón sol/luna. Al hacer click alterna la clase `.dark` y persiste la elección en `localStorage.theme`. Prop `inline` para el estilo móvil (igual patrón que `LanguageSwitcher`).
- **Persistencia al cambiar de idioma:** `components/ThemeSync.tsx` (`'use client'`, montado en el layout). El script inline solo corre en carga completa; cambiar de idioma es una **navegación cliente** que re-renderiza `<html className={inter.variable}>` y **pisa la clase `.dark`**, dejando la página en claro. `ThemeSync` re-aplica el tema desde `localStorage` en cada cambio de `pathname` con `useLayoutEffect` (patrón isomórfico para no romper SSR), que corre en el commit antes del paint → el modo se mantiene sin parpadeo.

**Comportamiento:** primera visita → sigue la preferencia del navegador. El botón fuerza manualmente el otro modo y esa elección se recuerda entre visitas. Borrar `localStorage.theme` vuelve a seguir el sistema.

**Colocación del toggle:** a la izquierda del language switcher en desktop; dentro del overlay del menú móvil, junto al switcher.

**Superficies:** las cards usan el token `surface` (antes `bg-white` hardcodeado). En oscuro, la profundidad viene del contraste `surface` vs `background` + `border`, ya que las sombras negras (`rgba(0,0,0,…)`) se desvanecen sobre fondo oscuro.

### Logos en modo oscuro

Muchos logos son PNG/WebP con fondo transparente y tinta oscura, que se pierden sobre el fondo oscuro. Dos estrategias:

- **Caja blanca (`logoBoxed`):** prop de `TimelineEntry` que envuelve el grupo de logos en un contenedor `bg-white rounded-lg p-3` con borde `border-transparent dark:border-border` — es decir, **sin borde visible en claro** (la caja blanca se funde con la card blanca) y **con borde solo en oscuro** (para delimitar la caja sobre el fondo oscuro). Activado en **Education** y **Certifications** (siempre), y en **Experience** de forma condicional: `logoBoxed={!entry.logoDark}`, es decir, una entrada que trae variante oscura propia se salta la caja. Cuando una entrada tiene varios logos (ej. IGM + Hotusa, o las dos titulaciones USC), todos comparten la misma caja. Da un aspecto uniforme por sección, con CiTIUS como única excepción en Experience (ver `logoDark`).
- **Esquinas redondeadas sin caja (`logoRounded`):** prop de `TimelineEntry` que aplica `rounded-lg` al propio `<Image>` (sin fondo ni borde). Para logos que ya traen su propio fondo y no necesitan caja. Usado en **Leadership & Awards** (Bankinter, cuadrado naranja) y en **Projects** (Máis Mates en Student Magazine, imagen JPG con fondo). En Projects también lo lleva el logo de EGS, pero al ser transparente el redondeo no tiene efecto visible.
- **Borde fino de color (`logoBorderColor`):** campo de dato por entrada (en `ProjectEntry`) que dibuja un borde `1px` alrededor del logo con el color indicado, vía `style={{ borderColor }}`. Se usa en **Máis Mates** con el propio azul de fondo de la imagen (`#1C52A6`) para enmarcarla limpiamente. Solo lo lleva esa entrada, así que no afecta a EGS.
- **Variante por tema (`logoDark`):** prop de `TimelineEntry` (array paralelo a `logo`, por índice). Si existe, el logo claro se muestra con `dark:hidden` y la variante oscura con `hidden dark:block`. Se usa en dos sitios, siempre con el logo "suelto" sobre el fondo, sin caja:

  - **Projects** → EGS (`egs.webp` marino en claro / `egs-white.webp` con letras blancas en oscuro).
  - **Experience** → CiTIUS (`citius.webp` negro en claro / `citius-white.webp` en oscuro). Ambos PNG originales vienen del centro con fondo transparente, así que aquí no hubo que recolorear nada: solo convertirlos a WebP. Es la razón de que `logoBoxed` pasara a ser condicional en Experience — un logo blanco dentro de la caja blanca sería invisible.

`egs-white.webp` se generó recoloreando solo las letras (el azul-verde de la onda se conserva) con ImageMagick:

```bash
magick assets/egs.png -channel RGB -fuzz 35% -fill white -opaque "srgb(20,51,93)" +channel public/egs-white.webp
```

**Logo de Anthropic (`anthropic.webp`):** wordmark negro con fondo transparente, así que no necesita variante oscura — la `logoBoxed` de **Certifications** le da fondo blanco en ambos modos y el borde `dark:border-border` lo delimita en oscuro, igual que McKinsey, AWS o Hugging Face. El original (`Anthropic_logo.svg.webp`, 3840×432, 22 KB) se redimensionó a 800px de ancho conservando el canal alfa:

```bash
magick Anthropic_logo.svg.webp -resize 800x -define webp:method=6 -quality 85 anthropic.webp
```

Resultado: 800×90, 6,1 KB (−72 %). Como todos los logos de `TimelineEntry`, sus dimensiones intrínsecas se registran en `lib/imageDimensions.ts` (requisito de `next/image` al referenciar rutas dinámicas desde los diccionarios). Al ser un wordmark muy apaisado (8,9:1) se ve más fino que el resto dentro de la caja de `sm:w-32`, que es su proporción real.

**Marcador de umbral (Languages):** la línea/etiqueta "C1 Pass Threshold" usa `emerald-600 dark:emerald-400` (antes `blue-800`, ilegible en oscuro) — verde "aprobado", distinto del azul del acento y legible en ambos modos.

---

## Estructura de componentes

```
components/
├── Navbar.tsx              # 'use client' — fixed nav + active route (usePathname) + hamburger
├── SocialSidebar.tsx       # Sidebar vertical fijo (xl+) / fila horizontal en footer (móvil)
├── LanguageSwitcher.tsx    # 'use client' — links EN|ES|GL, usa usePathname
├── ui/
│   ├── SectionTitle.tsx    # H2 monospace uppercase + línea decorativa
│   ├── TimelineEntry.tsx   # Grid date|content, reutilizable en todas las secciones
│   └── SkillBadge.tsx      # Pill font-mono con hover accent
└── sections/
    ├── Header.tsx          # Nombre + título + 4 links con iconos SVG inline
    ├── Summary.tsx
    ├── Skills.tsx          # 3 categorías con SkillBadge
    ├── Education.tsx
    ├── Experience.tsx
    ├── LeadershipAwards.tsx
    ├── ProjectsCompetitions.tsx
    ├── Languages.tsx       # Layout horizontal plano (no timeline)
    ├── Volunteering.tsx
    └── Certifications.tsx
```

### TimelineEntry

Componente genérico para todas las secciones con estructura fecha/título/subtítulo. Props:

| Prop | Tipo | Uso |
|---|---|---|
| `date` | `string` | Columna izquierda (`w-16`). Admite varios rangos separados por ` & ` |
| `title` | `string` | Título en negrita |
| `subtitle` | `string` | Organización/empresa/institución |
| `subtitleUrl?` | `string` | Convierte el subtitle en enlace externo |
| `bullets?` | `string[]` | Lista con viñeta `•` en color accent (`text-accent text-lg`) como marcador |
| `description?` | `string` | Párrafo (para Volunteering) |
| `note?` | `string` | Nota italic monospace al pie (ej: "Report available.") |
| `links?` | `EntryLink[]` | Píldoras de enlace externo al pie de la card |
| `images?` | `string[]` | Galería bajo los links (grid según el nº de imágenes) |

**Enlaces externos (`links`):** array de `{ label, url }` (tipo `EntryLink` en `lib/types.ts`) que se pinta como una fila de píldoras `rounded-lg` con borde, texto en accent, icono SVG de flecha diagonal y `hover:bg-accent hover:text-white`. Todas abren en pestaña nueva (`target="_blank" rel="noopener noreferrer"`). El `label` es el nombre de la fuente, no una llamada a la acción. Se usa en:

- **Leadership & Awards** → entrada "Honors Distinction" (se renderiza en la página de Educación): recortes de prensa, con el nombre del medio como label (La Voz de Galicia, ABC, Faro de Vigo, La Región).
- **Projects** → entrada "Open Source Governance Skill": enlace al repo, con label `GitHub`.

**Fechas con varios rangos:** una entrada con estancias discontinuas (IGM WEB: `07/2025 – 09/2025 & 06/2026 – 09/2026`) guarda los rangos en un único string separados por ` & `. El render difiere por breakpoint:

- **Desktop (`sm+`):** la columna de fecha hace `date.split(' & ')` y pinta cada rango en su propio `<span>` (`block`), con `mt-2` a partir del segundo para separar los pares. Dentro de cada rango se mantiene el `replace(' – ', '\n')` de siempre, porque `07/2025 – 09/2025` no cabe en los `w-16` (4rem) de la columna. Resultado: cuatro líneas, el segundo par debajo del primero. El `split` va antes del `replace` **a propósito**: `String.replace` con un string solo sustituye la primera ocurrencia, así que sobre la cadena completa dejaría el segundo rango sin partir y desbordado.
- **Mobile (`sm:hidden`):** se pinta el string en crudo, así que los dos rangos quedan en línea unidos por el `&`.

Retrocompatible: una fecha sin ` & ` produce un array de un elemento y se renderiza igual que antes. Las secciones con `timeline={false}` (Projects, Education) pintan la fecha inline en la cabecera y no usan este formato.

**Línea del timeline continua (`sm+`):** los puntos (`w-2.5` con borde accent) se mantienen en su sitio, pero la línea vertical gris ya **no se corta entre tarjetas**. En lugar de un `flex-1` confinado al content-box de cada fila, cada entrada dibuja su línea como elemento `absolute` (clase `.tl-line`): arranca en el centro de su propio punto (`top-[0.8125rem]` = `mt-2` + medio punto) y se prolonga `-bottom-[2.8125rem]` (= `pb-8` 2rem + 0.8125rem) para alcanzar el centro del punto de la siguiente entrada, atravesando el padding de la fila. Los tramos se solapan y se ven como un único trazo continuo, con los puntos por encima (`z-10`). La última entrada oculta su prolongación con `[&:last-child_.tl-line]:hidden` para que no cuelgue una línea muerta. Nota: el `2.8125rem` depende de que el `pb-8` de la fila siga siendo 2rem.

---

## Navbar

- **Avatar junto al nombre (COMENTADO, desactivado):** actualmente está comentado en `Navbar.tsx` (import de `next/image` incluido), pendiente de decisión. Cuando se reactiva, a la izquierda del nombre se muestra `silueta.webp` (retrato ilustrado). **Ese WebP no existe hoy en el repo**: solo está el original `assets/silueta.png`, así que hay que regenerarlo a `public/` antes de descomentar nada. El `<Link>` del nombre es `flex items-center gap-2` y la imagen usa `h-[1.25em] w-auto` para igualar la altura de la línea del texto (`text-xl leading-tight`); escala con el nombre. Lleva `priority` por estar above-the-fold. El WebP se generó desde `silueta.png` quitándole el fondo blanco (umbral de blanco casi-neutro con feather en los bordes → alfa), por lo que funciona en claro y oscuro sin halo. **Ojo:** este fichero **no** está en `scripts/to-webp.mjs` a propósito — ese script hace conversión plana y sobrescribiría la transparencia; si hay que regenerarlo, usar un script de recorte con alfa.
- El Navbar se renderiza **una sola vez en `app/[lang]/layout.tsx`** (no en cada página), para que persista entre navegaciones cliente y el subrayado pueda deslizarse en lugar de re-montarse.
- **Desktop (`md+`):** links horizontales. Ruta activa detectada con `usePathname()`. El subrayado activo es un **único elemento deslizante** (barra `bg-accent` posicionada en absoluto): un `useEffect` mide `offsetLeft`/`offsetWidth` de la pestaña activa (con re-medición en `resize` y en `document.fonts.ready`) y actualiza su `left`/`width` con `transition-all` → al cambiar de ruta la barra se mueve entre pestañas. Sigue la estética de la barra baja `_`.
- **Negrita sin salto:** la pestaña activa y cualquiera en hover van en `font-semibold`. Para que el cambio de peso no desplace el layout (ni descoloque el subrayado), cada label lleva una copia fantasma en negrita (`invisible`, apilada con grid) que reserva el ancho.
- **Hover:** todos los elementos del navbar (pestañas, selector de idioma, toggle de tema, hamburguesa) usan `hover:text-accent`; las pestañas añaden `hover:font-semibold`. El acento azul aparece al pasar el ratón, en claro y en oscuro.
- **Mobile:** botón hamburger → overlay full-screen con links centrados grandes + botón X para cerrar. Se cierra también al hacer click en un link. La pestaña activa lleva subrayado de acento estático (`underline underline-offset-8 decoration-accent`)
- **Language switcher:** EN | ES | GL siempre visible. En mobile aparece al pie del overlay

## SocialSidebar

- **Desktop (`xl+`):** sidebar vertical fijo centrado en la izquierda, iconos SVG con tooltip al hover
- **Mobile/tablet:** fila horizontal en el footer del layout
- Links: email, LinkedIn, GitHub, Devpost
- Renderizado en `app/[lang]/layout.tsx` dentro del `<footer>`

## Footer

Vive en `app/[lang]/layout.tsx`, no en un componente aparte. Tres elementos apilados: la fila de iconos de `SocialSidebar`, la línea de copyright y el enlace al repositorio.

- **Enlace «Ver en GitHub»:** apunta a `github.com/igarbayo/web-personal`. Está escrito **directamente en el layout y no dentro de `SocialSidebar`** a propósito: la fila de iconos de ese componente lleva `xl:hidden` porque en escritorio pasa a ser barra lateral fija, así que un enlace colocado ahí desaparecería del footer justo en escritorio. En el layout se renderiza igual en los dos modos.
- La etiqueta se traduce (`footer.repo` en los diccionarios); la URL no, va fija en el layout, porque es idéntica en los tres idiomas y triplicarla solo daría ocasión de que se desincronizara.
- Reutiliza `GitHubIcon`, exportado desde `SocialSidebar.tsx`, con `size={16}` para casar con el `text-sm` del enlace. El resto de usos mantienen el tamaño por defecto de 20.
- No aparece en `out/404.html` ni en `out/index.html`: esas páginas no pasan por el layout de `[lang]`.

---

## Secciones por página

| Página | Secciones |
|---|---|
| `/[lang]` | Header (nombre + título + links), Summary |
| `/[lang]/experience` | Experience (CiTIUS, IGM WEB, IDIS, Fegaba), Skills (3 categorías), Volunteering |
| `/[lang]/education` | Education (2 grados USC), LeadershipAwards, Languages, Certifications |
| `/[lang]/projects` | ProjectsCompetitions (hackathons, skill open source, proyectos) |

---

## Optimización de imágenes

### `assets/` vs `public/`

Separación importante: **`public/` contiene solo lo que el sitio sirve; los originales viven en `src/frontend/assets/`**.

Motivo: con `output: 'export'`, Next copia `public/` entera a `out/`, y `out/` es el artefacto que sube `upload-pages-artifact`. Todo raster que esté en `public/` viaja en cada despliegue aunque ningún componente lo referencie. Los originales (JPG de cámara de hasta 8000px, PNG previos a la conversión) sumaban 42 MB de los 44 MB de `public/`, mientras que los WebP que la web sirve de verdad ocupan ~2 MB. Al moverlos, `public/` bajó a 2,5 MB.

`assets/` está versionado en git — no se borra nada, simplemente queda fuera del export. Regla al añadir una imagen nueva: **el original va a `assets/`, el `.webp` generado va a `public/`**, y solo el segundo se referencia desde los diccionarios.

Se quedan en `public/` aunque no aparezcan referenciados en el TypeScript: `CNAME`, `.nojekyll` y `web-app-manifest-192x192.png` / `-512x512.png` (los referencia `site.webmanifest`, no el código).

### Scripts

En `scripts/` (requieren `sharp`, ya en devDependencies). Ambos **leen de `assets/` y escriben el `.webp` en `public/`**, sin borrar el original:

| Script | Uso |
|---|---|
| `to-webp.mjs` | Convierte a WebP los rasters referenciados en la web (solo cambia formato, sin redimensionar) |
| `compress-hack-images.mjs` | Redimensiona las fotos de hackathons (`hack-1..5-compressed`) a un ancho máximo de 1200px antes de generar el WebP — los originales son fotos de cámara de hasta 8000px de ancho mostradas como thumbnails de 256px de alto, así que la mayor parte del peso era resolución desperdiciada |

```bash
node scripts/to-webp.mjs
node scripts/compress-hack-images.mjs
```

**Ojo con el orden:** los cinco `hack-N-compressed.*` están en el `FILES` de los dos scripts y ambos escriben el mismo `hack-N-compressed.webp`. `compress-hack-images.mjs` redimensiona a 1200px; `to-webp.mjs` no. Ejecutar `to-webp` después deshace el redimensionado. Si hay que lanzar los dos, `compress-hack-images.mjs` va el último.

---

## Verificación

```bash
# Desde src/frontend/
pnpm dev        # → localhost:3000 (redirect a /en)
pnpm check      # verify + lint + typecheck (rápido, ~5 s)
pnpm build      # Debe generar /en, /es, /gl + sub-rutas estáticamente
```

### CI

`.github/workflows/ci.yml` corre `pnpm check` (verify + lint + typecheck) y `pnpm build` en cada push a cualquier rama. Sustituye a los antiguos hooks locales de `.githooks/` (`pre-commit` y `pre-push`): ahora la comprobación es la misma para todo el mundo y no depende de que cada clon active `core.hooksPath`.

### `scripts/verify.mjs`

Comprueba invariantes que ni ESLint ni `next build` ven, porque los diccionarios son JSON y las rutas de imagen se resuelven en ejecución:

1. Los tres diccionarios parsean como JSON.
2. Los tres tienen las mismas secciones de primer nivel.
3. `llms.txt` se genera sin romperse y cubre las 9 secciones. Como el fichero no está en el repo, lo que se comprueba es el generador: importa `buildLlmsTxt` y verifica que cada `## <título de sección>` aparece en la salida y que no se ha colado ningún `undefined`. Caza el renombrado o la desaparición de una sección del diccionario.
4. Toda imagen referenciada (diccionarios, código y `site.webmanifest`) existe en `public/`. Caza el caso de mover un original a `assets/` y olvidar generar el `.webp`.
5. Toda fuente listada en el `FILES` de los dos scripts de imagen existe en `assets/`.
6. `public/` se mantiene por debajo de 8 MB. Es un presupuesto de peso: Next la copia entera al artefacto de deploy, y llegó a pesar 44 MB.
7. Los campos `date` usan años de 4 cifras (`09/2021`, no `09/21`). Se mira solo la clave `date` a propósito: sobre texto libre el patrón chocaría con las notas (`8.1/10`) y con las fechas dentro de las URLs de prensa.
8. Siguen en `public/` los ficheros que el sitio sirve sin que ningún import los mencione: `CNAME`, `.nojekyll` y los dos `web-app-manifest-*.png`.

No tiene dependencias externas: es Node puro —solo importa `gen-llms-txt.mjs`, que también lo es— así que corre sin `node_modules`.

Rutas a verificar:
- `localhost:3000/en`, `/es`, `/gl` → home con foto + Header + Summary
- `localhost:3000/en/experience` → Experience + Skills + Volunteering
- `localhost:3000/en/education` → Education + LeadershipAwards + Languages + Certifications
- `localhost:3000/en/projects` → ProjectsCompetitions
- Language switcher: cambia idioma manteniendo la ruta actual
- Navbar: ruta activa resaltada; mobile: overlay full-screen con X para cerrar
- SocialSidebar: visible en sidebar izquierdo (xl+) o footer (menor)
