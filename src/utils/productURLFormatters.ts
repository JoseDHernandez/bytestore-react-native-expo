export const productURL = (id: string, name: string) =>
  `${id}:${name.replaceAll(" ", "-")}`;
export const getProductIdFromURL = (url: string) =>
  decodeURIComponent(url).split(":")[0];
