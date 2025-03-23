import { validateSucursal, validatePartialSucursal } from '../schemas/sucursales.js'

export class SucursalesController {
  constructor ({ sucursalesModel }) {
    this.sucursalesModel = sucursalesModel
  }

  getAll = async (req, res) => {
    const sucursales = await this.sucursalesModel.getAll()
    res.render('sucursales/sucursales', { sucursales })
  }

  create = async (req, res) => {
    const result = validateSucursal(req.body)
    if (!result.success) {
      // 422 Unprocessable Entity
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    await this.sucursalesModel.create({ input: result.data })
    res.redirect('/sucursales')
  }

  renderEditForm = async (req, res) => {
    const { id } = req.params
    const sucursales = await this.sucursalesModel.getById({ id })
    res.render('sucursales/sucursales-edit', { sucursales, currentPath: req.path })
  }

  update = async (req, res) => {
    const result = validatePartialSucursal(req.body)
    if (!result.success) { res.status(400).json({ error: JSON.parse(result.error.message) }) }

    const { id } = req.params
    await this.sucursalesModel.update({ id, input: result.data })

    res.redirect('/sucursales')
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await this.sucursalesModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ message: 'Sucursal no encontrada' })
    }
    res.redirect('/sucursales')
  }
}
