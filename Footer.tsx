import { STORE_CONFIG } from '../data/storeConfig';

export function Footer() {
  return (
    <footer className="border-t border-[#C0C0C0]/20 bg-[#0B0B0D] py-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-display text-3xl tracking-wider text-white">
              {STORE_CONFIG.brandName}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#C0C0C0]">
              {STORE_CONFIG.slogan} · Ilo y Arequipa, Perú
            </p>
          </div>

          <nav aria-label="Enlaces de pie de página" className="flex flex-wrap gap-6">
            <a
              href="#inicio"
              className="text-xs font-medium uppercase tracking-[0.14em] text-[#C0C0C0] transition-colors hover:text-white"
            >
              Inicio
            </a>
            <a
              href="#tienda"
              className="text-xs font-medium uppercase tracking-[0.14em] text-[#C0C0C0] transition-colors hover:text-white"
            >
              Tienda
            </a>
            <a
              href="#sobre-nosotros"
              className="text-xs font-medium uppercase tracking-[0.14em] text-[#C0C0C0] transition-colors hover:text-white"
            >
              Sobre nosotros
            </a>
            <a
              href="#contacto"
              className="text-xs font-medium uppercase tracking-[0.14em] text-[#C0C0C0] transition-colors hover:text-white"
            >
              Contacto
            </a>
          </nav>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-2 border-t border-[#C0C0C0]/15 pt-6 text-xs text-zinc-400 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {STORE_CONFIG.brandName}. Proyecto
            universitario de tienda virtual.
          </p>
          <p>
            Demostración académica · Catálogo editable sin procesamiento real de
            pagos.
          </p>
        </div>
      </div>
    </footer>
  );
}
