"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product } from "@/types";
import { INITIAL_CART_ITEMS } from "@/lib/data";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, volume: string) => void;
  removeFromCart: (id: string, volume: string) => void;
  updateQuantity: (id: string, volume: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("ee_cart");
    if (stored) {
      setCartItems(JSON.parse(stored));
    } else {
      setCartItems(INITIAL_CART_ITEMS);
      localStorage.setItem("ee_cart", JSON.stringify(INITIAL_CART_ITEMS));
    }
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setCartItems(newItems);
    localStorage.setItem("ee_cart", JSON.stringify(newItems));
  };

  const addToCart = (product: Product, volume: string) => {
    // Standardize volume display string
    const cleanVolume = volume.includes("100 ml") ? "100 ml" : "50 ml";
    
    const existingIndex = cartItems.findIndex(
      (item) => item.id === product.id && item.volume === cleanVolume
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      saveCart(updated);
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
      saveCart([...cartItems, newItem]);
    }
  };

  const removeFromCart = (id: string, volume: string) => {
    saveCart(cartItems.filter((item) => !(item.id === id && item.volume === volume)));
  };

  const updateQuantity = (id: string, volume: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, volume);
      return;
    }
    saveCart(
      cartItems.map((item) => {
        if (item.id === id && item.volume === volume) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Free shipping for orders above $150
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        shipping,
        tax,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
