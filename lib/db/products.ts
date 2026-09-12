import prisma from "@/lib/prisma";
import { Product as PrismaProduct, Category, Gender, PerfumeType, Longevity, ProductStatus } from "@/generated/prisma/client";
import { Product } from "@/types";

export interface GetProductsParams {
  search?: string;
  category?: string;
  brand?: string;
  gender?: string;
  type?: string;
  sort?: "rating" | "price_asc" | "price_desc" | "name_asc" | "newest";
  page?: number;
  limit?: number;
}

export interface PaginatedProductsResult {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  brands: { name: string; count: number }[];
  categories: string[];
}

export function formatProductFromDb(item: any): Product {
  let parsedNotes: string[] = [];
  if (item.notes) {
    try {
      parsedNotes = Array.isArray(item.notes) ? item.notes : JSON.parse(item.notes);
    } catch {
      parsedNotes = typeof item.notes === "string" ? item.notes.split(",") : [];
    }
  }

  return {
    id: item.id,
    name: item.name,
    brand: item.brandName || (item.brand?.name ?? ""),
    slug: item.slug,
    category: item.category,
    price: item.price,
    rating: item.rating,
    reviews: item.reviews,
    imageBg: item.imageBg || "from-amber-800/40 via-yellow-900/30 to-stone-950/90",
    description: item.description,
    notes: parsedNotes,
    ingredients: item.ingredients ?? null,
    stock: item.stock,
    status: item.status,
    type: item.type,
    gender: item.gender,
    volume: item.volume ?? "100ml",
    longevity: item.longevity,
    sillage: item.sillage,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export async function getProducts(params: GetProductsParams = {}): Promise<PaginatedProductsResult> {
  const {
    search = "",
    category = "All",
    brand = "All",
    gender = "All",
    type = "All",
    sort = "rating",
    page = 1,
    limit = 24,
  } = params;

  const where: any = {};

  // 1. Search Query filter (matches name, brandName, description)
  if (search.trim()) {
    const q = search.trim();
    where.OR = [
      { name: { contains: q } },
      { brandName: { contains: q } },
      { description: { contains: q } },
    ];
  }

  // 2. Category filter
  if (category && category !== "All") {
    where.category = category as Category;
  }

  // 3. Brand filter
  if (brand && brand !== "All") {
    where.brandName = brand;
  }

  // 4. Gender filter
  if (gender && gender !== "All") {
    where.gender = gender.toUpperCase() as Gender;
  }

  // 5. Type filter
  if (type && type !== "All") {
    where.type = type as PerfumeType;
  }

  // Sorting
  let orderBy: any = [{ rating: "desc" }, { reviews: "desc" }];
  if (sort === "price_asc") {
    orderBy = { price: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { price: "desc" };
  } else if (sort === "name_asc") {
    orderBy = { name: "asc" };
  } else if (sort === "newest") {
    orderBy = { createdAt: "desc" };
  }

  const skip = (Math.max(1, page) - 1) * limit;

  const [total, rawProducts, allBrands] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { brand: true },
    }),
    prisma.brand.findMany({
      select: {
        name: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const items = rawProducts.map(formatProductFromDb);
  const totalPages = Math.ceil(total / limit);

  const brands = allBrands.map((b) => ({
    name: b.name,
    count: b._count.products,
  }));

  const categories = [
    "Fresh & Citrus",
    "Woody",
    "Gourmand",
    "Floral",
    "Oriental & Amber",
    "Oud & Rich Woods",
    "Leather",
    "Aromatic / Fougère",
    "Other",
  ];

  return {
    items,
    total,
    page,
    limit,
    totalPages,
    brands,
    categories,
  };
}

export async function getProductByIdOrSlug(idOrSlug: string): Promise<Product | null> {
  const rawProduct = await prisma.product.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: { brand: true },
  });

  if (!rawProduct) return null;
  return formatProductFromDb(rawProduct);
}

/**
 * Optimized Candidate Pool Recommender:
 * Queries targeted candidate pools via indexed SQL filters (category, gender, brand, co-interactions)
 * instead of loading the entire database into memory.
 */
export async function getOptimizedRelatedProducts(
  idOrSlug: string,
  limit = 3
): Promise<Product[]> {
  const current = await prisma.product.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
  });

  if (!current) return [];

  // 1. Candidate Pool 1: Same category + gender match / unisex (indexed SQL lookup, max 20)
  const categoryCandidatesPromise = prisma.product.findMany({
    where: {
      id: { not: current.id },
      category: current.category,
      gender: { in: [current.gender, Gender.UNISEX] },
      status: { not: ProductStatus.OUT_OF_STOCK },
    },
    orderBy: [{ rating: "desc" }, { reviews: "desc" }],
    take: 20,
    include: { brand: true },
  });

  // 2. Candidate Pool 2: Same brand favorites (max 10)
  const brandCandidatesPromise = current.brandName
    ? prisma.product.findMany({
        where: {
          id: { not: current.id },
          brandName: current.brandName,
          status: { not: ProductStatus.OUT_OF_STOCK },
        },
        orderBy: [{ rating: "desc" }],
        take: 10,
        include: { brand: true },
      })
    : Promise.resolve([]);

  // 3. Candidate Pool 3: Co-interaction candidates (sessions that viewed current product also viewed these)
  const coInteractedSessions = await prisma.productInteraction.findMany({
    where: { productId: current.id },
    select: { sessionId: true },
    distinct: ["sessionId"],
    take: 25,
  });

  const sessionIds = coInteractedSessions.map((s) => s.sessionId);
  const interactionCandidatesPromise =
    sessionIds.length > 0
      ? prisma.productInteraction.findMany({
          where: {
            sessionId: { in: sessionIds },
            productId: { not: current.id },
          },
          select: { productId: true },
          distinct: ["productId"],
          take: 15,
        })
      : Promise.resolve([]);

  const [catCandidates, brandCandidates, interCandidates] = await Promise.all([
    categoryCandidatesPromise,
    brandCandidatesPromise,
    interactionCandidatesPromise,
  ]);

  const coInteractedProductIds = interCandidates.map((i) => i.productId);
  let coProducts: any[] = [];
  if (coInteractedProductIds.length > 0) {
    coProducts = await prisma.product.findMany({
      where: {
        id: { in: coInteractedProductIds },
        status: { not: ProductStatus.OUT_OF_STOCK },
      },
      include: { brand: true },
    });
  }

  // Combine and deduplicate candidate pool (typically ~25 to 35 candidates total)
  const candidateMap = new Map<string, Product>();
  for (const raw of [...catCandidates, ...brandCandidates, ...coProducts]) {
    if (!candidateMap.has(raw.id)) {
      candidateMap.set(raw.id, formatProductFromDb(raw));
    }
  }

  const currentFormatted = formatProductFromDb(current);
  const candidates = Array.from(candidateMap.values());

  // Rank candidate pool using content similarity
  const { getRelatedProducts } = await import("@/lib/recommender_engine/recommender");
  return getRelatedProducts(currentFormatted, candidates, limit);
}

