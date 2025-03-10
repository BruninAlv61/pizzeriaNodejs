import express from 'express'
import { MenuController } from '../controllers/menuController.js'
import { MenuModel } from '../models/menuModel.js'
import { CategoriesModel } from '../models/categoriesModel.js'

const router = express.Router()
const menuController = new MenuController({ menuModel: MenuModel, categoriesModel: CategoriesModel }) // Agregamos categoriesModel

router.get('/', menuController.getAll)

router.get('/menu-add', menuController.renderAddForm)

router.get('/:id', menuController.getById)

router.get('/edit/:id', menuController.renderEditForm)

router.post('/', menuController.create)

router.delete('/:id', menuController.delete)

router.patch('/:id', menuController.update)

export default router
