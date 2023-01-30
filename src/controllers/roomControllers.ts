import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';
import { Room, Task } from '../protocols/roomProtocols.js';
import { roomSchema, taskSchema } from '../models/roomModels.js';
import { roomRepositories } from '../repositories/roomRepositories.js';
import { userRepositories } from '../repositories/userRepositories.js';

const prisma = new PrismaClient();

export async function createRoom(req: Request, res: Response) {
    const id : number = res.locals.id;
    const validation = roomSchema.validate(req.body);

    if (validation.error) {
        res.status(400).send(validation.error.details[0].message);
        return;
    }
    
    try {
        const { nameRoom, isPrivate } : Room= req.body;
     
        const createdAt : Date = new Date();
        await roomRepositories.createRoom({nameRoom, isPrivate, userId: id, createdAt});
        res.status(201).send('Room created');
        return;
    } catch (err) {
        res.sendStatus(500);
        return;
    }
}

export async function getRooms(req: Request, res: Response) {
    const id : number = res.locals.id;
    try {

        const rooms = await roomRepositories.getRooms(id);
    
        res.send({rooms});
        return;
    } catch (err) {
        res.sendStatus(500);
        return;
    }
}

export async function deleteRoom(req: Request, res: Response) {
    const id : number = res.locals.id;
    const roomId = Number(req.params.id);
    try {
        const isRoom = await roomRepositories.getRoomById(roomId);
        if (!isRoom) {
            res.sendStatus(404);
            return;
        }
        if (isRoom.userId !== id) {
            res.sendStatus(401);
            return;
        }
        await roomRepositories.deleteRoom(roomId);
        res.sendStatus(200);
        return;
    } catch (err) {
        res.sendStatus(500);
        return;
    }
}

export async function createTask(req: Request, res: Response) {
    const id : number = res.locals.id;
    const roomId : number = Number(req.params.id);
    const validation = taskSchema.validate(req.body);
    if (validation.error) {
        res.status(400).send(validation.error.details[0].message);
        return;
    }
    const { nameTask, email, dueDate} = req.body;

    try {
       
        const isEmail = await userRepositories.getUserByEmail(email);
        if (!isEmail) {
            res.status(400).send('Email not found');
            return;
        }
        const userId = isEmail.id;
    
        if(dueDate < new Date()) {
            res.status(400).send('Due date must be greater than today');
            return;
        }
       
    
        const isRoom = await roomRepositories.getRoomById(roomId);
        if (!isRoom) {
            res.sendStatus(404);
            return;
        }
        if (isRoom.userId !== id) {
            res.sendStatus(401);
            return;
        }
        await roomRepositories.createTask({nameTask, dueDate, userId, roomId, createdAt: new Date(), isDone: false});
        res.sendStatus(201);
        return;
    } catch (err) {
        console.log(err.message);
        console.log(new Date());
        res.sendStatus(500);
        return;
    }
}

export async function getTasks(req: Request, res: Response) {
    const id : number = res.locals.id;
    const roomId : number = Number(req.params.id);
    try {
        const isRoom = await roomRepositories.getRoomById(roomId);
        if (!isRoom) {
            res.sendStatus(404);
            return;
        }
        if (isRoom.userId !== id) {
            res.sendStatus(401);
            return;
        }
        const tasks = await roomRepositories.getTasks(roomId);

        res.send( tasks);
        return;
    } catch (err) {
        res.sendStatus(500);
        return;
    }
}

export async function deleteTask(req: Request, res: Response) {
    const id : number = res.locals.id;
    const roomId : number = Number(req.params.id);
    const taskId : number = Number(req.params.taskId);
    try {
        
       
        const isTask = await roomRepositories.getTaskById(taskId);
        if (!isTask) {
            res.sendStatus(404);
            return;
        }
        const isRoom = await roomRepositories.getRoomById(roomId);
        if (!isRoom) {
            res.sendStatus(404);
            return;
        }
        if (isRoom.userId !== id) {
            res.sendStatus(401);
            return;
        }
        await roomRepositories.deleteTask(taskId);
        res.sendStatus(200);
        return;
    } catch (err) {
        res.sendStatus(500);
        return;
    }
}

export async function updateTask(req: Request, res: Response) {
    const id : number = res.locals.id;
    const roomId : number = Number(req.params.id);
    const taskId : number = Number(req.params.taskId);
  
  
    try {
        const isRoom = await roomRepositories.getRoomById(roomId);
        if (!isRoom) {
            res.sendStatus(404);
            return;
        }
      
        const isTask = await roomRepositories.getTaskById(taskId);
        if (!isTask) {
            res.sendStatus(404);
            return;
        }
        if (isRoom.userId !== id || isTask.userId !== id) {
            res.sendStatus(401);
            return;
        }
        const isDone = !isTask.isDone
        await roomRepositories.updateTask(taskId, isDone);
        res.sendStatus(200);
        return;
    } catch (err) {
        res.sendStatus(500);
        return;
    }
}

