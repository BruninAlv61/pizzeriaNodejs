import { z } from 'zod'

const comboOffersSchema = z.object({
  combo_offers_name: z.string().min(4).max(50, {
    message: 'The title must be between 4 and 50 characters long'
  }),
  description: z.string().min(10).max(255, {
    message: 'The description must be between 10 and 255 characters long'
  }),
  price: z.union([
    z.string().transform((val) => Number(val)),
    z.number()
  ]).refine((val) => !isNaN(val) && val >= 0, {
    message: 'The price must be a positive number'
  }),
  combo_offers_image: z.string().url('Must be a valid image URL'),
  products: z
    .string()
    .nonempty({ message: 'Products must not be empty' })
    .transform((val) => {
      const parsed = JSON.parse(val)
      if (!Array.isArray(parsed)) {
        throw new Error('Products must be an array')
      }
      return parsed
    })
    .refine((arr) =>
      arr.every(
        (item) =>
          typeof item.id === 'string' &&
          item.id.length > 0 &&
          typeof item.quantity === 'number' &&
          item.quantity > 0
      ),
    { message: 'Each product must have an id and quantity > 0' })
})

export const validateComboOffers = (input) => {
  return comboOffersSchema.safeParse(input)
}

export const validateComboOffersPartial = (input) => {
  return comboOffersSchema.partial().safeParse(input)
}
