import { ArrowDownRight } from 'lucide-react';
import heroImg from '../assets/images/hero_urban_streetwear_1794628640255.jpg';
import { STORE_CONFIG } from '../data/storeConfig';

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative scroll-mt-16 overflow-hidden bg-[#0B0B0D] text-white"
    >
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-28">
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Editorial Column */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#C0C0C0]">
              Ilo · Arequipa, Perú &nbsp;/&nbsp; Ropa nueva y segunda mano
            </p>

            <h1 className="font-display mt-4 max-w-xl text-balance text-[clamp(3.25rem,7vw,5.75rem)] leading-[0.94] tracking-wider text-white">
              {STORE_CONFIG.brandName}
            </h1>

            <div className="mt-5 flex items-center gap-4">
              <span className="h-px w-12 bg-[#C0C0C0]" aria-hidden="true" />
              <p className="text-lg font-medium tracking-wide text-[#C0C0C0] sm:text-xl">
                {STORE_CONFIG.slogan}
              </p>
            </div>

            <p className="mt-6 max-w-lg text-sm leading-relaxed text-zinc-300 sm:text-base">
              Moda urbana y casual pensada para jóvenes de 16 a 25 años.
              Combinamos prendas nuevas de corte contemporáneo con piezas de
              segunda mano seleccionadas por su calidad y carácter.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#tienda"
                className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#0B0B0D] transition-colors duration-150 hover:bg-[#C0C0C0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>Explorar tienda</span>
                <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <a
                href="#sobre-nosotros"
                className="inline-flex min-h-[44px] items-center whitespace-nowrap border border-[#C0C0C0]/40 px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors duration-150 hover:border-white hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C0C0C0]"
              >
                Nuestra propuesta
              </a>
            </div>
          </div>

          {/* Right Editorial 16:9 / Stretch Campaign Frame */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] w-full overflow-hidden border border-[#C0C0C0]/25 bg-zinc-900 lg:aspect-auto lg:h-full lg:min-h-[460px]">
              <img
                src={heroImg}
                alt="Editorial urbana de The Present Shine con casacas, poleras y pantalones cargo en concreto costero"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/70 via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="absolute right-4 bottom-4 left-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-[#C0C0C0]/30 pt-3 text-[11px] uppercase tracking-[0.16em] text-[#C0C0C0]">
                <span>Colección Urbana</span>
                <span>Polos · Poleras · Casacas · Pantalones</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
