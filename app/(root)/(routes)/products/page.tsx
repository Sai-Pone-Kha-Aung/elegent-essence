import ProductsClient from "./ProductsClient";
import { getProducts } from "@/lib/db/products";

export const metadata = {
  title: "Products Catalogue - Elegant Essence",
  description: "Browse our premium curated collection of 940+ elegant fragrances and essences.",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const { items, total, brands, categories } = await getProducts({
    page: 1,
    limit: 24,
    sort: "rating",
  });

  return (
    <ProductsClient
      initialProducts={items}
      initialTotal={total}
      initialBrands={brands}
      initialCategories={categories}
    />
  );
}

