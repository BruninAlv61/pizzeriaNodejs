import { validateCustomer, validatePartialCustomer } from '../schemas/customersSchema.js'
import { adminMiddleware } from '../middlewares/adminMiddleware.js'
import { setCustomerAuthCookie } from '../jwt/auth.js'

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
    const { user } = req.session || {}

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

      if (!result) return res.status(400).json({ error: 'Error creating customer' })

      if (user?.type === 'admin') return res.redirect('/customers')

      // Establecer la cookie de autenticación
      setCustomerAuthCookie(res, {
        customer_id: result.customer_id,
        name: result.name,
        lastname: result.lastname,
        email: result.email,
        phone_number: result.phone_number
      })

      // IMPORTANTE: Devolver una respuesta al cliente
      return res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        customer: {
          id: result.customer_id,
          name: result.name,
          email: result.email
        }
      })
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

  checkSession = async (req, res) => {
    const { user } = req.session || {}

    console.log(req.session)

    if (user && user.type === 'customer') {
      return res.status(200).json({
        isAuthenticated: true,
        user: {
          id: user.customer_id,
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          phone_number: user.phone_number
        }
      })
    }

    return res.status(401).json({
      isAuthenticated: false,
      message: 'No active session found'
    })
  }
}
