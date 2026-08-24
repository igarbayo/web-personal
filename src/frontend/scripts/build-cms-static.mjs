import { cpSync, rmSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const REPO_ROOT = join(ROOT, '..', '..')
const OUT_DIR = join(ROOT, 'out')
const BACKEND_STATIC = join(REPO_ROOT, 'src', 'backend', 'static')

const cmsSlug = process.env.NEXT_PUBLIC_CMS_ROUTE || 'admin'
const cmsOutDir = join(OUT_DIR, cmsSlug)

console.log(`[build-cms-static] Exportando CMS a src/backend/static para servir en <subdominio>.ignaciogarbayo.com...`)

if (existsSync(BACKEND_STATIC)) {
  rmSync(BACKEND_STATIC, { recursive: true, force: true })
}
mkdirSync(BACKEND_STATIC, { recursive: true })

// Copy full static output so all Next.js chunks, fonts and images resolve
if (existsSync(OUT_DIR)) {
  cpSync(OUT_DIR, BACKEND_STATIC, { recursive: true })
  
  // Also copy index.html from out/${cmsSlug}/index.html to static/index.html
  const cmsIndexHtml = join(cmsOutDir, 'index.html')
  if (existsSync(cmsIndexHtml)) {
    cpSync(cmsIndexHtml, join(BACKEND_STATIC, 'index.html'))
  }
  console.log(`[build-cms-static] CMS exportado con éxito en src/backend/static!`)
} else {
  console.error(`[build-cms-static] No se encontró la carpeta out/. Ejecuta 'pnpm build' primero.`)
}
