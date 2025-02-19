import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY } from '../config.js'

export const setAuthCookie = (res, payload) => {
  // Generar accessToken con 15 minutos de expiración
  const accessToken = jwt.sign(payload, SECRET_JWT_KEY, {
    expiresIn: '15m'
  })
  // Establecer cookies con 15 minutos de expiración
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 15 // 15 minutos en milisegundos
  })
}
