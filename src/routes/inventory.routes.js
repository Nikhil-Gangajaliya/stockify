import { Router } from "express";
import { 
    addStock,
    reduceStock,
    adjustStock,
    getLowStockProducts
} from "../controllers/inventory.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router()

router.route("/add-stock/:productId").post(verifyJWT, authorizeRoles("admin"), addStock);
router.route("/reduce-stock/:productId").post(verifyJWT, authorizeRoles("admin"), reduceStock);
router.route("/adjust-stock/:productId").post(verifyJWT, authorizeRoles("admin"), adjustStock);
router.route("/low-stock-products").get(verifyJWT, authorizeRoles("admin"), getLowStockProducts);


export default router;

