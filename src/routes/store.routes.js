import { Router } from "express";
import {
    getMyStores,
    updateMyStore,
    getAllStores,
    getPendingStores,
    approveStore,
    rejectStore
} from "../controllers/store.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router()

// USER
router.route("/my-stores")
    .get(verifyJWT, authorizeRoles("user"), getMyStores);

router.route("update/:storeId")
    .put(verifyJWT, authorizeRoles("user"), updateMyStore);

// ADMIN
router.route("/admin/all")
    .get(verifyJWT, authorizeRoles("admin"), getAllStores);

router.route("/admin/pending")
    .get(verifyJWT, authorizeRoles("admin"), getPendingStores);

router.route("/admin/approve/:storeId")
    .put(verifyJWT, authorizeRoles("admin"), approveStore);

router.route("/admin/reject/:storeId")
    .put(verifyJWT, authorizeRoles("admin"), rejectStore);


export default router;