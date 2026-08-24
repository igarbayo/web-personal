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

const API_BASE =
  process.env.NEXT_PUBLIC_CMS_API_URL?.replace(/\/$/, '') || 'http://localhost:8000/api/v1'

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

  static async saveSection(
    section: string,
    dataEn: any,
    dataEs: any,
    dataGl: any,
    confirmationPassword: string,
    commitMessage?: string
  ): Promise<ApiResponse> {
    return this.request<ApiResponse>(
      `/content/section/${section}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          section,
          data_en: dataEn,
          data_es: dataEs,
          data_gl: dataGl,
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
