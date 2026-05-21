//tipo de display
export type Display = {
  size: number;
  resolution: string;
  graphics: string;
  brand: string;
};
//pantallas desde el api
export type DisplaysData = Display & {
  id: string;
};
