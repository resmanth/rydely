// ============================================================
// ownerRoutes.js — API Routes for Car Owners / Hosts (Host HQ)
// ------------------------------------------------------------
// Mounted at: /api/owner
// All endpoints are protected by JWT authentication (`protect`).
//
// Endpoints:
//   POST /api/owner/change-role   — Upgrade user account to "owner"
//   POST /api/owner/add-car       — List a new car (with image upload)
//   GET  /api/owner/cars          — Fetch all cars listed by this host
//   POST /api/owner/toggle-car    — Toggle car availability on/off
//   POST /api/owner/delete-car    — Remove a car listing
//   GET  /api/owner/dashboard     — Get host analytics (revenue, bookings, fleet)
//   POST /api/owner/update-image  — Update owner profile avatar
// ============================================================

import express from "express";
import { protect } from "../middleware/auth.js";
import {
    addCar,
    changeRoleToOwner,
    deleteCar,
    getDashboardData,
    getOwnerCars,
    toggleCarAvailability,
    updateUserImage
} from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

// Role management
ownerRouter.post("/change-role", protect, changeRoleToOwner);

// Car management (add, list, toggle, delete)
ownerRouter.post("/add-car", upload.single("image"), protect, addCar);
ownerRouter.get("/cars", protect, getOwnerCars);
ownerRouter.post("/toggle-car", protect, toggleCarAvailability);
ownerRouter.post("/delete-car", protect, deleteCar);

// Host HQ dashboard metrics
ownerRouter.get('/dashboard', protect, getDashboardData);

// Profile avatar update
ownerRouter.post('/update-image', upload.single("image"), protect, updateUserImage);

export default ownerRouter;
