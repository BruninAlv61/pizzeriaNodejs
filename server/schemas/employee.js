// server/schemas/employee.js
import { z } from 'zod'

export const employeeSchema = z.object({
  // Para el login, permitimos email o name
  employee_id: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6),

  // Campos adicionales solo requeridos para registro
  lastname: z.string().optional(),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  employee_branch: z.string().optional()
})
  .refine(data => data.name || data.email, {
    message: 'Either name or email is required',
    path: ['name']
  })

// Schema específico para registro que requiere todos los campos
export const employeeRegisterSchema = z.object({
  name: z.string().min(2),
  lastname: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone_number: z.string().min(6),
  address: z.string().min(6),
  employee_branch: z.string()
})
