// Dimensiones intrínsecas (px) de los logos e imágenes de galería referenciados
// dinámicamente en TimelineEntry, requeridas por next/image.
export const imageDimensions: Record<string, { width: number; height: number }> = {
  // Logos
  'igm.svg': { width: 102, height: 34 },
  'hotusa.svg': { width: 227, height: 69 },
  'idis.webp': { width: 263, height: 191 },
  'fegaba.webp': { width: 1800, height: 812 },
  'usc.webp': { width: 500, height: 326 },
  'egs.webp': { width: 1626, height: 341 },
  'egs-white.webp': { width: 1626, height: 341 },
  'maismates.webp': { width: 694, height: 529 },
  'mckinsey.webp': { width: 381, height: 132 },
  'aws.webp': { width: 1200, height: 630 },
  'huuging-face.webp': { width: 1738, height: 394 },
  'anthropic.webp': { width: 800, height: 90 },
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
}

export function getImageDimensions(src: string) {
  const filename = src.split('/').pop()!
  return imageDimensions[filename] ?? { width: 1200, height: 800 }
}
