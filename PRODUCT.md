# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Tres audiencias con el mismo material y distinta intención:

- **Reclutadores técnicos**: recruiters y hiring managers de empresas de software revisando una candidatura, con poco tiempo y en escritorio. Buscan comprobar cualificación rápido.
- **Contactos profesionales**: gente que ha coincidido con Ignacio en un evento, hackathon o LinkedIn y entra a comprobar quién es. Llegada frecuente desde móvil.
- **Clientes y colaboradores potenciales**: alguien evaluando trabajar con él en un proyecto o colaboración.

Ninguna de las tres es secundaria. El sitio no se segmenta por audiencia, sirve el mismo CV a las tres.

## Product Purpose

CV web personal de Ignacio Garbayo Fernández, publicado en ignaciogarbayo.com. Sustituye al PDF como enlace que se manda en cualquier candidatura o presentación: indexable, siempre actualizado y legible en móvil.

Una visita tiene éxito cuando cumple las tres cosas a la vez:

1. El lector sale convencido de la cualificación del perfil.
2. El enlace funciona como CV canónico, sin necesidad de adjuntar nada.
3. El lector llega al trabajo concreto (proyectos y premios), no solo al listado de experiencia.

El contacto es deseable pero no es la métrica de éxito.

## Positioning

Un CV que vive en el navegador y no en un adjunto. Tres rasgos que un sitio personal vecino no copia sin más:

- **Trilingüe real** en inglés, español y gallego, con paridad estricta de contenido y sin librería de i18n. El gallego no es decorativo, es parte de la identidad del perfil.
- **Contenido en datos**: el CV entero vive en `dictionaries/{en,es,gl}.json` y los componentes solo lo pintan. Actualizar el CV es editar JSON, no tocar interfaz.
- **Estático de verdad**: `output: 'export'`, sin servidor ni base de datos, con analíticas server-side desde el edge de Cloudflare en vez de scripts en el cliente.

## Operating Context

- Llegadas típicas: enlace enviado en una candidatura, perfil de LinkedIn, GitHub, Devpost o búsqueda por nombre.
- Lectura mixta escritorio y móvil. El punto de corte del diseño es el breakpoint `sm` de Tailwind, 640 px.
- Sesiones cortas y de escaneo, no de lectura lineal.
- Un CV en PDF sigue existiendo y se sigue enviando. La web y el PDF conviven y deben mantenerse consistentes entre sí.
- Publicación: push a `main` en GitHub, build en GitHub Actions, GitHub Pages detrás del proxy de Cloudflare, dominio propio.

## Capabilities and Constraints

Capacidades actuales:

- Rutas `/[lang]` para en, es y gl, más rutas sin prefijo indexables, sitemap, robots, hreflang, 404 propia, datos estructurados Person y `llms.txt` generado.
- Secciones: resumen, competencias, formación, experiencia, liderazgo y premios, proyectos y competiciones, idiomas, voluntariado, certificaciones. Páginas dedicadas para formación, experiencia y proyectos.
- Modo oscuro que sigue la preferencia del sistema, con toggle manual persistente y sin parpadeo inicial.
- Imágenes en WebP generadas desde originales que quedan fuera del artefacto de deploy.

Restricciones duras confirmadas:

- **Legible sin JavaScript**: todo el contenido debe renderizar sin JS. Solo el toggle de tema y el menú móvil pueden depender de él.
- **Paridad trilingüe estricta**: toda entrada existe en los tres diccionarios, comprobado por `pnpm verify`. Los años van completos (`07/2026`, nunca `07/26`).
- **Artefacto ligero**: el export debe seguir pequeño. Los originales de imagen viven en `assets/`, nunca en `public/`. Por encima de unos pocos MB el deploy de Pages se encalla en `deployment_queued`.

Restricción blanda:

- **JavaScript de terceros negociable con criterio**: por defecto se evita, pero puede añadirse algo externo si aporta valor real. Ya no es línea roja absoluta, aunque el README todavía lo describe como tal.

Stack fijado por el código existente: Next.js 14 con App Router, React 18, TypeScript, Tailwind, pnpm, Node 20+, sin dependencias de UI más allá de `react-icons`.

## Brand Commitments

- Nombre y dominio: Ignacio Garbayo Fernández, ignaciogarbayo.com.
- Identidad profesional que el sitio debe transmitir, en palabras del propio Ignacio: esencia técnica, de builder, de startup e intelectual. La doble base de ingeniería informática y matemáticas es parte de esa identidad, no un dato suelto.
- Estilo de texto en español: mayúscula solo en la primera palabra y en nombres propios, sin raya ni punto y coma.
- Perfiles públicos vinculados: GitHub `igarbayo`, LinkedIn `ignaciogarbayo`, Devpost `igarbayo`, email iggarbayo@gmail.com.

## Evidence on Hand

Material real disponible, que el trabajo futuro puede usar y no debe inventar:

- **Repos públicos**: proyectos con código enlazable en GitHub y Devpost.
- **Premios verificables**: primer premio nacional de Bankinter por un algoritmo de Business Intelligence, con fuente pública.
- **Demos y capturas propias**: vídeos, demos vivas o imágenes de los proyectos, más allá de logos.
- **Logos de instituciones y empresas** en `src/frontend/public/`, en variante clara y oscura.
- **Contenido del CV** completo y traducido en `src/frontend/dictionaries/{en,es,gl}.json`.

Ausencias que no se rellenan inventando: no hay publicaciones ni papers citables, no hay testimonios ni referencias de terceros, no hay métricas de tráfico o de uso publicables.

## Product Principles

1. **El contenido vive en los diccionarios.** Cualquier cosa que sea CV entra por JSON en los tres idiomas. La interfaz nunca almacena contenido.
2. **Escaneo antes que lectura.** El lector típico dedica menos de un minuto. La jerarquía debe permitir sacar una conclusión sobre el perfil sin leerlo entero.
3. **El trabajo concreto es la prueba.** Proyectos y premios son la evidencia que respalda las afirmaciones del resumen, así que tienen que ser alcanzables, no un anexo.
4. **Nada se degrada sin JavaScript.** La funcionalidad opcional puede depender de JS, el contenido nunca.
5. **El peso del artefacto es una restricción de producto, no de ingeniería.** Si el export engorda, el sitio deja de publicarse.

## Accessibility & Inclusion

- Contenido completo legible sin JavaScript.
- Paridad de contenido entre los tres idiomas, sin idioma de segunda.
- Uso real en móvil y escritorio, probado en Chrome, Safari y Firefox.
- No hay un estándar formal comprometido (WCAG u otro) más allá de estas condiciones.
