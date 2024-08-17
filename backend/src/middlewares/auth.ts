import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../types';

const secret = process.env.JWT_SECRET || ""

interface AuthMidReqType extends Request {
    headers: {
        authorization: string
    }
    user: undefined | IUser
}


const authenticateJWT = (req: AuthMidReqType, res: Response, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        jwt.verify(token, secret, (err: any, user: any) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
