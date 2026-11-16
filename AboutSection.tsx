import aboutRackImg from '../assets/images/about_curated_rack_1794628644340.jpg';
import { STORE_CONFIG } from '../data/storeConfig';

const VALUE_PILLARS = [
  {
    index: '01.',
    title: 'Curaduría nueva y de segunda mano',
    detail:
      'Integramos básicos urbanos de estreno junto a piezas de segunda mano cuidadosamente revisadas por su estado, confección y silueta.',
  },
  {
    index: '02.',
    title: 'Moda circular con identidad',
    detail:
      'Damos una segunda vida a prendas con carácter, ofreciendo una alternativa consciente y accesible frente al consumo textil desechable.',
  },
  {
    index: '03.',
    title: 'Pensado para Ilo y Arequipa',
    detail:
      'Prendas versátiles adaptadas al ritmo juvenil de la costa y la ciudad: desde polos ligeros para el día hasta poleras y casacas para el frío de tarde.',
  },
];

export function AboutSection() {
  return (
    <section
      id="sobre-nosotros"
      className="scroll-mt-16 bg-[#0B0B0D] py-20 text-white md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Editorial Studio Image */}
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] w-full overflow-hidden border border-[#C0C0C0]/25 bg-zinc-900 lg:aspect-auto lg:h-full lg:min-h-[480px]">
              <img
                src={aboutRackImg}
                alt="Perchero minimalista de The Present Shine con prendas urbanas seleccionadas en tonos negro, blanco y plateado"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* Value Proposition Copy */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#C0C0C0]">
              Propuesta de valor · {STORE_CONFIG.targetAudience}
            </p>

            <h2 className="font-display mt-3 text-balance text-4xl tracking-wider text-white sm:text-5xl">
              Sobre Nosotros
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
              <strong className="font-semibold text-white">
                {STORE_CONFIG.brandName}
              </strong>{' '}
              nace como una tienda virtual enfocada en jóvenes de 16 a 25 años
              de Ilo y Arequipa que buscan vestir con autenticidad sin depender
              de producciones genéricas. Reunimos ropa nueva de estética
              minimalista y piezas de segunda mano seleccionadas bajo un mismo
              estándar visual: cortes actuales, tonos versátiles y durabilidad real.
            </p>

            {/* 3 Unboxed Pillars separated by 1px silver hairlines */}
            <div className="mt-10 divide-y divide-[#C0C0C0]/20 border-t border-b border-[#C0C0C0]/20">
              {VALUE_PILLARS.map((pillar) => (
                <div key={pillar.index} className="py-5">
                  <h3 className="font-display text-2xl tracking-wide text-white">
                    <span className="mr-2 text-[#C0C0C0]">{pillar.index}</span>
                    {pillar.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-300 sm:text-sm">
                    {pillar.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
