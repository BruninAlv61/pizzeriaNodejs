import { validateComboOffers, validateComboOffersPartial } from '../schemas/comboOffers.js'

export class ComboOffersController {
  constructor ({ comboOffersModel, menuModel }) {
    this.comboOffersModel = comboOffersModel
    this.menuModel = menuModel
  }

  getAll = async (req, res) => {
    const comboOffers = await this.comboOffersModel.getAll()
    res.render('combo-offers/combo-offers.hbs', { comboOffers })
  }

  getAddComboOfferPage = async (req, res) => {
    try {
      const categoryId = req.query.categoryId // Si tienes un parámetro de query categoryId
      const menu = await this.menuModel.getAll({ categoryId }) // Pasar categoryId como objeto
      res.render('combo-offers/combo-offers-add', { products: menu }) // Pasar los productos a la vista
    } catch (error) {
      console.error('Error al obtener los productos:', error)
      res.status(500).send('Error al obtener los productos')
    }
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

    const menu = await this.menuModel.getAll()

    res.render('combo-offers/combo-offers-edit', {
      comboOffer,
      menu,
      currentPath: req.path
    })
  }
}
