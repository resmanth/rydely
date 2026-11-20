// --- Database Connection Setup ---
// This file connects the app to MongoDB using Mongoose.
// It exports a function that other parts of the app call to start the connection.

import mongoose from "mongoose";

// connectDB - Connects to the MongoDB database.
// Uses the MONGODB_URI environment variable and appends the database name "Rydely".
const connectDB = async () => {
    try {
        // Log a message once Mongoose successfully connects
        mongoose.connection.on("connected", () => console.log("Database Connected"));

        // Attempt to connect to MongoDB using the connection string from environment variables
        await mongoose.connect(`${process.env.MONGODB_URI}/Rydely`);
    } catch (error) {
        // If connection fails, log the error message
        console.log(error.message);
    }
};

export default connectDB;
