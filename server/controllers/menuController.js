import { menuSchema, partialMenuSchema } from '../schemas/menu.js'

export class MenuController {
  constructor ({ menuModel }) {
    this.menuModel = menuModel
  }

  getAll = async (req, res) => {
    const { categoria } = req.query
    const productos = await this.menuModel.getAll({ categoria })
    res.json(productos)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const producto = await this.menuModel.getById({ id })
    if (producto) return res.json(producto)
    res.status(404).json({ message: 'Producto no encontrado' })
  }

  create = async (req, res) => {
    const result = menuSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({ error: result.error.format() })
    }

    const nuevoProducto = await this.menuModel.create({ input: result.data })
    res.status(201).json(nuevoProducto)
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
}
