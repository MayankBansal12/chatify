import express, { Response, Request, json } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())
app.use(json({ limit: '50mb' }))


const PORT = process.env.PORT || 5000

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send("Server running fine!");
})

import userRouter from "./routes/user-route"

app.use("/user", userRouter)

const server = app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/`)
})



// Connecting sockets
import { Server } from 'socket.io'

const io = new Server(server, {
  pingTimeout: 120000,
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {

  // For connecting the dm with a user
  socket.on('join-dm', ({ roomId }) => {
    socket.join(roomId)
  })

  // Leave dm
  socket.on('leave-dm', ({ roomId }) => {
    socket.leave(roomId)
  })

  // ToDo: Create socket endpoint for sending message
  // ToDo: Create socket endpoint for typing status
  // ToDo: Create one endpoint for online and offline status


  socket.on('disconnect', () => {
    console.log('User disconnected!')
  })
})