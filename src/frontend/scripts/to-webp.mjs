// Convierte a WebP las imágenes rasterizadas referenciadas en la web.
// Genera <nombre>.webp junto al original (no borra nada).
// Uso:  node scripts/to-webp.mjs
//
// Requiere sharp:  pnpm add -D sharp

import { fileURLToPath } from 'node:url'
import { dirname, join, parse } from 'node:path'
import { stat } from 'node:fs/promises'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
// Los originales viven en `assets/`, fuera de `public/`, para que no acaben
// en el export estático ni en el artefacto de deploy. El WebP resultante sí
// se escribe en `public/`, que es lo único que la web sirve.
const ASSETS = join(__dirname, '..', 'assets')
const PUBLIC = join(__dirname, '..', 'public')

// Originales de los que se genera cada WebP servido por la web.
// SVGs, favicons, manifest icons, apple-touch y la OG image se quedan como están.
const FILES = [
  // Foto de perfil
  'me.png',
  'me-movil.png',
  // Logos
  'usc.png',
  'idis.png',
  'fegaba.png',
  'bankinter.jpg',
  'egs.png',
  'mckinsey.png',
  'huuging-face.png',
  'maismates.jpg',
  'citius.png',
  'citius-white.png',
  'linux-foundation.png',
  'anthropic.png',
  'aws.jpg',
  'fujitsu.jpg',
  'udemy.png',
  // Imágenes de experiencias / proyectos / voluntariado
  'akademia-1.JPG',
  'akademia-2.jfif',
  'hack-1-compressed.jpg',
  'hack-2-compressed.jpg',
  'hack-3-compressed.jpeg',
  'hack-4-compressed.jpg',
  'hack-5-compressed.jpg',
  'mais-mates-1.JPG',
  'mais-mates-2.JPG',
  'mais-mates-3.jpeg',
  'volunt-fegaba-1.jfif',
  'volunt-fegaba-2.jpg',
]

const QUALITY = 82

const fmt = (n) => (n / 1024).toFixed(0).padStart(6) + ' KB'

let totalIn = 0
let totalOut = 0

for (const file of FILES) {
  const src = join(ASSETS, file)
  const out = join(PUBLIC, parse(file).name + '.webp')
  try {
    const before = (await stat(src)).size
    await sharp(src).webp({ quality: QUALITY, effort: 6 }).toFile(out)
    const after = (await stat(out)).size
    totalIn += before
    totalOut += after
    const pct = (100 - (after / before) * 100).toFixed(0)
    console.log(`${fmt(before)} -> ${fmt(after)}  (-${pct}%)  ${file}`)
  } catch (err) {
    console.error(`ERROR  ${file}: ${err.message}`)
  }
}

console.log('─'.repeat(48))
console.log(`TOTAL  ${fmt(totalIn)} -> ${fmt(totalOut)}  (-${(100 - (totalOut / totalIn) * 100).toFixed(0)}%)`)
