import { categoriesSchema, partialCategoriesSchema } from '../schemas/categories.js'

export class CategoriesController {
  constructor ({ categoriesModel }) {
    this.categoriesModel = categoriesModel
  }

  getAll = async (req, res) => {
    const categories = await this.categoriesModel.getAll()
    res.render('categories/categories.hbs', { categories })
  }

  getById = async (req, res) => {
    try {
      const { id } = req.params
      const category = await this.categoriesModel.getById({ id })

      if (!category) {
        return res.status(404).json({ message: 'Categoría no encontrada' })
      }

      res.json(category)
    } catch (error) {
      console.error('Error en getById:', error.message)
      return res.status(400).json({ message: 'ID inválido o formato incorrecto' })
    }
  }

  create = async (req, res) => {
    const result = categoriesSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({ error: result.error.format() })
    }

    await this.categoriesModel.create({ input: result.data })
    res.redirect('/categories')
  }

  delete = async (req, res) => {
    const { id } = req.params

    const result = await this.categoriesModel.delete({ id })

    if (!result) {
      return res.status(404).json({ message: 'Categoría no encontrada' })
    }

    return res.json({ message: 'Categoría eliminada' })
  }

  update = async (req, res) => {
    const result = partialCategoriesSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({ error: result.error.format() })
    }

    const { id } = req.params
    const updatedCategory = await this.categoriesModel.update({ id, input: result.data })

    return res.json(updatedCategory)
  }

  renderEditForm = async (req, res) => {
    const { id } = req.params
    const category = await this.categoriesModel.getById({ id })

    if (!category) {
      return res.status(404).send('Categoría no encontrada')
    }

    res.render('categories/categories-edit', { category, currentPath: req.path })
  }
}
