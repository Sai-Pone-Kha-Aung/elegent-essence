export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  imageBg: string;
  description: string;
  notes: string[];
  ingredients: string;
  stock: number; // Stored as a number of units
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

export interface CartItem {
  id: string;
  name: string;
  volume: string;
  category: string;
  price: number;
  quantity: number;
  imageBg: string;
}

export interface OrderItem {
  name: string;
  qty: number;
  volume: string;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: "Processing" | "Shipped" | "Delivered";
  statusColor?: string;
  items: OrderItem[];
  buyer?: string;
}

export interface User {
  name: string;
  email: string;
  role: "Customer" | "Admin";
  status: "Active" | "Suspended";
  joined: string;
  phone?: string;
  address?: string;
  preference?: string;
}

export interface Transaction {
  id: string;
  customer: string;
  date: string;
  status: "Paid" | "Failed";
  amount: number;
}

export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}
