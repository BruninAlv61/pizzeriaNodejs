import { validateOfertasCombos, validateOfertasCombosPartial } from '../schemas/ofertasCombos.js'

export class OfertasCombosController {
  constructor ({ ofertasCombosModel }) {
    this.ofertasCombosModel = ofertasCombosModel
  }

  getAll = async (req, res) => {
    const ofertasCombos = await this.ofertasCombosModel.getAll()
    res.render('ofertas-combos/ofertas-combos.hbs', { ofertasCombos })
  }

  create = async (req, res) => {
    const result = validateOfertasCombos(req.body)
    if (!result.success) {
      // 422 Unprocessable Entity
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    await this.ofertasCombosModel.create({ input: result.data })

    res.redirect('/ofertas-combos')
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await this.ofertasCombosModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ message: 'Oferta/Combo no encontrada' })
    }
    res.redirect('/ofertas-combos')
  }

  update = async (req, res) => {
    const result = validateOfertasCombosPartial(req.body)
    if (!result.success) { res.status(400).json({ error: JSON.parse(result.error.message) }) }

    const { id } = req.params
    await this.ofertasCombosModel.update({ id, input: result.data })

    res.redirect('/ofertas-combos')
  }

  renderEditForm = async (req, res) => {
    const { id } = req.params
    const ofertaCombo = await this.ofertasCombosModel.getById({ id })

    if (!ofertaCombo) {
      return res.status(404).send('Oferta/Combo no encontrada')
    }

    res.render('ofertas-combos/ofertas-combos-edit', { ofertaCombo, currentPath: req.path })
  }
}
