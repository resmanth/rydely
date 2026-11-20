/**
 * carMapper.js — Transforms raw backend data into the shape our UI components expect.
 *
 * The backend returns Car and Booking objects with field names like `_id`, `pricePerDay`,
 * `fuel_type`, etc. Our React components (CarCard, CarDetails, Profile) expect a
 * different structure. These mapper functions bridge the gap.
 *
 * This keeps the mapping logic in one place, so if the backend fields change,
 * we only need to update this file.
 */

// ============================================================
// mapCar — Converts a backend Car object into CarCard / CarDetails props
// ============================================================
/**
 * @param {Object} car - A raw car object from the backend API
 * @returns {Object} - A transformed object matching what our CarCard/CarDetails components expect
 *
 * Fields the backend does NOT provide are left `undefined`
 * so components can hide them via their own conditional rendering.
 */
export const mapCar = (car) => ({
    id: car._id,
    name: `${car.brand} ${car.model}`.trim(),             // Combine brand + model into a display name
    category: car.category,
    image: car.image,
    price: car.pricePerDay,                                // Rename pricePerDay → price for the UI
    location: car.location,
    isAvailable: car.isAvailable !== false,                 // Default to true if field is missing
    description: car.description,
    specs: [
        { label: 'Transmission', val: car.transmission },
        { label: 'Fuel', val: car.fuel_type },
        { label: 'Seats', val: `${car.seating_capacity} Seater` },
        { label: 'Year', val: String(car.year) },
    ],
    features: [],
    // These fields are intentionally NOT set — the backend has no such data:
    // rating, tripsCount, badge, instantBooking, doorstepDelivery,
    // hostName, isSuperhost
});

// ============================================================
// mapBooking — Converts a backend Booking object into Profile bookings UI shape
// ============================================================
/**
 * @param {Object} booking - A raw booking object from the backend (with populated car)
 * @returns {Object} - A transformed object for the Profile page's booking list
 */
export const mapBooking = (booking) => {
    // The booking has a nested `car` object (populated by MongoDB).
    // If it's missing for some reason, default to an empty object.
    const car = booking.car || {};

    // --- Parse Dates ---
    const pickupDate = new Date(booking.pickupDate);
    const returnDate = new Date(booking.returnDate);

    // --- Format a Date as "01 Jan 2025" (Indian locale) ---
    const formatDate = (date) =>
        date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    return {
        _id: booking._id,
        car: `${car.brand || ''} ${car.model || ''}`.trim() || 'Unknown Car',  // Display name
        type: (car.category || '').toUpperCase(),                               // e.g. "SUV"
        dates: `${formatDate(pickupDate)} — ${formatDate(returnDate)}`,         // e.g. "01 Jan 2025 — 05 Jan 2025"
        price: `₹${(booking.price ?? 0).toLocaleString('en-IN')}`,             // e.g. "₹3,499"
        status: (booking.status || 'pending').toUpperCase(),                    // e.g. "CONFIRMED"
        image: car.image || '',
    };
};
