// Verificaciones propias del proyecto. Sin dependencias: solo Node.
// Uso:  node scripts/verify.mjs   (o `pnpm verify`)
//
// Comprueba invariantes que ni ESLint ni `next build` detectan, porque los
// diccionarios son JSON y las rutas de imagen se resuelven en tiempo de
// ejecución. Lo ejecuta el hook de pre-commit.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, basename } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = join(ROOT, 'public')
const ASSETS = join(ROOT, 'assets')
const DICTS = join(ROOT, 'dictionaries')

// Presupuesto de peso para `public/`. Next copia esa carpeta entera a `out/`,
// que es el artefacto de deploy: si crece sin control, el despliegue se
// ralentiza. Referencia: llegó a 44 MB por tener los originales dentro.
const PUBLIC_BUDGET_MB = 8

// Ficheros que el sitio sirve sin que ningún import los mencione.
const UNREFERENCED_BUT_REQUIRED = [
  'CNAME',
  '.nojekyll',
  'web-app-manifest-192x192.png',
  'web-app-manifest-512x512.png',
]

const errors = []
const check = (name, fn) => {
  try {
    const detail = fn()
    console.log(`  ok    ${name}${detail ? ` — ${detail}` : ''}`)
  } catch (err) {
    errors.push(`${name}: ${err.message}`)
    console.log(`  FALLA ${name}`)
    console.log(`        ${err.message.split('\n').join('\n        ')}`)
  }
}

const walk = dir =>
  readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]
  )

const langs = ['en', 'es', 'gl']
const dicts = {}

console.log('verify')

check('los diccionarios parsean', () => {
  for (const lang of langs) {
    const file = join(DICTS, `${lang}.json`)
    try {
      dicts[lang] = JSON.parse(readFileSync(file, 'utf8'))
    } catch (err) {
      throw new Error(`${lang}.json no es JSON válido — ${err.message}`)
    }
  }
  return `${langs.length} idiomas`
})

check('mismas secciones en los 3 idiomas', () => {
  const base = Object.keys(dicts.en ?? {}).sort()
  for (const lang of langs.slice(1)) {
    const keys = Object.keys(dicts[lang] ?? {}).sort()
    const falta = base.filter(k => !keys.includes(k))
    const sobra = keys.filter(k => !base.includes(k))
    if (falta.length || sobra.length) {
      throw new Error(
        `${lang}.json difiere de en.json` +
          (falta.length ? ` — falta: ${falta.join(', ')}` : '') +
          (sobra.length ? ` — sobra: ${sobra.join(', ')}` : '')
      )
    }
  }
  return `${base.length} secciones`
})

check('todas las imágenes referenciadas existen en public/', () => {
  const refs = new Set()
  const rutaImagen = /['"`](\/?[\w\-./]+\.(?:webp|svg|png|jpe?g|ico))['"`]/g

  for (const lang of langs) {
    for (const m of JSON.stringify(dicts[lang]).matchAll(rutaImagen)) {
      refs.add(basename(m[1]))
    }
  }
  for (const dir of ['app', 'components', 'lib']) {
    for (const file of walk(join(ROOT, dir))) {
      for (const m of readFileSync(file, 'utf8').matchAll(rutaImagen)) {
        refs.add(basename(m[1]))
      }
    }
  }
  const manifest = JSON.parse(readFileSync(join(PUBLIC, 'site.webmanifest'), 'utf8'))
  for (const icon of manifest.icons ?? []) refs.add(basename(icon.src))

  const presentes = new Set(readdirSync(PUBLIC))
  const faltan = [...refs].filter(r => !presentes.has(r)).sort()
  if (faltan.length) {
    throw new Error(
      `referenciados pero ausentes de public/: ${faltan.join(', ')}\n` +
        `¿están en assets/ sin haber generado el .webp?`
    )
  }
  return `${refs.size} referencias`
})

check('los scripts de imagen encuentran sus fuentes en assets/', () => {
  const scripts = ['to-webp.mjs', 'compress-hack-images.mjs']
  const faltan = []
  let total = 0
  for (const script of scripts) {
    const txt = readFileSync(join(ROOT, 'scripts', script), 'utf8')
    const bloque = txt.match(/const FILES = \[(.*?)\]/s)?.[1] ?? ''
    for (const [, file] of bloque.matchAll(/'([^']+)'/g)) {
      total++
      if (!existsSync(join(ASSETS, file))) faltan.push(`${script} → ${file}`)
    }
  }
  if (faltan.length) throw new Error(`fuentes ausentes:\n${faltan.join('\n')}`)
  return `${total} fuentes`
})

check(`public/ por debajo de ${PUBLIC_BUDGET_MB} MB`, () => {
  const bytes = walk(PUBLIC).reduce((n, f) => n + statSync(f).size, 0)
  const mb = bytes / 1024 / 1024
  if (mb > PUBLIC_BUDGET_MB) {
    throw new Error(
      `public/ ocupa ${mb.toFixed(1)} MB, por encima del presupuesto de ${PUBLIC_BUDGET_MB} MB.\n` +
        `Next la copia entera al artefacto de deploy. Los originales van en assets/.`
    )
  }
  return `${mb.toFixed(1)} MB`
})

check('años con 4 cifras en los campos date', () => {
  // Convención del proyecto: 09/2021, nunca 09/21. Se mira solo la clave
  // `date`: en texto libre el patrón chocaría con notas ("8.1/10") y con las
  // fechas que traen las URLs de prensa.
  const malos = []
  let total = 0
  for (const lang of langs) {
    const recorre = (nodo, ruta) => {
      if (Array.isArray(nodo)) {
        nodo.forEach((v, i) => recorre(v, `${ruta}[${i}]`))
      } else if (nodo && typeof nodo === 'object') {
        for (const [k, v] of Object.entries(nodo)) {
          const sub = ruta ? `${ruta}.${k}` : k
          if (k === 'date' && typeof v === 'string') {
            total++
            if (/\d{1,2}\/\d{2}(?!\d)/.test(v)) malos.push(`${lang}: ${sub} → "${v}"`)
          } else {
            recorre(v, sub)
          }
        }
      }
    }
    recorre(dicts[lang], '')
  }
  if (malos.length) throw new Error(`fechas abreviadas:\n${malos.join('\n')}`)
  return `${total} fechas`
})

check('siguen en public/ los ficheros que no se referencian pero hacen falta', () => {
  const faltan = UNREFERENCED_BUT_REQUIRED.filter(f => !existsSync(join(PUBLIC, f)))
  if (faltan.length) throw new Error(`ausentes de public/: ${faltan.join(', ')}`)
  return `${UNREFERENCED_BUT_REQUIRED.length} ficheros`
})

if (errors.length) {
  console.error(`\nverify: ${errors.length} comprobación(es) fallidas`)
  process.exit(1)
}
console.log('verify: todo correcto')
