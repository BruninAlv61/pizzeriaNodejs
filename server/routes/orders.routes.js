import express from 'express'
import { OrdersController } from '../controllers/ordersController.js'
import { OrdersModel } from '../models/ordersModel.js'
import { CustomersModel } from '../models/customersModel.js'
import { BranchesModel } from '../models/branchesModel.js'
import { MenuModel } from '../models/menuModel.js'
import { ComboOffersModel } from '../models/comboOffersModel.js'

const router = express.Router()

const ordersController = new OrdersController({
  ordersModel: OrdersModel,
  customersModel: CustomersModel,
  branchesModel: BranchesModel,
  menuModel: MenuModel,
  comboOffersModel: ComboOffersModel
})

router.get('/', ordersController.getAll)
router.get('/add', ordersController.renderAddForm)
router.post('/', ordersController.create)
router.get('/edit/:id', ordersController.renderEditForm)
router.patch('/:id', ordersController.update)
router.delete('/:id', ordersController.delete)

export default router
