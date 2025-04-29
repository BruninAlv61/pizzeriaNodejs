import { validateOrder, validatePartialOrder } from '../schemas/ordersSchema.js'

export class OrdersController {
  constructor ({ ordersModel, customersModel, branchesModel, menuModel, comboOffersModel }) {
    this.ordersModel = ordersModel
    this.customersModel = customersModel
    this.branchesModel = branchesModel
    this.menuModel = menuModel
    this.comboOffersModel = comboOffersModel
  }

  getAll = async (req, res) => {
    try {
      const orders = await this.ordersModel.getAll()
      res.render('orders/orders', { orders })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  renderAddForm = async (req, res) => {
    try {
      const customers = await this.customersModel.getAll()
      const branches = await this.branchesModel.getAll()
      const products = await this.menuModel.getAll()
      const combos = await this.comboOffersModel.getAll()

      res.render('orders/orders-add', {
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
    try {
      // Parse items from JSON string
      const input = { ...req.body }

      if (typeof input.items === 'string') {
        input.items = JSON.parse(input.items)
      }

      // Convert price to number
      input.total_price = Number(input.total_price)

      // Add created_at
      input.created_at = new Date().toISOString()

      const validation = validateOrder(input)

      if (!validation.success) {
        const errors = validation.error.errors.map(error => ({
          field: error.path.join('.'),
          message: error.message
        }))

        return res.status(400).json({ errors })
      }

      const result = await this.ordersModel.create({ input: validation.data })

      if (result) {
        res.redirect('/orders')
      } else {
        res.status(400).json({ error: 'Error creating order' })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  renderEditForm = async (req, res) => {
    try {
      const { id } = req.params
      const order = await this.ordersModel.getById({ id })

      if (!order) {
        return res.status(404).json({ error: 'Order not found' })
      }

      const customers = await this.customersModel.getAll()
      const branches = await this.branchesModel.getAll()
      const products = await this.menuModel.getAll()
      const combos = await this.comboOffersModel.getAll()

      res.render('orders/orders-edit', {
        order,
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
    try {
      const { id } = req.params

      // Parse items from JSON string
      const input = { ...req.body }

      if (typeof input.items === 'string') {
        input.items = JSON.parse(input.items)
      }

      // Convert price to number
      input.total_price = Number(input.total_price)

      const validation = validatePartialOrder(input)

      if (!validation.success) {
        const errors = validation.error.errors.map(error => ({
          field: error.path.join('.'),
          message: error.message
        }))

        return res.status(400).json({ errors })
      }

      const result = await this.ordersModel.update({ id, input: validation.data })

      if (result) {
        res.redirect('/orders')
      } else {
        res.status(404).json({ error: 'Order not found' })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  delete = async (req, res) => {
    try {
      const { id } = req.params
      const result = await this.ordersModel.delete({ id })

      if (result) {
        res.status(200).json({ message: 'Order deleted successfully' })
      } else {
        res.status(404).json({ error: 'Order not found' })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}
