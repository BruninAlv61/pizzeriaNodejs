import express from 'express'
import { UserController } from '../controllers/userController.js'
import { UserModel } from '../models/userModel.js'

const router = express.Router()

const userModel = new UserModel() // Instancia correcta
const userController = new UserController({ userModel }) // Pasamos la instancia

router.get('/', (req, res) => {
  res.render('login/login')
})

router.post('/', userController.login)

export default router
