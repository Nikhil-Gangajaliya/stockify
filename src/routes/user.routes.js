import { Router } from "express";
import{
    registerUser,
    loginUser
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/register", registerUser);
router.route("/login").post(loginUser);


export default router;