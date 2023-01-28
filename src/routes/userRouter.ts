import { Router } from "express";
import { newUser, signIn } from "../controllers/userControllers.js";

const router = Router();


router.post('/sign-up', newUser);
router.post('/sign-in', signIn);


export default router;