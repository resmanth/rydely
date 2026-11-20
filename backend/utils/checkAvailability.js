// =============================================================
// utils/checkAvailability.js — Utility to check if a car is
// available for booking during a given date range.
//
// It queries the Booking collection to see if any non-cancelled
// booking overlaps with the requested pickup and return dates.
// If no overlapping booking exists, the car is available.
// =============================================================

import Booking from "../models/Booking.js";

// --- Check Car Availability ---
// Parameters:
//   car        — the car's ObjectId
//   pickupDate — the requested start date
//   returnDate — the requested end date
// Returns: true if the car is free, false if already booked
const checkAvailability = async (car, pickupDate, returnDate) => {
    // Find any bookings for this car that:
    //   - are NOT cancelled ($ne = "not equal")
    //   - overlap with the requested date range
    // Overlap logic: existing booking starts before our return AND ends after our pickup
    const overlappingBookings = await Booking.find({
        car,
        status: { $ne: "cancelled" },
        pickupDate: { $lte: returnDate },
        returnDate: { $gte: pickupDate }
    });

    // If no overlapping bookings found, the car is available
    return overlappingBookings.length === 0;
};

export default checkAvailability;
