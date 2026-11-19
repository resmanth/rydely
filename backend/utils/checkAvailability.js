import Booking from "../models/Booking.js";

const checkAvailability = async (car, pickupDate, returnDate) => {

    const bookings = await Booking.find({
        car,
        status: { $ne: "cancelled" },
        pickupDate: { $lte: returnDate },
        returnDate: { $gte: pickupDate }
    });

    return bookings.length === 0;
};

export default checkAvailability;