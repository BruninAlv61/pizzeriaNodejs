import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY, EMPLOYEE_SECRET_JWT_KEY, CUSTOMER_SECRET_JWT_KEY } from '../config.js'

export const tokenVerify = (req, res, next) => {
  const token = req.cookies.access_token
  req.session = { user: null }

  if (!token) {
    return next()
  }

  try {
    // Intentamos verificar como administrador
    try {
      const admin = jwt.verify(token, SECRET_JWT_KEY)
      req.session.user = { ...admin, type: 'admin' }
      return next()
    } catch (adminError) {
      req.session.user = null
    }

    // Intentamos verificar como empleado
    try {
      const employee = jwt.verify(token, EMPLOYEE_SECRET_JWT_KEY)
      req.session.user = { ...employee, type: 'employee' }
      return next()
    } catch (employeeError) {
      req.session.user = null
    }

    // Intentamos verificar como cliente
    try {
      const customer = jwt.verify(token, CUSTOMER_SECRET_JWT_KEY)
      req.session.user = { ...customer, type: 'customer' }
      return next()
    } catch (customerError) {
      req.session.user = null
    }
  } catch (err) {
    req.session.user = null
  }

  next()
}
