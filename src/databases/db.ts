require('dotenv').config()
import mongoose from 'mongoose'
mongoose.set('strictQuery', true)

const MONGO_URI = process.env.MONGO_URI

export const connectionDB = async () => {
  try {
    if (!MONGO_URI) throw new Error('Not found MONGO_URI env')
    await mongoose.connect(MONGO_URI)
    console.log('Connected to the database')
  } catch (error) {
    throw new Error('Could not connect to the database sorry :(')
  }
}
