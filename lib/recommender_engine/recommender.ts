import { Product, Order } from "@/types";
import { Gender } from "@/types";

// Common stop-words and structural tags to ignore when extracting scent keywords
const STOP_WORDS = new Set([
  "top", "heart", "base", "notes", "note", "fragrance", "perfume",
  "and", "with", "of", "in", "a", "the", "an", "for", "to", "from",
  "accord", "accords", "extract", "oil", "essence", "infused", "blended"
]);

/**
 * Checks if a product is available in stock.
 */
export function isProductAvailable(product: Product): boolean {
  if (!product) return false;
  if (product.stock !== undefined && product.stock <= 0) return false;
  const statusStr = String(product.status).toUpperCase();
  if (statusStr === "OUT_OF_STOCK" || statusStr === "OUT OF STOCK") return false;
  return true;
}

/**
 * Extracts clean, normalized scent keywords from an array of note strings.
 * Filters out heading tags ("Top", "Heart", "Base"), punctuation, and stop-words.
 */
export function extractScentKeywords(notes: string[] = []): Set<string> {
  const keywords = new Set<string>();
  if (!Array.isArray(notes)) return keywords;

  for (const noteStr of notes) {
    if (typeof noteStr !== "string") continue;
    // Split by colon, comma, slash, dash, or whitespace
    const tokens = noteStr.toLowerCase().split(/[:,\/\-\s]+/);
    for (let token of tokens) {
      token = token.replace(/[^a-z0-9]/g, "").trim();
      if (token.length > 1 && !STOP_WORDS.has(token)) {
        keywords.add(token);
      }
    }
  }
  return keywords;
}

/**
 * Content-based similarity recommender using scent notes, category, gender, and perfume type.
 */
export function getRelatedProducts(
  currentProduct: Product,
  allProducts: Product[],
  limit = 3
): Product[] {
  if (!currentProduct || !Array.isArray(allProducts)) return [];

  const currentNotesSet = extractScentKeywords(currentProduct.notes);

  return allProducts
    .filter((p) => p.id !== currentProduct.id && isProductAvailable(p))
    .map((product) => {
      let score = 0;

      // 1. Category Similarity Match (+3.0)
      if (product.category === currentProduct.category) {
        score += 3.0;
      }

      // 2. Scent Notes Overlap
      const targetNotesSet = extractScentKeywords(product.notes);
      let commonCount = 0;
      for (const keyword of currentNotesSet) {
        if (targetNotesSet.has(keyword)) {
          commonCount++;
        }
      }

      // Jaccard similarity + distinct keyword match score
      const unionSize = new Set([...currentNotesSet, ...targetNotesSet]).size;
      const jaccard = unionSize > 0 ? commonCount / unionSize : 0;
      score += commonCount * 1.5 + jaccard * 2.0;

      // 3. Gender Target Match (+1.0 for exact or UNISEX)
      if (
        product.gender === currentProduct.gender ||
        product.gender === Gender.UNISEX ||
        currentProduct.gender === Gender.UNISEX
      ) {
        score += 1.0;
      }

      // 4. Perfume Type Match (+0.5)
      if (product.type && currentProduct.type && product.type === currentProduct.type) {
        score += 0.5;
      }

      return { product, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.product.rating !== a.product.rating) return b.product.rating - a.product.rating;
      return (b.product.reviews || 0) - (a.product.reviews || 0);
    })
    .map((item) => item.product)
    .slice(0, limit);
}

/**
 * Co-occurrence recommender ("Frequently Bought Together") based on past orders.
 * Fallbacks gracefully to related products and trending products if order history is scarce.
 */
