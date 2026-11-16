export type ProductCategory = 'Polos' | 'Poleras' | 'Casacas' | 'Pantalones';

export type ProductCondition = 'Nueva' | 'Segunda mano';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  condition: ProductCondition;
  size: string;
  description: string;
  price: number;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'Yape' | 'Plin';

export interface CheckoutCustomerData {
  firstName: string;
  lastName: string;
  email: string;
  city: 'Ilo' | 'Arequipa';
  deliveryAddress: string;
  deliveryReference: string;
}

