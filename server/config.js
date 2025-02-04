import dotenv from 'dotenv'
dotenv.config()

export const {
  PORT = 3000,
  MONGO_ATLAS_URI
} = process.env
