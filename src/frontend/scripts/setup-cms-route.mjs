import { cpSync, rmSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CMS_TEMPLATE = join(ROOT, 'cms-template')
const APP_DIR = join(ROOT, 'app')

const cmsSlug = process.env.NEXT_PUBLIC_CMS_ROUTE || 'admin'
const targetDir = join(APP_DIR, cmsSlug)

// 1. Clean up old dynamic route [cms_route] if it exists
const oldDynamic = join(APP_DIR, '[cms_route]')
if (existsSync(oldDynamic)) {
  rmSync(oldDynamic, { recursive: true, force: true })
}

// 2. Always clean up the target directory first, whether or not we're about
// to repopulate it. This guarantees a stale CMS route never survives into a
// build that meant to skip it.
if (existsSync(targetDir)) {
  rmSync(targetDir, { recursive: true, force: true })
}

// SKIP_CMS_ROUTE=1 is set by the GitHub Pages workflow: that build is the
// public site and must never ship the admin panel or its JS chunks.
if (process.env.SKIP_CMS_ROUTE === '1') {
  console.log('[setup-cms-route] SKIP_CMS_ROUTE=1: el panel del CMS no se incluye en este build (build público).')
  process.exit(0)
}

cpSync(CMS_TEMPLATE, targetDir, { recursive: true })
console.log(`[setup-cms-route] CMS configurado con éxito en /${cmsSlug}/`)
