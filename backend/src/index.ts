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
  const userId = socket.handshake.query.userId;

  console.log('User connected:', userId);

  socket.on('join-dm', ({ roomId }) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);

    // broadcast to the room that the user is online
    socket.to(roomId).emit('user-online', { userId });
  });


  socket.on('leave-dm', ({ roomId }) => {
    socket.leave(roomId);
    console.log(`User ${userId} left room ${roomId}`);

    // broadcast to the room that the user is offline
    socket.to(roomId).emit('user-offline', { userId });
  });

  // Send message event
  socket.on('send-message', async ({ roomId, senderId, participantId, content, attachment }: MessagePayLoad) => {
    io.emit('user-online', { userId: senderId });

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
  socket.on('typing', ({ roomId }) => {
    socket.to(roomId).emit('typing', { userId });
  });

  socket.on('stop-typing', ({ roomId }) => {
    socket.to(roomId).emit('stop-typing', { userId });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', userId);

    // user offline
    io.emit('user-offline', { userId: userId });
  });
});
