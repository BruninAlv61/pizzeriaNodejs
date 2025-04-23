import express from 'express'
import { AdminController } from '../controllers/adminController.js'
import { AdminModel } from '../models/adminModel.js'

const router = express.Router()

const adminController = new AdminController({ adminModel: AdminModel }) // Passing the instance

router.get('/', (req, res) => {
  res.render('register/register')
})

router.post('/', adminController.register)

export default router
