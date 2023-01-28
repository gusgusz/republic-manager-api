import {Request, Response} from 'express';
import { connectionDb } from '../database/db.js';
import { Room, Task } from '../types/roomTypes.js';
import { roomSchema, taskSchema } from '../models/roomModels.js';

export async function createRoom(req: Request, res: Response) {
    const id : number = res.locals.id;
    const validation = roomSchema.validate(req.body);
    if (validation.error) {
        res.status(400).send(validation.error.details[0].message);
        return;
    }
    
    try {

    
        const { nameRoom, isPrivate } : Room= req.body;
        const isNameRoom = await connectionDb.query(`SELECT * FROM rooms WHERE "nameRoom" = $1;`, [nameRoom]);
        if(isNameRoom.rowCount !==0 && isNameRoom.rows[0].userId === id) {
            res.status(409).send('Room already exists');
            return;
        }
    await connectionDb.query(`INSERT INTO rooms ("userId", "nameRoom", "createdAt", "isPrivate") VALUES ($1, $2, $3, $4);`, [id, nameRoom, new Date(), isPrivate]);
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

        const rooms = (await connectionDb.query<Room>(`SELECT * FROM rooms WHERE "userId" = $1;`, [id])).rows;
        const countRooms : number = (await connectionDb.query(`SELECT COUNT(*) FROM rooms WHERE "userId" = $1;`, [id])).rows;
        res.send({countRooms, rooms});
        return;
    } catch (err) {
        res.sendStatus(500);
        return;
    }
}

export async function deleteRoom(req: Request, res: Response) {
    const id : number = res.locals.id;
    const roomId = req.params.id;
    try {
        const isRoom = await connectionDb.query<Room>(`SELECT * FROM rooms WHERE id = $1;`, [roomId]);
        if (isRoom.rowCount === 0) {
            res.sendStatus(404);
            return;
        }
        if (isRoom.rows[0].userId !== id) {
            res.sendStatus(401);
            return;
        }
        await connectionDb.query(`DELETE FROM rooms WHERE id = $1;`, [roomId]);
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
       
        const isEmail = await connectionDb.query(`SELECT * FROM users WHERE email = $1;`, [email]);
        if (isEmail.rowCount === 0) {
            res.status(400).send('Email not found');
            return;
        }
        const userId = isEmail.rows[0].id;
    
        if(dueDate < new Date()) {
            res.status(400).send('Due date must be greater than today');
            return;
        }
       
    
        const isRoom = await connectionDb.query<Task>(`SELECT * FROM rooms WHERE id = $1;`, [roomId]);
        if (isRoom.rowCount === 0) {
            res.sendStatus(404);
            return;
        }
        if (isRoom.rows[0].userId !== id) {
            res.sendStatus(401);
            return;
        }
        await connectionDb.query(`INSERT INTO tasks ("roomId", "userId", "nameTask", "isDone", "dueDate", "createdAt") VALUES ($1, $2, $3, $4, $5, $6);`, [roomId, userId, nameTask,false, dueDate, new Date()]);
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
        const isRoom = await connectionDb.query(`SELECT * FROM rooms WHERE id = $1;`, [roomId]);
        if (isRoom.rowCount === 0) {
            res.sendStatus(404);
            return;
        }
        if (isRoom.rows[0].userId !== id) {
            res.sendStatus(401);
            return;
        }
        const tasks = (await connectionDb.query(`SELECT * FROM tasks WHERE "roomId" = $1;`, [roomId])).rows;
        const countTasks : number = (await connectionDb.query(`SELECT COUNT(*) FROM tasks WHERE "roomId" = $1;`, [roomId])).rows;
        res.send({countTasks, tasks});
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
        const isRoom = await connectionDb.query(`SELECT * FROM rooms WHERE id = $1;`, [roomId]);
        if (isRoom.rowCount === 0) {
            res.sendStatus(404);
            return;
        }
       
        const isTask = await connectionDb.query(`SELECT * FROM tasks WHERE id = $1;`, [taskId]);
        if (isTask.rowCount === 0) {
            res.sendStatus(404);
            return;
        }

        if (isRoom.rows[0].userId !== id || isTask.rows[0].userId !== id) {
            res.sendStatus(401);
            return;
        }
        await connectionDb.query(`DELETE FROM tasks WHERE id = $1;`, [taskId]);
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
    const validation = taskSchema.validate(req.body);
    if (validation.error) {
        res.status(400).send(validation.error.details[0].message);
        return;
    }
    const { nameTask, email, dueDate, isDone} = req.body;
    try {
        const isRoom = await connectionDb.query(`SELECT * FROM rooms WHERE id = $1;`, [roomId]);
        if (isRoom.rowCount === 0) {
            res.sendStatus(404);
            return;
        }
        const isEmail = await connectionDb.query(`SELECT * FROM users WHERE email = $1;`, [email]);
        if (isEmail.rowCount === 0) {
            res.status(400).send('Email not found');
            return;
        }
        const userId = isEmail.rows[0].id;
        const isTask = await connectionDb.query(`SELECT * FROM tasks WHERE id = $1;`, [taskId]);
        if (isTask.rowCount === 0) {
            res.sendStatus(404);
            return;
        }
        if (isRoom.rows[0].userId !== id || isTask.rows[0].userId !== id) {
            res.sendStatus(401);
            return;
        }
        await connectionDb.query(`UPDATE tasks SET "nameTask" = $1, "userId" = $2, "dueDate" = $3, "isDone" = $4 WHERE id = $5;`, [nameTask, userId, dueDate, isDone, taskId]);
        res.sendStatus(200);
        return;
    } catch (err) {
        res.sendStatus(500);
        return;
    }
}

export async function updateTaskDone(req: Request, res: Response) {
    const id : number = res.locals.id;
    const roomId : number = Number(req.params.id);
    const taskId : number = Number(req.params.taskId);
    try {
        const isRoom = await connectionDb.query(`SELECT * FROM rooms WHERE id = $1;`, [roomId]);
        if (isRoom.rowCount === 0) {
            res.sendStatus(404);
            return;
        }
        const isTask = await connectionDb.query(`SELECT * FROM tasks WHERE id = $1;`, [taskId]);
        if (isTask.rowCount === 0) {
            res.sendStatus(404);
            return;
        }
        if (isRoom.rows[0].userId !== id || isTask.rows[0].userId !== id) {
            res.sendStatus(401);
            return;
        }
        await connectionDb.query(`UPDATE tasks SET "isDone" = NOT "isDone" WHERE id = $1;`, [taskId]);
        res.sendStatus(200);
        return;
    } catch (err) {
        res.sendStatus(500);
        return;
    }
}