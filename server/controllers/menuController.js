import { menuSchema, partialMenuSchema } from '../schemas/menu.js'

export class MenuController {
  constructor ({ menuModel, categoriesModel }) { // Added categoriesModel
    this.menuModel = menuModel
    this.categoriesModel = categoriesModel
  }

  renderAddForm = async (req, res) => {
    const categories = await this.categoriesModel.getAll() // Get all categories
    res.render('menu/menu-add', { categories }) // Pass them to the view
  }

  getAll = async (req, res) => {
    const { category } = req.query
    const products = await this.menuModel.getAll({ category })
    res.render('menu/menu.hbs', { products })
  }

  getById = async (req, res) => {
    try {
      const { id } = req.params
      const product = await this.menuModel.getById({ id })

      if (!product) {
        return res.status(404).json({ message: 'Product not found' })
      }

      res.json(product)
    } catch (error) {
      console.error('Error in getById:', error.message)
      return res.status(400).json({ message: 'Invalid ID or incorrect format' })
    }
  }

  create = async (req, res) => {
    const result = menuSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({ error: result.error.format() })
    }

    await this.menuModel.create({ input: result.data })
    res.redirect('/menu')
  }

  delete = async (req, res) => {
    const { id } = req.params

    const result = await this.menuModel.delete({ id })

    if (!result) {
      return res.status(404).json({ message: 'Product not found' })
    }

    return res.json({ message: 'Product deleted' })
  }

  update = async (req, res) => {
    const result = partialMenuSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({ error: result.error.format() })
    }

    const { id } = req.params
    const updatedProduct = await this.menuModel.update({ id, input: result.data })

    return res.json(updatedProduct)
  }

  renderEditForm = async (req, res) => {
    const { id } = req.params
    const product = await this.menuModel.getById({ id })

    if (!product) {
      return res.status(404).send('Product not found')
    }

    res.render('menu/menu-edit', { product, currentPath: req.path })
  }
}
