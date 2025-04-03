import { z } from 'zod'

export const categoriesSchema = z.object({
  categoryName: z.string().min(1, 'The category name is required'),
  categoryCover: z.string().url('Must be a valid image URL')
})

export const partialCategoriesSchema = categoriesSchema.partial()
