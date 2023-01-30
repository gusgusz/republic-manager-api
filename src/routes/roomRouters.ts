import { Router } from "express";
import { createRoom, getRooms, deleteRoom, createTask, getTasks, deleteTask, updateTask } from "../controllers/roomControllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";


const router = Router();

router.use(authMiddleware);
router.post('/room', createRoom);
router.get('/room', getRooms);
router.delete('/room/:id', deleteRoom);
router.post('/room/:id', createTask);
router.get('/room/:id', getTasks);
router.delete('/room/:id/:taskId', deleteTask)
router.put('/room/:id/:taskId', updateTask)
// router.put('/room/:id/:taskId/done', updateTaskDone)


export default router;