// ============================================================
// Car.js — Mongoose model for a car listing
// ------------------------------------------------------------
// This file defines the "Car" collection in MongoDB.
// Each car belongs to an owner (a User with role "owner") and
// stores details like brand, model, year, pricing, and location.
// Timestamps (createdAt, updatedAt) are added automatically.
// ============================================================

import mongoose from "mongoose";

// Shorthand for MongoDB ObjectId type (used for references to other collections)
const { ObjectId } = mongoose.Schema.Types;

// --- Car Schema Definition ---
const carSchema = new mongoose.Schema({
    // --- Ownership ---
    // References the User who listed this car (the owner)
    owner: { type: ObjectId, ref: "User" },

    // --- Basic Car Info ---
    // Brand name (e.g. "Toyota", "BMW")
    brand: { type: String, required: true },

    // Model name (e.g. "Corolla", "X5")
    model: { type: String, required: true },

    // URL of the car's image (stored via ImageKit)
    image: { type: String, required: true },

    // Manufacturing year (e.g. 2023)
    year: { type: Number, required: true },

    // Category like "SUV", "Sedan", "Hatchback"
    category: { type: String, required: true },

    // --- Specifications ---
    // Number of seats in the car (e.g. 5, 7)
    seating_capacity: { type: Number, required: true },

    // Fuel type (e.g. "Petrol", "Diesel", "Electric")
    fuel_type: { type: String, required: true },

    // Transmission type (e.g. "Automatic", "Manual")
    transmission: { type: String, required: true },

    // --- Pricing & Availability ---
    // Rental cost per day in the app's currency
    pricePerDay: { type: Number, required: true },

    // City or area where the car is available for pickup
    location: { type: String, required: true },

    // Short description the owner writes about the car
    description: { type: String, required: true },

    // Whether the car is currently available for booking
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

// --- Create and Export the Model ---
const Car = mongoose.model("Car", carSchema);

export default Car;
