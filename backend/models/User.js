// ============================================================
// User.js — Mongoose model for a registered user
// ------------------------------------------------------------
// This file defines the "User" collection in MongoDB.
// Each user has a name, email, hashed password, a role
// (either "user" or "owner"), and an optional profile image.
// Timestamps (createdAt, updatedAt) are added automatically.
// ============================================================

import mongoose from "mongoose";

// --- User Schema Definition ---
const userSchema = new mongoose.Schema({
    // Full name of the user (e.g. "John Doe")
    name: { type: String, required: true },

    // Email address — must be unique so no two accounts share one
    email: { type: String, required: true, unique: true },

    // Hashed password (hashing happens in the controller, not here)
    password: { type: String, required: true },

    // Role determines permissions: "user" can book cars, "owner" can list cars
    role: { type: String, enum: ["owner", "user"], default: "user" },

    // URL of the user's profile picture (empty string if not set)
    image: { type: String, default: "" },
}, { timestamps: true });

// --- Create and Export the Model ---
const User = mongoose.model("User", userSchema);

export default User;
