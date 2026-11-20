/**
 * Maps a backend Car object → CarCard / CarDetails props.
 *
 * Fields the backend does NOT provide are left `undefined`
 * so components can hide them via their own conditional rendering.
 */
export const mapCar = (c) => ({
    id: c._id,
    name: `${c.brand} ${c.model}`.trim(),
    category: c.category,
    image: c.image,
    price: c.pricePerDay,
    location: c.location,
    isAvailable: c.isAvailable !== false,
    description: c.description,
    specs: [
        { label: 'Transmission', val: c.transmission },
        { label: 'Fuel', val: c.fuel_type },
        { label: 'Seats', val: `${c.seating_capacity} Seater` },
        { label: 'Year', val: String(c.year) },
    ],
    features: [],
    // These are intentionally NOT set — backend has no such data:
    // rating, tripsCount, badge, instantBooking, doorstepDelivery,
    // hostName, isSuperhost
});

/**
 * Maps a backend Booking object (with populated car) → Profile bookings UI shape.
 */
export const mapBooking = (booking) => {
    const car = booking.car || {};
    const pickup = new Date(booking.pickupDate);
    const ret = new Date(booking.returnDate);

    const fmtDate = (d) =>
        d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    return {
        _id: booking._id,
        car: `${car.brand || ''} ${car.model || ''}`.trim() || 'Unknown Car',
        type: (car.category || '').toUpperCase(),
        dates: `${fmtDate(pickup)} — ${fmtDate(ret)}`,
        price: `₹${(booking.price ?? 0).toLocaleString('en-IN')}`,
        status: (booking.status || 'pending').toUpperCase(),
        image: car.image || '',
    };
};
