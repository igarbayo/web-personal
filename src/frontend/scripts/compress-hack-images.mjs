// Recomprime las imágenes de hackathons a un tamaño razonable para la web.
// Los originales son fotos de cámara (hasta 8000x5343 px) pero se muestran
// como thumbnails de 256px de alto -> se redimensionan a un ancho máximo
// de 1200px (suficiente para pantallas retina) antes de convertir a WebP.
// Uso:  node scripts/compress-hack-images.mjs

import { fileURLToPath } from 'node:url'
import { dirname, join, parse } from 'node:path'
import { stat } from 'node:fs/promises'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC = join(__dirname, '..', 'public')

const FILES = [
  'hack-1-compressed.jpg',
  'hack-2-compressed.jpg',
  'hack-3-compressed.jpeg',
  'hack-4-compressed.jpg',
  'hack-5-compressed.jpg',
]

const MAX_WIDTH = 1200
const QUALITY = 75

const fmt = (n) => (n / 1024).toFixed(0).padStart(6) + ' KB'

let totalIn = 0
let totalOut = 0

for (const file of FILES) {
  const src = join(PUBLIC, file)
  const out = join(PUBLIC, parse(file).name + '.webp')
  const before = (await stat(src)).size
  await sharp(src)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(out)
  const after = (await stat(out)).size
  totalIn += before
  totalOut += after
  const pct = (100 - (after / before) * 100).toFixed(0)
  console.log(`${fmt(before)} -> ${fmt(after)}  (-${pct}%)  ${file}`)
}

console.log('─'.repeat(48))
console.log(`TOTAL  ${fmt(totalIn)} -> ${fmt(totalOut)}  (-${(100 - (totalOut / totalIn) * 100).toFixed(0)}%)`)
