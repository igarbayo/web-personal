import { resolveTokensDeep } from './tokens.mjs'
import type { Dictionary } from './types'

export type Lang = 'en' | 'es' | 'gl'

const loaders: Record<Lang, () => Promise<Dictionary>> = {
  en: () => import('../dictionaries/en.json').then((m) => m.default as unknown as Dictionary),
  es: () => import('../dictionaries/es.json').then((m) => m.default as unknown as Dictionary),
  gl: () => import('../dictionaries/gl.json').then((m) => m.default as unknown as Dictionary),
}

// Cada página pide el diccionario dos veces (metadatos y cuerpo) y resolver los
// atajos copia el árbol entero, así que se guarda el resultado por idioma.
const cache = new Map<Lang, Promise<Dictionary>>()

export function getDictionary(lang: string): Promise<Dictionary> {
  const key = lang in loaders ? (lang as Lang) : 'en'
  let dict = cache.get(key)
  if (!dict) {
    // Aquí es donde los atajos `{present}` de los diccionarios se convierten en
    // la palabra del idioma. Ver lib/tokens.mjs. Es el único punto de carga,
    // así que todo lo que hay aguas abajo ve ya el texto final.
    dict = loaders[key]().then((d) => resolveTokensDeep(d, key))
    cache.set(key, dict)
  }
  return dict
}
