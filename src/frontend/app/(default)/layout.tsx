import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionaries'
import SiteShell from '@/components/SiteShell'

const description =
  'Software Engineer with a dual foundation in Computer Engineering and Mathematics.'

export const metadata: Metadata = {
  metadataBase: new URL('https://ignaciogarbayo.com'),
  title: 'Ignacio Garbayo Fernández',
  description,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  twitter: {
    card: 'summary',
    title: 'Ignacio Garbayo Fernández',
    description,
    images: ['/me-movil-compressed.png'],
  },
}

// Detección de idioma, con la misma semántica que el antiguo `detectLang()` de
// `app/page.tsx`: gana el primer idioma de `navigator.languages` que matchee
// gl/es/en, y el inglés se queda donde está.
//
// Dos diferencias con aquel, y las dos son el motivo de este cambio:
//   1. Es **síncrono y bloqueante en el <head>**, así que corre antes del primer
//      paint: cero parpadeo de inglés para usuarios es/gl. El `useEffect` de
//      antes corría después de pintar, y por eso la página tenía que ir vacía.
//   2. **Preserva el pathname**, así que `/experience/` lleva a
//      `/es/experience/` y no a `/es/`.
//
// El crawler no ejecuta JS y se queda con el HTML inglés completo, que es justo
// lo que buscamos. `location.replace` no ensucia el historial. No hay riesgo de
// bucle: este script solo existe en el grupo (default), nunca en (i18n).
// La guarda del primer `if` es imprescindible: `404.html` también se sirve para
// rutas que YA llevan prefijo (`/es/loquesea`), y sin ella el script volvería a
// prefijar en bucle infinito (`/es/es/loquesea`, `/es/es/es/…`).
const LANG_REDIRECT = `(function(){try{
if(/^\\/(en|es|gl)(\\/|$)/.test(location.pathname))return;
var L=(navigator.languages&&navigator.languages.length)?navigator.languages:[navigator.language];
for(var i=0;i<L.length;i++){
var c=String(L[i]||'').toLowerCase().split('-')[0];
if(c==='es'||c==='gl'){location.replace('/'+c+location.pathname);return}
if(c==='en'){return}
}
}catch(e){}})();`

export default async function DefaultLayout({ children }: { children: ReactNode }) {
  const dict = await getDictionary('en')

  return (
    <SiteShell
      lang="en"
      dict={dict}
      headExtra={<script dangerouslySetInnerHTML={{ __html: LANG_REDIRECT }} />}
    >
      {children}
    </SiteShell>
  )
}
