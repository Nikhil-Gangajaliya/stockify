import { Router } from "express";
import { 
    getGlobalStats,
  getStoreStats,
  getSalesSummary,
  getTopProducts
} from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.route("/global-stats").get(verifyJWT, authorizeRoles("admin"), getGlobalStats);
router.route("/store-stats").get(verifyJWT, authorizeRoles("admin"), getStoreStats);
router.route("/sales-summary").get(verifyJWT, authorizeRoles("admin"), getSalesSummary);
router.route("/top-products").get(verifyJWT, authorizeRoles("admin"), getTopProducts);

export default router;