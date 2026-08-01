import { create } from "zustand";
import { INITIAL_PRODUCTS } from "@/lib/data";
import { Product, ProductStatus } from "@/types";

interface ProductsState {
  products: Product[];
  isInitialized: boolean;
  initializeProducts: () => void;
  addProduct: (product: Omit<Product, "id" | "status">) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, stock: number) => void;
}

const getProductStatus = (stock: number) => {
  if (stock > 15) return ProductStatus.IN_STOCK;
  if (stock > 0) return ProductStatus.LOW_STOCK;
  return ProductStatus.OUT_OF_STOCK;
};

const saveProducts = (products: Product[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("ee_products", JSON.stringify(products));
  }
  return { products };
};

const getNextProductId = (products: Product[]) => {
  const maxId = products.reduce((max, product) => {
    const numericId = Number.parseInt(product.id, 10);
    return Number.isNaN(numericId) ? max : Math.max(max, numericId);
  }, 0);
  return String(maxId + 1);
};

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  isInitialized: false,

  initializeProducts: () => {
    if (get().isInitialized) return;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ee_products");
      let products = INITIAL_PRODUCTS;
      if (stored) {
        try {
          products = JSON.parse(stored);
        } catch (error) {
          console.error("Error parsing stored products:", error);
        }
      } else {
        localStorage.setItem("ee_products", JSON.stringify(INITIAL_PRODUCTS));
      }

      set({
        products,
        isInitialized: true,
      });
    }
  },

  addProduct: (product) => {
    const { products } = get();
    const newProduct: Product = {
      ...product,
      id: getNextProductId(products),
      status: getProductStatus(product.stock),
    };

    const updatedProducts = [...products, newProduct];
    set(saveProducts(updatedProducts));
  },

  deleteProduct: (id) => {
    const { products } = get();
    set(saveProducts(products.filter((product) => product.id !== id)));
  },

  updateStock: (id, stock) => {
    const { products } = get();
    set(
      saveProducts(
        products.map((product) => {
          if (product.id === id) {
            return {
              ...product,
              stock,
              status: getProductStatus(stock),
            };
          }
          return product;
        }),
      ),
    );
  },
}));
