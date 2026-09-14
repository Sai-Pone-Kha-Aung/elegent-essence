import { notFound } from "next/navigation";
import { getProductByIdOrSlug, getOptimizedRelatedProducts } from "@/lib/db/products";
import { INITIAL_ORDERS } from "@/lib/data";
import ProductDetailsClient from "./ProductDetailsClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductByIdOrSlug(id);
  return {
    title: `${product ? `${product.name} (${product.brand})` : "Fragrance Details"} - Elegant Essence`,
    description: product ? product.description : "Details of our artisanal fragrance.",
  };
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const [product, relatedProducts] = await Promise.all([
    getProductByIdOrSlug(id),
    getOptimizedRelatedProducts(id, 3),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <ProductDetailsClient
      product={product}
      relatedProducts={relatedProducts}
      allOrders={INITIAL_ORDERS}
    />
  );
}


