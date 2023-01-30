
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.users.create({
    data: {
        "name": "Gustavo",
        "email": "gus@gmail.com",
        "password": "123456",
        "createdAt": "2021-06-01T00:00:00.000Z"
    }}),
}

main().catch((e) => {
        throw e;
    })
 .finally(async () => {

        await prisma.$disconnect();

    } );


