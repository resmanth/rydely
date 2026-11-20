
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const TOKEN_KEY = 'rydely-token';

export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

export const apiRequest = async (endpoint, options = {}) => {
    const token = options.token ?? localStorage.getItem(TOKEN_KEY);
    const isForm = options.body instanceof FormData;
    const headers = {
        ...(isForm ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
    };
    if (token) headers.Authorization = token; // raw token, NO "Bearer "

    let response;
    try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    } catch {
        throw new ApiError('Cannot reach the server. Please try again.', 0);
    }

    let data = {};
    try {
        data = await response.json();
    } catch {
        /* non-json response */
    }

    if (response.status === 401) {
        window.dispatchEvent(new Event('rydely:unauthorized'));
        throw new ApiError(data.message || 'Not authorized', 401);
    }

    if (!response.ok || data.success === false) {
        throw new ApiError(data.message || 'Something went wrong', response.status);
    }

    return data;
};

// ── Cars / Availability ──────────────────────────────────────────────
export const carsApi = {
    checkAvailability: ({ location, pickupDate, returnDate }) =>
        apiRequest('/api/booking/check-availability', {
            method: 'POST',
            body: JSON.stringify({ location, pickupDate, returnDate }),
        }),
};

// ── Bookings ─────────────────────────────────────────────────────────
export const bookingApi = {
    create: ({ car, pickupDate, returnDate }) =>
        apiRequest('/api/booking/create', {
            method: 'POST',
            body: JSON.stringify({ car, pickupDate, returnDate }),
        }),
    mine: () => apiRequest('/api/booking/user'),
    owner: () => apiRequest('/api/booking/owner'),
    changeStatus: ({ bookingId, status }) =>
        apiRequest('/api/booking/change-status', {
            method: 'POST',
            body: JSON.stringify({ bookingId, status }),
        }),
};

// ── Owner ────────────────────────────────────────────────────────────
export const ownerApi = {
    changeRole: () =>
        apiRequest('/api/owner/change-role', { method: 'POST' }),
    addCar: (formData) =>
        apiRequest('/api/owner/add-car', {
            method: 'POST',
            body: formData, // FormData — apiRequest skips Content-Type
        }),
    cars: () => apiRequest('/api/owner/cars'),
    toggleCar: (carId) =>
        apiRequest('/api/owner/toggle-car', {
            method: 'POST',
            body: JSON.stringify({ carId }),
        }),
    deleteCar: (carId) =>
        apiRequest('/api/owner/delete-car', {
            method: 'POST',
            body: JSON.stringify({ carId }),
        }),
    dashboard: () => apiRequest('/api/owner/dashboard'),
};
