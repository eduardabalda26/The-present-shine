import { useEffect, useMemo, useRef, useState, FormEvent } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageCircle,
  X,
} from 'lucide-react';
import {
  CartItem,
  CheckoutCustomerData,
  PaymentMethod,
} from '../types/store';
import {
  buildWhatsAppUrl,
  buildWhatsAppWebUrl,
  formatPricePEN,
  STORE_CONFIG,
} from '../data/storeConfig';
import { ProductImage } from './ProductImage';
import { PlinLogo, YapeLogo } from './PaymentLogos';

interface CheckoutModalProps {
  isOpen: boolean;
  items: CartItem[];
  total: number;
  onClose: () => void;
  onBackToCart: () => void;
  onOrderConfirmed: () => void;
}

type CheckoutStep = 'form' | 'simulation' | 'confirmation';

interface ConfirmedOrderSnapshot {
  orderNumber: string;
  createdAt: string;
  customer: CheckoutCustomerData;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  total: number;
}

const PAYMENT_OPTIONS: Array<{
  id: PaymentMethod;
  label: string;
  description: string;
  simulationNote: string;
  Logo: typeof YapeLogo;
}> = [
  {
    id: 'Yape',
    label: 'Yape',
    description: 'Pago móvil directo (simulación)',
    simulationNote:
      'Realiza el abono simulado vía Yape al número 974 494 548. En esta vista de demostración confirmamos tu pedido sin efectuar cobros automáticos ni solicitar claves.',
    Logo: YapeLogo,
  },
  {
    id: 'Plin',
    label: 'Plin',
    description: 'Pago interbancario directo (simulación)',
    simulationNote:
      'Realiza el abono simulado vía Plin al número 974 494 548. En esta vista de demostración confirmamos tu pedido sin efectuar cobros automáticos ni solicitar datos sensibles.',
    Logo: PlinLogo,
  },
];

function generateDemoOrderNumber(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `TPS-DEMO-${randomDigits}`;
}

