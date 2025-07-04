import { categoriesSchema, partialCategoriesSchema } from '../schemas/categories.js'
import { adminMiddleware } from '../middlewares/adminMiddleware.js'

export class CategoriesController {
  constructor ({ categoriesModel }) {
    this.categoriesModel = categoriesModel
  }

  getAll = async (req, res) => {
    const categories = await this.categoriesModel.getAll()
    res.render('categories/categories.hbs', { categories })
    adminMiddleware(req, res)
  }

  getById = async (req, res) => {
    adminMiddleware(req, res)
    try {
      const { id } = req.params
      const category = await this.categoriesModel.getById({ id })

      if (!category) {
        return res.status(404).json({ message: 'Category not found' })
      }

      res.json(category)
    } catch (error) {
      console.error('Error in getById:', error.message)
      return res.status(400).json({ message: 'Invalid ID or incorrect format' })
    }
  }

  create = async (req, res) => {
    adminMiddleware(req, res)
    const result = categoriesSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({ error: result.error.format() })
    }

    await this.categoriesModel.create({ input: result.data })
    res.redirect('/categories')
  }

  delete = async (req, res) => {
    adminMiddleware(req, res)
    const { id } = req.params

    const result = await this.categoriesModel.delete({ id })

    if (!result) {
      return res.status(404).json({ message: 'Category not found' })
    }

    return res.json({ message: 'Category deleted' })
  }

  update = async (req, res) => {
    adminMiddleware(req, res)
    const result = partialCategoriesSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({ error: result.error.format() })
    }

    const { id } = req.params
    const updatedCategory = await this.categoriesModel.update({ id, input: result.data })

    return res.json(updatedCategory)
  }

  renderEditForm = async (req, res) => {
    adminMiddleware(req, res)
    const { id } = req.params
    const category = await this.categoriesModel.getById({ id })

    if (!category) {
      return res.status(404).send('Category not found')
    }

    res.render('categories/categories-edit', { category, currentPath: req.path })
  }
}
