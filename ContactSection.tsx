import { useMemo, useState } from 'react';
import { Check, Copy, MapPin, MessageCircle, Mail, Clock } from 'lucide-react';
import { CartItem } from '../types/store';
import {
  buildWhatsAppUrl,
  formatPricePEN,
  STORE_CONFIG,
} from '../data/storeConfig';

interface ContactSectionProps {
  cartItems: CartItem[];
  cartTotal: number;
}

export function ContactSection({ cartItems, cartTotal }: ContactSectionProps) {
  const [visitorName, setVisitorName] = useState('');
  const [city, setCity] = useState<'Ilo' | 'Arequipa'>('Ilo');
  const [customNote, setCustomNote] = useState('');
  const [includeCart, setIncludeCart] = useState(true);
  const [copied, setCopied] = useState(false);

  const composedMessage = useMemo(() => {
    const lines: string[] = [
      `Hola, vengo de ${STORE_CONFIG.brandName}.`,
      visitorName.trim() ? `Mi nombre es ${visitorName.trim()} (${city}).` : `Escribo desde ${city}.`,
    ];

    if (includeCart && cartItems.length > 0) {
      lines.push('');
      lines.push('Prendas seleccionadas en mi carrito (demo):');
      cartItems.forEach(({ product, quantity }) => {
        lines.push(
          `- ${quantity}x ${product.name} (${product.condition}, Talla ${product.size}) — ${formatPricePEN(product.price * quantity)}`
        );
      });
      lines.push(`Total referencial: ${formatPricePEN(cartTotal)}`);
    }

    if (customNote.trim()) {
      lines.push('');
      lines.push(`Consulta: ${customNote.trim()}`);
    } else if (cartItems.length === 0 || !includeCart) {
      lines.push('Quisiera recibir información sobre las prendas disponibles y coordinación de entrega.');
    }

    return lines.join('\n');
  }, [visitorName, city, customNote, includeCart, cartItems, cartTotal]);

  const whatsappUrl = useMemo(() => buildWhatsAppUrl(composedMessage), [composedMessage]);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(composedMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="contacto" className="scroll-mt-16 bg-white py-20 text-[#0B0B0D] md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: Contact Information */}
          <div className="lg:col-span-5">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              Atención directa
            </p>
            <h2 className="font-display mt-2 text-4xl tracking-wider text-[#0B0B0D] sm:text-5xl">
              Contacto
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600">
              Comunícate directamente para consultar sobre prendas, tallas,
              precios, pedidos o coordinar entregas en Ilo y Arequipa.
            </p>

            <dl className="mt-8 divide-y divide-zinc-200 border-t border-b border-zinc-200">
              <div className="flex items-start gap-3.5 py-4">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0B0B0D]" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0B0B0D]">
                    Cobertura
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-600">
                    {STORE_CONFIG.contactPlaceholders.deliveryZones}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3.5 py-4">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0B0B0D]" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0B0B0D]">
                    WhatsApp
                  </dt>
                  <dd className="mt-1 flex flex-wrap items-center gap-3 text-sm text-zinc-600">
                    <a
                      href={STORE_CONFIG.whatsappDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[#0B0B0D] underline underline-offset-4 transition-colors hover:text-zinc-600"
                    >
                      {STORE_CONFIG.contactPlaceholders.whatsappLabel}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3.5 py-4">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#0B0B0D]" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0B0B0D]">
                    Correo electrónico
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-600">
                    <a
                      href={`mailto:${STORE_CONFIG.contactEmail}?subject=${encodeURIComponent('Consulta - The Present Shine')}`}
                      className="font-medium break-all text-[#0B0B0D] underline underline-offset-4 transition-colors hover:text-zinc-600"
                    >
                      {STORE_CONFIG.contactEmail}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3.5 py-4">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#0B0B0D]" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0B0B0D]">
                    Horario de atención
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-600">
                    {STORE_CONFIG.contactPlaceholders.scheduleLabel}
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={STORE_CONFIG.whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap bg-[#0B0B0D] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B0B0D]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>WhatsApp directo</span>
              </a>

              <a
                href={`mailto:${STORE_CONFIG.contactEmail}?subject=${encodeURIComponent('Consulta sobre prendas - The Present Shine')}`}
                className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap border border-[#0B0B0D] bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#0B0B0D] transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B0B0D]"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>Escribir por correo</span>
              </a>
            </div>
          </div>

          {/* Right: Interactive WhatsApp Message Composer */}
          <div className="border border-zinc-200 bg-zinc-50 p-6 sm:p-8 lg:col-span-7">
            <h3 className="font-display text-3xl tracking-wide text-[#0B0B0D]">
              Consulta por WhatsApp
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600">
              Prepara tu mensaje de consulta antes de abrir WhatsApp. Si tienes
              prendas en el carrito, puedes adjuntarlas automáticamente.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#0B0B0D]"
                >
                  Tu nombre (opcional)
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="Ej. Camila"
                  className="mt-1.5 w-full border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-[#0B0B0D] placeholder:text-zinc-400 focus:border-[#0B0B0D] focus:outline-none"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#0B0B0D]">
                  Ciudad
                </span>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {(['Ilo', 'Arequipa'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setCity(option)}
                      className={`min-h-[42px] cursor-pointer border text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                        city === option
                          ? 'border-[#0B0B0D] bg-[#0B0B0D] text-white'
                          : 'border-zinc-300 bg-white text-zinc-700 hover:border-[#0B0B0D]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="contact-note"
                className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#0B0B0D]"
              >
                Mensaje o consulta (opcional)
              </label>
              <textarea
                id="contact-note"
                rows={2}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Ej. Quisiera consultar medidas de la casaca o coordinar entrega..."
                className="mt-1.5 w-full resize-none border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-[#0B0B0D] placeholder:text-zinc-400 focus:border-[#0B0B0D] focus:outline-none"
              />
            </div>

            {cartItems.length > 0 && (
              <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-xs font-medium text-[#0B0B0D]">
                <input
                  type="checkbox"
                  checked={includeCart}
                  onChange={(e) => setIncludeCart(e.target.checked)}
                  className="h-4 w-4 accent-[#0B0B0D]"
                />
                <span>
                  Incluir mi selección actual del carrito ({cartItems.length}{' '}
                  {cartItems.length === 1 ? 'prenda distinta' : 'prendas distintas'} ·{' '}
                  {formatPricePEN(cartTotal)})
                </span>
              </label>
            )}

            {/* Message Preview */}
            <div className="mt-5 border border-zinc-200 bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Vista previa del mensaje
              </p>
              <pre className="mt-2 whitespace-pre-wrap font-sans text-xs leading-relaxed text-zinc-700">
                {composedMessage}
              </pre>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap bg-[#0B0B0D] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B0B0D]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>Enviar por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 whitespace-nowrap border border-zinc-300 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#0B0B0D] transition-colors hover:border-[#0B0B0D]"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden="true" />
                    <span>Mensaje copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    <span>Copiar mensaje</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
