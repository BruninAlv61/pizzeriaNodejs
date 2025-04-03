import { MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config() // Ensure environment variables are loaded

const uri = process.env.MONGO_ATLAS_URI // Check that it is correctly read

if (!uri) {
  throw new Error('❌ ERROR: MONGO_ATLAS_URI is not defined in .env')
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export async function connectMenu () {
  try {
    await client.connect()
    console.log('✅ Successfully connected to MongoDB Atlas')
    return client.db('pizzasDB').collection('menu') // Use the correct DB and collection name
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error)
    await client.close()
  }
}

export async function connectUsers () {
  try {
    await client.connect()
    console.log('✅ Successfully connected to MongoDB Atlas')
    return client.db('pizzasDB').collection('users') // Use the correct DB and collection name
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error)
    await client.close()
  }
}

export async function connectCategories () {
  try {
    await client.connect()
    console.log('✅ Successfully connected to MongoDB Atlas')
    return client.db('pizzasDB').collection('categories') // Use the correct DB and collection name
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error)
    await client.close()
  }
}

export async function connectComboOffers () {
  try {
    await client.connect()
    console.log('✅ Successfully connected to MongoDB Atlas')
    return client.db('pizzasDB').collection('combo_offers') // Use the correct DB and collection name
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error)
    await client.close()
  }
}

export async function connectBranches () {
  try {
    await client.connect()
    console.log('✅ Successfully connected to MongoDB Atlas')
    return client.db('pizzasDB').collection('branches') // Use the correct DB and collection name
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error)
    await client.close()
  }
}
