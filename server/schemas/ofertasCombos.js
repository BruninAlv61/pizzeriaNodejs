import { z } from 'zod'

const ofertasCombosSchema = z.object({
  nombreOfertaCombo: z.string().min(4).max(50, {
    message: 'EL título debe tener entre 4 y 50 caracteres'
  }),
  descripcionOfertaCombo: z.string().min(10).max(255, {
    message: 'La descripción debe tener entre 10 y 255 caracteres'
  }),
  precioOfertaCombo: z.union([
    z.string().transform((val) => Number(val)),
    z.number()
  ]).refine((val) => !isNaN(val) && val >= 0, {
    message: 'El precio debe ser un número positivo'
  }),
  portadaOfertaCombo: z.string().url('Debe ser una URL válida de imagen')
})

export const validateOfertasCombos = (input) => {
  return ofertasCombosSchema.safeParse(input)
}

export const validateOfertasCombosPartial = (input) => {
  return ofertasCombosSchema.partial().safeParse(input)
}
