import { MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config() // Asegurar que se cargan las variables de entorno

const uri = process.env.MONGO_ATLAS_URI // Verifica que se lee correctamente

if (!uri) {
  throw new Error('❌ ERROR: MONGO_ATLAS_URI no está definido en .env')
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export async function connect () {
  try {
    await client.connect()
    console.log('✅ Conexión exitosa a MongoDB Atlas')
    return client.db('pizzasDB').collection('menú') // Usa el nombre correcto de la DB y colección
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error)
    await client.close()
  }
}

export async function connectUser () {
  try {
    await client.connect()
    console.log('✅ Conexión exitosa a MongoDB Atlas')
    return client.db('pizzasDB').collection('users') // Usa el nombre correcto de la DB y colección
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error)
    await client.close()
  }
}

export async function connectCategories () {
  try {
    await client.connect()
    console.log('✅ Conexión exitosa a MongoDB Atlas')
    return client.db('pizzasDB').collection('categories') // Usa el nombre correcto de la DB y colección
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error)
    await client.close()
  }
}

export async function connectOfertasCombos () {
  try {
    await client.connect()
    console.log('✅ Conexión exitosa a MongoDB Atlas')
    return client.db('pizzasDB').collection('ofertas-combos') // Usa el nombre correcto de la DB y colección
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error)
    await client.close()
  }
}

export async function connectSucursales () {
  try {
    await client.connect()
    console.log('✅ Conexión exitosa a MongoDB Atlas')
    return client.db('pizzasDB').collection('sucursales') // Usa el nombre correcto de la DB y colección
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error)
    await client.close()
  }
}
