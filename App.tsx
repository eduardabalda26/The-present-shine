import { useEffect, useMemo, useState } from 'react';
import { INITIAL_PRODUCTS } from './data/products';
import { CartItem, Product } from './types/store';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CatalogSection } from './components/CatalogSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { CartDrawer } from './components/CartDrawer';
import { CatalogEditorModal } from './components/CatalogEditorModal';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';

const PRODUCTS_STORAGE_KEY = 'tps_demo_products_v1';
const CART_STORAGE_KEY = 'tps_demo_cart_v1';

interface StoredCartEntry {
  productId: string;
  quantity: number;
}

function loadInitialProducts(): Product[] {
  try {
    const raw = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) return INITIAL_PRODUCTS;
    const parsed = JSON.parse(raw) as Product[];
    if (!Array.isArray(parsed) || parsed.length !== INITIAL_PRODUCTS.length) {
      return INITIAL_PRODUCTS;
    }
    return parsed.map((saved, index) => ({
      ...INITIAL_PRODUCTS[index],
      ...saved,
      image: INITIAL_PRODUCTS[index].image,
    }));
  } catch {
    return INITIAL_PRODUCTS;
  }
}

function loadInitialCart(): StoredCartEntry[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredCartEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry) =>
        typeof entry.productId === 'string' &&
        typeof entry.quantity === 'number' &&
        entry.quantity > 0
    );
  } catch {
    return [];
  }
}

export default function App() {
  const [products, setProducts] = useState<Product[]>(loadInitialProducts);
  const [cartEntries, setCartEntries] = useState<StoredCartEntry[]>(loadInitialCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toastProductName, setToastProductName] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch {
      // Ignore storage quota issues in restricted preview frames
    }
  }, [products]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartEntries));
    } catch {
      // Ignore storage quota issues in restricted preview frames
    }
  }, [cartEntries]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCartOpen(false);
        setIsEditorOpen(false);
        setIsCheckoutOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const cartItems: CartItem[] = useMemo(() => {
    return cartEntries
      .map((entry) => {
        const product = products.find((p) => p.id === entry.productId);
        return product ? { product, quantity: entry.quantity } : null;
      })
      .filter((item): item is CartItem => item !== null);
  }, [cartEntries, products]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const handleAddToCart = (product: Product) => {
    setCartEntries((prev) => {
      const existing = prev.find((entry) => entry.productId === product.id);
      if (existing) {
        return prev.map((entry) =>
          entry.productId === product.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }
      return [...prev, { productId: product.id, quantity: 1 }];
    });

    setToastProductName(product.name);
  };

  useEffect(() => {
    if (!toastProductName) return;
    const timer = window.setTimeout(() => {
      setToastProductName(null);
    }, 2800);
    return () => window.clearTimeout(timer);
  }, [toastProductName]);

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartEntries((prev) =>
      prev
        .map((entry) =>
          entry.productId === productId
            ? { ...entry, quantity: entry.quantity + delta }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartEntries((prev) =>
      prev.filter((entry) => entry.productId !== productId)
    );
  };

  const handleClearCart = () => {
    setCartEntries([]);
  };

  const handleSaveProducts = (updated: Product[]) => {
    setProducts(updated);
  };

  const handleResetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    try {
      window.localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    } catch {
      // Ignore storage access errors
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white">
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main>
        <HeroSection />
        <CatalogSection
          products={products}
          onAddToCart={handleAddToCart}
          onOpenEditor={() => setIsEditorOpen(true)}
        />
        <AboutSection />
        <ContactSection cartItems={cartItems} cartTotal={cartTotal} />
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        total={cartTotal}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          items={cartItems}
          total={cartTotal}
          onClose={() => setIsCheckoutOpen(false)}
          onBackToCart={() => {
            setIsCheckoutOpen(false);
            setIsCartOpen(true);
          }}
          onOrderConfirmed={handleClearCart}
        />
      )}

      {isEditorOpen && (
        <CatalogEditorModal
          isOpen={isEditorOpen}
          products={products}
          onClose={() => setIsEditorOpen(false)}
          onSaveProducts={handleSaveProducts}
          onResetDefaults={handleResetProducts}
        />
      )}

      {/* Subtle Add-to-Cart Feedback Toast */}
      {toastProductName && !isCartOpen && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 bottom-4 left-4 z-40 flex items-center justify-between gap-4 border border-[#C0C0C0]/40 bg-[#0B0B0D] px-4 py-3 text-xs text-white shadow-xl sm:left-auto sm:max-w-sm"
        >
          <span className="truncate">
            <strong className="font-semibold">{toastProductName}</strong> agregado
            al carrito.
          </span>
          <button
            type="button"
            onClick={() => {
              setToastProductName(null);
              setIsCartOpen(true);
            }}
            className="shrink-0 cursor-pointer whitespace-nowrap border border-[#C0C0C0]/50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-[#0B0B0D]"
          >
            Ver carrito
          </button>
        </div>
      )}
    </div>
  );
}

