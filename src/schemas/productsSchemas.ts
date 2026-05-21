import { z } from "zod";
import { processorSchema } from "./processorSchemas";
import { displaySchema } from "./displaySchemas";
import { systemSchema } from "./systemSchema";
export const brandSchema = z
  .string()
  .trim()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(50, "El nombre no puede superar los 50 caracteres")
  .regex(
    /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-]+$/,
    "Solo se permiten letras, números, espacios y guiones"
  );

//Actualización de un producto
export const productUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5)
    .max(40)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-]+$/),
  model: z
    .string()
    .trim()
    .min(5)
    .max(36)
    .regex(/^[\w\d\-\/\\]+$/),
  price: z.number().gte(100000.0).lte(20000000.0),
  discount: z.number().positive().lte(90),
  ram_capacity: z.number().gte(8).lte(128),
  disk_capacity: z.number().gte(120).lte(10000),
  stock: z.int().positive(),
  description: z
    .string()
    .min(10)
    .max(1000)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\.\,\'\"\(\)\-\!\¡\;\:]+$/),
  processor_id: z.int().positive(),
  system_id: z.int().positive(),
  display_id: z.int().positive(),
  brand_id: z.int().positive(),
});
//crear producto
export const productRegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5)
    .max(40)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-]+$/),
  model: z
    .string()
    .trim()
    .min(5)
    .max(36)
    .regex(/^[\w\d\-\/\\]+$/),
  brand: brandSchema,
  stock: z.int().positive(),
  price: z.number().gte(100000.0).lte(20000000.0),
  discount: z.number().gte(0).lte(90),
  ram_capacity: z.number().gte(8).lte(128),
  disk_capacity: z.number().gte(120).lte(10000),
  image: z.string().regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\-\.]+$/),
  description: z
    .string()
    .min(10)
    .max(1000)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\.\,\'\"\(\)\-\!\¡\;\:]+$/),
  display: displaySchema,

  processor: processorSchema,

  system: systemSchema,
});
