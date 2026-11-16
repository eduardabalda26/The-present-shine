import { useState } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { Product, ProductCategory, ProductCondition } from '../types/store';

interface CatalogEditorModalProps {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onSaveProducts: (updated: Product[]) => void;
  onResetDefaults: () => void;
}

const CATEGORIES: ProductCategory[] = ['Polos', 'Poleras', 'Casacas', 'Pantalones'];
const CONDITIONS: ProductCondition[] = ['Nueva', 'Segunda mano'];

export function CatalogEditorModal({
  isOpen,
  products,
  onClose,
  onSaveProducts,
  onResetDefaults,
}: CatalogEditorModalProps) {
  const [drafts, setDrafts] = useState<Product[]>(products);
  const [selectedId, setSelectedId] = useState<string>(products[0]?.id ?? '');

  if (!isOpen) return null;

  const activeProduct = drafts.find((p) => p.id === selectedId) ?? drafts[0];

  const updateField = <K extends keyof Product>(
    id: string,
    field: K,
    value: Product[K]
  ) => {
    setDrafts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = () => {
    onSaveProducts(drafts);
    onClose();
  };

  const handleReset = () => {
    onResetDefaults();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="catalog-editor-title"
    >
      <div
        className="fixed inset-0 bg-[#0B0B0D]/75 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden border border-zinc-300 bg-white text-[#0B0B0D] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-[#0B0B0D] px-6 py-4 text-white">
          <div>
            <h2
              id="catalog-editor-title"
              className="font-display text-2xl tracking-wider text-white"
            >
              Editor de Catálogo (Demo)
            </h2>
            <p className="text-[11px] text-[#C0C0C0]">
              Personaliza los 8 productos de demostración en tiempo real para tu presentación.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar editor"
            className="inline-flex min-h-[40px] min-w-[40px] cursor-pointer items-center justify-center border border-[#C0C0C0]/30 text-white hover:border-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="grid flex-1 overflow-y-auto md:grid-cols-12">
          {/* Product Selector List */}
          <div className="border-b border-zinc-200 bg-zinc-50 p-4 md:col-span-4 md:border-r md:border-b-0">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Selecciona una prenda
            </p>
            <div className="flex flex-col gap-1.5">
              {drafts.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`flex w-full cursor-pointer items-center justify-between px-3 py-2.5 text-left text-xs transition-colors ${
                    activeProduct?.id === item.id
                      ? 'bg-[#0B0B0D] font-semibold text-white'
                      : 'bg-white text-zinc-700 hover:bg-zinc-200/70'
                  }`}
                >
                  <span className="truncate">
                    0{idx + 1}. {item.name}
                  </span>
                  <span className="ml-2 shrink-0 tabular-nums opacity-80">
                    S/ {item.price}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Product Form */}
          {activeProduct && (
            <div className="space-y-4 p-6 md:col-span-8">
              <div>
                <label
                  htmlFor="edit-name"
                  className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#0B0B0D]"
                >
                  Nombre de la prenda
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={activeProduct.name}
                  onChange={(e) =>
                    updateField(activeProduct.id, 'name', e.target.value)
                  }
                  className="mt-1.5 w-full border border-zinc-300 px-3 py-2 text-sm focus:border-[#0B0B0D] focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="edit-category"
                    className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#0B0B0D]"
                  >
                    Categoría
                  </label>
                  <select
                    id="edit-category"
                    value={activeProduct.category}
                    onChange={(e) =>
                      updateField(
                        activeProduct.id,
                        'category',
                        e.target.value as ProductCategory
                      )
                    }
                    className="mt-1.5 w-full border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-[#0B0B0D] focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="edit-condition"
                    className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#0B0B0D]"
                  >
                    Condición
                  </label>
                  <select
                    id="edit-condition"
                    value={activeProduct.condition}
                    onChange={(e) =>
                      updateField(
                        activeProduct.id,
                        'condition',
                        e.target.value as ProductCondition
                      )
                    }
                    className="mt-1.5 w-full border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-[#0B0B0D] focus:outline-none"
                  >
                    {CONDITIONS.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="edit-size"
                    className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#0B0B0D]"
                  >
                    Talla
                  </label>
                  <input
                    id="edit-size"
                    type="text"
                    value={activeProduct.size}
                    onChange={(e) =>
                      updateField(activeProduct.id, 'size', e.target.value)
                    }
                    className="mt-1.5 w-full border border-zinc-300 px-3 py-2 text-sm focus:border-[#0B0B0D] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-price"
                  className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#0B0B0D]"
                >
                  Precio (S/)
                </label>
                <input
                  id="edit-price"
                  type="number"
                  min={1}
                  step={1}
                  value={activeProduct.price}
                  onChange={(e) => {
                    const parsed = Number(e.target.value);
                    updateField(
                      activeProduct.id,
                      'price',
                      Number.isFinite(parsed) && parsed > 0 ? parsed : 0
                    );
                  }}
                  className="mt-1.5 w-full border border-zinc-300 px-3 py-2 text-sm tabular-nums focus:border-[#0B0B0D] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-description"
                  className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#0B0B0D]"
                >
                  Descripción
                </label>
                <textarea
                  id="edit-description"
                  rows={3}
                  value={activeProduct.description}
                  onChange={(e) =>
                    updateField(activeProduct.id, 'description', e.target.value)
                  }
                  className="mt-1.5 w-full resize-none border border-zinc-300 px-3 py-2 text-sm focus:border-[#0B0B0D] focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 bg-zinc-50 px-6 py-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 border border-zinc-300 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-zinc-700 hover:border-[#0B0B0D] hover:text-[#0B0B0D]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Restaurar originales</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] cursor-pointer px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-zinc-600 hover:text-[#0B0B0D]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="min-h-[40px] cursor-pointer bg-[#0B0B0D] px-6 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-zinc-800"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
