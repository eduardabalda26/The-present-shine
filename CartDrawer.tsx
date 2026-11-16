import { useMemo } from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X, MessageCircle } from 'lucide-react';
import { CartItem } from '../types/store';
import {
  buildWhatsAppUrl,
  formatPricePEN,
  STORE_CONFIG,
} from '../data/storeConfig';
import { ProductImage } from './ProductImage';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  total: number;
  onClose: () => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  items,
  total,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}: CartDrawerProps) {
  const totalUnits = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const whatsappOrderUrl = useMemo(() => {
    if (items.length === 0) return buildWhatsAppUrl(`Hola, quiero consultar sobre ${STORE_CONFIG.brandName}.`);
    const summaryLines = [
      `Hola, vengo de ${STORE_CONFIG.brandName} y quiero consultar por estas prendas:`,
      '',
      ...items.map(
        ({ product, quantity }) =>
          `- ${quantity}x ${product.name} (${product.condition}, Talla ${product.size}) — ${formatPricePEN(product.price * quantity)}`
      ),
      '',
      `Total referencial: ${formatPricePEN(total)}`,
    ];
    return buildWhatsAppUrl(summaryLines.join('\n'));
  }, [items, total]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B0B0D]/70 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Panel */}
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-white text-[#0B0B0D] shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-[#0B0B0D] px-6 py-4 text-white">
          <div>
            <h2
              id="cart-drawer-title"
              className="font-display text-2xl tracking-wider text-white"
            >
              Tu Carrito ({totalUnits})
            </h2>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#C0C0C0]">
              {STORE_CONFIG.brandName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="inline-flex min-h-[40px] min-w-[40px] cursor-pointer items-center justify-center border border-[#C0C0C0]/30 text-white transition-colors hover:border-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag
                className="h-10 w-10 stroke-[1.25] text-zinc-400"
                aria-hidden="true"
              />
              <p className="font-display mt-4 text-2xl tracking-wide text-[#0B0B0D]">
                Tu carrito está vacío
              </p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-zinc-500">
                Explora nuestras 8 prendas urbanas y agrega tus favoritas para
                calcular el total referencial.
              </p>
              <a
                href="#tienda"
                onClick={onClose}
                className="mt-6 inline-flex min-h-[42px] items-center bg-[#0B0B0D] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-zinc-800"
              >
                Ir a la tienda
              </a>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-200">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4 py-5 first:pt-0">
                  <div className="h-20 w-24 shrink-0 overflow-hidden bg-zinc-100">
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      title={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                          {product.condition} · Talla {product.size}
                        </p>
                        <h3 className="font-display text-xl leading-tight tracking-wide text-[#0B0B0D]">
                          {product.name}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(product.id)}
                        aria-label={`Eliminar ${product.name} del carrito`}
                        className="inline-flex min-h-[36px] min-w-[36px] cursor-pointer items-center justify-center text-zinc-400 transition-colors hover:text-[#0B0B0D]"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center border border-zinc-300">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          aria-label={`Disminuir cantidad de ${product.name}`}
                          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center text-[#0B0B0D] transition-colors hover:bg-zinc-100"
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <span className="min-w-[2.25rem] text-center text-xs font-semibold tabular-nums text-[#0B0B0D]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, 1)}
                          aria-label={`Aumentar cantidad de ${product.name}`}
                          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center text-[#0B0B0D] transition-colors hover:bg-zinc-100"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold tabular-nums text-[#0B0B0D]">
                        {formatPricePEN(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="border-t border-zinc-200 bg-zinc-50 px-6 py-5">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-zinc-600">
                <span>Subtotal ({totalUnits} {totalUnits === 1 ? 'prenda' : 'prendas'})</span>
                <span className="font-semibold tabular-nums text-[#0B0B0D]">
                  {formatPricePEN(total)}
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-500">
                <span>Entrega (Ilo / Arequipa)</span>
                <span>Por coordinar</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-3 text-sm">
              <span className="font-semibold text-[#0B0B0D]">Total estimado</span>
              <span className="text-xl font-bold tabular-nums text-[#0B0B0D]">
                {formatPricePEN(total)}
              </span>
            </div>

            <p className="mt-2.5 border border-zinc-200 bg-white px-3 py-2 text-[11px] leading-relaxed text-zinc-600">
              Demostración funcional: este carrito calcula tu selección de forma
              ilustrativa. No realiza cobros reales ni procesa pagos.
            </p>

            <div className="mt-4 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={onCheckout}
                className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 bg-[#0B0B0D] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-zinc-800"
              >
                <span>Finalizar compra</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <a
                href={whatsappOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 border border-[#0B0B0D] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0B0B0D] transition-colors hover:bg-zinc-100"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>Consultar por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onClearCart}
                className="inline-flex min-h-[40px] w-full cursor-pointer items-center justify-center border border-zinc-300 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-zinc-600 transition-colors hover:border-[#0B0B0D] hover:text-[#0B0B0D]"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
