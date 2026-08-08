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

**`docs/`** — documentación técnica del proyecto. Parte de su contenido está fuera del control de versiones (ver `.gitignore`).

## Instrucciones para el agente

- No vuelvas a leer archivos ya leídos en esta sesión a menos que te lo pida. Minimiza las llamadas a herramientas y trabaja con lo que ya tienes en contexto.
- No ejecutes el `build` en cada modificación de código, ya ejecuto yo en formato dev o manualmente.
- No hagas ningún commit ni PR ni nada en Github. Cuando te pida algo de Github, dame los comandos exactos para hacerlo.
- **Nunca relances (`re-run`) ni lances un workflow de Actions sin preguntarme antes.** Consultar el estado y leer logs sí, sin pedir permiso; disparar ejecuciones no. Esto incluye los pushes a `main`, que disparan el deploy.
- Ante una tarea ambigua, pregunta antes de implementar
- No inventes contenido que no te he pedido. Si te pido añadir una entrada (curso, experiencia, proyecto...), añade solo los campos que te he dado. No añadas bullets, descripciones ni notas por tu cuenta: si crees que hacen falta, pregunta antes.
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
src/
    frontend/

## Convenciones
- al hacer algo, documentarás como funciona en la documentación técnica de `docs/`. Ahí es donde aparecen los detalles técnicos del proyecto.
- Los años se escriben siempre completos: `2026`, nunca abreviados como `26`. Esto aplica también a rangos y fechas `MM/AAAA` (p. ej. `09/2021 – 06/2027`, no `09/21 – 06/27`).

## Lo que no debes tocar

- ningún fichero de `docs/` que esté ignorado por git: son documentos personales y operativos, y deben quedarse fuera del repositorio público.


