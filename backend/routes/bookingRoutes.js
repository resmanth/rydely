// ============================================================
// bookingRoutes.js — API Routes for Rental Bookings
// ------------------------------------------------------------
// Mounted at: /api/booking
//
// Endpoints:
//   POST /api/booking/check-availability — Public check if cars are free for dates
//   POST /api/booking/create             — Create new booking (renter auth required)
//   GET  /api/booking/user               — View current user's bookings
//   GET  /api/booking/owner              — View current owner's received bookings
//   POST /api/booking/change-status      — Host approves, rejects, or completes booking
// ============================================================

import express from "express";
import {
    changeBookingStatus,
    checkAvailabilityOfCar,
    createBooking,
    getOwnerBookings,
    getUserBookings
} from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";

const bookingRouter = express.Router();

// Public check (can be searched before logging in)
bookingRouter.post('/check-availability', checkAvailabilityOfCar);

// Authenticated booking operations
bookingRouter.post('/create', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/owner', protect, getOwnerBookings);
bookingRouter.post('/change-status', protect, changeBookingStatus);

export default bookingRouter;
