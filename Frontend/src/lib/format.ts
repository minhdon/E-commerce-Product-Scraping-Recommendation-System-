export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const formatSold = (count: number) => {
  if (typeof count !== "number") return "0 đã bán";
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(".0", "")}k đã bán`;
  }
  return `${count} đã bán`;
};
