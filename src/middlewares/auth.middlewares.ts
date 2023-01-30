import { Request, Response } from "express";
import { Token, User } from "../protocols/userProtocols.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function authMiddleware(req: Request, res: Response, next: any) {
    const token = (req.headers.authorization?.replace('Bearer ', ''))?.trim();
    if (!token) {
        res.sendStatus(401);
        return;
    }
    try {
        const isToken = await prisma.tokens.findUnique({
            where: {
                token: token,
            },
        });
        if (!isToken) {
            res.sendStatus(401);
            return;
        }

        const user = await prisma.users.findUnique({
            where: {
                id: isToken.userId,
            },
        });
        if (!user) {
            res.sendStatus(401);
            return;
        }

        res.locals.id = user.id;
        next();
    } catch (err) {
        res.sendStatus(500);
        return;
    }
}