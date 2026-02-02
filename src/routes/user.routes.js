import { Router } from "express";
import{
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    getAllUsers
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router()

router.post("/register", registerUser);
router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, authorizeRoles("admin", "user") ,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT,  authorizeRoles("admin", "user"), getCurrentUser);
router.route("/get-all-users").get(verifyJWT, getAllUsers);

export default router;