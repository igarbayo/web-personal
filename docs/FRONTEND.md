# Frontend — Documentación técnica

Web CV personal de Ignacio Garbayo Fernández. Stack: **Next.js 14** (App Router) + **Tailwind CSS** + **TypeScript**. Deploy en **GitHub Pages** con `basePath: '/web-personal'`.

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
- Las imágenes en `public/` se referencian con el prefijo `${process.env.NEXT_PUBLIC_BASE_PATH}/` (necesario por el basePath de GitHub Pages)

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

| Token | Valor |
|---|---|
| Background | `#FAFAFA` |
| Foreground | `#1A1A1A` |
| Muted (secondary) | `#6B7280` |
| Accent | `#2563EB` |
| Border | `#E5E7EB` |
| Font (sans) | Inter (via `next/font/google`, variable `--font-inter`) |
| Font (mono) | system monospace (variable `--font-mono`) |

**Toques nerd:** skill badges en `font-mono`, cursor parpadeante (`_`) tras el nombre en el Header usando `cursor-blink::after` (CSS animation + Tailwind `animate-blink`).

**Layout:** `max-w-4xl` centrado, `px-4 sm:px-6`, secciones con `py-8`. El navbar es `fixed top-0` con `backdrop-blur-md` y `bg-background/80`.

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
| `date` | `string` | Columna izquierda (7rem) |
| `title` | `string` | Título en negrita |
| `subtitle` | `string` | Organización/empresa/institución |
| `subtitleUrl?` | `string` | Convierte el subtitle en enlace externo |
| `bullets?` | `string[]` | Lista con `·` como marcador |
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
