import express from 'express'
import { UserController } from '../controllers/userController.js'
import { UserModel } from '../models/userModel.js'

const router = express.Router()

const userController = new UserController({ userModel: UserModel })

router.get('/', (req, res) => {
  res.render('login/login')
})

router.post('/', userController.login)

export default router
