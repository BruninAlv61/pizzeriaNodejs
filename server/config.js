import dotenv from 'dotenv'
dotenv.config()

export const {
  PORT = 3000,
  SECRET_JWT_KEY,
  EMPLOYEE_SECRET_JWT_KEY,
  SALT_ROUNDS
} = process.env
