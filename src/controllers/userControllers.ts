import { Response, Request } from 'express';
import { NewUser, User, Token } from '../types/userTypes.js';
import { userSchema, userLoginSchema } from '../models/userModels.js';
import { connectionDb } from '../database/db.js';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';



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
       await connectionDb.query<NewUser>(`INSERT INTO users (name, email, password, "createdAt") VALUES ($1, $2, $3, $4);`, [name, email, hashPassword, createdAt]);
         res.status(201).json('User created');
         return;
    }catch(err){ 
        if(err.message.includes("users_email_key")){
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
    const user = await connectionDb.query<NewUser>(`SELECT * FROM users WHERE email = $1;`, [email]);
    if(user.rowCount === 0){
        res.status(404).json('User not found');
        return;
    }
    const hashPassword : string = user.rows[0].password;
    const isPassword = bcrypt.compareSync(password, hashPassword);
    if(!isPassword){
        res.status(401).json('Invalid password');
        return;
    }

    const isToken = await connectionDb.query<Token>(`SELECT * from tokens WHERE "userId" = $1;`, [user.rows[0].id]);
  

    if(isToken.rowCount !== 0){
        res.status(200).send({token: isToken.rows[0].token});
        return;
    }
    
    const token = uuid();

    await connectionDb.query<Token>(`INSERT INTO tokens (token, "userId", "createdAt") VALUES ($1, $2, $3);`, [token, user.rows[0].id, new Date()]);
    
    res.status(200).send({token: token});
    return;
    }catch(err){
        console.log(err.message);
        res.sendStatus(500);
        return;
    }}