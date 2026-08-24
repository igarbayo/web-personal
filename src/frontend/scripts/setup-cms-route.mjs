import { cpSync, rmSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CMS_TEMPLATE = join(ROOT, 'cms-template')
const APP_DIR = join(ROOT, 'app')

const cmsSlug = process.env.NEXT_PUBLIC_CMS_ROUTE || 'admin'
const targetDir = join(APP_DIR, cmsSlug)

console.log(`[setup-cms-route] Configurando subruta del CMS en app/${cmsSlug}...`)

// 1. Clean up old dynamic route [cms_route] if it exists
const oldDynamic = join(APP_DIR, '[cms_route]')
if (existsSync(oldDynamic)) {
  rmSync(oldDynamic, { recursive: true, force: true })
}

// 2. Clean up target directory and copy template
if (existsSync(targetDir)) {
  rmSync(targetDir, { recursive: true, force: true })
}

cpSync(CMS_TEMPLATE, targetDir, { recursive: true })
console.log(`[setup-cms-route] CMS configurado con éxito en /${cmsSlug}/`)
