import { z } from 'zod'

export const menuSchema = z.object({
  productName: z.string().min(1, 'The product name is required'),
  category: z.string().min(1, 'The category is required'),
  price: z.union([
    z.string().transform((val) => Number(val)),
    z.number()
  ]).refine((val) => !isNaN(val) && val >= 0, {
    message: 'The price must be a positive number'
  }),
  image: z.string().url('Must be a valid image URL')
})

export const partialMenuSchema = menuSchema.partial()
