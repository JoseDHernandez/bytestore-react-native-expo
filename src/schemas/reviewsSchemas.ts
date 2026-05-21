import { z } from "zod";
//Formulario de comentario
export const reviewSchema = z.object({
  product_id: z.uuidv7(),
  user_name: z
    .string()
    .min(5)
    .max(50)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]+$/),
  qualification: z.number().max(5),
  comment: z
    .string()
    .min(10)
    .max(1000)
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\.\,\'\"\(\)]+$/),
  date: z.date(),
});
