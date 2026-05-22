export const wordBreaker = (text: string, words: number) => {
  return text.split(" ").slice(0, words).join(" ");
};
export const numberFormat = (num: number) => {
  return new Intl.NumberFormat("es-Co", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};
export const getDiscount = (price: number, discount: number) => {
  if (discount < 0 || discount > 100) {
    return price;
  }
  return price - (price * discount) / 100;
};
