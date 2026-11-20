// =============================================================
// server.js — Main entry point for the Rydely backend server.
// This file sets up Express, connects to the database, registers
// all API route groups, and starts listening for HTTP requests.
// =============================================================

// --- Imports ---
import express from "express";
import "dotenv/config"; // Loads environment variables from .env file automatically
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

// --- Initialize Express App ---
const app = express();

// --- Connect to MongoDB ---
await connectDB();

// --- Global Middleware ---
// cors() allows the frontend (running on a different port/domain) to call our API
app.use(cors());
// express.json() parses incoming JSON request bodies so we can access req.body
app.use(express.json());

// --- Health-Check Route ---
// Simple route to verify the server is running
app.get('/', (req, res) => {
    res.send("Server is running...");
});

// --- API Routes ---
// User routes   — registration, login, get user data
app.use('/api/user', userRouter);
// Owner routes  — add cars, manage listings, dashboard
app.use('/api/owner', ownerRouter);
// Booking routes — check availability, create/manage bookings
app.use('/api/booking', bookingRouter);

// --- Start Server ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export app for serverless platforms (e.g. Vercel) and automated testing
export default app;
