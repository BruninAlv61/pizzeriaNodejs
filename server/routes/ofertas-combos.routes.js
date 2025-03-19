import express from 'express'
import { OfertasCombosController } from '../controllers/ofertasCombosController.js'
import { OfertasCombosModel } from '../models/ofertasCombosModel.js'

const router = express.Router()

const ofertasCombosController = new OfertasCombosController({ ofertasCombosModel: OfertasCombosModel })

router.get('/', ofertasCombosController.getAll)
router.get('/add', (req, res) => {
  res.render('ofertas-combos/ofertas-combos-add')
})
router.get('/edit/:id', ofertasCombosController.renderEditForm)
router.post('/create', ofertasCombosController.create)
router.delete('/:id', ofertasCombosController.delete)
router.patch('/:id', ofertasCombosController.update)
export default router
