/**
 * Clases de la tarjeta de contenido.
 *
 * Vive aquí y no repetida en cada componente porque la usan dos sitios que
 * tienen que ir a la vez: `TimelineEntry`, que monta casi todas las entradas
 * del sitio, y el `CertCard` de `Languages`, que no puede montarse sobre
 * `TimelineEntry` por su estructura de barras.
 *
 * La tarjeta no tiene estado de hover: es un contenedor de lectura, no un
 * elemento accionable, y señalarlo al pasar por encima prometía una
 * interacción que no existe. Lo accionable de una tarjeta son sus chips de
 * enlace, y son ellos los que responden.
 */
export const cardSurface = 'rounded-xl border border-border bg-surface p-5'
