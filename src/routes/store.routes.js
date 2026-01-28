import e, { Router } from "express";
import{
    createStore,
    getMyStore,
    updateMyStore,
    updateStoreByAdmin,
    getAllStores
} from "../controllers/store.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router()

router.route("/create").post(verifyJWT, authorizeRoles("admin"), createStore);
router.route("/my-store").get(verifyJWT, authorizeRoles( "user"), getMyStore);
router.route("/update-store").put(verifyJWT, authorizeRoles( "user"), updateMyStore);
router.route("/admin/update-store/:storeId").put(verifyJWT, authorizeRoles("admin"), updateStoreByAdmin);
router.route("/admin/get-all-stores").get(verifyJWT, authorizeRoles("admin"), getAllStores);


export default router;