/**
 * Configuración general de The Present Shine.
 * Edita estos valores antes de publicar o vincular canales reales de atención.
 */
export const STORE_CONFIG = {
  brandName: 'The Present Shine',
  slogan: 'Tu estilo, tu esencia.',
  locations: ['Ilo', 'Arequipa'],
  country: 'Perú',
  targetAudience: 'Jóvenes de 16 a 25 años',
  currencySymbol: 'S/',
  /**
   * Número de WhatsApp en formato internacional sin "+" ni espacios.
   */
  whatsappNumber: '51974494548',
  whatsappDisplay: '974 494 548',
  whatsappDirectUrl: 'https://api.whatsapp.com/send?phone=51974494548',
  contactEmail: 'anabelencamibalda@gmail.com',
  /**
   * Datos de contacto oficiales de la tienda.
   */
  contactPlaceholders: {
    whatsappLabel: '+51 974 494 548',
    emailLabel: 'anabelencamibalda@gmail.com',
    scheduleLabel: 'Lunes a sábado, de 9:00 a. m. a 7:00 p. m.',
    deliveryZones: 'Ilo y Arequipa, Perú (puntos de entrega por coordinar)',
  },
} as const;

export function buildWhatsAppUrl(message: string): string {
  const encodedText = encodeURIComponent(message);
  const cleanNumber = STORE_CONFIG.whatsappNumber.replace(/\D/g, '');
  if (cleanNumber) {
    return `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}

export function buildWhatsAppWebUrl(message: string): string {
  const encodedText = encodeURIComponent(message);
  const cleanNumber = STORE_CONFIG.whatsappNumber.replace(/\D/g, '');
  if (cleanNumber) {
    return `https://web.whatsapp.com/send?phone=${cleanNumber}&text=${encodedText}`;
  }
  return `https://web.whatsapp.com/send?text=${encodedText}`;
}

export function formatPricePEN(amount: number): string {
  return `${STORE_CONFIG.currencySymbol} ${amount.toFixed(2)}`;
}
