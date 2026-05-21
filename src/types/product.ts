import { Display } from "./display";
import type { Processor } from "./processor";
import { OperatingSystem } from "./system";

//Producto
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  image: string;
  brand: string;
  model: string;
  processor: Processor;
  system: OperatingSystem;
  ram_capacity: number;
  disk_capacity: number;
  display: Display;
};
//Productos paginados
export type ProductData = {
  total: number;
  pages: number;
  first: number;
  next: number | null;
  prev: number | null;
  data: Product[];
};
//Filtros/ marcas de productos
type Item = {
  name: string;
};
export type ProductFilters = {
  brands: Item[];
  processors: Item[];
  displays: Item[];
};
//actualizar producto
export type ProductUpdate = Omit<
  Product,
  "processor" | "system" | "display" | "image" | "brand" | "id"
> & {
  processor_id: number;
  system_id: number;
  display_id: number;
  brand_id: number;
};
//crear producto
export type NewProduct = Omit<Product, "id"> & {};
