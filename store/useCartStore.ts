import { create } from "zustand";
import { CartItem, Product } from "@/types";
import { INITIAL_CART_ITEMS } from "@/lib/data";

interface CartState {
  cartItems: CartItem[];
  cartCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  isInitialized: boolean;
  initializeCart: () => void;
  addToCart: (product: Product, volume: string) => void;
  removeFromCart: (id: string, volume: string) => void;
  updateQuantity: (id: string, volume: string, quantity: number) => void;
  clearCart: () => void;
}

const computeCartTotals = (cartItems: CartItem[]) => {
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Free shipping for orders above $150
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  return { cartCount, subtotal, shipping, tax, total };
};

const saveCart = (newItems: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("ee_cart", JSON.stringify(newItems));
  }
  return {
    cartItems: newItems,
    ...computeCartTotals(newItems),
  };
};

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  cartCount: 0,
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  isInitialized: false,

  initializeCart: () => {
    if (get().isInitialized) return;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ee_cart");
      let items = INITIAL_CART_ITEMS;
      if (stored) {
        try {
          items = JSON.parse(stored);
        } catch (e) {
          console.error("Error parsing stored cart:", e);
        }
      } else {
        localStorage.setItem("ee_cart", JSON.stringify(INITIAL_CART_ITEMS));
      }
      set({
        cartItems: items,
        isInitialized: true,
        ...computeCartTotals(items),
      });
    }
  },

  addToCart: (product: Product, volume: string) => {
    // Standardize volume display string
    const cleanVolume = volume.includes("100 ml") ? "100 ml" : "50 ml";
    const { cartItems } = get();

    const existingIndex = cartItems.findIndex(
      (item) => item.id === product.id && item.volume === cleanVolume
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      set(saveCart(updated));
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        volume: cleanVolume,
        category: product.category,
        price: product.price,
        quantity: 1,
        imageBg: product.imageBg,
      };
      set(saveCart([...cartItems, newItem]));
    }
  },

  removeFromCart: (id: string, volume: string) => {
    const { cartItems } = get();
    set(saveCart(cartItems.filter((item) => !(item.id === id && item.volume === volume))));
  },

  updateQuantity: (id: string, volume: string, quantity: number) => {
    const { removeFromCart } = get();
    if (quantity <= 0) {
      removeFromCart(id, volume);
      return;
    }
    const { cartItems } = get();
    set(
      saveCart(
        cartItems.map((item) => {
          if (item.id === id && item.volume === volume) {
            return { ...item, quantity };
          }
          return item;
        })
      )
    );
  },

  clearCart: () => {
    set(saveCart([]));
  },
}));
