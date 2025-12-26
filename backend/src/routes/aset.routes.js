import express from "express";
import { AsetController } from "../controllers/index.js";
import {
  authMiddleware,
  permissionMiddleware,
  PERMISSIONS,
  canViewAset,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET routes
router.get("/", canViewAset, AsetController.getAll);
router.get("/stats", canViewAset, AsetController.getStats);
router.get("/map", canViewAset, AsetController.getForMap);
router.get("/:id", canViewAset, AsetController.getById);

// POST routes
router.post(
  "/",
  permissionMiddleware(PERMISSIONS.ASET_CREATE),
  AsetController.create
);

// PUT routes
router.put(
  "/:id",
  permissionMiddleware(PERMISSIONS.ASET_UPDATE),
  AsetController.update
);

// DELETE routes
router.delete(
  "/:id",
  permissionMiddleware(PERMISSIONS.ASET_DELETE),
  AsetController.remove
);

export default router;
