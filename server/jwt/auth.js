import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY } from '../config.js'

export const setAuthCookie = (res, payload) => {
  // Generar accessToken
  const accessToken = jwt.sign(payload, SECRET_JWT_KEY, {
    expiresIn: '1m'
  })
  // Establecer cookies
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 1
  })
}
