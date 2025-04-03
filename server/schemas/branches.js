import { z } from 'zod'

const branchesSchema = z.object({
  branchName: z.string().min(4, {
    message: 'Minimum of 4 characters required for the branch name'
  }).max(50, {
    message: 'Branch name can have up to 50 characters'
  }),
  address: z.string().min(4, {
    message: 'Minimum of 4 characters required for the address'
  }).max(140, {
    message: 'Address too long, maximum of 140 characters allowed'
  }),
  phone: z
    .string()
    .regex(/^\d+$/, { message: 'Phone number must contain only digits' })
    .min(8, { message: 'Phone number must have at least 8 digits' })
    .max(15, { message: 'Phone number cannot exceed 15 digits' }),
  schedule: z.string().min(4, {
    message: 'Minimum of 4 characters required for the schedule'
  }).max(140, {
    message: 'Schedule too long, maximum of 140 characters allowed'
  })
})

export const validateBranch = (input) => {
  return branchesSchema.safeParse(input)
}

export const validatePartialBranch = (input) => {
  return branchesSchema.partial().safeParse(input)
}
