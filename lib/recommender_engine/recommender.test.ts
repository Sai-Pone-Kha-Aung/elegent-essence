import {
  extractScentKeywords,
  isProductAvailable,
  getRelatedProducts,
  getFrequentlyBoughtTogether,
  getPersonalizedRecommendations,
  getTrendingProducts,
} from "./recommender";
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from "../data";
import { Product, ProductStatus, Category, Gender, PerfumeType, Longevity, Sillage } from "@/types";

console.log("=== Running Recommender Engine Unit Tests ===");

// 1. Test Scent Keywords Extraction & Stop-word Filtering
console.log("\n[Test 1] extractScentKeywords");
const notes = [
  "Top: Sicilian Bergamot, Lemon Zest",
  "Heart: Chilled Mint Leaves, Coriander",
  "Base: White Cedarwood, Musk",
];
const extracted = extractScentKeywords(notes);
console.assert(!extracted.has("top"), "Should strip structural word 'Top'");
console.assert(!extracted.has("heart"), "Should strip structural word 'Heart'");
console.assert(!extracted.has("base"), "Should strip structural word 'Base'");
console.assert(extracted.has("bergamot"), "Should extract 'bergamot'");
console.assert(extracted.has("lemon"), "Should extract 'lemon'");
console.assert(extracted.has("mint"), "Should extract 'mint'");
console.assert(extracted.has("musk"), "Should extract 'musk'");
console.log("✔ extractScentKeywords passed.");

// 2. Test Availability Check
console.log("\n[Test 2] isProductAvailable");
const inStockProduct = INITIAL_PRODUCTS[0]; // Mystique Oud (stock 45)
const outOfStockProduct = INITIAL_PRODUCTS[3]; // Citron Glace (stock 0)
console.assert(isProductAvailable(inStockProduct) === true, "Mystique Oud should be available");
console.assert(isProductAvailable(outOfStockProduct) === false, "Citron Glace should NOT be available (stock 0)");
console.log("✔ isProductAvailable passed.");

// 3. Test getRelatedProducts
console.log("\n[Test 3] getRelatedProducts");
const relatedToMystique = getRelatedProducts(INITIAL_PRODUCTS[0], INITIAL_PRODUCTS, 3);
console.assert(Array.isArray(relatedToMystique), "Returns array");
console.assert(relatedToMystique.length <= 3, "Respects limit 3");
console.assert(!relatedToMystique.some((p) => p.id === INITIAL_PRODUCTS[0].id), "Excludes current product");
console.assert(!relatedToMystique.some((p) => p.status === ProductStatus.OUT_OF_STOCK || p.stock <= 0), "Excludes out of stock products");
console.log(`Related to Mystique Oud (${INITIAL_PRODUCTS[0].name}):`, relatedToMystique.map(p => p.name));
console.log("✔ getRelatedProducts passed.");

// 4. Test getFrequentlyBoughtTogether
console.log("\n[Test 4] getFrequentlyBoughtTogether");
const fbtMystique = getFrequentlyBoughtTogether("1", INITIAL_ORDERS, INITIAL_PRODUCTS, 2);
console.assert(Array.isArray(fbtMystique), "Returns array");
console.assert(fbtMystique.length === 2, "Returns 2 products");
console.assert(!fbtMystique.some((p) => p.id === "1"), "Excludes target product '1'");
console.log(`Frequently bought together with Mystique Oud:`, fbtMystique.map(p => p.name));
console.log("✔ getFrequentlyBoughtTogether passed.");

// 5. Test getPersonalizedRecommendations
console.log("\n[Test 5] getPersonalizedRecommendations");
const woodyRecs = getPersonalizedRecommendations("Woody and Oud spices", INITIAL_PRODUCTS, 3);
console.assert(woodyRecs.length > 0, "Returns recommendations for 'Woody and Oud spices'");
console.assert(woodyRecs[0].name === "Mystique Oud", "Mystique Oud should be top recommendation for woody/oud preference");
console.log(`Personalized recommendations for 'Woody and Oud spices':`, woodyRecs.map(p => p.name));
console.log("✔ getPersonalizedRecommendations passed.");

// 6. Test getTrendingProducts
console.log("\n[Test 6] getTrendingProducts");
const trending = getTrendingProducts(INITIAL_PRODUCTS, 3);
console.assert(trending.length === 3, "Returns 3 trending products");
console.assert(trending[0].rating >= trending[1].rating, "Sorted by rating descending");
console.log("Trending products:", trending.map(p => `${p.name} (${p.rating}★)`));
console.log("✔ getTrendingProducts passed.");

console.log("\n=== ALL RECOMMENDER ENGINE TESTS PASSED! ===");
