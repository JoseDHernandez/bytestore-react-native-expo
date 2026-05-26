import { api } from "./axios";

import {
  NewProduct,
  PaginatedProducts,
  Product,
  ProductFilters,
  ProductUpdate,
} from "@/types/product";

export async function getProductById(id: string): Promise<Product | null> {
  const regex = /^[0-9]+$/;
  if (!regex.test(id)) return null;
  try {
    const res = await api.get<Product>(`/products/${id}/`);
    return res.data;
  } catch (error) {
    console.error(`Error obteniendo producto ${id}`, error);
    return null;
  }
}

export async function getProductsLimited(limit: number): Promise<Product[] | null> {
  try {
    const res = await api.get<PaginatedProducts>("/products/", { params: { limit } });
    return res.data.data;
  } catch (error) {
    console.error(`Error obteniendo ${limit} productos`, error);
    return null;
  }
}

export async function getProductsPaginatedAndLimited(
  page: number,
  limit: number,
): Promise<PaginatedProducts | null> {
  try {
    const res = await api.get<PaginatedProducts>("/products/", { params: { page, limit } });
    return res.data;
  } catch (error) {
    console.error(`Error obteniendo página ${page}`, error);
    return null;
  }
}

export async function deleteProductById(id: string): Promise<number> {
  try {
    const res = await api.delete(`/products/${id}/`);
    return res.status;
  } catch (error) {
    console.error(`Error eliminando producto ${id}`, error);
    return 400;
  }
}

type GetProductsBySearchParams = {
  query?: string;
  numberPage?: number;
  sort?: string;
  order?: "asc" | "desc";
  limit?: number;
  brand?: string;
  processor?: string;
  display?: string;
};

export async function getProductsBySearch({
  query,
  numberPage,
  sort,
  order,
  limit,
  brand,
  processor,
  display,
}: GetProductsBySearchParams): Promise<PaginatedProducts | null> {
  const params: Record<string, string | number> = {};

  if (query) params.search = query;
  if (numberPage) params.page = numberPage;

  params.limit = limit && limit >= 10 && limit <= 100 ? limit : 11;

  if (sort) params.sort = `order_${sort}`;
  if (order) params.order = order === "asc" ? "asc" : "desc";

  // Filtros de marca, procesador y pantalla
  if (brand) params.brand = brand;
  if (processor) params.processor = processor;
  if (display) params.display = display;

  try {
    const res = await api.get<PaginatedProducts>("/products/", { params });
    return res.data;
  } catch (error) {
    console.error("Error buscando productos", error);
    return null;
  }
}

export async function getProductFilters(): Promise<ProductFilters | null> {
  try {
    const res = await api.get<ProductFilters>("/products/filters/");
    return res.data;
  } catch (error) {
    console.error("Error obteniendo filtros", error);
    return null;
  }
}

export async function updateProductById(
  id: string,
  product: ProductUpdate,
): Promise<number> {
  try {
    const res = await api.put(`/products/${id}/`, product);
    return res.status;
  } catch (error) {
    console.error(`Error actualizando producto ${id}`, error);
    return 400;
  }
}

export async function createProduct(product: NewProduct): Promise<number> {
  try {
    const res = await api.post("/products/", product);
    return res.status;
  } catch (error) {
    console.error("Error creando producto", error);
    return 400;
  }
}