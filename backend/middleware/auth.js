// =============================================================
// middleware/auth.js — Authentication middleware.
// This middleware protects routes that require a logged-in user.
// It reads the JWT token from the Authorization header, verifies
// it, finds the user in the database, and attaches the user
// object to req.user so controllers can use it.
// =============================================================

import jwt from "jsonwebtoken";
import User from "../models/User.js";

// --- Protect Middleware ---
// Usage: add "protect" before any route handler that needs authentication.
// Example: router.get('/data', protect, getUserData)
export const protect = async (req, res, next) => {
    // Step 1: Get the token from the Authorization header
    const token = req.headers.authorization;

    // If no token was sent, the user is not logged in
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized"
        });
    }

    try {
        // Step 2: Verify the token using our secret key
        // jwt.verify returns the payload we stored when creating the token (the userId)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Step 3: Find the user in the database using the decoded userId
        // .select("-password") excludes the password field for security
        req.user = await User.findById(decoded).select("-password");

        // If the user was deleted after the token was issued
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Step 4: User is authenticated — proceed to the next middleware / controller
        next();

    } catch (error) {
        // Token is invalid or expired
        return res.status(401).json({
            success: false,
            message: "Not authorized"
        });
    }
};
