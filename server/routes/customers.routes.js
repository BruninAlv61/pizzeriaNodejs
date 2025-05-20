import express from 'express'
import { CustomersController } from '../controllers/customersController.js'
import { CustomersModel } from '../models/customersModel.js'

const router = express.Router()

const customersController = new CustomersController({ customersModel: CustomersModel })

router.get('/', customersController.getAll)
router.get('/add', (req, res) => {
  res.render('customers/customers-add')
})
router.post('/', customersController.create)
router.get('/edit/:id', customersController.renderEditForm)
router.patch('/:id', customersController.update)
router.delete('/:id', customersController.delete)

router.get('/check-session', customersController.checkSession)

export default router
