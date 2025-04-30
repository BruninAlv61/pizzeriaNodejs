import { validateCustomer, validatePartialCustomer } from '../schemas/customersSchema.js'
import { adminMiddleware } from '../middlewares/adminMiddleware.js'

export class CustomersController {
  constructor ({ customersModel }) {
    this.customersModel = customersModel
  }

  getAll = async (req, res) => {
    adminMiddleware(req, res)
    try {
      const customers = await this.customersModel.getAll()
      res.render('customers/customers', { customers })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  create = async (req, res) => {
    const validation = validateCustomer(req.body)

    if (!validation.success) {
      // Extract error messages
      const errors = validation.error.errors.map(error => ({
        field: error.path.join('.'),
        message: error.message
      }))

      return res.status(400).json({ errors })
    }

    try {
      const result = await this.customersModel.create({ input: validation.data })

      if (result) {
        res.redirect('/customers')
      } else {
        res.status(400).json({ error: 'Error creating customer' })
      }
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Email already exists' })
      }
      res.status(500).json({ error: error.message })
    }
  }

  renderEditForm = async (req, res) => {
    adminMiddleware(req, res)
    try {
      const { id } = req.params
      const customer = await this.customersModel.getById({ id })

      if (customer) {
        res.render('customers/customers-edit', { customer })
      } else {
        res.status(404).json({ error: 'Customer not found' })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  update = async (req, res) => {
    const validation = validatePartialCustomer(req.body)

    if (!validation.success) {
      // Extract error messages
      const errors = validation.error.errors.map(error => ({
        field: error.path.join('.'),
        message: error.message
      }))

      return res.status(400).json({ errors })
    }

    try {
      const { id } = req.params
      const result = await this.customersModel.update({ id, input: validation.data })

      if (result) {
        res.redirect('/customers')
      } else {
        res.status(404).json({ error: 'Customer not found' })
      }
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Email already exists' })
      }
      res.status(500).json({ error: error.message })
    }
  }

  delete = async (req, res) => {
    try {
      const { id } = req.params
      const result = await this.customersModel.delete({ id })

      if (result) {
        res.status(200).json({ message: 'Customer deleted successfully' })
      } else {
        res.status(404).json({ error: 'Customer not found' })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}
