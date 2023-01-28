import { Request, Response } from "express";
import { Token, User } from "../types/userTypes.js";
import { connectionDb } from "../database/db.js";


export async function authMiddleware(req: Request, res: Response, next: any) {
    const token = (req.headers.authorization?.replace('Bearer ', ''))?.trim();
    if (!token) {
        res.sendStatus(401);
        return;
    }
    try {
        const isToken = await connectionDb.query<Token>(`SELECT * FROM tokens WHERE token = $1;`, [token]);
        if (isToken.rowCount === 0) {
            res.sendStatus(401);
            return;
        }

        const user = await connectionDb.query<User>(`SELECT * FROM users WHERE id = $1;`, [isToken.rows[0].userId]);

        res.locals.id = user.rows[0].id;
        next();
    } catch (err) {
        res.sendStatus(500);
        return;
    }
}