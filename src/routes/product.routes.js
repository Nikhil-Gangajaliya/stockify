import { Router } from "express";
import { 
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByStore
 } from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router()

router.route("/create").post(verifyJWT, authorizeRoles("admin"), createProduct);
router.route("/update-product/:productId").put(verifyJWT, authorizeRoles("admin"), updateProduct);
router.route("/delete-product/:productId").delete(verifyJWT, authorizeRoles("admin"), deleteProduct);
router.route("/get-product/:productId").get(verifyJWT, authorizeRoles("user", "admin"), getProductById);
router.route("/get-products-by-store/:storeId").get(verifyJWT, authorizeRoles("user", "admin"), getProductsByStore);

export default router;