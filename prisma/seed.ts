import fs from "fs";
import path from "path";
import prisma from "../lib/prisma";
import {
  Category,
  PerfumeType,
  Gender,
  Longevity,
  ProductStatus,
} from "../generated/prisma/enums";

interface RawFragrance {
  Brand: string;
  Title: string;
  Type: string;
  Category: string;
  Gender: string;
  Longevity: string;
}

const CATEGORY_MAP: Record<string, Category> = {
  "Fresh & Citrus": Category.FRESH_CITRUS,
  Woody: Category.WOODY,
  Gourmand: Category.GOURMAND,
  Floral: Category.FLORAL,
  "Oriental & Amber": Category.ORIENTAL_AMBER,
  "Oud & Rich Woods": Category.OUD_RICH_WOODS,
  Leather: Category.LEATHER,
  "Aromatic / Fougère": Category.AROMATIC_FOUGERE,
  Other: Category.OTHER,
  Unknown: Category.UNKNOWN,
};

const TYPE_MAP: Record<string, PerfumeType> = {
  EDP: PerfumeType.EDP,
  EDT: PerfumeType.EDT,
  Parfum: PerfumeType.PARFUM,
  "Extrait de Parfum": PerfumeType.EXTRAIT_DE_PARFUM,
  Extrait: PerfumeType.EXTRAIT,
  Cologne: PerfumeType.COLOGNE,
  "Alcohol-free": PerfumeType.ALCOHOL_FREE,
  Attar: PerfumeType.ATTAR,
  Concentrate: PerfumeType.CONCENTRATE,
  Oil: PerfumeType.OIL,
};

const GENDER_MAP: Record<string, Gender> = {
  Male: Gender.MALE,
  Female: Gender.FEMALE,
  Unisex: Gender.UNISEX,
};

const LONGEVITY_MAP: Record<string, Longevity> = {
  Strong: Longevity.STRONG,
  Medium: Longevity.MEDIUM,
  Light: Longevity.LIGHT,
  "Very Strong": Longevity.VERY_STRONG,
};

const CATEGORY_DEFAULT_NOTES: Record<string, string[]> = {
  "Fresh & Citrus": [
    "Top: Bergamot, Lemon, Mandarin",
    "Heart: Neroli, Green Apple",
    "Base: Musk, Cedarwood",
  ],
  Woody: [
    "Top: Cardamom, Pink Pepper",
    "Heart: Cedarwood, Vetiver",
    "Base: Sandalwood, Patchouli, Amber",
  ],
  Gourmand: [
    "Top: Roasted Almond, Coffee",
    "Heart: Tonka Bean, Vanilla, Cocoa",
    "Base: Caramel, Sandalwood",
  ],
  Floral: [
    "Top: Jasmine, Rose Petals",
    "Heart: Lily of the Valley, Ylang-Ylang",
    "Base: White Musk, Cashmere Wood",
  ],
  "Oriental & Amber": [
    "Top: Saffron, Incense",
    "Heart: Amber, Cinnamon",
    "Base: Vanilla, Agarwood, Benzoin",
  ],
  "Oud & Rich Woods": [
    "Top: Smoky Woods, Nutmeg",
    "Heart: Cambodian Oud, Leather",
    "Base: Amberwood, Oakmoss",
  ],
  Leather: [
    "Top: Black Pepper, Thyme",
    "Heart: Tuscan Leather, Suede",
    "Base: Birch Tar, Amber",
  ],
  "Aromatic / Fougère": [
    "Top: Lavender, Mint",
    "Heart: Geranium, Sage",
    "Base: Tonka Bean, Oakmoss",
  ],
  Other: ["Top: Fresh Accord", "Heart: Floral Woody Accord", "Base: Soft Musk"],
  Unknown: ["Top: Citrus Accord", "Heart: Clean Woods", "Base: Amber"],
};

