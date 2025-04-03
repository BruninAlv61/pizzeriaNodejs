import { validateComboOffers, validateComboOffersPartial } from '../schemas/comboOffers.js'

export class ComboOffersController {
  constructor ({ comboOffersModel }) {
    this.comboOffersModel = comboOffersModel
  }

  getAll = async (req, res) => {
    const comboOffers = await this.comboOffersModel.getAll()
    res.render('combo-offers/combo-offers.hbs', { comboOffers })
  }

  create = async (req, res) => {
    const result = validateComboOffers(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    await this.comboOffersModel.create({ input: result.data })
    res.redirect('/combo-offers')
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await this.comboOffersModel.delete({ id })

    if (!result) {
      return res.status(404).json({ message: 'Combo offer not found' })
    }
    res.redirect('/combo-offers')
  }

  update = async (req, res) => {
    const result = validateComboOffersPartial(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    await this.comboOffersModel.update({ id, input: result.data })

    res.redirect('/combo-offers')
  }

  renderEditForm = async (req, res) => {
    const { id } = req.params
    const comboOffer = await this.comboOffersModel.getById({ id })

    if (!comboOffer) {
      return res.status(404).send('Combo offer not found')
    }

    res.render('combo-offers/combo-offers-edit', { comboOffer, currentPath: req.path })
  }
}
