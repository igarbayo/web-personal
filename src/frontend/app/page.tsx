'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

function detectLang(): 'en' | 'es' | 'gl' {
  if (typeof navigator === 'undefined') return 'en'
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const l of langs) {
    const code = l.toLowerCase().split('-')[0]
    if (code === 'gl') return 'gl'
    if (code === 'es') return 'es'
    if (code === 'en') return 'en'
  }
  return 'en'
}

export default function RootPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace(`/${detectLang()}`)
  }, [router])
  return null
}
