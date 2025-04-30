import express from 'express'
import { PhysicalSalesController } from '../controllers/physicalSalesController.js'
import { PhysicalSalesModel } from '../models/physicalSalesModel.js'
import { CustomersModel } from '../models/customersModel.js'
import { BranchesModel } from '../models/branchesModel.js'
import { MenuModel } from '../models/menuModel.js'
import { ComboOffersModel } from '../models/comboOffersModel.js'

const router = express.Router()

const physicalSalesController = new PhysicalSalesController({
  physicalSalesModel: PhysicalSalesModel,
  customersModel: CustomersModel,
  branchesModel: BranchesModel,
  menuModel: MenuModel,
  comboOffersModel: ComboOffersModel
})

router.get('/', physicalSalesController.getAll)
router.get('/add', physicalSalesController.renderAddForm)
router.post('/', physicalSalesController.create)
router.get('/edit/:id', physicalSalesController.renderEditForm)
router.patch('/:id', physicalSalesController.update)
router.delete('/:id', physicalSalesController.delete)

export default router
