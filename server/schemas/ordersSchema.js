import { z } from 'zod'

const ordersSchema = z.object({
  customer_id: z.string().uuid({
    message: 'Invalid customer ID format'
  }),

  branch_id: z.string().uuid({
    message: 'Invalid branch ID format'
  }),

  total_price: z.number({
    required_error: 'Total price is required',
    invalid_type_error: 'Total price must be a number'
  }).positive({
    message: 'Total price must be a positive number'
  }),

  order_status: z.string().min(2, {
    message: 'Status must have at least 2 characters'
  }).max(20, {
    message: 'Status can have up to 20 characters'
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

  created_at: z.string().optional()
})

export const validateOrder = (input) => {
  return ordersSchema.safeParse(input)
}

export const validatePartialOrder = (input) => {
  return ordersSchema.partial().safeParse(input)
}
