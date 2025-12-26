import express from "express";
import { AuthController } from "../controllers/index.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);

// Protected routes
router.get("/me", authMiddleware, AuthController.getCurrentUser);
router.post("/logout", authMiddleware, AuthController.logout);

export default router;
