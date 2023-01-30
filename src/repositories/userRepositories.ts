import { PrismaClient } from "@prisma/client";

import { NewUser } from "../protocols/userProtocols";

const prisma = new PrismaClient();

async function newUser(user: NewUser) {
 
   
    await prisma.users.create({
        data: {
            name: user.name,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
        },
    });

 
}

async function getUserByEmail(email: string) {

        const user = await prisma.users.findUnique({
            where: {
                email: email,
            },
        });
        return user;
   
}

async function getUserById(id: number) {
  
        const user = await prisma.users.findUnique({
            where: {
                id: id,
            },
        });
        return user;
  
}

async function getUserByToken(token: string) {

   
        const user = await prisma.tokens.findUnique({
            where: {
                token: token,
            },
        });
        return user;
   
}

async function getTokenById(id: number){

   
        const token = await prisma.tokens.findMany({
            where: {
                userId: id
            },
        });
        return token;
   
}


async function createToken(token: string, userId: number) {

       await prisma.tokens.create({
            data: {
                token: token,
                userId: userId,
            }
        });
    }

export const userRepositories = {
    newUser,
    getUserByEmail,
    getUserById,
    getUserByToken,
    createToken,
    getTokenById
};