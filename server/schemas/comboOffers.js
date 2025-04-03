import { z } from 'zod'

const comboOffersSchema = z.object({
  comboOfferName: z.string().min(4).max(50, {
    message: 'The title must be between 4 and 50 characters long'
  }),
  comboOfferDescription: z.string().min(10).max(255, {
    message: 'The description must be between 10 and 255 characters long'
  }),
  comboOfferPrice: z.union([
    z.string().transform((val) => Number(val)),
    z.number()
  ]).refine((val) => !isNaN(val) && val >= 0, {
    message: 'The price must be a positive number'
  }),
  comboOfferImage: z.string().url('Must be a valid image URL')
})

export const validateComboOffers = (input) => {
  return comboOffersSchema.safeParse(input)
}

export const validateComboOffersPartial = (input) => {
  return comboOffersSchema.partial().safeParse(input)
}
