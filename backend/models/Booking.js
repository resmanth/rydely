// ============================================================
// Booking.js — Mongoose model for a car booking / reservation
// ------------------------------------------------------------
// This file defines the "Booking" collection in MongoDB.
// A booking connects a user (the renter), a car, and the car's
// owner. It tracks the pickup & return dates, total price, and
// the current status (pending → confirmed or cancelled).
// Timestamps (createdAt, updatedAt) are added automatically.
// ============================================================

import mongoose from "mongoose";

// Shorthand for MongoDB ObjectId type (used for references to other collections)
const { ObjectId } = mongoose.Schema.Types;

// --- Booking Schema Definition ---
const bookingSchema = new mongoose.Schema({
    // --- References (link this booking to other collections) ---
    // The car being booked
    car: { type: ObjectId, ref: "Car", required: true },

    // The user who made the booking (the renter)
    user: { type: ObjectId, ref: "User", required: true },

    // The owner of the car (stored here so we can quickly query an owner's bookings)
    owner: { type: ObjectId, ref: "User", required: true },

    // --- Booking Dates ---
    // When the renter picks up the car
    pickupDate: { type: Date, required: true },

    // When the renter returns the car
    returnDate: { type: Date, required: true },

    // --- Status & Pricing ---
    // Current state of the booking: starts as "pending", can become "confirmed" or "cancelled"
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },

    // Total rental price (calculated as pricePerDay × number of days)
    price: { type: Number, required: true },
}, { timestamps: true });

// --- Create and Export the Model ---
const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
