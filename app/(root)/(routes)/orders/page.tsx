import OrdersClient from "./OrdersClient";

export const metadata = {
  title: "Order History - Elegant Essence",
  description: "Track your current shipments and view past purchases.",
};

export default function OrderHistoryPage() {
  return <OrdersClient />;
}
