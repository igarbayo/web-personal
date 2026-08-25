import type { Dictionary } from './types'

export interface DictionariesBundle {
  en: Dictionary
  es: Dictionary
  gl: Dictionary
}

export interface MediaItem {
  filename: string
  size_bytes: number
  size_kb: number
  width?: number
  height?: number
  format: string
  url: string
}

export interface MediaListResponse {
  total_files: number
  total_size_mb: number
  budget_mb: number
  budget_remaining_mb: number
  items: MediaItem[]
}

export interface ApiResponse<T = any> {
  status: string
  message: string
  details?: any
  data?: T
}

// El backend sirve public/ en /media-files/, hermano de /api/v1 y no debajo.
// En producción panel y API comparten origen, así que una ruta relativa
// basta. En desarrollo local (`pnpm dev` en :3000 contra FastAPI en :8000)
// no comparten origen, así que se deriva la misma base que usa la API a
// partir de NEXT_PUBLIC_CMS_API_URL en vez de asumir origen propio.
function getMediaBase(): string {
  if (process.env.NEXT_PUBLIC_CMS_API_URL) {
    return process.env.NEXT_PUBLIC_CMS_API_URL.replace(/\/$/, '').replace(/\/api\/v1$/, '')
  }
  return ''
}

const MEDIA_BASE = getMediaBase()

// MediaItem.url de la API ya lleva este prefijo; este helper es para
// componentes (como ImagePicker) que solo tienen el nombre de fichero de un
// campo del diccionario (p. ej. logo: ["cambridge.svg"]).
export function mediaUrl(filename: string): string {
  const clean = filename.replace(/^\//, '')
  return `${MEDIA_BASE}/media-files/${clean}`
}

// Para componentes que sí reciben `MediaItem.url` de la API (ya con el
// prefijo `/media-files/` puesto por el backend) y solo necesitan anteponer
// el origen, sin volver a construir la ruta como hace `mediaUrl()`.
export function resolveMediaUrl(url: string): string {
  return `${MEDIA_BASE}${url}`
}

function getApiBase(): string {
  // If explicitly configured, use that
  if (process.env.NEXT_PUBLIC_CMS_API_URL) {
    return process.env.NEXT_PUBLIC_CMS_API_URL.replace(/\/$/, '')
  }
  // In the browser: use relative path (same-origin, works on any domain)
  if (typeof window !== 'undefined') {
    return '/api/v1'
  }
  // SSR / build time fallback
  return 'http://localhost:8000/api/v1'
}

const API_BASE = getApiBase()

const TOKEN_KEY = 'garden_cms_token'

export class CmsClient {
  static getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
  }

  static setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token)
    }
  }

  static removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
    }
  }

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {},
    confirmationPassword?: string
  ): Promise<T> {
    const token = this.getToken()
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    if (confirmationPassword) {
      headers['X-Confirmation-Password'] = confirmationPassword
    }

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    })

    if (!res.ok) {
      let errorDetail = `Error ${res.status}: ${res.statusText}`
      try {
        const errorJson = await res.json()
        if (errorJson.detail) {
          errorDetail = typeof errorJson.detail === 'string'
            ? errorJson.detail
            : JSON.stringify(errorJson.detail)
        }
      } catch {
        // use default errorDetail
      }
      throw new Error(errorDetail)
    }

    return res.json()
  }

  static async login(username: string, password: string): Promise<{ access_token: string }> {
    const res = await this.request<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    this.setToken(res.access_token)
    return res
  }

  static async verifyKey(password: string): Promise<boolean> {
    const res = await this.request<{ valid: boolean }>('/auth/verify-key', {
      method: 'POST',
      body: JSON.stringify({ password }),
    })
    return res.valid
  }

  static async getMe(): Promise<{ username: string; authenticated: boolean }> {
    return this.request<{ username: string; authenticated: boolean }>('/auth/me')
  }

  static async getDictionaries(): Promise<DictionariesBundle> {
    return this.request<DictionariesBundle>('/content/dictionaries')
  }

  static async validateBundle(bundle: DictionariesBundle): Promise<ApiResponse> {
    return this.request<ApiResponse>('/content/validate', {
      method: 'POST',
      body: JSON.stringify(bundle),
    })
  }

  static async saveDictionaries(
    bundle: DictionariesBundle,
    confirmationPassword: string,
    commitMessage?: string
  ): Promise<ApiResponse> {
    return this.request<ApiResponse>(
      '/content/dictionaries',
      {
        method: 'PUT',
        body: JSON.stringify({
          dictionaries: bundle,
          commit_message: commitMessage,
        }),
      },
      confirmationPassword
    )
  }

  static async listMedia(): Promise<MediaListResponse> {
    return this.request<MediaListResponse>('/media/list')
  }

  static async uploadMedia(
    file: File,
    customName: string | undefined,
    confirmationPassword: string
  ): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)
    if (customName) {
      formData.append('custom_name', customName)
    }

    return this.request(
      '/media/upload',
      {
        method: 'POST',
        body: formData,
      },
      confirmationPassword
    )
  }

  static async deleteMedia(filename: string, confirmationPassword: string): Promise<any> {
    return this.request(
      `/media/${filename}`,
      {
        method: 'DELETE',
      },
      confirmationPassword
    )
  }
}
