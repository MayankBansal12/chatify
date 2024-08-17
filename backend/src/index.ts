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
import messageRouter from "./routes/message-route"

app.use("/user", userRouter)
app.use("/chat", messageRouter)

const server = app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/`)
})



// Connecting sockets
import { Server } from 'socket.io'
import { db } from './db'
import { eq } from 'drizzle-orm/expressions';
import { chats, messages } from './models'
import { MessagePayLoad } from './types'
import upload from './helpers/upload-img'

const io = new Server(server, {
  pingTimeout: 120000,
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  io.emit('user-online', { userId: socket.id });

  socket.on('join-dm', async ({ roomId }) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on('leave-dm', ({ roomId }) => {
    socket.leave(roomId);
    console.log(`User left room: ${roomId}`);
  });

  // Send message event
  socket.on('send-message', async ({ roomId, senderId, participantId, content, attachment }: MessagePayLoad) => {
    try {
      let chat = await db.select().from(chats)
        .where(eq(chats.chatId, roomId))
        .limit(1);

      if (chat.length === 0) {
        // create chat if doesn't exist
        await db.insert(chats).values({
          chatId: roomId,
          participants: [senderId, participantId]
        }).returning();
      }

      const url = await upload(attachment)

      const message = await db.insert(messages).values({
        chatId: roomId,
        content,
        senderId,
        attachment: url
      }).returning();

      // emit the message to the room
      io.to(roomId).emit('receive-message', message[0]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // handling typing event
  socket.on('typing', ({ roomId, userId }) => {
    socket.to(roomId).emit('user-typing', { userId });
  });

  socket.on('stop-typing', ({ roomId, userId }) => {
    socket.to(roomId).emit('user-stop-typing', { userId });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // user offline
    io.emit('user-offline', { userId: socket.id });
  });
});
