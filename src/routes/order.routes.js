import { Router } from "express";
import { 
    createOrder,
    getOrderById,
    getOrdersByStore,
    getMyOrders,
    cancelOrder
} from "../controllers/order.controller.js";
import {
    approveOrder,
    rejectOrder,
    getPendingOrders,
    adminCancelOrder
} from "../controllers/adminOrder.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router()

router.route("/create-order").post(verifyJWT, authorizeRoles("user"), createOrder);
router.route("/all-orders/:orderId").get(verifyJWT, authorizeRoles("admin"), getOrderById);
router.route("/store-orders/:storeId").get(verifyJWT, authorizeRoles("admin"), getOrdersByStore);
router.route("/my-orders").get(verifyJWT, authorizeRoles("user"), getMyOrders);
router.route("/cancel-order/:orderId").post(verifyJWT, authorizeRoles("user"), cancelOrder);

router.route("/admin/pending-orders").get(verifyJWT, authorizeRoles("admin"), getPendingOrders);
router.route("/admin/approve-order/:orderId").post(verifyJWT, authorizeRoles("admin"), approveOrder);
router.route("/admin/reject-order/:orderId").post(verifyJWT, authorizeRoles("admin"), rejectOrder);
router.route("/admin/cancel-order/:orderId").post(verifyJWT, authorizeRoles("admin"), adminCancelOrder);


export default router;