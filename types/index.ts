import {
  Role,
  UserStatus,
  PerfumeType,
  Category,
  Gender,
  Longevity,
  Sillage,
  ProductStatus,
  OrderStatus,
  TransactionStatus,
} from "../generated/prisma/client";

export {
  Role,
  UserStatus,
  PerfumeType,
  Category,
  Gender,
  Longevity,
  Sillage,
  ProductStatus,
  OrderStatus,
  TransactionStatus,
};

export interface Product {
  id: string;
  name: string;
  brand?: string;
  slug?: string;
  category: Category;
  price: number;
  rating: number;
  reviews: number;
  imageBg: string;
  description: string;
  notes: string[]; // Keep as string[] for compatibility with UI components mapping over notes
  ingredients: string | null;
  stock: number; // Stored as a number of units
  status: ProductStatus;
  type?: PerfumeType;
  gender?: Gender;
  volume?: string | null;
  longevity?: Longevity;
  sillage?: Sillage;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CartItem {
  id: string;
  name: string;
  volume: string;
  category: Category;
  price: number;
  quantity: number;
  imageBg: string;
}

export interface OrderItem {
  id?: string;
  orderId?: string;
  productId?: string | null;
  name: string;
  qty: number; // For compatibility with frontend / mock data
  quantity?: number; // To match quantity field in schema.prisma
  volume: string;
  price: number;
  createdAt?: Date | string;
}

export interface Order {
  id: string;
  date: string; // Keep as string for compatibility with ReactNode / Next.js JSON serialization
  total: number;
  status: OrderStatus;
  statusColor?: string;
  buyerId?: string;
  buyer?: string; // Buyer name for compatibility
  items: OrderItem[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  transaction?: Transaction[];
}

export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  status: UserStatus;
  joined?: string; // Retain for compatibility with old mock data/UI
  phone?: string | null;
  address?: string | null;
  preference?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Transaction {
  id: string;
  orderId?: string;
  customer: string;
  date: string; // Keep as string for compatibility with ReactNode / Next.js JSON serialization
  status: TransactionStatus;
  amount: number;
  createdAt?: Date | string;
}

export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}
