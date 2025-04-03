import express from 'express'
import { ComboOffersController } from '../controllers/comboOffersController.js' // Renombrado
import { ComboOffersModel } from '../models/comboOffersModel.js' // Renombrado

const router = express.Router()

const comboOffersController = new ComboOffersController({ comboOffersModel: ComboOffersModel }) // Renombrado

router.get('/', comboOffersController.getAll)
router.get('/add', (req, res) => {
  res.render('combo-offers/combo-offers-add') // Ruta corregida
})
router.get('/edit/:id', comboOffersController.renderEditForm)
router.post('/create', comboOffersController.create)
router.delete('/:id', comboOffersController.delete)
router.patch('/:id', comboOffersController.update)

export default router
