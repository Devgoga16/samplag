// Datos de contacto y marca de Samplag S.A.C.
// Todo lo marcado como `null` está pendiente de confirmar con el cliente y se muestra como placeholder.
export const site = {
  name: 'Samplag S.A.C.',
  legalName: 'Saneamiento Ambiental y Control de Plagas S.A.C.',
  slogan: 'Saneamiento con respaldo MINSA',
  url: 'https://samplag.com.pe',
  whatsapp: '51994694597',
  whatsappLabel: '994 694 597',
  phone: '+51986069074',
  phoneLabel: '986 069 074',
  email: 'ventas@samplag.com.pe',
  facebook: 'https://www.facebook.com/SamplagSACpe/',
  authorization: 'R.A. N° 2764-2021-DSAIA/DIRIS-LC',
  authorizationBy: 'DIRIS Lima Centro',
  authorizationYear: 2021,
  address: null as string | null,
  schedule: null as string | null,
  ruc: '20535825913' as string | null,
  /** Tienda en línea (uTracker). En false se ocultan el menú, el carrito, la sección y la página /tienda */
  storeEnabled: false,
};

/**
 * Medición para Google Ads y Google Analytics 4.
 * Mientras un valor sea `null` no se carga nada de Google; basta pegar los códigos y volver a desplegar.
 * - ga4: ID de la propiedad de Analytics (G-XXXXXXXXXX)
 * - ads: ID de la cuenta de Google Ads (AW-XXXXXXXXX)
 * - conversions: etiqueta de cada conversión creada en Google Ads (AW-XXXXXXXXX/AbCdEfGhIj)
 */
export const tracking = {
  ga4: null as string | null,
  ads: null as string | null,
  conversions: {
    whatsapp: null as string | null,
    call: null as string | null,
    form: null as string | null,
    email: null as string | null,
  },
};

export const waLink = (text?: string) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
