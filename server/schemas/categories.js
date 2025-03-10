import { z } from 'zod'

export const categoriesSchema = z.object({
  nombreCategoria: z.string().min(1, 'El nombre del producto es obligatorio'),
  portadaCategoria: z.string().url('Debe ser una URL válida de imagen')
})

export const partialCategoriesSchema = categoriesSchema.partial()
