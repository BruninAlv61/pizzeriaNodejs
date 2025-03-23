import { z } from 'zod'

const sucursalesSchema = z.object({
  nombreSucursal: z.string().min(4, {
    message: 'minimo de 4 caracteres en el nombre de la sucursal'
  }).max(50, {
    message: 'solo se permiten 50 caracteres en el nombre de la sucursal'
  }),
  direccion: z.string().min(4, {
    message: 'minimo de 4 caracteres en la direccion'
  }).max(140, {
    message: 'dirección demasiado larga, se permiten hasta 140 caracteres'
  }),
  telefono: z
    .string()
    .regex(/^\d+$/, { message: 'El teléfono debe contener solo dígitos' })
    .min(8, { message: 'El teléfono debe tener al menos 8 dígitos' })
    .max(15, { message: 'El teléfono no puede tener más de 15 dígitos' }),
  horarios: z.string().min(4, {
    message: 'minimo de 4 caracteres en los horarios'
  }).max(140, {
    message: 'horarios demasiado largos, se permiten hasta 140 caracteres'
  })
})

export const validateSucursal = (input) => {
  return sucursalesSchema.safeParse(input)
}

export const validatePartialSucursal = (input) => {
  return sucursalesSchema.partial().safeParse(input)
}
