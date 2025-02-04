import dotenv from 'dotenv'
dotenv.config()

console.log('MONGO_ATLAS_URI:', process.env.MONGO_ATLAS_URI) // Verifica la URI

const uri = process.env.MONGO_ATLAS_URI
if (!uri) throw new Error('❌ ERROR: MONGO_ATLAS_URI no está definido en .env')
