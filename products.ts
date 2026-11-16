import { Product } from '../types/store';

import poloOversizeImg from '../assets/images/product_polo_oversize_negro_1794628641563.jpg';
import poloVintageImg from '../assets/images/product_polo_vintage_lavado_1794628642459.jpg';
import poleraHoodieImg from '../assets/images/product_polera_hoodie_negra_1794628641286.jpg';
import poleraCrewneckImg from '../assets/images/product_polera_crewneck_plateada_1794628642106.jpg';
import casacaBomberImg from '../assets/images/product_casaca_bomber_urbana_1794628642456.jpg';
import casacaDenimImg from '../assets/images/product_casaca_denim_vintage_1794628643017.jpg';
import pantalonCargoImg from '../assets/images/product_pantalon_cargo_negro_1794628643873.jpg';
import pantalonBaggyImg from '../assets/images/product_pantalon_baggy_denim_1794628644255.jpg';

/**
 * Catálogo inicial de demostración (8 productos editables).
 * Puedes modificar nombres, descripciones, precios, tallas o categorías directamente aquí,
 * o mediante el editor integrado en la tienda.
 */
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'tps-01',
    name: 'Polo Oversize Obsidian',
    category: 'Polos',
    condition: 'Nueva',
    size: 'M',
    description:
      'Algodón pesado de 240g en negro mate con caída relajada y cuello acanalado estructurado para uso diario.',
    price: 65,
    image: poloOversizeImg,
  },
  {
    id: 'tps-02',
    name: 'Polo Lavado Archivo 90s',
    category: 'Polos',
    condition: 'Segunda mano',
    size: 'L',
    description:
      'Pieza curada de segunda mano en carbón lavado con detalle minimalista en tono plateado y textura suave.',
    price: 45,
    image: poloVintageImg,
  },
  {
    id: 'tps-03',
    name: 'Polera Hoodie Nocturna',
    category: 'Poleras',
    condition: 'Nueva',
    size: 'L',
    description:
      'Polera boxy fit en franela gruesa negra con capucha doble y puntas metálicas plateadas en el cordón.',
    price: 120,
    image: poleraHoodieImg,
  },
  {
    id: 'tps-04',
    name: 'Polera Crewneck Silver Mist',
    category: 'Poleras',
    condition: 'Segunda mano',
    size: 'M',
    description:
      'Sudadera clásica gris jaspeado de silueta amplia y puños firmes, ideal para las tardes frescas de Arequipa.',
    price: 75,
    image: poleraCrewneckImg,
  },
  {
    id: 'tps-05',
    name: 'Casaca Bomber Chrome Zip',
    category: 'Casacas',
    condition: 'Nueva',
    size: 'M',
    description:
      'Casaca bomber en nailon técnico negro mate con cierre central plateado, bolsillo utilitario y corte urbano.',
    price: 165,
    image: casacaBomberImg,
  },
  {
    id: 'tps-06',
    name: 'Casaca Denim Carbón Vintage',
    category: 'Casacas',
    condition: 'Segunda mano',
    size: 'L',
    description:
      'Chaqueta trucker de mezclilla negra prelavada con botones metálicos plateados y desgaste auténtico.',
    price: 110,
    image: casacaDenimImg,
  },
  {
    id: 'tps-07',
    name: 'Pantalón Cargo Táctico',
    category: 'Pantalones',
    condition: 'Nueva',
    size: '32',
    description:
      'Pantalón cargo en dril resistente negro con bolsillos laterales amplios, broches plateados y calce cómodo.',
    price: 135,
    image: pantalonCargoImg,
  },
  {
    id: 'tps-08',
    name: 'Pantalón Baggy Denim Humo',
    category: 'Pantalones',
    condition: 'Segunda mano',
    size: '30',
    description:
      'Jean de pierna ancha estilo skate noventero en lavado gris humo, seleccionado por su caída y resistencia.',
    price: 88,
    image: pantalonBaggyImg,
  },
];
