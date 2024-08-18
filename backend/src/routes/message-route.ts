import { Router, Request, Response } from 'express';
import { eq, and, arrayContains } from 'drizzle-orm/expressions';
import { db, pool } from '../db';
import { chats, messages } from '../models';

const router = Router()

// Route to fetch messages between two users
// router.get('/messages/:userId1/:userId2', async (req, res) => {
//     const { userId1, userId2 } = req.params;

//     try {
//         // Find the chat between the two users
//         const chatResult = await pool.query(
//             `SELECT chat_id FROM chats WHERE participants @> ARRAY[$1::uuid, $2::uuid] AND participants <@ ARRAY[$1::uuid, $2::uuid]`,
//             [userId1, userId2]
//         );

//         if (chatResult.rows.length === 0) {
//             return res.status(404).json({ message: 'Chat between these users not found' });
//         }

//         const chatId = chatResult.rows[0].chat_id;

//         // Fetch messages for the found chat
//         const messagesResult = await pool.query(
//             `SELECT * FROM messages WHERE chat_id = $1 ORDER BY timestamp ASC`,
//             [chatId]
//         );

//         res.json(messagesResult.rows);
//     } catch (err) {
//         console.error('Error fetching messages:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// })


// Route to fetch messages by chatId
router.get('/messages', async (req: Request, res: Response) => {
    const { chatId } = req.query;

    try {
        if (!chatId) {
            return res.status(400).json({ message: 'chatId is required' });
        }

        // Fetch all messages for the given chatId
        const allMessages = await db.select().from(messages)
            .where(eq(messages.chatId, chatId as string))
            .orderBy(messages.timestamp);

        res.status(200).json({ message: "Messages fetched successfully", messages: allMessages });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
});


export default router