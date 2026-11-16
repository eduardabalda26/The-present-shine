import { useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Product, ProductCategory, ProductCondition } from '../types/store';
import { ProductCard } from './ProductCard';

interface CatalogSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onOpenEditor: () => void;
}

const CONDITION_FILTERS: Array<'Todas' | ProductCondition> = [
  'Todas',
  'Nueva',
  'Segunda mano',
];

const CATEGORY_FILTERS: Array<'Todo' | ProductCategory> = [
  'Todo',
  'Polos',
  'Poleras',
  'Casacas',
  'Pantalones',
];

export function CatalogSection({
  products,
  onAddToCart,
  onOpenEditor,
}: CatalogSectionProps) {
  const [selectedCondition, setSelectedCondition] = useState<'Todas' | ProductCondition>('Todas');
  const [selectedCategory, setSelectedCategory] = useState<'Todo' | ProductCategory>('Todo');

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCondition =
        selectedCondition === 'Todas' || item.condition === selectedCondition;
      const matchCategory =
        selectedCategory === 'Todo' || item.category === selectedCategory;
      return matchCondition && matchCategory;
    });
  }, [products, selectedCondition, selectedCategory]);

  return (
    <section id="tienda" className="scroll-mt-16 bg-white py-20 text-[#0B0B0D] md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-zinc-200 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              Catálogo de demostración · {products.length} prendas
            </p>
            <h2 className="font-display mt-2 text-4xl tracking-wider text-[#0B0B0D] sm:text-5xl">
              Tienda Urbana
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600">
              Selección equilibrada de polos, poleras, casacas y pantalones en
              modalidad nueva y segunda mano curada.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenEditor}
            className="inline-flex min-h-[40px] shrink-0 cursor-pointer items-center gap-2 self-start whitespace-nowrap border border-zinc-300 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#0B0B0D] transition-colors hover:border-[#0B0B0D] hover:bg-zinc-50 md:self-auto"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Editar catálogo (Demo)</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Condition Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-zinc-100 p-1" role="group" aria-label="Filtrar por condición">
            {CONDITION_FILTERS.map((condition) => {
              const active = selectedCondition === condition;
              return (
                <button
                  key={condition}
                  type="button"
                  onClick={() => setSelectedCondition(condition)}
                  className={`min-h-[36px] cursor-pointer whitespace-nowrap px-4 py-1.5 text-xs font-medium uppercase tracking-[0.1em] transition-colors ${
                    active
                      ? 'bg-[#0B0B0D] text-white'
                      : 'text-zinc-600 hover:text-[#0B0B0D]'
                  }`}
                >
                  {condition}
                </button>
              );
            })}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por categoría">
            {CATEGORY_FILTERS.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`min-h-[36px] cursor-pointer whitespace-nowrap border px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.1em] transition-colors ${
                    active
                      ? 'border-[#0B0B0D] bg-[#0B0B0D] text-white'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-[#0B0B0D]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 border border-zinc-200 bg-zinc-50 px-6 py-14 text-center">
            <p className="text-sm font-medium text-[#0B0B0D]">
              No hay prendas que coincidan con este filtro combinado.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCondition('Todas');
                setSelectedCategory('Todo');
              }}
              className="mt-4 inline-flex min-h-[40px] cursor-pointer items-center bg-[#0B0B0D] px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-zinc-800"
            >
              Ver las {products.length} prendas
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
