import { z } from 'zod'

export const menuSchema = z.object({
  product_id: z.string().optional(), // Esto es opcional porque se genera automáticamente
  product_name: z.string().min(1, 'El nombre del producto es obligatorio'),
  product_description: z.string().min(1, 'La descripción del producto es obligatoria'),
  product_price: z.union([
    z.string().transform(val => Number(val)),
    z.number()
  ]).refine(val => !isNaN(val) && val >= 0, {
    message: 'El precio debe ser un número positivo'
  }),
  product_image: z.string().url('Debe ser una URL válida de imagen'),
  category_id: z.string().min(1, 'La categoría es obligatoria')
})

export const partialMenuSchema = menuSchema.partial()
