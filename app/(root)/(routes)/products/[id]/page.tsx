import { notFound } from "next/navigation";
import { INITIAL_PRODUCTS } from "@/lib/data";
import ProductDetailsClient from "./ProductDetailsClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.id === id);
  return {
    title: `${product ? product.name : "Product Details"} - Elegant Essence`,
    description: product ? product.description : "Details of our premium essence.",
  };
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
}
