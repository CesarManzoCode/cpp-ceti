// =====================================================================
// Nombre visible del producto.
//
// Un solo lugar para el wording del cascarón. La plataforma dejó de ser
// de un solo lenguaje: el nombre no puede prometer C++ a alguien que
// viene a POO I. Cada curso pone su propio título dentro de su ruta.
//
// Nombre definitivo: Índice Cero. Los identificadores internos (paquete,
// base de datos, prefijo de cookie, slugs de curso) NO son marca visible
// y no se tocan.
// =====================================================================

/** Nombre canónico del producto — el que va en texto y metadata. */
export const PRODUCT_NAME = "Índice Cero";

/**
 * Representación visual compacta, para donde el contexto lo permita
 * (isotipo + wordmark, marcas pequeñas). El nombre textual/canónico
 * sigue siendo `PRODUCT_NAME`.
 */
export const PRODUCT_MARK = "índice[0]";

/** Descripción corta, sin comprometerse con un lenguaje. */
export const PRODUCT_TAGLINE =
  "Aprende a programar escribiendo código, no memorizando.";

/**
 * Aviso de independencia institucional.
 *
 * Va donde el producto se presenta (portada, acceso, rail, invitaciones).
 * La plataforma apoya a estudiantes del CETI y NO es un producto oficial
 * de la institución; decirlo a medias sería peor que no decirlo.
 */
export const UNOFFICIAL_NOTICE =
  "Plataforma no oficial de apoyo para estudiantes del CETI.";
