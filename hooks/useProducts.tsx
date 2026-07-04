"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";
import { INITIAL_PRODUCTS } from "@/lib/data";

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "status">) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, stock: number) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("ee_products");
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem("ee_products", JSON.stringify(INITIAL_PRODUCTS));
    }
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem("ee_products", JSON.stringify(newProducts));
  };

  const addProduct = (p: Omit<Product, "id" | "status">) => {
    const id = (products.length + 1).toString();
    const status = p.stock > 15 ? "In Stock" : p.stock > 0 ? "Low Stock" : "Out of Stock";
    const newProduct: Product = {
      ...p,
      id,
      status,
    };
    saveProducts([...products, newProduct]);
  };

  const deleteProduct = (id: string) => {
    saveProducts(products.filter((p) => p.id !== id));
  };

  const updateStock = (id: string, stock: number) => {
    saveProducts(
      products.map((p) => {
        if (p.id === id) {
          const status = stock > 15 ? "In Stock" : stock > 0 ? "Low Stock" : "Out of Stock";
          return { ...p, stock, status };
        }
        return p;
      })
    );
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, deleteProduct, updateStock }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
