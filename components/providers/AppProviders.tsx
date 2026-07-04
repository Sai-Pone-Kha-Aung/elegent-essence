"use client";
import React from "react";
import { ProductsProvider } from "@/hooks/useProducts";
import { ProfileProvider } from "@/hooks/useProfile";
import { OrdersProvider } from "@/hooks/useOrders";
import { CartProvider } from "@/hooks/useCart";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ProductsProvider>
      <ProfileProvider>
        <OrdersProvider>
          <CartProvider>{children}</CartProvider>
        </OrdersProvider>
      </ProfileProvider>
    </ProductsProvider>
  );
}
