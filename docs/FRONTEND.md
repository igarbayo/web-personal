# Frontend — Documentación técnica

Web CV personal de Ignacio Garbayo Fernández. Stack: **Next.js 14** (App Router) + **Tailwind CSS** + **TypeScript**. Las rutas se sirven desde la raíz del dominio (sin basePath). El antiguo `basePath: '/web-personal'` ya no se usa.

---

## Arquitectura

### Routing

App multi-página con 4 rutas por idioma:

| Ruta | Secciones renderizadas |
|---|---|
| `/[lang]` | Home: foto de perfil + Header + Summary |
| `/[lang]/experience` | Experience, Skills, Volunteering |
| `/[lang]/education` | Education, LeadershipAwards, Languages, Certifications |
| `/[lang]/projects` | ProjectsCompetitions |

- `/` → redirect a `/en` (via `app/page.tsx`)
- Rutas generadas estáticamente con `generateStaticParams` en `app/[lang]/layout.tsx`
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
app/layout.tsx              → <>{children}</> (pass-through)
app/[lang]/layout.tsx       → <html><body>{children}<footer><SocialSidebar/></footer></body></html>
app/[lang]/page.tsx         → Home (foto + Header + Summary)
app/[lang]/experience/      → Experience + Skills + Volunteering
app/[lang]/education/       → Education + LeadershipAwards + Languages + Certifications
app/[lang]/projects/        → ProjectsCompetitions
```

---

## Diseño visual

Identidad **"paper matemático"**: papel milimetrado, serif de publicación científica y azul tinta, sobre la base minimalista original.

| Token | Valor |
|---|---|
| Background | `#FBFAF7` (papel cálido) |
| Foreground | `#1C1E26` (tinta) |
| Muted (secondary) | `#63697A` |
| Accent | `#2743C0` (azul pluma) |
| Border | `#E3E2DB` |
| Font (serif, base) | STIX Two Text (variable `--font-stix`): fuente base del `<body>` — cuerpo de texto, tarjetas, nombre, H1, títulos de sección/tarjeta, navbar |
| Font (sans) | Inter (variable `--font-inter`): disponible como `font-sans`, ya no es la fuente por defecto |
| Font (mono, datos) | IBM Plex Mono (variable `--font-mono`): fechas, marcador `//`, footer, skill badges |

Como STIX tiene menor altura-x que Inter, en `tailwind.config.ts` se sobrescribe la escala `fontSize` de los tamaños de lectura (`xs`–`3xl`) con un +~6%. Los tamaños de display (`4xl`/`5xl`/`6xl`), que usan los títulos grandes (H1 de página `text-4xl sm:text-5xl`, nombre del hero `text-5xl sm:text-6xl`), se dejan con los valores por defecto de Tailwind.

**Elementos de identidad:**
- Fondo de papel milimetrado en `globals.css` (`background-image` con 4 `linear-gradient`: rejilla fina de 24px + rejilla mayor de 120px en azul tinta muy tenue)
- Cursor `_` parpadeante tras el nombre del Header (`animate-blink`)
- Subtítulo del Header con `∩` ("Ingeniería Informática ∩ Matemáticas")
- `header.hooks` en los diccionarios (opcional en `HeaderData`): 3 datos duros bajo el subtítulo del hero, en mono con marcador `▸`
- Títulos de sección con prefijo `//` (comentario de código) en mono + accent (SectionTitle)
- Animación de entrada `fade-up` (+ variantes `-delay-1`, `-delay-2`) en hero y H1 de páginas. Todas las animaciones se desactivan con `prefers-reduced-motion`

**Layout:** `max-w-4xl` centrado, `px-4 sm:px-6`, secciones con `py-8`. El navbar es `fixed top-0` con `backdrop-blur-md` y `bg-background/80`.

---

## Estructura de componentes

