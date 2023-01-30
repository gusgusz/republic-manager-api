import { Response, Request } from 'express';
import { NewUser, User, Token } from '../protocols/userProtocols.js';
import { userSchema, userLoginSchema } from '../models/userModels.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { userRepositories } from '../repositories/userRepositories.js';

const prisma = new PrismaClient();



export async function newUser(req: Request, res: Response) {
    const validate = userSchema.validate(req.body);
    if (validate.error) {
        res.status(400).json(validate.error.details[0].message);
        return;
    }
    const { name, email, password } : NewUser = req.body;
    const createdAt : Date = new Date();
    const hashPassword : string = bcrypt.hashSync(password, 10);

    try{
       await userRepositories.newUser({name, email, password: hashPassword, createdAt});
        res.sendStatus(201);
         return;
    }catch(err){ 
        if(err.message.includes("Unique constraint failed on the fields: (`email`)")){
            res.status(409).json('Email already exists');
            return;
        }
        res.sendStatus(500);
        return;
    }


    };


export async function signIn(req: Request, res: Response) {
    const validate = userLoginSchema.validate(req.body);
    if (validate.error) {
        res.status(400).json(validate.error.details[0].message);
        return;
    }
    const { email, password } : User = req.body;
    try{
    const user = await userRepositories.getUserByEmail(email);
    if(!user){
        res.status(404).json('User not found');
        return;
    }
    const hashPassword : string = user.password;
    const isPassword = bcrypt.compareSync(password, hashPassword);
    if(!isPassword){
        res.status(401).json('Invalid password');
        return;
    }

    const isToken = await userRepositories.getTokenById(user.id);
  
   
    if(isToken.length ){
 
        res.status(200).send(isToken[0].token);
        return;
    }
    
    const token = uuid();

    await userRepositories.createToken(token,user.id);
    
    res.status(200).send(token);
    return;
    }catch(err){
        console.log(err.message);
        res.sendStatus(500);
        return;
    }}