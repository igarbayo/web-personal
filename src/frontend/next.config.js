/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Genera `ruta/index.html` en vez de `ruta.html`, para que GitHub Pages
  // sirva `/en/` y redirija `/en` → `/en/` en lugar de devolver 404.
  trailingSlash: true,
  images: { unoptimized: true },
}

module.exports = nextConfig
