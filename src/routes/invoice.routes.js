import { Router } from "express";
import {
    generateInvoice,
    getInvoiceByOrder,
    getInvoicesByStore
} from "../controllers/invoice.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.route("/generate-invoice/:orderId").post(verifyJWT, authorizeRoles("admin"), generateInvoice);
router.route("/invoice-by-order/:orderId").get(verifyJWT, authorizeRoles("admin", "user"), getInvoiceByOrder);
router.route("/invoices-by-store/:storeId").get(verifyJWT, authorizeRoles("admin"), getInvoicesByStore);


export default router;