import { Router } from "express";
import { 
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts
 } from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router()

router.route("/create").post(verifyJWT, authorizeRoles("admin"), createProduct);
router.route("/update-product/:productId").put(verifyJWT, authorizeRoles("admin"), updateProduct);
router.route("/delete-product/:productId").delete(verifyJWT, authorizeRoles("admin"), deleteProduct);
router.route("/get-product").get(verifyJWT, authorizeRoles("user", "admin"), getAllProducts);

export default router;
