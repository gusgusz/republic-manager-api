import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';
import roomRouter from './routes/roomRouters.js';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(userRouter)
app.use(roomRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});