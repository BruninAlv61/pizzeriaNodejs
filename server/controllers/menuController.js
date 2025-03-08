import { menuSchema, partialMenuSchema } from '../schemas/menu.js'

export class MenuController {
  constructor ({ menuModel }) {
    this.menuModel = menuModel
  }

  getAll = async (req, res) => {
    const { categoria } = req.query
    const productos = await this.menuModel.getAll({ categoria })
    res.render('menu/menu.hbs', { productos })
  }

  getById = async (req, res) => {
    try {
      const { id } = req.params
      const producto = await this.menuModel.getById({ id })

      if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado' })
      }

      res.json(producto)
    } catch (error) {
      console.error('Error en getById:', error.message)
      return res.status(400).json({ message: 'ID inválido o formato incorrecto' })
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
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    return res.json({ message: 'Producto eliminado' })
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
    const producto = await this.menuModel.getById({ id })

    if (!producto) {
      return res.status(404).send('Producto no encontrado')
    }

    res.render('menu/menu-edit', { producto, currentPath: req.path })
  }
}