export function getFrequentlyBoughtTogether(
  productId: string,
  allOrders: Order[] = [],
  allProducts: Product[] = [],
  limit = 2
): Product[] {
  if (!productId || !Array.isArray(allProducts)) return [];

  const targetProduct = allProducts.find((p) => p.id === productId || p.name === productId);
  const targetId = targetProduct?.id || productId;
  const targetName = targetProduct?.name || productId;

  const coOccurrenceMap = new Map<string, number>();

  if (Array.isArray(allOrders)) {
    for (const order of allOrders) {
      if (!order.items || !Array.isArray(order.items)) continue;

      const hasTarget = order.items.some(
        (item) => item.productId === targetId || item.id === targetId || item.name === targetName
      );

      if (hasTarget) {
        for (const item of order.items) {
          const itemPid = item.productId || item.id;
          // Find matching product in allProducts by id or name
          const matchedProduct = allProducts.find(
            (p) => p.id === itemPid || p.name === item.name
          );

          if (matchedProduct && matchedProduct.id !== targetId) {
            const qty = item.qty || item.quantity || 1;
            coOccurrenceMap.set(
              matchedProduct.id,
              (coOccurrenceMap.get(matchedProduct.id) || 0) + qty
            );
          }
        }
      }
    }
  }

  const result: Product[] = [];
  const addedIds = new Set<string>([targetId]);

  const sortedCoOccurringIds = Array.from(coOccurrenceMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);

  for (const id of sortedCoOccurringIds) {
    const product = allProducts.find((p) => p.id === id);
    if (product && isProductAvailable(product) && !addedIds.has(product.id)) {
      result.push(product);
      addedIds.add(product.id);
      if (result.length >= limit) return result;
    }
  }

  // Fallback 1: Top Related Products
  if (result.length < limit && targetProduct) {
    const fallbackProducts = getRelatedProducts(targetProduct, allProducts, limit * 2);
    for (const product of fallbackProducts) {
      if (!addedIds.has(product.id) && isProductAvailable(product)) {
        result.push(product);
        addedIds.add(product.id);
        if (result.length >= limit) break;
      }
    }
  }

  // Fallback 2: Top Rated / Trending Products
  if (result.length < limit) {
    const trending = getTrendingProducts(allProducts, limit * 2);
    for (const product of trending) {
      if (!addedIds.has(product.id) && isProductAvailable(product)) {
        result.push(product);
        addedIds.add(product.id);
        if (result.length >= limit) break;
      }
    }
  }

  return result.slice(0, limit);
}

/**
 * User Preference-based recommender ("Recommended For You").
 * Matches user's scent profile preferences against category, scent notes, name, and description.
 */
export function getPersonalizedRecommendations(
  userPreference: string | null | undefined,
  allProducts: Product[] = [],
  limit = 4
): Product[] {
  if (!Array.isArray(allProducts)) return [];

  const available = allProducts.filter(isProductAvailable);
  if (!userPreference || !userPreference.trim()) {
    return getTrendingProducts(available, limit);
  }

  const prefKeywords = userPreference
    .toLowerCase()
    .split(/[\s,\/]+/)
    .map((w) => w.replace(/[^a-z0-9]/g, ""))
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  if (prefKeywords.length === 0) {
    return getTrendingProducts(available, limit);
  }

  const scored = available.map((product) => {
    let score = 0;
    const catLower = String(product.category).toLowerCase();
    const nameLower = (product.name || "").toLowerCase();
    const descLower = (product.description || "").toLowerCase();
    const scentKeywords = extractScentKeywords(product.notes);

    for (const keyword of prefKeywords) {
      if (catLower.includes(keyword)) score += 4.0;
      if (scentKeywords.has(keyword)) score += 3.0;
      if (nameLower.includes(keyword)) score += 2.0;
      if (descLower.includes(keyword)) score += 1.0;
    }

    return { product, score };
  });

  return scored
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.product.rating !== a.product.rating) return b.product.rating - a.product.rating;
      return (b.product.reviews || 0) - (a.product.reviews || 0);
    })
    .map((item) => item.product)
    .slice(0, limit);
}

/**
 * Returns top-rated, highly-reviewed available products as a fallback / general shelf.
 */
export function getTrendingProducts(allProducts: Product[] = [], limit = 4): Product[] {
  if (!Array.isArray(allProducts)) return [];

  return allProducts
    .filter(isProductAvailable)
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return (b.reviews || 0) - (a.reviews || 0);
    })
    .slice(0, limit);
}
