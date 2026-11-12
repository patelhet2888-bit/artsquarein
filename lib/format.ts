export const formatPrice = (price?: number) =>
  typeof price === "number"
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(price)
    : "Contact for Price";
