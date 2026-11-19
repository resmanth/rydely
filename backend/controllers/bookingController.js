
import Car from "../models/Car.js";
import { checkAvailability } from "../utils/checkAvailability.js";

// API to check availability of cars for the given date and location
export const checkAvailabilityOfCar = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.body;

        // Fetch all available cars for the given location
        const cars = await Car.find({
            location,
            isAvailable: true
        });

        // Check car availability for the given date range using Promise
        const availableCarsPromises = cars.map(async (car) => {
            const isAvailable = await checkAvailability(
                car._id,
                pickupDate,
                returnDate
            );

            return {
                ...car._doc,
                isAvailable: isAvailable
            };
        });

        let availableCars = await Promise.all(availableCarsPromises);

        // Filter only available cars
        availableCars = availableCars.filter(
            car => car.isAvailable === true
        );

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



export const createBooking = async (req, res) => {
    try {
        const { _id } = req.user;
        const { car, pickupDate, returnDate } = req.body;
        const isAvailable = await checkAvailability(car, pickupDate, returnDate)
        if (!isAvailable) {
            return res.json({ success: false, message: "Car is not available" })
        }
        const carData = await Car.findById(car)

        // Calculate price based on pickupDate and returnDate
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noofDays = Math.ceil((returned - picked) / (1000 60 * 60 * 24))
        const price = carData.pricePerDay * noofDays;
        await Booking.create({ car, owner: carData.owner, user: _id, pickupDate, returnDate, price })
        res.json({ success: true, message: "Booking Created" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}