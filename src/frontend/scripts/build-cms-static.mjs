import { cpSync, rmSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const REPO_ROOT = join(ROOT, '..', '..')
const OUT_DIR = join(ROOT, 'out')
const BACKEND_STATIC = join(REPO_ROOT, 'src', 'backend', 'static')

const cmsSlug = process.env.NEXT_PUBLIC_CMS_ROUTE || 'admin'
const cmsOutDir = join(OUT_DIR, cmsSlug)
const nextAssetsDir = join(OUT_DIR, '_next')

console.log(`[build-cms-static] Exportando SOLO el panel del CMS a src/backend/static (nunca el sitio público)...`)

if (existsSync(BACKEND_STATIC)) {
  rmSync(BACKEND_STATIC, { recursive: true, force: true })
}
mkdirSync(BACKEND_STATIC, { recursive: true })

if (!existsSync(OUT_DIR)) {
  console.error(`[build-cms-static] No se encontró la carpeta out/. Ejecuta 'pnpm build' primero.`)
  process.exit(1)
}

// Solo los chunks de Next (CSS/JS/fuentes) y la página del panel: nunca el
// resto del sitio público, que no debe vivir en el subdominio del CMS.
if (existsSync(nextAssetsDir)) {
  cpSync(nextAssetsDir, join(BACKEND_STATIC, '_next'), { recursive: true })
}

const cmsIndexHtml = join(cmsOutDir, 'index.html')
if (existsSync(cmsIndexHtml)) {
  cpSync(cmsIndexHtml, join(BACKEND_STATIC, 'index.html'))
} else {
  console.error(`[build-cms-static] No se encontró out/${cmsSlug}/index.html. ¿Se generó la ruta del CMS antes del build?`)
  process.exit(1)
}

const cmsIndexTxt = join(cmsOutDir, 'index.txt')
if (existsSync(cmsIndexTxt)) {
  cpSync(cmsIndexTxt, join(BACKEND_STATIC, 'index.txt'))
}

console.log(`[build-cms-static] Panel del CMS exportado con éxito en src/backend/static!`)
