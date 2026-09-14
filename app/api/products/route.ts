import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/db/products";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "All";
    const brand = searchParams.get("brand") || "All";
    const gender = searchParams.get("gender") || "All";
    const type = searchParams.get("type") || "All";
    const sort = (searchParams.get("sort") as any) || "rating";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "24", 10);

    const result = await getProducts({
      search,
      category,
      brand,
      gender,
      type,
      sort,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("API /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
