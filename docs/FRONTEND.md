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

Claves añadidas para la estética "paper" (deben estar presentes y con la misma forma en los 3 JSON, validado por `tsc` vía `lib/types.ts`):
- `header.photoCaption`, `summary.keywordsLabel`, `summary.keywords[]`, `summary.metrics[]`
- `leadership.resultLabel`; entradas con `imagesCaption?` y `highlight?` (booleano, activa la caja de resultado destacado)
- `education` / `experience` / `projects` / `volunteering`: entradas con `imagesCaption?` opcional junto a `images[]`
- `labels.lastRevised` (texto del footer)

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

## Diseño visual — «El paper»

Estética de paper académico / LaTeX: papel, tinta y un único acento rojo de corrección. La web se lee como un documento con capítulos numerados (1. Inicio, 2. Experiencia, 3. Educación, 4. Proyectos) en lugar de páginas sueltas.

| Token | Valor | Rol |
|---|---|---|
| `background` | `#FBFAF7` | blanco papel |
| `foreground` | `#1C1B18` | tinta |
| `muted` | `#6E6A63` | pies de figura, metadatos |
| `accent` | `#C13127` | boli rojo: links, cursor, notas al margen, activo |
| `border` | `#D9D5CC` | filetes (hairlines) |
| Font (serif) | STIX Two Text (via `next/font/google`, variable `--font-serif`, `font-serif`) | display + cuerpo |
| Font (mono) | JetBrains Mono (via `next/font/google`, variable `--font-mono`) | fechas, labels, stack, numeración |

**Elementos firma:**
- **Home = portada de paper:** nombre como título con `_` parpadeante en rojo (`animate-blink`), Summary como bloque **Abstract** justificado (`text-justify hyphens-auto`) con línea de `keywords` y fila de métricas en mono; foto envuelta en `<figure>` con `figcaption`.
- **Numeración estructural:** Navbar = índice con números mono (`1. Inicio`, `2. Experiencia`…); `h1` de cada página lleva el número del capítulo; `SectionTitle` acepta prop `number` para subsecciones (`2.1`, `3.2`…), pasada desde cada `app/[lang]/*/page.tsx` a través del componente de sección correspondiente.
- **TimelineEntry sin tarjeta:** sin `bg-white/rounded/shadow`; entradas planas separadas por `border-b`. Links como referencias mono `[label ↗]`. Imágenes envueltas en `<figure>` con `figcaption` opcional (prop `imagesCaption`, viene del diccionario). Prop `highlightLabel` dibuja una caja con borde de tinta para resultados destacados (ej. premio Bankinter).
- **Notas al margen:** el campo `note` se muestra en rojo mono itálica; en `2xl+` se posiciona como nota al margen derecha (`absolute left-full`), inline en pantallas menores.
- `prefers-reduced-motion: reduce` desactiva el parpadeo del cursor (`app/globals.css`).

**Layout:** `max-w-5xl` centrado, `px-6 sm:px-3`, secciones con `py-8`. El navbar es `fixed top-0` con `backdrop-blur-md` y `bg-background/90`.

---

## Estructura de componentes

```
components/
├── Navbar.tsx              # 'use client' — fixed nav + active route (usePathname) + hamburger
├── SocialSidebar.tsx       # Sidebar vertical fijo (xl+) / fila horizontal en footer (móvil)
├── LanguageSwitcher.tsx    # 'use client' — links EN|ES|GL, usa usePathname
├── ui/
│   ├── SectionTitle.tsx    # H2 serif + número mono opcional (prop `number`) + filete
│   ├── TimelineEntry.tsx   # Entrada plana date|content, reutilizable en todas las secciones
│   └── SkillBadge.tsx      # Texto font-mono plano con icono, hover accent
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

Componente genérico para todas las secciones con estructura fecha/título/subtítulo. Sin tarjeta: entradas planas separadas por `border-b`. Props:

| Prop | Tipo | Uso |
|---|---|---|
| `date` | `string` | Columna izquierda (7rem) en modo `timeline` |
| `title` | `string` | Título en negrita |
| `subtitle` | `string` | Organización/empresa/institución, en serif itálica muted |
| `bullets?` | `string[]` | Lista con viñeta `•` muted |
| `description?` | `string` | Párrafo (para Volunteering) |
| `note?` | `string` | Nota roja mono itálica; margen derecho en `2xl+`, inline debajo |
| `links?` | `EntryLink[]` | Referencias mono `[label ↗]` |
| `images?` / `imagesCaption?` | `string[]` / `string` | Galería envuelta en `<figure>` con `figcaption` |
| `highlightLabel?` | `string` | Si se pasa, dibuja caja con borde de tinta y la etiqueta arriba (resultado destacado) |
| `timeline?` | `boolean` | `true` = columna de fecha + raíl con punto; `false` = fecha inline en el header |

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
- `localhost:3000/en`, `/es`, `/gl` → home con abstract, keywords, métricas y `Fig. 1` de la foto
- `localhost:3000/en/experience` → h1 "2 …" + Experience (2.1) + Skills (2.2) + Volunteering (2.3)
- `localhost:3000/en/education` → h1 "3 …" + Education (3.1) + LeadershipAwards (3.2, caja de resultado en Akademia) + Languages (3.3) + Certifications (3.4)
- `localhost:3000/en/projects` → h1 "4 …" + ProjectsCompetitions (4.1), pies de figura en las galerías
- Language switcher: cambia idioma manteniendo la ruta actual
- Navbar: índice numerado, ruta activa en rojo; mobile: overlay full-screen (fondo papel) con X para cerrar
- SocialSidebar: visible en sidebar izquierdo (xl+) o footer (menor)
- Cursor `_` parpadea en rojo; con `prefers-reduced-motion` no parpadea
- Typecheck: `pnpm exec tsc --noEmit` sin errores
