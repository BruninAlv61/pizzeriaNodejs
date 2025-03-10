import { z } from 'zod'

export const menuSchema = z.object({
  nombreProducto: z.string().min(1, 'El nombre del producto es obligatorio'),
  categoria: z.string().min(1, 'La categoría es obligatoria'),
  precio: z.union([
    z.string().transform((val) => Number(val)),
    z.number()
  ]).refine((val) => !isNaN(val) && val >= 0, {
    message: 'El precio debe ser un número positivo'
  }),
  imagen: z.string().url('Debe ser una URL válida de imagen')
})

export const partialMenuSchema = menuSchema.partial()
