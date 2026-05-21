import { z } from "zod";
//Barra de búsqueda
export const searchSchema = z
  .string()
  .trim()
  .min(3)
  .max(30)
  .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]+$/);
