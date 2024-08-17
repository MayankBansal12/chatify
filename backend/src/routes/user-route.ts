import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { eq } from 'drizzle-orm/expressions';
import { users } from '../models';

const secret = process.env.JWT_SECRET || ""

const router = Router()

router.post('/signup', async (req: Request, res: Response) => {
    const { username, name, email, password } = req.body;

    try {
        if (!username || !name || !email || !password) {
            return res.status(400).json({ message: 'Invalid data!' });
        }

        // check already existing user
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // hash passwd
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("values: ", email, hashedPassword, name, username)

        // add new user
        const newUser = await db.insert(users).values({
            username,
            name,
            email,
            password: hashedPassword,
        }).returning();

        const user = newUser[0];

        const token = jwt.sign({ id: user.id }, secret);

        res.status(201).json({ message: "added a new user!", token, userId: user.id });
    } catch (error) {
        console.log("error creating user ", error)
        res.status(500).json({ message: 'Error signing up user', error });
    }
});


router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const usersArray = await db.select().from(users).where(eq(users.email, email)).limit(1);
        const user = usersArray[0];

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // password check
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // sending jwt token
        const token = jwt.sign({ id: user.id }, secret);

        res.status(200).json({ message: "user logged in!", token, userId: user.id });
    } catch (error) {
        console.log("error logging in user ", error)
        res.status(500).json({ message: 'error logging in user', error });
    }
});

export default router