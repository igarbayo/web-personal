// Dimensiones intrínsecas (px) de los logos e imágenes de galería referenciados
// dinámicamente en TimelineEntry, requeridas por next/image.
export const imageDimensions: Record<string, { width: number; height: number }> = {
  // Logos
  'igm.svg': { width: 102, height: 34 },
  'hotusa.svg': { width: 227, height: 69 },
  'idis.webp': { width: 187, height: 134 },
  'citius.webp': { width: 447, height: 447 },
  'citius-white.webp': { width: 1981, height: 526 },
  'fegaba.webp': { width: 851, height: 812 },
  'usc.webp': { width: 500, height: 326 },
  'egs.webp': { width: 1626, height: 341 },
  'egs-white.webp': { width: 1626, height: 341 },
  'maismates.webp': { width: 694, height: 529 },
  'mckinsey.webp': { width: 634, height: 634 },
  'aws.webp': { width: 620, height: 620 },
  'huuging-face.webp': { width: 418, height: 394 },
  'anthropic.webp': { width: 291, height: 291 },
  'linux-foundation.webp': { width: 431, height: 431 },
  'udemy.webp': { width: 525, height: 525 },
  'fujitsu.webp': { width: 1125, height: 1125 },
  'factorial.webp': { width: 429, height: 429 },
  'mensa.webp': { width: 1280, height: 1280 },
  'tef.svg': { width: 1224, height: 1224 },
  // Galería
  'volunt-fegaba-1.webp': { width: 2048, height: 1366 },
  'volunt-fegaba-2.webp': { width: 1080, height: 810 },
  'hack-1-compressed.webp': { width: 1200, height: 801 },
  'hack-2-compressed.webp': { width: 1200, height: 800 },
  'hack-3-compressed.webp': { width: 1200, height: 857 },
  'hack-4-compressed.webp': { width: 1200, height: 800 },
  'hack-5-compressed.webp': { width: 1200, height: 800 },
  'mais-mates-1.webp': { width: 2000, height: 1500 },
  'mais-mates-2.webp': { width: 1342, height: 1200 },
  'mais-mates-3.webp': { width: 1088, height: 899 },
  'taiafox-1.webp': { width: 1280, height: 960 },
  'expresso-1.webp': { width: 1600, height: 900 },
  'expresso-2.webp': { width: 1200, height: 630 },
}

export function getImageDimensions(src: string) {
  const filename = src.split('/').pop()!
  return imageDimensions[filename] ?? { width: 1200, height: 800 }
}
