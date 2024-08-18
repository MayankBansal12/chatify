import { Router, Request, Response } from 'express';
import { eq, arrayContains, ne } from 'drizzle-orm/expressions';
import { db } from '../db';
import { chats, messages, users } from '../models';

const router = Router()

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

// Route to fetch all current user chat
router.get('/user-chats', async (req: Request, res: Response) => {
    const { userId } = req.query;

    try {
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // fetch chats where user is participant
        const userChats = await db
            .select()
            .from(chats)
            .where(arrayContains(chats.participants, [userId as string]));

        const chatWithUserDetails = await Promise.all(
            userChats.map(async chat => {
                const otherParticipantId = chat.participants.find(participant => participant !== userId);

                if (otherParticipantId) {
                    // fetch details of participant
                    const otherParticipant = await db
                        .select()
                        .from(users)
                        .where(eq(users.id, otherParticipantId))
                        .limit(1);

                    return {
                        chatId: chat.chatId,
                        id: otherParticipant[0].id,
                        name: otherParticipant[0].name,
                        userName: otherParticipant[0].username,
                        timestamp: chat.timestamp,
                        archived: chat.archived,
                        blocked: chat.blocked
                    };
                }
                return null;
            })
        );

        res.status(200).json({ message: 'Active chats fetched successfully!', chats: chatWithUserDetails });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user chats', error });
    }
});

// Route to fetch all users on the platform expect for the userId
router.get('/all-users', async (req: Request, res: Response) => {
    const { userId } = req.query;

    try {
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Fetch all users except the one with the given userId
        const allUsersExceptCurrent = await db
            .select()
            .from(users)
            .where(ne(users.id, userId as string));

        res.status(200).json({ message: 'Users fetched successfully!', users: allUsersExceptCurrent });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

export default router