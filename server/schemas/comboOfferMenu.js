import { z } from 'zod'

const comboOfferMenuItemSchema = z.object({
  product_id: z.string().min(1, {
    message: 'Product ID is required'
  }),
  quantity: z.union([
    z.string().transform((val) => Number(val)),
    z.number()
  ]).refine((val) => Number.isInteger(val) && val > 0, {
    message: 'Quantity must be a positive integer'
  })
})

const comboOfferMenuSchema = z.array(comboOfferMenuItemSchema).min(1, {
  message: 'You must include at least one product in the combo'
})

export const validateComboOfferMenu = (input) => {
  return comboOfferMenuSchema.safeParse(input)
}