/**
 * Candidate Pool Personalized Recommender:
 * Queries candidate products matching explicit preferences or implicit session interactions.
 */
export async function getOptimizedPersonalizedProducts({
  preference,
  sessionId,
  limit = 4,
}: {
  preference?: string | null;
  sessionId?: string | null;
  limit?: number;
}): Promise<Product[]> {
  // If user or guest has implicit interaction history, boost those categories
  let implicitCategories: Category[] = [];
  if (sessionId) {
    const recentInteractions = await prisma.productInteraction.findMany({
      where: { sessionId },
      select: {
        product: { select: { category: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    implicitCategories = recentInteractions
      .map((i) => i.product?.category)
      .filter((c): c is Category => Boolean(c));
  }

  // Target categories to query
  const targetCategories = new Set<Category>(implicitCategories);
  if (preference) {
    const prefLower = preference.toLowerCase();
    if (prefLower.includes("citrus") || prefLower.includes("fresh")) targetCategories.add(Category.FRESH_CITRUS);
    if (prefLower.includes("woody") || prefLower.includes("wood")) targetCategories.add(Category.WOODY);
    if (prefLower.includes("gourmand") || prefLower.includes("vanilla")) targetCategories.add(Category.GOURMAND);
    if (prefLower.includes("floral") || prefLower.includes("rose")) targetCategories.add(Category.FLORAL);
    if (prefLower.includes("amber") || prefLower.includes("oriental")) targetCategories.add(Category.ORIENTAL_AMBER);
    if (prefLower.includes("oud")) targetCategories.add(Category.OUD_RICH_WOODS);
    if (prefLower.includes("leather")) targetCategories.add(Category.LEATHER);
    if (prefLower.includes("aromatic") || prefLower.includes("fougère")) targetCategories.add(Category.AROMATIC_FOUGERE);
  }

  const categoryList = Array.from(targetCategories);

  // Query bounded candidate pool (max 30 items)
  const rawCandidates = await prisma.product.findMany({
    where: {
      status: { not: ProductStatus.OUT_OF_STOCK },
      ...(categoryList.length > 0 ? { category: { in: categoryList } } : {}),
    },
    orderBy: [{ rating: "desc" }, { reviews: "desc" }],
    take: 30,
    include: { brand: true },
  });

  const candidates = rawCandidates.map(formatProductFromDb);
  const { getPersonalizedRecommendations } = await import("@/lib/recommender_engine/recommender");
  return getPersonalizedRecommendations(preference, candidates, limit);
}

export async function getAllProductsForRecommendation(): Promise<Product[]> {
  const rawProducts = await prisma.product.findMany({
    take: 60,
    orderBy: { rating: "desc" },
    include: { brand: true },
  });

  return rawProducts.map(formatProductFromDb);
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const rawProducts = await prisma.product.findMany({
    take: limit,
    orderBy: [{ rating: "desc" }, { reviews: "desc" }],
    include: { brand: true },
  });

  return rawProducts.map(formatProductFromDb);
}

