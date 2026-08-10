import type { ReactNode } from 'react'

/**
 * Layout raíz pasarela: no renderiza `<html>` ni `<body>`, de eso se encargan
 * `(default)/layout.tsx` y `(i18n)/[lang]/layout.tsx`, que necesitan un `lang`
 * distinto en el `<html>`.
 *
 * Existe solo para que `app/not-found.tsx` tenga un layout raíz por encima: sin
 * él, el build falla con «not-found.tsx doesn't have a root layout», y una
 * not-found metida dentro de un route group no alimenta el `out/404.html` del
 * export estático (Next emite ahí su 404 genérica).
 *
 * La metadata que vivía aquí se movió a los dos layouts de grupo.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
