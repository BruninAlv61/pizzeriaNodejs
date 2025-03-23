import express from 'express'
import { SucursalesController } from '../controllers/sucursalesController.js'
import { SucursalesModel } from '../models/sucursalesModel.js'
const router = express.Router()

const sucursalesController = new SucursalesController({ sucursalesModel: SucursalesModel })

router.get('/', sucursalesController.getAll)
router.get('/add', (req, res) => {
  res.render('sucursales/sucursales-add')
})
router.post('/', sucursalesController.create)
router.get('/edit/:id', sucursalesController.renderEditForm)
router.patch('/:id', sucursalesController.update)
router.delete('/:id', sucursalesController.delete)

export default router
