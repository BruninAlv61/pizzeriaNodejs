import { z } from 'zod'

export const adminSchema = z.object({
  admin_name: z
    .string()
    .min(4, 'admin_name must be at least 4 characters long'),

  /*  ""  ▸ OK  |  "texto@dom.com" ▸ OK  |  otro valor ▸ error */
  email: z
    .string()
    .transform((v) => v.trim()) // quitamos espacios
    .refine(
      (v) => v === '' || z.string().email().safeParse(v).success,
      { message: 'Must be a valid e‑mail address' }
    ),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
})
