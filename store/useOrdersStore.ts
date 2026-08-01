import { create } from "zustand";
import { INITIAL_ORDERS } from "@/lib/data";
import { CartItem, Order, OrderStatus } from "@/types";

interface OrdersState {
  orders: Order[];
  isInitialized: boolean;
  initializeOrders: () => void;
  placeOrder: (items: CartItem[], total: number, buyerName?: string) => string;
  shipOrder: (id: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

const saveOrders = (orders: Order[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("ee_orders", JSON.stringify(orders));
  }
  return { orders };
};

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  isInitialized: false,

  initializeOrders: () => {
    if (get().isInitialized) return;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ee_orders");
      let orders = INITIAL_ORDERS;
      if (stored) {
        try {
          orders = JSON.parse(stored) as Order[];
        } catch (error) {
          console.error("Error parsing stored orders:", error);
        }
      } else {
        localStorage.setItem("ee_orders", JSON.stringify(INITIAL_ORDERS));
      }

      set({
        orders,
        isInitialized: true,
      });
    }
  },

  placeOrder: (items, total, buyerName = "John Doe") => {
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
      status: OrderStatus.PROCESSING,
      buyer: buyerName,
      items: items.map((item) => ({
        name: item.name,
        qty: item.quantity,
        volume: item.volume,
        price: item.price,
      })),
    };

    const updatedOrders = [newOrder, ...get().orders];
    set(saveOrders(updatedOrders));
    return orderId;
  },

  shipOrder: (id) => {
    get().updateOrderStatus(id, OrderStatus.SHIPPED);
  },

  updateOrderStatus: (id, status) => {
    const updatedOrders = get().orders.map((order) => {
      if (order.id === id) {
        return { ...order, status };
      }
      return order;
    });

    set(saveOrders(updatedOrders));
  },
}));
