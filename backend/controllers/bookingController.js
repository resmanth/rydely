// ============================================================
// bookingController.js — Rental Bookings Controller
// ------------------------------------------------------------
// This controller manages all car rental transactions:
//   1. checkAvailabilityOfCar: filters cars available for given dates & city
//   2. createBooking: verifies availability, computes price, creates booking
//   3. getUserBookings: retrieves bookings made by the logged-in renter
//   4. getOwnerBookings: retrieves rental requests for the host's fleet
//   5. changeBookingStatus: allows host to confirm/cancel/complete a booking
// ============================================================

import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import checkAvailability from "../utils/checkAvailability.js";

// ------------------------------------------------------------
// 1. CHECK CAR AVAILABILITY
// POST /api/booking/check-availability
// ------------------------------------------------------------
export const checkAvailabilityOfCar = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.body;

        // Fetch all active cars in the requested city
        const cars = await Car.find({
            location,
            isAvailable: true
        });

        // Check each car's booking calendar to avoid double-booking
        const availabilityChecks = cars.map(async (car) => {
            const isFree = await checkAvailability(
                car._id,
                pickupDate,
                returnDate
            );

            return {
                ...car._doc,
                isAvailable: isFree
            };
        });

        const checkedCars = await Promise.all(availabilityChecks);

        // Keep only cars that have no overlapping confirmed/pending bookings
        const availableCars = checkedCars.filter(car => car.isAvailable === true);

        res.json({
            success: true,
            availableCars
        });

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// ------------------------------------------------------------
// 2. CREATE A NEW BOOKING
// POST /api/booking/create (protected by auth middleware)
// ------------------------------------------------------------
export const createBooking = async (req, res) => {
    try {
        const { _id } = req.user;
        const { car, pickupDate, returnDate } = req.body;

        // Double check car is still free for selected dates
        const isAvailable = await checkAvailability(car, pickupDate, returnDate);
        if (!isAvailable) {
            return res.json({ success: false, message: "Car is not available" });
        }

        const carData = await Car.findById(car);
        if (!carData) {
            return res.json({ success: false, message: "Car not found" });
        }

        // Calculate rental duration in days
        const pickup = new Date(pickupDate);
        const dropoff = new Date(returnDate);
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const numberOfDays = Math.max(1, Math.ceil((dropoff - pickup) / millisecondsPerDay));

        // Total price = daily rate * number of rental days
        const price = carData.pricePerDay * numberOfDays;

        // Create booking record with status defaults to "pending"
        await Booking.create({
            car,
            owner: carData.owner,
            user: _id,
            pickupDate,
            returnDate,
            price
        });

        res.json({ success: true, message: "Booking Created" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------
// 3. GET LOGGED-IN RENTER'S BOOKINGS
// GET /api/booking/user
// ------------------------------------------------------------
export const getUserBookings = async (req, res) => {
    try {
        const { _id } = req.user;

        // Find all bookings made by this user, sorted newest first
        const bookings = await Booking.find({ user: _id })
            .populate("car")
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------
// 4. GET ALL BOOKINGS FOR LOGGED-IN OWNER'S FLEET
// GET /api/booking/owner
// ------------------------------------------------------------
export const getOwnerBookings = async (req, res) => {
    try {
        if (req.user.role !== 'owner') {
            return res.json({ success: false, message: "Unauthorized" });
        }

        // Find all bookings for cars owned by this host, exclude renter's hashed password
        const bookings = await Booking.find({ owner: req.user._id })
            .populate('car')
            .populate('user', '-password')
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// ------------------------------------------------------------
// 5. UPDATE BOOKING STATUS (Confirm / Cancel / Complete)
// POST /api/booking/change-status
// ------------------------------------------------------------
export const changeBookingStatus = async (req, res) => {
    try {
        const { _id } = req.user;
        const { bookingId, status } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        // Security check: ensure only the car owner can change booking status
        if (booking.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        booking.status = status;
        await booking.save();

        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
