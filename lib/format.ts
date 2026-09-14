export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("mm-MM", {
    style: "currency",
    currency: "MMK",
  }).format(amount);
}

export function formatStock(stock: number): string {
  if (stock === 0) {
    return "0 units";
  }
  return `${stock} unit${stock === 1 ? "" : "s"}`;
}

const CATEGORY_LABELS: Record<string, string> = {
  FRESH_CITRUS: "Fresh & Citrus",
  "Fresh & Citrus": "Fresh & Citrus",
  WOODY: "Woody",
  Woody: "Woody",
  GOURMAND: "Gourmand",
  Gourmand: "Gourmand",
  FLORAL: "Floral",
  Floral: "Floral",
  ORIENTAL_AMBER: "Oriental & Amber",
  "Oriental & Amber": "Oriental & Amber",
  OUD_RICH_WOODS: "Oud & Rich Woods",
  "Oud & Rich Woods": "Oud & Rich Woods",
  LEATHER: "Leather",
  Leather: "Leather",
  AROMATIC_FOUGERE: "Aromatic / Fougère",
  "Aromatic / Fougère": "Aromatic / Fougère",
  OTHER: "Other",
  Other: "Other",
  UNKNOWN: "Essence",
  Unknown: "Essence",
};

export function formatCategory(cat: string | undefined): string {
  if (!cat) return "Fragrance";
  return CATEGORY_LABELS[cat] || cat.replace(/_/g, " ");
}

const TYPE_LABELS: Record<string, string> = {
  EXTRAIT_DE_PARFUM: "Extrait de Parfum",
  ALCOHOL_FREE: "Alcohol-free",
};

export function formatPerfumeType(type: string | undefined): string {
  if (!type) return "EDP";
  return TYPE_LABELS[type] || type.replace(/_/g, " ");
}
