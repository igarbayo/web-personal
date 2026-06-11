import type { Dictionary } from './types'

export type Lang = 'en' | 'es' | 'gl'

const loaders: Record<Lang, () => Promise<Dictionary>> = {
  en: () => import('../dictionaries/en.json').then((m) => m.default as unknown as Dictionary),
  es: () => import('../dictionaries/es.json').then((m) => m.default as unknown as Dictionary),
  gl: () => import('../dictionaries/gl.json').then((m) => m.default as unknown as Dictionary),
}

export function getDictionary(lang: string): Promise<Dictionary> {
  const key = lang as Lang
  return (loaders[key] ?? loaders.en)()
}
