// server/jwt/auth.js
import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY } from '../config.js'

export const setAuthCookie = (res, payload) => {
  /* payload → { admin_id, admin_name } */
  const accessToken = jwt.sign(payload, SECRET_JWT_KEY, { expiresIn: '15m' })

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 15
  })
}
