
import User from "../models/User.js";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";
import fs from "fs";
import imagekit from "../configs/imagekit.js";

// API to change user role to owner
export const changeRoleToOwner = async (req, res) => {
    try {
        const { _id } = req.user;

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


// API to add/list a car
export const addCar = async (req, res) => {
    try {
        const { _id } = req.user;

        const car = JSON.parse(req.body.carData);
        const imageFile = req.file;

        if (!imageFile) {
            return res.json({
                success: false,
                message: "Car image is required"
            });
        }

        // Read image from local storage
        const fileBuffer = fs.readFileSync(imageFile.path);

        // Upload image to ImageKit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/cars"
        });

        // Optimize image using ImageKit transformations
        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: "1280" },
                { quality: "auto" },
                { format: "webp" }
            ]
        });

        const image = optimizedImageUrl;

        await Car.create({
            ...car,
            owner: _id,
            image
        });

        // Remove temporary local file
        fs.unlinkSync(imageFile.path);

        res.json({
            success: true,
            message: "Car added successfully"
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


// API to get all cars belonging to an owner
export const getOwnerCars = async (req, res) => {
    try {
        const { _id } = req.user;

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


// API to toggle car availability
export const toggleCarAvailability = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;

        const car = await Car.findById(carId);

        if (!car) {
            return res.json({
                success: false,
                message: "Car not found"
            });
        }

        // Check whether the car belongs to this owner
        if (car.owner.toString() !== _id.toString()) {
            return res.json({
                success: false,
                message: "Unauthorized"
            });
        }

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


// API to delete a car
export const deleteCar = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;

        const car = await Car.findById(carId);

        if (!car) {
            return res.json({
                success: false,
                message: "Car not found"
            });
        }

        // Check whether the car belongs to this owner
        if (car.owner.toString() !== _id.toString()) {
            return res.json({
                success: false,
                message: "Unauthorized"
            });
        }

        // Delete the car document
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


// API to get owner dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const { _id, role } = req.user;

        if (role !== "owner") {
            return res.json({
                success: false,
                message: "Unauthorized"
            });
        }

        // Get all cars belonging to this owner
        const cars = await Car.find({ owner: _id });

        // Get all bookings belonging to this owner
        const bookings = await Booking.find({ owner: _id })
            .populate("car")
            .sort({ createdAt: -1 });

        // Get pending bookings
        const pendingBookings = await Booking.find({
            owner: _id,
            status: "pending"
        });

        // Get confirmed bookings
        const completedBookings = await Booking.find({
            owner: _id,
            status: "confirmed"
        });

        // Calculate current month's confirmed booking revenue
        const now = new Date();

        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const startOfNextMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
        );

        const monthlyRevenue = bookings
            .filter(booking =>
                booking.status === "confirmed" &&
                booking.createdAt >= startOfMonth &&
                booking.createdAt < startOfNextMonth
            )
            .reduce((total, booking) => total + booking.price, 0);

        // Prepare dashboard data
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



// API to update user image
export const updateUserImage = async (req, res) => {
    try {
        const { _id } = req.user;
        const imageFile = req.file;
        // Upload Image to ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/users'
        })
        // optimization through imagekit URL transformation
        var optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '400' },
                // Width resizing
                { quality: 'auto' }, // Auto compression
                { format: 'webp' }
                // Convert to modern format
            ]
        });
        to
        const image = optimizedImageUrl;
        await User.findByIdAndUpdate(_id, {image});
    res.json({success: true, message: "Image Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}