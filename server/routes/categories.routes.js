import express from 'express'
import { CategoriesController } from '../controllers/categoriesController.js'
import { CategoriesModel } from '../models/categoriesModel.js'

const router = express.Router()

const categoriesController = new CategoriesController({ categoriesModel: CategoriesModel })

router.get('/', categoriesController.getAll)

router.get('/add', (req, res) => {
  res.render('categories/categories-add')
})

router.post('/', categoriesController.create)
router.delete('/:id', categoriesController.delete)
router.patch('/:id', categoriesController.update)
router.get('/edit/:id', categoriesController.renderEditForm)
router.get('/:id', categoriesController.getById)

export default router
