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
