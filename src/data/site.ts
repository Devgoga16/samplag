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
  authorization: 'R.A. N° 305-2020-DSAIA-DIRIS-LS',
  authorizationPdf: null as string | null,
  address: null as string | null,
  schedule: null as string | null,
  ruc: null as string | null,
};

export const waLink = (text?: string) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
