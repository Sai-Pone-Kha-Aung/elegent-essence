import { NextRequest, NextResponse } from "next/server";
import { getOptimizedPersonalizedProducts, getOptimizedRelatedProducts } from "@/lib/db/products";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "personalized"; // "personalized" | "related"
    const productId = searchParams.get("productId");
    const preference = searchParams.get("preference");
    const sessionId = searchParams.get("sessionId");
    const limit = parseInt(searchParams.get("limit") || "4", 10);

    if (type === "related" && productId) {
      const related = await getOptimizedRelatedProducts(productId, limit);
      return NextResponse.json({ items: related });
    }

    const recommendations = await getOptimizedPersonalizedProducts({
      preference,
      sessionId,
      limit,
    });

    return NextResponse.json({ items: recommendations });
  } catch (error) {
    console.error("API /api/recommendations error:", error);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
