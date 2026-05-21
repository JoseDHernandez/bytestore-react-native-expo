import { z } from "zod";
//esquema de display
export const displaySchema = z.object({
  size: z.number().gte(10.0).lte(20.0),
  resolution: z
    .string()
    .trim()
    .min(2)
    .max(10)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-]+$/),
  brand: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-]+$/),
  graphics: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-]+$/),
});
