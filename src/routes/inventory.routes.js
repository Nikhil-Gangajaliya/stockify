import { Router } from "express";
import { 
    getMyInventory,
    reduceMyStock
} from "../controllers/inventory.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router()

router.route("/my-inventory").get(verifyJWT, authorizeRoles("user"), getMyInventory);
router.route("/reduce-stock/:productId").post(verifyJWT, authorizeRoles("user"), reduceMyStock);



export default router;

