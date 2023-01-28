import joi from 'joi';

export const roomSchema = joi.object({
    nameRoom: joi.string().min(3).required(),
    isPrivate: joi.boolean().required(),
});

export const taskSchema = joi.object({
    nameTask: joi.string().min(3).required(),
    email: joi.string().email().required(),
    dueDate: joi.date().required(),
});