// Vocabulario de atajos `{token}` de los diccionarios.
//
// Existe por un desajuste concreto del CMS: los campos `date` son uno solo y se
// escriben igual en los tres diccionarios, así que una fecha que acaba en una
// palabra ("2025 – presente") quedaba en español también en la versión inglesa.
// La alternativa era triplicar el campo en el panel; esta es más barata: se
// escribe `2025 – {present}` una vez y cada idioma resuelve su palabra.
//
// El atajo vale en CUALQUIER cadena del diccionario, no solo en `date`. La
// sustitución ocurre al cargar el diccionario para un idioma (`getDictionary`),
// de modo que los componentes, los metadatos y `llms.txt` ya ven la palabra
// final y nadie más tiene que saber que esto existe.
//
// Es un fichero .mjs y no .ts a propósito: lo importan tanto el código de la
// aplicación como los scripts de build, que son Node plano y no pasan por TS.
//
// Para añadir un atajo basta con sumar una entrada a TOKENS. `verify.mjs` y
// `ContentService.validate_invariants` del backend rechazan cualquier `{...}`
// que no esté aquí, así que una errata falla el build o el guardado en vez de
// llegar al sitio como texto literal.

/** @typedef {'en' | 'es' | 'gl'} Lang */

/** @type {Record<string, Record<Lang, string>>} */
export const TOKENS = {
  present: { es: 'presente', en: 'present', gl: 'presente' },
  ongoing: { es: 'en curso', en: 'ongoing', gl: 'en curso' },
  expected: { es: 'previsto', en: 'expected', gl: 'previsto' },
}

// El panel está en español, así que la palabra que uno teclea sin pensar es la
// castellana. Se admite como sinónimo del nombre canónico.
/** @type {Record<string, string>} */
export const ALIASES = {
  presente: 'present',
  previsto: 'expected',
}

const TOKEN_PATTERN = /\{([A-Za-z]+)\}/g

/** Nombres válidos, canónicos y sinónimos, para mensajes de error y ayudas. */
export const TOKEN_NAMES = [...Object.keys(TOKENS), ...Object.keys(ALIASES)].sort()

/**
 * Traducción de un atajo, o `null` si el nombre no está en el vocabulario.
 * `{Present}` devuelve la palabra con la inicial en mayúscula: los atajos
 * también aparecen al principio de una frase.
 *
 * @param {string} name
 * @param {Lang} lang
 * @returns {string | null}
 */
export function resolveToken(name, lang) {
  const key = name.toLowerCase()
  const entry = TOKENS[ALIASES[key] ?? key]
  if (!entry) return null
  const word = entry[lang] ?? entry.en
  return name[0] === name[0].toUpperCase() ? word[0].toUpperCase() + word.slice(1) : word
}

/**
 * Sustituye los atajos de una cadena. Un `{...}` desconocido se deja tal cual:
 * la validación lo caza antes, y dejarlo visible es mejor que borrarlo en
 * silencio si alguna vez se cuela.
 *
 * @param {string} text
 * @param {Lang} lang
 */
export function resolveTokens(text, lang) {
  if (!text.includes('{')) return text
  return text.replace(TOKEN_PATTERN, (raw, name) => resolveToken(name, lang) ?? raw)
}

/**
 * Copia del árbol con todas sus cadenas resueltas. No muta la entrada: el
 * diccionario original es un módulo JSON cacheado por el bundler y compartido
 * entre los tres idiomas.
 *
 * @template T
 * @param {T} node
 * @param {Lang} lang
 * @returns {T}
 */
export function resolveTokensDeep(node, lang) {
  if (typeof node === 'string') return /** @type {any} */ (resolveTokens(node, lang))
  if (Array.isArray(node)) return /** @type {any} */ (node.map(v => resolveTokensDeep(v, lang)))
  if (node && typeof node === 'object') {
    return /** @type {any} */ (
      Object.fromEntries(
        Object.entries(node).map(([k, v]) => [k, resolveTokensDeep(v, lang)])
      )
    )
  }
  return node
}

/**
 * Atajos escritos en el árbol que no están en el vocabulario, con su ruta.
 * Lo usan `verify.mjs` y, replicado, el backend.
 *
 * @param {unknown} node
 * @param {string} [path]
 * @returns {{ path: string, token: string }[]}
 */
export function findUnknownTokens(node, path = '') {
  if (typeof node === 'string') {
    return [...node.matchAll(TOKEN_PATTERN)]
      .filter(m => !TOKENS[ALIASES[m[1].toLowerCase()] ?? m[1].toLowerCase()])
      .map(m => ({ path, token: m[0] }))
  }
  if (Array.isArray(node)) {
    return node.flatMap((v, i) => findUnknownTokens(v, `${path}[${i}]`))
  }
  if (node && typeof node === 'object') {
    return Object.entries(node).flatMap(([k, v]) =>
      findUnknownTokens(v, path ? `${path}.${k}` : k)
    )
  }
  return []
}
