import { Router, Request, Response } from 'express';
import { eq, arrayContains } from 'drizzle-orm/expressions';
import { db } from '../db';
import { chats, messages } from '../models';

const router = Router()

router.get('/messages', async (req: Request, res: Response) => {
    const { participant1, participant2 } = req.query;

    try {
        const chat = await db.select().from(chats)
            .where(arrayContains(chats.participants, [participant1 as string, participant2 as string]))
            .limit(1);

        if (chat.length === 0) {
            return res.status(200).json({ messages: [] });
        }

        const chatId = chat[0].chatId;
        const allMessages = await db.select().from(messages)
            .where(eq(messages.senderId, chatId))
            .orderBy(messages.timestamp);


        res.status(200).json({ message: "all messages fetched!", messages: allMessages });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
});

export default router