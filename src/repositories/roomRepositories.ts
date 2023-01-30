import {PrismaClient} from '@prisma/client'
import { Room, Task } from '../protocols/roomProtocols';

const prisma = new PrismaClient()

async function createRoom({nameRoom, isPrivate, userId}: Room) : Promise<void> {
    await prisma.rooms.create({
        data: {
            nameRoom: nameRoom,
            isPrivate: isPrivate,
            userId: userId,
        },
    })
   
}


async function getRooms(userId: number) {
const rooms = await prisma.rooms.findMany({
    where: {
        userId: userId
    }
});
return rooms;
}

async function getRoomById(id: number){
    const room = await prisma.rooms.findUnique({
        where: {
            id: id
        }
    });
    return room;
}

async function getRoomByName(nameRoom: string) {
    const room = await prisma.rooms.findFirst({
        where: {
            nameRoom: nameRoom
        }
    });
    return room;
}

async function deleteRoom(roomId: number) : Promise<void> {
    await prisma.rooms.delete({
        where: {
            id: roomId
        }
    })
}

async function getTasks(roomId: number) {
    const tasks = await prisma.tasks.findMany({
        where: {
            roomId: roomId
        }
    });
    return tasks;
}

async function createTask({nameTask, roomId, userId, dueDate, createdAt, isDone}: Task) : Promise<void> {
    await prisma.tasks.create({
        data: {
            roomId: roomId,
            nameTask: nameTask,
            userId: userId,
            dueDate: new Date(dueDate),
            createdAt: createdAt,
            isDone: isDone,
        },
    })
}

async function deleteTask(taskId: number) : Promise<void> {
    await prisma.tasks.delete({
        where: {
            id: taskId
        }
    })
}

async function updateTask(taskId: number, isDone: boolean) : Promise<void> {
    await prisma.tasks.update({
        where: {
            id: taskId
        },
        data: {
            isDone: isDone,

        }
    })

}

async function getTaskById(id: number){
    const task = await prisma.tasks.findUnique({
        where: {
            id: id
        }
    });
    return task;
}

export const roomRepositories = {
    createRoom,
    getRooms,
    deleteRoom,
    getTasks,
    createTask,
    getRoomByName,
    getRoomById,
    deleteTask,
    updateTask,
    getTaskById
}