export function CheckoutModal({
  isOpen,
  items,
  total,
  onClose,
  onBackToCart,
  onOrderConfirmed,
}: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>('form');
  const [customer, setCustomer] = useState<CheckoutCustomerData>({
    firstName: '',
    lastName: '',
    email: '',
    city: 'Ilo',
    deliveryAddress: '',
    deliveryReference: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Yape');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [confirmedOrder, setConfirmedOrder] =
    useState<ConfirmedOrderSnapshot | null>(null);
  const simulationTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (simulationTimerRef.current !== null) {
        window.clearTimeout(simulationTimerRef.current);
      }
    };
  }, []);

  const totalUnits = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const selectedPaymentMeta = useMemo(
    () =>
      PAYMENT_OPTIONS.find((option) => option.id === paymentMethod) ??
      PAYMENT_OPTIONS[0],
    [paymentMethod]
  );

  const confirmedOrderMessage = useMemo(() => {
    if (!confirmedOrder) return '';
    return [
      `Hola ${STORE_CONFIG.brandName}, acabo de registrar un pedido:`,
      '',
      `N.º de pedido: ${confirmedOrder.orderNumber}`,
      `Cliente: ${confirmedOrder.customer.firstName} ${confirmedOrder.customer.lastName}`,
      `Correo: ${confirmedOrder.customer.email}`,
      `Ciudad: ${confirmedOrder.customer.city}`,
      `Entrega: ${confirmedOrder.customer.deliveryAddress}`,
      confirmedOrder.customer.deliveryReference
        ? `Referencia: ${confirmedOrder.customer.deliveryReference}`
        : null,
      `Método de pago (simulado): ${confirmedOrder.paymentMethod}`,
      '',
      'Resumen del pedido:',
      ...confirmedOrder.items.map(
        ({ product, quantity }) =>
          `- ${quantity}x ${product.name} (${product.condition}, Talla ${product.size}) — ${formatPricePEN(product.price * quantity)}`
      ),
      '',
      `Total: ${formatPricePEN(confirmedOrder.total)}`,
    ]
      .filter((line): line is string => line !== null)
      .join('\n');
  }, [confirmedOrder]);

  const whatsappConfirmedUrl = useMemo(
    () => (confirmedOrderMessage ? buildWhatsAppUrl(confirmedOrderMessage) : '#'),
    [confirmedOrderMessage]
  );

  const whatsappWebConfirmedUrl = useMemo(
    () =>
      confirmedOrderMessage ? buildWhatsAppWebUrl(confirmedOrderMessage) : '#',
    [confirmedOrderMessage]
  );

  const handleCopyConfirmedOrder = async () => {
    if (!confirmedOrderMessage) return;
    try {
      await navigator.clipboard.writeText(confirmedOrderMessage);
      setCopiedOrder(true);
      window.setTimeout(() => setCopiedOrder(false), 1800);
    } catch {
      setCopiedOrder(false);
    }
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText('974494548');
      setCopiedPhone(true);
      window.setTimeout(() => setCopiedPhone(false), 1800);
    } catch {
      setCopiedPhone(false);
    }
  };

  if (!isOpen) return null;

  const handleContinueToSimulation = (event: FormEvent) => {
    event.preventDefault();
    const firstName = customer.firstName.trim();
    const lastName = customer.lastName.trim();
    const email = customer.email.trim();
    const deliveryAddress = customer.deliveryAddress.trim();

    if (!firstName || !lastName || !email || !deliveryAddress) {
      setFormError(
        'Completa tus nombres, apellidos, correo electrónico y punto o dirección de entrega.'
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Ingresa un correo electrónico válido.');
      return;
    }

    setFormError(null);
    setStep('simulation');
  };

  const handleConfirmSimulatedPayment = () => {
    setIsSimulating(true);
    simulationTimerRef.current = window.setTimeout(() => {
      const snapshot: ConfirmedOrderSnapshot = {
        orderNumber: generateDemoOrderNumber(),
        createdAt: new Date().toLocaleString('es-PE', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
        customer: {
          ...customer,
          firstName: customer.firstName.trim(),
          lastName: customer.lastName.trim(),
          email: customer.email.trim(),
          deliveryAddress: customer.deliveryAddress.trim(),
          deliveryReference: customer.deliveryReference.trim(),
        },
        paymentMethod,
        items: items.map((entry) => ({ ...entry })),
        total,
      };
      setConfirmedOrder(snapshot);
      setIsSimulating(false);
      setStep('confirmation');
      onOrderConfirmed();
    }, 550);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B0B0D]/80 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden border border-[#C0C0C0]/30 bg-white text-[#0B0B0D] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-[#0B0B0D] px-5 py-4 text-white sm:px-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#C0C0C0]">
              {STORE_CONFIG.brandName} · Demostración de compra
            </p>
            <h2
              id="checkout-modal-title"
              className="font-display text-2xl tracking-wider text-white sm:text-3xl"
            >
              {step === 'form' && 'Finalizar Compra'}
              {step === 'simulation' && 'Simulación de Pago'}
              {step === 'confirmation' && 'Pedido Confirmado (Demo)'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar proceso de compra"
            className="inline-flex min-h-[40px] min-w-[40px] cursor-pointer items-center justify-center border border-[#C0C0C0]/30 text-white transition-colors hover:border-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Clean Unboxed Step Indicator */}
        <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium uppercase tracking-[0.12em]">
            <span
              className={
                step === 'form'
                  ? 'font-semibold text-[#0B0B0D]'
                  : 'text-zinc-400'
              }
            >
              01. Datos y pago
            </span>
            <span className="text-zinc-300" aria-hidden="true">
              /
            </span>
            <span
              className={
                step === 'simulation'
                  ? 'font-semibold text-[#0B0B0D]'
                  : 'text-zinc-400'
              }
            >
              02. Simulación
            </span>
            <span className="text-zinc-300" aria-hidden="true">
              /
            </span>
            <span
              className={
                step === 'confirmation'
                  ? 'font-semibold text-[#0B0B0D]'
                  : 'text-zinc-400'
              }
            >
              03. Confirmación
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
          {/* STEP 1: CUSTOMER FORM & PAYMENT METHOD */}
          {step === 'form' && (
            <form
              onSubmit={handleContinueToSimulation}
              className="grid gap-8 lg:grid-cols-12"
              noValidate
            >
              {/* Left Form Fields */}
              <div className="space-y-6 lg:col-span-7">
                <div>
                  <h3 className="font-display text-2xl tracking-wide text-[#0B0B0D]">
                    1. Datos del cliente
                  </h3>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="checkout-firstname"
                        className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#0B0B0D]"
                      >
                        Nombres *
                      </label>
                      <input
                        id="checkout-firstname"
                        type="text"
                        required
                        value={customer.firstName}
                        onChange={(e) =>
                          setCustomer((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        placeholder="Ej. Ana Belén"
                        className="mt-1.5 w-full border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-[#0B0B0D] placeholder:text-zinc-400 focus:border-[#0B0B0D] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="checkout-lastname"
                        className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#0B0B0D]"
                      >
                        Apellidos *
                      </label>
                      <input
                        id="checkout-lastname"
                        type="text"
                        required
                        value={customer.lastName}
                        onChange={(e) =>
                          setCustomer((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        placeholder="Ej. Torres Paredes"
                        className="mt-1.5 w-full border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-[#0B0B0D] placeholder:text-zinc-400 focus:border-[#0B0B0D] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="checkout-email"
                      className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#0B0B0D]"
                    >
                      Correo electrónico *
                    </label>
                    <input
                      id="checkout-email"
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) =>
                        setCustomer((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Ej. cliente@correo.com"
                      className="mt-1.5 w-full border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-[#0B0B0D] placeholder:text-zinc-400 focus:border-[#0B0B0D] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="border-t border-zinc-200 pt-6">
                  <h3 className="font-display text-2xl tracking-wide text-[#0B0B0D]">
                    2. Datos de entrega
                  </h3>

                  <div className="mt-3">
                    <span className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#0B0B0D]">
                      Ciudad *
                    </span>
                    <div className="mt-1.5 grid grid-cols-2 gap-2.5">
                      {(['Ilo', 'Arequipa'] as const).map((cityOption) => (
                        <button
                          key={cityOption}
                          type="button"
                          onClick={() =>
                            setCustomer((prev) => ({
                              ...prev,
                              city: cityOption,
                            }))
                          }
                          className={`min-h-[42px] cursor-pointer border text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                            customer.city === cityOption
                              ? 'border-[#0B0B0D] bg-[#0B0B0D] text-white'
                              : 'border-zinc-300 bg-white text-zinc-700 hover:border-[#0B0B0D]'
                          }`}
                        >
                          {cityOption}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="checkout-address"
                      className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#0B0B0D]"
                    >
                      Dirección o punto de entrega *
                    </label>
                    <input
                      id="checkout-address"
                      type="text"
                      required
                      value={customer.deliveryAddress}
                      onChange={(e) =>
                        setCustomer((prev) => ({
                          ...prev,
                          deliveryAddress: e.target.value,
                        }))
                      }
                      placeholder="Ej. Centro de Ilo / Yanahuara (Arequipa)"
                      className="mt-1.5 w-full border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-[#0B0B0D] placeholder:text-zinc-400 focus:border-[#0B0B0D] focus:outline-none"
                    />
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="checkout-reference"
                      className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#0B0B0D]"
                    >
                      Referencia o horario preferido (opcional)
                    </label>
                    <input
                      id="checkout-reference"
                      type="text"
                      value={customer.deliveryReference}
                      onChange={(e) =>
                        setCustomer((prev) => ({
                          ...prev,
                          deliveryReference: e.target.value,
                        }))
                      }
                      placeholder="Ej. Frente al parque / Tarde de 4:00 p. m."
                      className="mt-1.5 w-full border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-[#0B0B0D] placeholder:text-zinc-400 focus:border-[#0B0B0D] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Payment Method Selection (Yape & Plin only) */}
                <div className="border-t border-zinc-200 pt-6">
                  <h3 className="font-display text-2xl tracking-wide text-[#0B0B0D]">
                    3. Método de pago
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                    Elige Yape o Plin para visualizar el número de pago y
                    simular la confirmación de tu pedido.
                  </p>

                  <div
                    className="mt-3 grid gap-3 sm:grid-cols-2"
                    role="radiogroup"
                    aria-label="Métodos de pago disponibles"
                  >
                    {PAYMENT_OPTIONS.map((option) => {
                      const Logo = option.Logo;
                      const selected = paymentMethod === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setPaymentMethod(option.id)}
                          className={`flex w-full cursor-pointer items-center gap-3.5 border p-3.5 text-left transition-colors ${
                            selected
                              ? 'border-[#0B0B0D] bg-[#0B0B0D] text-white'
                              : 'border-zinc-300 bg-white text-[#0B0B0D] hover:border-[#0B0B0D]'
                          }`}
                        >
                          <Logo className="h-9 w-16 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em]">
                              {option.label}
                            </p>
                            <p
                              className={`mt-0.5 text-[11px] leading-snug ${
                                selected ? 'text-zinc-300' : 'text-zinc-500'
                              }`}
                            >
                              {option.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Payment Number Box */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border border-zinc-300 bg-zinc-50 p-4">
                    <div className="flex items-center gap-3">
                      <selectedPaymentMeta.Logo className="h-9 w-14 shrink-0" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                          Número para pago vía {selectedPaymentMeta.label}
                        </p>
                        <p className="mt-0.5 font-mono text-base font-bold tracking-wider text-[#0B0B0D]">
                          {STORE_CONFIG.whatsappDisplay}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 border border-zinc-300 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0B0B0D] transition-colors hover:border-[#0B0B0D]"
                    >
                      {copiedPhone ? (
                        <>
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Número copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Copiar 974494548</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {formError && (
                  <p
                    role="alert"
                    className="border border-[#0B0B0D] bg-zinc-100 px-4 py-3 text-xs font-medium text-[#0B0B0D]"
                  >
                    {formError}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="inline-flex min-h-[44px] flex-1 cursor-pointer items-center justify-center whitespace-nowrap bg-[#0B0B0D] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-zinc-800 sm:flex-none"
                  >
                    Continuar a simulación de pago
                  </button>

                  <button
                    type="button"
                    onClick={onBackToCart}
                    className="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 whitespace-nowrap border border-zinc-300 bg-white px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] text-zinc-700 transition-colors hover:border-[#0B0B0D] hover:text-[#0B0B0D]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Volver al carrito</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <aside className="lg:col-span-5">
                <div className="border border-zinc-200 bg-zinc-50 p-5">
                  <h3 className="font-display text-2xl tracking-wide text-[#0B0B0D]">
                    Resumen del pedido
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {totalUnits} {totalUnits === 1 ? 'prenda' : 'prendas'} seleccionadas
                  </p>

                  <ul className="mt-4 divide-y divide-zinc-200 border-t border-b border-zinc-200">
                    {items.map(({ product, quantity }) => (
                      <li key={product.id} className="flex items-center gap-3 py-3">
                        <div className="h-14 w-16 shrink-0 overflow-hidden bg-zinc-100">
                          <ProductImage
                            src={product.image}
                            alt={product.name}
                            title={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-[#0B0B0D]">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-zinc-500">
                            {quantity} x {formatPricePEN(product.price)} · Talla{' '}
                            {product.size}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs font-semibold tabular-nums text-[#0B0B0D]">
                          {formatPricePEN(product.price * quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-zinc-600">
                      <span>Subtotal</span>
                      <span className="font-semibold tabular-nums text-[#0B0B0D]">
                        {formatPricePEN(total)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-500">
                      <span>Entrega ({customer.city})</span>
                      <span>Por coordinar</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-3">
                    <span className="text-sm font-semibold text-[#0B0B0D]">
                      Total estimado
                    </span>
                    <span className="text-xl font-bold tabular-nums text-[#0B0B0D]">
                      {formatPricePEN(total)}
                    </span>
                  </div>
                </div>
              </aside>
            </form>
          )}

          {/* STEP 2: PAYMENT SIMULATION SCREEN */}
          {step === 'simulation' && (
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="border border-[#0B0B0D] bg-[#0B0B0D] p-6 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#C0C0C0]">
                      Pantalla de simulación · Sin cobro real
                    </p>
                    <h3 className="font-display mt-1 text-3xl tracking-wider text-white">
                      Pago con {selectedPaymentMeta.label}
                    </h3>
                  </div>
                  <selectedPaymentMeta.Logo className="h-11 w-20 shrink-0" />
                </div>

                <div className="mt-5 grid gap-4 border-t border-[#C0C0C0]/20 pt-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-[#C0C0C0]">
                      Monto referencial a simular
                    </p>
                    <p className="mt-1 text-3xl font-bold tabular-nums text-white">
                      {formatPricePEN(total)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-[#C0C0C0]">
                      Número {selectedPaymentMeta.label} de la tienda
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xl font-bold tracking-wider text-white">
                        {STORE_CONFIG.whatsappDisplay}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyPhone}
                        className="inline-flex min-h-[32px] cursor-pointer items-center gap-1.5 border border-[#C0C0C0]/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C0C0C0] transition-colors hover:border-white hover:text-white"
                      >
                        {copiedPhone ? (
                          <>
                            <Check className="h-3 w-3" aria-hidden="true" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" aria-hidden="true" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-zinc-300">
                  {selectedPaymentMeta.simulationNote}
                </p>
              </div>

              {/* Order & Customer Review */}
              <div className="border border-zinc-200 bg-zinc-50 p-5">
                <h4 className="font-display text-2xl tracking-wide text-[#0B0B0D]">
                  Verificación de datos y pedido
                </h4>

                <dl className="mt-3 grid gap-3 border-b border-zinc-200 pb-4 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold uppercase tracking-[0.1em] text-zinc-500">
                      Cliente
                    </dt>
                    <dd className="mt-0.5 font-medium text-[#0B0B0D]">
                      {customer.firstName} {customer.lastName}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold uppercase tracking-[0.1em] text-zinc-500">
                      Correo electrónico
                    </dt>
                    <dd className="mt-0.5 font-medium text-[#0B0B0D]">
                      {customer.email}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-semibold uppercase tracking-[0.1em] text-zinc-500">
                      Entrega en {customer.city}
                    </dt>
                    <dd className="mt-0.5 font-medium text-[#0B0B0D]">
                      {customer.deliveryAddress}
                      {customer.deliveryReference
                        ? ` (${customer.deliveryReference})`
                        : ''}
                    </dd>
                  </div>
                </dl>

                <ul className="mt-3 divide-y divide-zinc-200 text-xs">
                  {items.map(({ product, quantity }) => (
                    <li
                      key={product.id}
                      className="flex items-center justify-between gap-4 py-2.5"
                    >
                      <span className="text-zinc-700">
                        <strong className="font-semibold text-[#0B0B0D]">
                          {quantity}x
                        </strong>{' '}
                        {product.name} ({product.condition}, Talla {product.size})
                      </span>
                      <span className="shrink-0 font-semibold tabular-nums text-[#0B0B0D]">
                        {formatPricePEN(product.price * quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex items-center justify-between border-t border-zinc-300 pt-3">
                  <span className="text-sm font-semibold text-[#0B0B0D]">
                    Total del pedido
                  </span>
                  <span className="text-lg font-bold tabular-nums text-[#0B0B0D]">
                    {formatPricePEN(total)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={handleConfirmSimulatedPayment}
                  className="inline-flex min-h-[44px] flex-1 cursor-pointer items-center justify-center whitespace-nowrap bg-[#0B0B0D] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-70 sm:flex-none"
                >
                  {isSimulating
                    ? 'Simulando confirmación...'
                    : 'Confirmar simulación de pago'}
                </button>

                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={() => setStep('form')}
                  className="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 whitespace-nowrap border border-zinc-300 bg-white px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-zinc-700 transition-colors hover:border-[#0B0B0D] hover:text-[#0B0B0D]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Modificar datos</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ORDER CONFIRMATION SCREEN */}
          {step === 'confirmation' && confirmedOrder && (
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="border border-[#0B0B0D] bg-zinc-50 p-6">
                <div className="flex items-start gap-3.5">
                  <CheckCircle2
                    className="mt-0.5 h-7 w-7 shrink-0 text-[#0B0B0D]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Confirmación de demostración · Sin cobro real
                    </p>
                    <h3 className="font-display mt-1 text-3xl tracking-wide text-[#0B0B0D]">
                      ¡Pedido registrado correctamente!
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                      Este comprobante es una simulación académica para{' '}
                      {STORE_CONFIG.brandName}. Puedes enviar el resumen por
                      WhatsApp para coordinar tu consulta o entrega.
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-4">
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                      Número de pedido (Demo)
                    </span>
                    <span className="font-mono text-lg font-bold tracking-wider text-[#0B0B0D]">
                      {confirmedOrder.orderNumber}
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                      Método simulado
                    </span>
                    <span className="text-sm font-semibold text-[#0B0B0D]">
                      {confirmedOrder.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirmed Order Summary */}
              <div className="border border-zinc-200 bg-white p-5">
                <h4 className="font-display text-2xl tracking-wide text-[#0B0B0D]">
                  Resumen del pedido
                </h4>

                <dl className="mt-3 grid gap-3 border-b border-zinc-200 pb-4 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold uppercase tracking-[0.1em] text-zinc-500">
                      Cliente
                    </dt>
                    <dd className="mt-0.5 font-medium text-[#0B0B0D]">
                      {confirmedOrder.customer.firstName}{' '}
                      {confirmedOrder.customer.lastName}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold uppercase tracking-[0.1em] text-zinc-500">
                      Correo
                    </dt>
                    <dd className="mt-0.5 font-medium break-all text-[#0B0B0D]">
                      {confirmedOrder.customer.email}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-semibold uppercase tracking-[0.1em] text-zinc-500">
                      Entrega ({confirmedOrder.customer.city})
                    </dt>
                    <dd className="mt-0.5 font-medium text-[#0B0B0D]">
                      {confirmedOrder.customer.deliveryAddress}
                      {confirmedOrder.customer.deliveryReference
                        ? ` — ${confirmedOrder.customer.deliveryReference}`
                        : ''}
                    </dd>
                  </div>
                </dl>

                <ul className="mt-3 divide-y divide-zinc-200 text-xs">
                  {confirmedOrder.items.map(({ product, quantity }) => (
                    <li
                      key={product.id}
                      className="flex items-center justify-between gap-4 py-2.5"
                    >
                      <span className="text-zinc-700">
                        <strong className="font-semibold text-[#0B0B0D]">
                          {quantity}x
                        </strong>{' '}
                        {product.name} ({product.condition}, Talla {product.size})
                        — {formatPricePEN(product.price)} c/u
                      </span>
                      <span className="shrink-0 font-semibold tabular-nums text-[#0B0B0D]">
                        {formatPricePEN(product.price * quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-3">
                  <span className="text-sm font-semibold text-[#0B0B0D]">
                    Total referencial
                  </span>
                  <span className="text-xl font-bold tabular-nums text-[#0B0B0D]">
                    {formatPricePEN(confirmedOrder.total)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={whatsappConfirmedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 whitespace-nowrap bg-[#0B0B0D] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-zinc-800 sm:flex-none"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    <span>Enviar pedido por WhatsApp</span>
                  </a>

                  <a
                    href={whatsappWebConfirmedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 whitespace-nowrap border border-[#0B0B0D] bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#0B0B0D] transition-colors hover:bg-zinc-100 sm:flex-none"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    <span>Abrir en WhatsApp Web</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyConfirmedOrder}
                    className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 whitespace-nowrap border border-zinc-300 bg-white px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] text-zinc-700 transition-colors hover:border-[#0B0B0D] hover:text-[#0B0B0D]"
                  >
                    {copiedOrder ? (
                      <>
                        <Check className="h-4 w-4" aria-hidden="true" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" aria-hidden="true" />
                        <span>Copiar resumen</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center whitespace-nowrap border border-zinc-300 bg-zinc-50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#0B0B0D] transition-colors hover:border-[#0B0B0D] hover:bg-zinc-100 sm:w-auto"
                  >
                    Continuar comprando
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