```
components/
├── Navbar.tsx              # 'use client' — fixed nav + active route (usePathname) + hamburger
├── SocialSidebar.tsx       # Sidebar vertical fijo (xl+) / fila horizontal en footer (móvil)
├── LanguageSwitcher.tsx    # 'use client' — links EN|ES|GL, usa usePathname
├── ui/
│   ├── SectionTitle.tsx    # H2 serif con prefijo // en accent + línea decorativa
│   ├── TimelineEntry.tsx   # Grid date|content, reutilizable en la mayoría de secciones
│   ├── ProjectPlate.tsx    # Lámina "Fig. N" para la página de proyectos (bento)
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

### ProjectPlate (página de proyectos)

La página `/[lang]/projects` **no** usa `TimelineEntry`; usa un grid bento de láminas tipo figura de paper. `ProjectsCompetitions.tsx` renderiza un `grid md:grid-cols-12` donde cada proyecto ocupa un span alterno (`SPANS = [7, 5, 5, 7]`), dando 2 filas asimétricas con ritmo 7/5 → 5/7. Las tarjetas de una misma fila se igualan en altura (`items-stretch` + `h-full` + un spacer `flex-1` que empuja el pie).

Cada `ProjectPlate` muestra:
- **`Fig. N`** (mono, accent) + fecha en la cabecera.
- **Figura:** la primera imagen (`images[0]`) con zoom sutil al hover; o, si el proyecto no tiene imagen, un **esquema SVG** con retícula milimetrada embebida según `schematic`:
  - `graph` → grafo de nodos/aristas con un camino resaltado (motor de scheduling + enrutamiento).
  - `sparkline` → serie temporal con una anomalía marcada en accent (detección de anomalías).
- Título (serif) + organización (accent), **estado** (`● En curso`) y **premios** como pills, **caption** de una línea, **tags** en mono.
- **`<details>` "Detalle técnico"** plegable que conserva los `bullets` completos del CV (nada de información se pierde).
- Enlaces con la flecha `↗`.

Campos opcionales añadidos a `ProjectEntry`: `caption`, `tags`, `awards`, `status`, `schematic` (`'graph' | 'sparkline'`), `featured` (la primera lámina, con figura más alta).

### TimelineEntry

Componente genérico para todas las secciones con estructura fecha/título/subtítulo. Props:

| Prop | Tipo | Uso |
|---|---|---|
| `date` | `string` | Columna izquierda (7rem) |
| `title` | `string` | Título en negrita |
| `subtitle` | `string` | Organización/empresa/institución |
| `subtitleUrl?` | `string` | Convierte el subtitle en enlace externo |
| `bullets?` | `string[]` | Lista con viñeta `•` en color accent (`text-accent text-lg`) como marcador |
| `description?` | `string` | Párrafo (para Volunteering) |
| `note?` | `string` | Nota italic monospace al pie (ej: "Report available.") |

---

## Navbar

- **Desktop (`md+`):** links horizontales. Ruta activa detectada con `usePathname()` (highlight en `text-accent font-semibold`)
- **Mobile:** botón hamburger → overlay full-screen con links centrados grandes + botón X para cerrar. Se cierra también al hacer click en un link
- **Language switcher:** EN | ES | GL siempre visible. En mobile aparece al pie del overlay

## SocialSidebar

- **Desktop (`xl+`):** sidebar vertical fijo centrado en la izquierda, iconos SVG con tooltip al hover
- **Mobile/tablet:** fila horizontal en el footer del layout
- Links: email, LinkedIn, GitHub, Devpost
- Renderizado en `app/[lang]/layout.tsx` dentro del `<footer>`

---

## Secciones por página

| Página | Secciones |
|---|---|
| `/[lang]` | Header (nombre + título + links), Summary |
| `/[lang]/experience` | Experience (IGM WEB, IDIS, Fegaba), Skills (3 categorías), Volunteering |
| `/[lang]/education` | Education (2 grados USC), LeadershipAwards, Languages, Certifications |
| `/[lang]/projects` | ProjectsCompetitions (hackathons, proyectos) |

---

## Verificación

```bash
# Desde src/frontend/
pnpm dev        # → localhost:3000 (redirect a /en)
pnpm build      # Debe generar /en, /es, /gl + sub-rutas estáticamente
```

Rutas a verificar:
- `localhost:3000/en`, `/es`, `/gl` → home con foto + Header + Summary
- `localhost:3000/en/experience` → Experience + Skills + Volunteering
- `localhost:3000/en/education` → Education + LeadershipAwards + Languages + Certifications
- `localhost:3000/en/projects` → ProjectsCompetitions
- Language switcher: cambia idioma manteniendo la ruta actual
- Navbar: ruta activa resaltada; mobile: overlay full-screen con X para cerrar
- SocialSidebar: visible en sidebar izquierdo (xl+) o footer (menor)
