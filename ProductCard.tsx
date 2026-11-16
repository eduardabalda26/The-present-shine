import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { Product } from '../types/store';
import { formatPricePEN } from '../data/storeConfig';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setJustAdded(true);
    window.setTimeout(() => {
      setJustAdded(false);
    }, 1100);
  };

  return (
    <article className="group flex flex-col border border-zinc-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0B0B0D]">
      {/* 4:3 Studio Image Frame */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        <ProductImage
          src={product.image}
          alt={`${product.name} — ${product.category} (${product.condition})`}
          title={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Zero-pill metadata line */}
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
          <span>{product.category}</span>
          <span aria-hidden="true"> · </span>
          <span>{product.condition}</span>
          <span aria-hidden="true"> · </span>
          <span>Talla {product.size}</span>
        </p>

        <h3 className="font-display mt-2 text-2xl leading-tight tracking-wide text-[#0B0B0D]">
          {product.name}
        </h3>

        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-600">
          {product.description}
        </p>

        {/* Bottom Price + Action Row */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-zinc-200 pt-4">
          <span className="text-base font-semibold tabular-nums text-[#0B0B0D]">
            {formatPricePEN(product.price)}
          </span>

          <button
            type="button"
            onClick={handleAdd}
            className={`inline-flex min-h-[40px] shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B0B0D] ${
              justAdded
                ? 'bg-zinc-800 text-white'
                : 'bg-[#0B0B0D] text-white hover:bg-zinc-800'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Agregado</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Agregar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
