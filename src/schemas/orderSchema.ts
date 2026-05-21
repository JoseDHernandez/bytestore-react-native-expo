import z from "zod";
//esquema de orden
export const orderSchema = z.object({
  user_id: z.uuidv7().trim(),
  status: z
    .string()
    .trim()
    .min(5)
    .max(100)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\.\,\'\"]+$/),
  total: z.number().positive(),
  pay_date: z.iso.datetime().trim(),
  delivery_date: z.iso.datetime().trim(),
  products: z.array(
    z.object({
      id: z.number().gte(1),
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
      brand: z
        .string()
        .trim()
        .min(2)
        .max(10)
        .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-]+$/),
      stock: z.int().positive(),
      price: z.number().gte(100000.0).lte(20000000.0),
      discount: z.number().gte(0).lte(90),
      image: z.url().trim(),
      quantity: z.int().gte(1),
    })
  ),
});
