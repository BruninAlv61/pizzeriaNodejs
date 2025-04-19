import express from 'express'
import { ComboOffersController } from '../controllers/comboOffersController.js' // Renombrado
import { ComboOffersModel } from '../models/comboOffersModel.js'
import { MenuModel } from '../models/menuModel.js' // Renombrado

const router = express.Router()

const comboOffersController = new ComboOffersController({
  comboOffersModel: ComboOffersModel,
  menuModel: MenuModel
})

router.get('/', comboOffersController.getAll)
router.get('/add', comboOffersController.getAddComboOfferPage)
router.get('/edit/:id', comboOffersController.renderEditForm)
router.post('/', comboOffersController.create)
router.delete('/:id', comboOffersController.delete)
router.patch('/:id', comboOffersController.update)

export default router
