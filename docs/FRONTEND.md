# Frontend — Documentación técnica

Web CV personal de Ignacio Garbayo Fernández. Stack: **Next.js 14** (App Router) + **Tailwind CSS** + **TypeScript**. Deploy en Vercel.

---

## Arquitectura

### Routing

- `/` → redirect a `/en` (via `app/page.tsx`)
- `/en`, `/es`, `/gl` → generados estáticamente con `generateStaticParams` en `app/[lang]/layout.tsx`
- No se usa ninguna librería de i18n; el contenido está en JSONs por idioma

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
app/layout.tsx           → <>{children}</> (pass-through, html/body en [lang]/layout.tsx)
app/[lang]/layout.tsx    → <html lang={params.lang}><body>...</body></html>
app/[lang]/page.tsx      → carga dict + renderiza todas las secciones
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
├── Navbar.tsx              # 'use client' — fixed nav + hamburger + IntersectionObserver
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

- **Desktop (`md+`):** links horizontales con `IntersectionObserver` para sección activa (highlight en `text-accent`)
- **Mobile:** botón hamburger que despliega menú vertical; se cierra al hacer click en un link
- **Language switcher:** EN | ES | GL siempre visible. Reemplaza el segmento `[lang]` en el pathname actual usando `usePathname()`
- Offset de scroll: todas las secciones tienen `scroll-mt-20` para compensar el navbar fijo

---

## Secciones incluidas

| ID | Sección |
|---|---|
| `#summary` | Resumen profesional |
| `#skills` | 3 categorías de skills con badges |
| `#education` | 2 grados USC |
| `#experience` | 3 entradas (IGM WEB, IDIS, Federación Baloncesto) |
| `#leadership` | Akademia + premios adicionales |
| `#projects` | Hackathons, Sistema arbitral, Smart Water, Revista |
| `#languages` | Inglés C1, Español nativo, Gallego nativo |
| `#volunteering` | Refugiados, Social |
| `#certifications` | 8 entradas (McKinsey, AWS ×2, HuggingFace, Udemy ×3, Fujitsu) |

---

## Verificación

```bash
# Desde src/frontend/
pnpm dev        # → localhost:3000 (redirect a /en)
pnpm build      # Debe generar /en, /es, /gl estáticamente
```

Rutas a verificar:
- `localhost:3000/en` → contenido inglés
- `localhost:3000/es` → contenido español
- `localhost:3000/gl` → contenido gallego
- Language switcher: cambiar entre idiomas preserva la posición del scroll
- Navbar: active section se actualiza al hacer scroll
- Mobile (DevTools): hamburger funciona, diseño responsive correcto
