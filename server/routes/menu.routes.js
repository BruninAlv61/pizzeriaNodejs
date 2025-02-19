import express from 'express'
import { MenuController } from '../controllers/menuController.js'
import { MenuModel } from '../models/menuModel.js'

const router = express.Router()
const menuController = new MenuController({ menuModel: MenuModel })

router.get('/', menuController.getAll)
router.get('/menu-add', (req, res) => {
  res.render('menu/menu-add')
})
router.get('/:id', menuController.getById)
router.post('/', menuController.create)
router.delete('/:id', menuController.delete)
router.patch('/:id', menuController.update)

export default router
