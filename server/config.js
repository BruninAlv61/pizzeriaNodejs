import dotenv from 'dotenv'
dotenv.config()

export const {
  PORT = 3000,
  MONGO_ATLAS_URI,
  SECRET_JWT_KEY,
  SALT_ROUNDS
} = process.env
