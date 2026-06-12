## Proyecto

This is a CV web project, simple, ellegant and a litte bit nerd. Your output must be in English primarilly. Hecho con Next.js 14, Tailwind CSS y TypeScript.

En el proyecto se usa pnpm, no npm.

## Setup

**Stack:** Next.js 14 (static export), Tailwind CSS, TypeScript. Package manager: pnpm.

**`src/frontend/`** — toda la aplicación:
- `app/[lang]/` — routing con i18n (en/es/gl), layout y página principal
- `components/sections/` — secciones del CV (Header, Summary, Experience, Education, Skills, etc.)
- `components/ui/` — componentes reutilizables (SectionTitle, SkillBadge, TimelineEntry)
- `components/` — Navbar, SocialSidebar, LanguageSwitcher
- `dictionaries/` — traducciones JSON (en/es/gl)
- `lib/` — utilidades (dictionaries loader, renderText, skillIcons, types)

**`docs/`** — CVs en PDF + documentación técnica (`FRONTEND.md`).

## Instrucciones para el agente

- No vuelvas a leer archivos ya leídos en esta sesión a menos que te lo pida. Minimiza las llamadas a herramientas y trabaja con lo que ya tienes en contexto.
- No ejecutes el `build` en cada modificación de código, ya ejecuto yo en formato dev o manualmente.
- No hagas ningún commit ni PR ni nada en Github. Cuando te pida algo de Github, dame los comandos exactos para hacerlo.
- Ante una tarea ambigua, pregunta antes de implementar
- Si necesitas contexto de un archivo que no has leído, pídelo antes de asumir su contenido
- Piensa antes de actuar. Lee los archivos existentes antes de escribir código.
- Sé conciso en el output pero exhaustivo en el razonamiento.
- Prefiere editar antes que reescribir archivos enteros.
- No vuelvas a leer archivos que ya has leído a menos que el archivo pueda haber cambiado.
- Prueba el código antes de declarar que has terminado.
- Sin openers aduladores ni fluff de cierre.
- Mantén las soluciones simples y directas.
- Las instrucciones del usuario siempre tienen prioridad sobre este archivo.
- pnpm run dev lo ejecuto yo.

## Estructura relevante

docs/  
    CV English.pdf
    CV Spanish.pdf
src/
    frontend/

## Convenciones
- al hacer algo, documentarás como funciona en `docs/`, en  `FRONTEND.md`. En esos documentos es donde aparecerán los detalles técnicos del proyecto.

## Lo que no debes tocar

- la carpeta docs/


