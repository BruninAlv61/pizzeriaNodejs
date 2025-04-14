import { z } from 'zod'

export const categoriesSchema = z.object({
  category_name: z.string().min(1, 'The category name is required'),
  category_description: z.string().min(1, 'The category description is required'),
  category_image: z.string().url('Must be a valid image URL')
})

export const partialCategoriesSchema = categoriesSchema.partial()