const GRADIENTS_BY_CATEGORY: Record<string, string[]> = {
  "Fresh & Citrus": [
    "from-amber-400/30 via-emerald-600/20 to-teal-950/90",
    "from-cyan-500/30 via-sky-600/20 to-slate-950/90",
    "from-lime-400/30 via-emerald-700/25 to-zinc-950/90",
  ],
  Woody: [
    "from-amber-800/40 via-yellow-900/30 to-stone-950/90",
    "from-stone-700/40 via-amber-950/40 to-black/90",
    "from-amber-700/35 via-zinc-800/40 to-stone-950/90",
  ],
  Gourmand: [
    "from-amber-600/35 via-rose-950/30 to-zinc-950/90",
    "from-orange-800/40 via-amber-950/40 to-black/90",
    "from-yellow-700/30 via-amber-900/30 to-stone-950/90",
  ],
  Floral: [
    "from-rose-500/30 via-pink-700/20 to-purple-950/90",
    "from-fuchsia-500/25 via-rose-800/25 to-zinc-950/90",
    "from-pink-400/30 via-violet-900/30 to-slate-950/90",
  ],
  "Oriental & Amber": [
    "from-amber-600/40 via-red-900/30 to-zinc-950/90",
    "from-orange-600/35 via-purple-950/40 to-black/90",
    "from-amber-700/40 via-rose-950/35 to-stone-950/90",
  ],
  "Oud & Rich Woods": [
    "from-purple-900/40 via-amber-950/40 to-black/95",
    "from-indigo-950/50 via-stone-900/40 to-zinc-950/95",
    "from-violet-900/35 via-slate-900/40 to-black/90",
  ],
  Leather: [
    "from-zinc-700/40 via-neutral-900/40 to-black/95",
    "from-amber-950/50 via-stone-900/40 to-black/90",
    "from-neutral-800/40 via-zinc-950/50 to-black/95",
  ],
  "Aromatic / Fougère": [
    "from-emerald-600/30 via-teal-900/30 to-zinc-950/90",
    "from-teal-500/30 via-cyan-900/30 to-slate-950/90",
    "from-green-600/25 via-emerald-950/35 to-zinc-950/90",
  ],
  Other: [
    "from-violet-600/30 via-purple-900/20 to-zinc-950/90",
    "from-indigo-500/25 via-slate-800/30 to-zinc-950/90",
  ],
  Unknown: [
    "from-zinc-600/30 via-zinc-800/25 to-zinc-950/90",
  ],
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function main() {
  const dataPath = path.join(process.cwd(), "output.json");
  const rawData: RawFragrance[] = JSON.parse(
    fs.readFileSync(dataPath, "utf-8"),
  );

  console.log(`Starting import of ${rawData.length} fragrances...`);

  // 1. Seed Brands
  const uniqueBrands = Array.from(
    new Set(rawData.map((item) => item.Brand.trim())),
  );
  console.log(`Seeding ${uniqueBrands.length} unique brands...`);

  for (const brandName of uniqueBrands) {
    await prisma.brand.upsert({
      where: { name: brandName },
      update: {},
      create: {
        name: brandName,
        slug: slugify(brandName),
      },
    });
  }

  const allBrands = await prisma.brand.findMany();
  const brandMap = new Map(allBrands.map((b) => [b.name, b.id]));

  console.log(`Seeding ${rawData.length} products...`);

  for (let i = 0; i < rawData.length; i++) {
    const item = rawData[i];
    const brandName = item.Brand.trim();
    const brandId = brandMap.get(brandName);
    const baseSlug = slugify(`${brandName}-${item.Title}`);
    const slug = `${baseSlug}-${i + 1}`;

    const notes =
      CATEGORY_DEFAULT_NOTES[item.Category] ||
      CATEGORY_DEFAULT_NOTES["Unknown"];

    // Dynamic realistic pricing based on type & brand
    const isExtraitOrParfum =
      item.Type.includes("Parfum") || item.Type.includes("Extrait") || item.Type === "Attar";
    const minPrice = isExtraitOrParfum ? 75 : 42;
    const maxPrice = isExtraitOrParfum ? 240 : 155;
    const price = Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice + 0.99;

    const rating = +(4.1 + Math.random() * 0.8).toFixed(1);
    const reviews = Math.floor(Math.random() * 150) + 12;

    const categoryGradients =
      GRADIENTS_BY_CATEGORY[item.Category] || GRADIENTS_BY_CATEGORY["Unknown"];
    const imageBg = categoryGradients[i % categoryGradients.length];

    const categoryEnum = CATEGORY_MAP[item.Category] || Category.UNKNOWN;
    const typeEnum = TYPE_MAP[item.Type] || PerfumeType.EDP;
    const genderEnum = GENDER_MAP[item.Gender] || Gender.UNISEX;
    const longevityEnum = LONGEVITY_MAP[item.Longevity] || Longevity.STRONG;

    await prisma.product.upsert({
      where: { slug },
      update: {
        brandId,
        brandName,
        category: categoryEnum,
        type: typeEnum,
        gender: genderEnum,
        longevity: longevityEnum,
      },
      create: {
        name: item.Title.trim(),
        slug,
        brandId,
        brandName,
        description: `A distinguished ${item.Gender.toLowerCase()} fragrance crafted by ${brandName}. Features an alluring ${item.Category.toLowerCase()} olfactory harmony with enduring ${item.Longevity.toLowerCase()} longevity.`,
        notes: JSON.stringify(notes),
        type: typeEnum,
        category: categoryEnum,
        gender: genderEnum,
        longevity: longevityEnum,
        imageBg,
        price,
        rating,
        reviews,
        stock: 50,
        status: ProductStatus.AVAILABLE,
      },
    });
  }

  const finalProductCount = await prisma.product.count();
  const finalBrandCount = await prisma.brand.count();

  console.log(
    `✅ Successfully seeded database! Total Brands: ${finalBrandCount}, Total Products: ${finalProductCount}`,
  );
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

