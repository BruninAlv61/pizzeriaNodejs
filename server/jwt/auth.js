import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY } from '../config.js'

export const setAuthCookie = (res, payload) => {
  // Generate accessToken with a 15-minute expiration
  const accessToken = jwt.sign(payload, SECRET_JWT_KEY, {
    expiresIn: '15m'
  })
  // Set cookies with a 15-minute expiration
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 15 // 15 minutes in milliseconds
  })
}
