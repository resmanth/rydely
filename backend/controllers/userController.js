// ============================================================
// userController.js — User Registration, Login, and Profile Data
// ------------------------------------------------------------
// This controller handles all renter/user identity actions:
//   1. registerUser: creates new account with hashed password
//   2. loginUser: validates credentials and returns a signed JWT
//   3. getUserData: returns the authenticated user's profile
// ============================================================

import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Helper function to sign a JSON Web Token (JWT) with the user's ID
const generateToken = (userId) => {
    return jwt.sign(userId, process.env.JWT_SECRET);
};

// ------------------------------------------------------------
// 1. REGISTER NEW USER
// POST /api/user/register
// ------------------------------------------------------------
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Input validation: ensure all fields exist and password is at least 8 chars
        if (!name || !email || !password || password.length < 8) {
            return res.json({ success: false, message: "Fill all the fields" });
        }

        // Check if an account already exists with this email
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Hash the password securely with salt rounds = 10
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user in MongoDB
        const user = await User.create({ name, email, password: hashedPassword });

        // Generate JWT token so user is automatically logged in upon signup
        const token = generateToken(user._id.toString());
        res.json({ success: true, token });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------
// 2. LOGIN USER
// POST /api/user/login
// ------------------------------------------------------------
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Verify password against stored bcrypt hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials" });
        }

        // Return new JWT token on successful authentication
        const token = generateToken(user._id.toString());
        res.json({ success: true, token });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------
// 3. GET USER PROFILE DATA
// GET /api/user/data (protected by auth middleware)
// ------------------------------------------------------------
export const getUserData = async (req, res) => {
    try {
        // req.user is set by the 'protect' middleware after validating the JWT
        const { user } = req;
        res.json({ success: true, user });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
