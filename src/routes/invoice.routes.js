import { Router } from "express";
import {
    generateInvoice,
    getInvoiceDetails,
    getMyInvoices,
    getAllInvoices,
    getInvoicesByStore
} from "../controllers/invoice.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.route("/generate-invoice/:orderId").post(verifyJWT, authorizeRoles("admin"), generateInvoice);
router.route("/invoice-details/:invoiceId").get(verifyJWT, authorizeRoles("admin", "user"), getInvoiceDetails);
router.route("/my-invoices").get(verifyJWT, authorizeRoles("user"), getMyInvoices);
router.route("/all-invoices").get(verifyJWT, authorizeRoles("admin"), getAllInvoices);
router.route("/invoices-by-store/:storeId").get(verifyJWT, authorizeRoles("admin"), getInvoicesByStore);


export default router;