import { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { STORE_CONFIG } from '../data/storeConfig';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#tienda', label: 'Tienda' },
  { href: '#sobre-nosotros', label: 'Sobre nosotros' },
  { href: '#contacto', label: 'Contacto' },
];

export function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#C0C0C0]/20 bg-[#0B0B0D]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#inicio"
          className="font-display shrink-0 whitespace-nowrap text-2xl tracking-wider text-white transition-colors hover:text-[#C0C0C0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C0C0C0]"
        >
          {STORE_CONFIG.brandName}
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav aria-label="Navegación principal" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 whitespace-nowrap text-xs font-medium uppercase tracking-[0.14em] text-[#C0C0C0] underline-offset-8 transition-colors duration-150 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C0C0C0]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action + mobile menu button */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Abrir carrito con ${cartCount} productos`}
            className="inline-flex min-h-[40px] shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#0B0B0D] transition-colors duration-150 hover:bg-[#C0C0C0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ShoppingBag className="h-4 w-4 stroke-[1.75]" aria-hidden="true" />
            <span>Carrito</span>
            <span className="tabular-nums">({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center border border-[#C0C0C0]/30 text-white transition-colors hover:border-white md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Navegación móvil"
          className="border-t border-[#C0C0C0]/15 bg-[#0B0B0D] px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center border-b border-[#C0C0C0]/10 text-xs font-medium uppercase tracking-[0.14em] text-[#C0C0C0] transition-colors last:border-b-0 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
