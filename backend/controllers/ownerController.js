// ============================================================
// ownerController.js — Host / Owner Management Controller
// ------------------------------------------------------------
// This controller handles all actions for car owners:
//   1. changeRoleToOwner: upgrades a renter account to host role
//   2. addCar: uploads car image to ImageKit and saves listing
//   3. getOwnerCars: returns all cars listed by this owner
//   4. toggleCarAvailability: switches isAvailable (true/false)
//   5. deleteCar: removes a car listing permanently
//   6. getDashboardData: calculates stats (fleet, revenue, bookings)
//   7. updateUserImage: updates owner/user profile avatar via ImageKit
// ============================================================

import User from "../models/User.js";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";
import fs from "fs";
import imagekit from "../configs/imagekit.js";

// ------------------------------------------------------------
// 1. UPGRADE USER TO OWNER ROLE
// POST /api/owner/change-role
// ------------------------------------------------------------
export const changeRoleToOwner = async (req, res) => {
    try {
        const { _id } = req.user;

        // Update the user's role in MongoDB from "user" to "owner"
        await User.findByIdAndUpdate(_id, { role: "owner" });

        res.json({
            success: true,
            message: "Now you can list cars"
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------
// 2. ADD / LIST A NEW CAR
// POST /api/owner/add-car (multipart/form-data with file)
// ------------------------------------------------------------
export const addCar = async (req, res) => {
    try {
        const { _id } = req.user;
        const car = JSON.parse(req.body.carData);
        const imageFile = req.file;

        // Image file is mandatory for listing a car
        if (!imageFile) {
            return res.json({
                success: false,
                message: "Car image is required"
            });
        }

        // Read local temporary file uploaded via Multer
        const fileBuffer = fs.readFileSync(imageFile.path);

        // Upload image to ImageKit cloud storage under the /cars folder
        const uploadResponse = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/cars"
        });

        // Generate optimized CDN URL with WebP conversion & auto-quality
        const optimizedImageUrl = imagekit.url({
            path: uploadResponse.filePath,
            transformation: [
                { width: "1280" },
                { quality: "auto" },
                { format: "webp" }
            ]
        });

        // Create the Car record in MongoDB with the owner's ID
        await Car.create({
            ...car,
            owner: _id,
            image: optimizedImageUrl
        });

        // Clean up: delete the temporary local file from Multer storage
        if (fs.existsSync(imageFile.path)) {
            fs.unlinkSync(imageFile.path);
        }

        res.json({
            success: true,
            message: "Car added successfully"
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------
// 3. GET ALL CARS LISTED BY LOGGED-IN OWNER
// GET /api/owner/cars
// ------------------------------------------------------------
export const getOwnerCars = async (req, res) => {
    try {
        const { _id } = req.user;

        // Find all cars where the owner matches the logged-in user
        const cars = await Car.find({ owner: _id });

        res.json({
            success: true,
            cars
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------
// 4. TOGGLE CAR AVAILABILITY (Active / Inactive)
// POST /api/owner/toggle-car
// ------------------------------------------------------------
export const toggleCarAvailability = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;

        const car = await Car.findById(carId);
        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }

        // Security check: ensure only the owner can toggle their own car
        if (car.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        // Invert the boolean availability flag
        car.isAvailable = !car.isAvailable;
        await car.save();

        res.json({
            success: true,
            message: "Availability toggled",
            isAvailable: car.isAvailable
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------
// 5. DELETE A CAR LISTING
// POST /api/owner/delete-car
// ------------------------------------------------------------
export const deleteCar = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;

        const car = await Car.findById(carId);
        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }

        // Security check: ensure only the owner can delete their own car
        if (car.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        await Car.findByIdAndDelete(carId);

        res.json({
            success: true,
            message: "Car removed successfully"
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------
// 6. GET OWNER DASHBOARD METRICS (Host HQ)
// GET /api/owner/dashboard
// ------------------------------------------------------------
export const getDashboardData = async (req, res) => {
    try {
        const { _id, role } = req.user;

        // Role verification
        if (role !== "owner") {
            return res.json({ success: false, message: "Unauthorized" });
        }

        // Fetch owner's cars and bookings
        const cars = await Car.find({ owner: _id });
        const bookings = await Booking.find({ owner: _id })
            .populate("car")
            .sort({ createdAt: -1 });

        // Count pending vs completed bookings
        const pendingBookings = bookings.filter(b => b.status === "pending");
        const completedBookings = bookings.filter(b => b.status === "confirmed");

        // Calculate confirmed revenue for the current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const monthlyRevenue = bookings
            .filter(b =>
                b.status === "confirmed" &&
                b.createdAt >= startOfMonth &&
                b.createdAt < startOfNextMonth
            )
            .reduce((total, b) => total + (b.price || 0), 0);

        // Assemble dashboard summary object
        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0, 3),
            monthlyRevenue
        };

        res.json({
            success: true,
            dashboardData
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------
// 7. UPDATE PROFILE AVATAR IMAGE
// POST /api/owner/update-image
// ------------------------------------------------------------
export const updateUserImage = async (req, res) => {
    try {
        const { _id } = req.user;
        const imageFile = req.file;

        if (!imageFile) {
            return res.json({ success: false, message: "Image file required" });
        }

        // Upload avatar image to ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const uploadResponse = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/users"
        });

        // Optimize avatar: 400px width, webp format
        const optimizedImageUrl = imagekit.url({
            path: uploadResponse.filePath,
            transformation: [
                { width: "400" },
                { quality: "auto" },
                { format: "webp" }
            ]
        });

        // Update user record with new profile image URL
        await User.findByIdAndUpdate(_id, { image: optimizedImageUrl });

        // Clean up local temp file
        if (fs.existsSync(imageFile.path)) {
            fs.unlinkSync(imageFile.path);
        }

        res.json({ success: true, message: "Image Updated" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
