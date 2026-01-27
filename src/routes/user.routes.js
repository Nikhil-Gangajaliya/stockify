import { Router } from "express";
import{
    registerUser
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/register", registerUser);


export default router;