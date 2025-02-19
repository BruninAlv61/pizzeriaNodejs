import { z } from 'zod'

export const menuSchema = z.object({
  nombreProducto: z.string().min(1, 'El nombre del producto es obligatorio'),
  categoria: z.enum(['pizza', 'hamburguesa', 'bebida', 'postre'], {
    errorMap: () => ({ message: 'Categoría inválida' })
  }),
  precio: z.union([
    z.string().transform((val) => Number(val)), // 🔥 Si viene como string, lo convierte a número
    z.number() // 🔥 Si ya es un número, lo acepta
  ]).refine((val) => !isNaN(val) && val >= 0, {
    message: 'El precio debe ser un número positivo'
  }),
  imagen: z.string().url('Debe ser una URL válida de imagen')
})

export const partialMenuSchema = menuSchema.partial()
