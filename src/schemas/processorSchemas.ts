import z from "zod";

export const processorSchema = z.object({
  brand: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-]+$/),
  family: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-]+$/),
  model: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-]+$/),
  cores: z.number().int().gte(4).lte(64),
  speed: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\.\,\-\)\(\\\/]+$/),
});
