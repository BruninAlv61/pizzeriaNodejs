// server/jwt/auth.js
import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY, EMPLOYEE_SECRET_JWT_KEY, CUSTOMER_SECRET_JWT_KEY } from '../config.js'

// Para administradores
export const setAuthCookie = (res, payload) => {
  /* payload → { admin_id, admin_name } */
  const accessToken = jwt.sign(payload, SECRET_JWT_KEY, { expiresIn: '15m' })

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 15
  })
}

// Para empleados (usa una clave secreta diferente)
export const setEmployeeAuthCookie = (res, payload) => {
  /* payload → { employee_id, name, employee_branch } */
  const accessToken = jwt.sign(payload, EMPLOYEE_SECRET_JWT_KEY, { expiresIn: '15m' })

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 15
  })
}

export const setCustomerAuthCookie = (res, payload) => {
  const accessToken = jwt.sign(payload, CUSTOMER_SECRET_JWT_KEY, { expiresIn: '1d' })

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    sameSite: 'lax', // dev
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  })
}
