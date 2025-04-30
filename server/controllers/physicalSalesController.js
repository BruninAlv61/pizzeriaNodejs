import { validatePhysicalSale, validatePartialPhysicalSale } from '../schemas/physicalSalesSchema.js'
import { adminMiddleware } from '../middlewares/adminMiddleware.js'

export class PhysicalSalesController {
  constructor ({ physicalSalesModel, customersModel, branchesModel, menuModel, comboOffersModel }) {
    this.physicalSalesModel = physicalSalesModel
    this.customersModel = customersModel
    this.branchesModel = branchesModel
    this.menuModel = menuModel
    this.comboOffersModel = comboOffersModel
  }

  getAll = async (req, res) => {
    adminMiddleware(req, res)
    try {
      const sales = await this.physicalSalesModel.getAll()
      res.render('physical-sales/physical-sales', { sales })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  renderAddForm = async (req, res) => {
    adminMiddleware(req, res)
    try {
      const customers = await this.customersModel.getAll()
      const branches = await this.branchesModel.getAll()
      const products = await this.menuModel.getAll()
      const combos = await this.comboOffersModel.getAll()

      res.render('physical-sales/physical-sales-add', {
        customers,
        branches,
        products,
        combos
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  create = async (req, res) => {
    adminMiddleware(req, res)
    try {
      // Parse items from JSON string
      const input = { ...req.body }

      if (typeof input.items === 'string') {
        input.items = JSON.parse(input.items)
      }

      // Convert price to number
      input.total_price = Number(input.total_price)

      // Add sale_date
      input.sale_date = new Date().toISOString()

      const validation = validatePhysicalSale(input)

      if (!validation.success) {
        const errors = validation.error.errors.map(error => ({
          field: error.path.join('.'),
          message: error.message
        }))

        return res.status(400).json({ errors })
      }

      const result = await this.physicalSalesModel.create({ input: validation.data })

      if (result) {
        res.redirect('/physical-sales')
      } else {
        res.status(400).json({ error: 'Error creating physical sale' })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  renderEditForm = async (req, res) => {
    adminMiddleware(req, res)
    try {
      const { id } = req.params
      const sale = await this.physicalSalesModel.getById({ id })

      if (!sale) {
        return res.status(404).json({ error: 'Physical sale not found' })
      }

      const customers = await this.customersModel.getAll()
      const branches = await this.branchesModel.getAll()
      const products = await this.menuModel.getAll()
      const combos = await this.comboOffersModel.getAll()

      res.render('physical-sales/physical-sales-edit', {
        sale,
        customers,
        branches,
        products,
        combos
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  update = async (req, res) => {
    adminMiddleware(req, res)
    try {
      const { id } = req.params

      // Parse items from JSON string
      const input = { ...req.body }

      if (typeof input.items === 'string') {
        input.items = JSON.parse(input.items)
      }

      // Convert price to number
      input.total_price = Number(input.total_price)

      const validation = validatePartialPhysicalSale(input)

      if (!validation.success) {
        const errors = validation.error.errors.map(error => ({
          field: error.path.join('.'),
          message: error.message
        }))

        return res.status(400).json({ errors })
      }

      const result = await this.physicalSalesModel.update({ id, input: validation.data })

      if (result) {
        res.redirect('/physical-sales')
      } else {
        res.status(404).json({ error: 'Physical sale not found' })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  delete = async (req, res) => {
    adminMiddleware(req, res)
    try {
      const { id } = req.params
      const result = await this.physicalSalesModel.delete({ id })

      if (result) {
        res.status(200).json({ message: 'Physical sale deleted successfully' })
      } else {
        res.status(404).json({ error: 'Physical sale not found' })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}
