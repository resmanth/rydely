// ============================================================
// userRoutes.js — API Routes for User Accounts & Authentication
// ------------------------------------------------------------
// Mounted at: /api/user
// Endpoints:
//   POST /api/user/register — Create a new account
//   POST /api/user/login    — Sign in with email & password
//   GET  /api/user/data     — Fetch authenticated user profile (protected)
// ============================================================

import express from "express";
import { getUserData, loginUser, registerUser } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

// Public routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Protected routes (requires valid JWT in Authorization header)
userRouter.get('/data', protect, getUserData);

export default userRouter;
