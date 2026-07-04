"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Order, CartItem } from "@/types";
import { INITIAL_ORDERS } from "@/lib/data";

interface OrdersContextType {
  orders: Order[];
  placeOrder: (items: CartItem[], total: number, buyerName?: string) => string;
  shipOrder: (id: string) => void;
  updateOrderStatus: (id: string, status: "Processing" | "Shipped" | "Delivered") => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("ee_orders");
    if (stored) {
      setOrders(JSON.parse(stored));
    } else {
      setOrders(INITIAL_ORDERS);
      localStorage.setItem("ee_orders", JSON.stringify(INITIAL_ORDERS));
    }
  }, []);

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem("ee_orders", JSON.stringify(newOrders));
  };

  const placeOrder = (items: CartItem[], total: number, buyerName: string = "John Doe"): string => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderId = `EE-${Math.floor(1000 + Math.random() * 9000)}-${randomSuffix}`;
    const dateStr = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });

    const newOrder: Order = {
      id: orderId,
      date: dateStr,
      total,
      status: "Processing",
      buyer: buyerName,
      items: items.map((item) => ({
        name: item.name,
        qty: item.quantity,
        volume: item.volume,
        price: item.price,
      })),
    };

    saveOrders([newOrder, ...orders]);
    return orderId;
  };

  const shipOrder = (id: string) => {
    updateOrderStatus(id, "Shipped");
  };

  const updateOrderStatus = (id: string, status: "Processing" | "Shipped" | "Delivered") => {
    saveOrders(
      orders.map((o) => {
        if (o.id === id) {
          return { ...o, status };
        }
        return o;
      })
    );
  };

  return (
    <OrdersContext.Provider value={{ orders, placeOrder, shipOrder, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}
