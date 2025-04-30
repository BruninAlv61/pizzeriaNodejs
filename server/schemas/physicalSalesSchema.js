import { z } from 'zod'

const physicalSalesSchema = z.object({
  customer_id: z.string().uuid({
    message: 'Invalid customer ID format'
  }).nullable().optional()
    .transform(val => val === '' ? null : val), // Transform empty string to null

  customer_phone: z.string().min(5, {
    message: 'Phone must have at least 5 characters'
  }).max(20, {
    message: 'Phone can have up to 20 characters'
  }).nullable().optional()
    .transform(val => val === '' ? null : val), // Transform empty string to null

  branch_id: z.string().uuid({
    message: 'Invalid branch ID format'
  }),

  total_price: z.number({
    required_error: 'Total price is required',
    invalid_type_error: 'Total price must be a number'
  }).positive({
    message: 'Total price must be a positive number'
  }),

  payment_method: z.string().min(2, {
    message: 'Payment method must have at least 2 characters'
  }).max(30, {
    message: 'Payment method can have up to 30 characters'
  }),

  items: z.array(
    z.object({
      id: z.string().uuid(),
      type: z.enum(['product', 'combo']),
      quantity: z.number().int().positive(),
      price: z.number().positive()
    })
  ).nonempty({
    message: 'At least one item is required'
  }),

  sale_date: z.string().optional()
})

export const validatePhysicalSale = (input) => {
  // Parse customer_phone and customer_id fields to ensure they're null if empty
  const preparedInput = {
    ...input,
    customer_id: input.customer_id === '' ? null : input.customer_id,
    customer_phone: input.customer_phone === '' ? null : input.customer_phone
  }

  return physicalSalesSchema.safeParse(preparedInput)
}

export const validatePartialPhysicalSale = (input) => {
  const preparedInput = {
    ...input,
    customer_id: input.customer_id === '' ? null : input.customer_id,
    customer_phone: input.customer_phone === '' ? null : input.customer_phone
  }
  return physicalSalesSchema.partial().safeParse(preparedInput)
}
