require('dotenv').config()
import { connectionDB } from './databases/db'
const express = require('express')
const cors = require('cors')
import { createServer } from 'http'
import UserRoutes from './routes/user.routes'


connectionDB()

const server = express()
const serverConfig = {
  port: parseInt(process.env.PORT || '3000'),
}

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))


server.use('/api/auth', UserRoutes)

createServer(server).listen(serverConfig.port, () =>
  console.log(`Server is running on port ${serverConfig.port}`),
)
