import { z } from 'zod'

const customersSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must have at least 2 characters'
  }).max(50, {
    message: 'Name can have up to 50 characters'
  }),

  lastname: z.string().min(2, {
    message: 'Lastname must have at least 2 characters'
  }).max(50, {
    message: 'Lastname can have up to 50 characters'
  }),

  email: z.string().email({
    message: 'Invalid email format'
  }).max(100, {
    message: 'Email can have up to 100 characters'
  }),

  password: z.string().min(6, {
    message: 'Password must have at least 6 characters'
  }).max(100, {
    message: 'Password can have up to 100 characters'
  }),

  phone_number: z
    .string()
    .regex(/^\d+$/, { message: 'Phone number must contain only digits' })
    .min(8, { message: 'Phone number must have at least 8 digits' })
    .max(15, { message: 'Phone number cannot exceed 15 digits' })
    .optional()
    .nullable()
})

export const validateCustomer = (input) => {
  return customersSchema.safeParse(input)
}

export const validatePartialCustomer = (input) => {
  return customersSchema.partial().safeParse(input)
}
