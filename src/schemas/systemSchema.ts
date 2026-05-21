import z from "zod";
//sistema operativo
export const systemSchema = z.object({
  system: z
    .string()
    .trim()
    .min(3, "El sistema debe tener mínimo 3 caracteres")
    .max(30, "El sistema no puede exceder 30 caracteres")
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-]+$/, "Datos inválidos"),
  distribution: z
    .string()
    .trim()
    .min(3, "La distribución debe tener mínimo 3 caracteres")
    .max(30, "La distribución no puede exceder 30 caracteres")
    .regex(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-]+$/, "Datos inválidos"),
});
