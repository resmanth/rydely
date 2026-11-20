/**
 * api.js — Centralised API service for all backend communication.
 *
 * This file provides:
 *   - `apiRequest(endpoint, options)` — the core fetch wrapper used everywhere.
 *   - `carsApi`    — methods for car-related endpoints (check availability).
 *   - `bookingApi` — methods for booking-related endpoints (create, list, status change).
 *   - `ownerApi`   — methods for car-owner endpoints (add car, toggle, delete, dashboard).
 *
 * How apiRequest works:
 *   1. Reads the JWT token from localStorage (or from options).
 *   2. Attaches it to the Authorization header (raw token, no "Bearer " prefix).
 *   3. Makes the fetch request to the backend.
 *   4. If the response is 401 (unauthorized), fires a custom DOM event so AuthContext
 *      can automatically log the user out.
 *   5. Throws an ApiError with a message and status code on any failure.
 */

// --- Configuration ---
// The backend URL comes from the VITE_API_URL environment variable,
// falling back to localhost:3000 during development.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const TOKEN_KEY = 'rydely-token';

// ============================================================
// ApiError — Custom error class that includes the HTTP status code
// ============================================================
export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

// ============================================================
// apiRequest — Core fetch wrapper used by all API methods
// ============================================================
export const apiRequest = async (endpoint, options = {}) => {
    // --- Build Headers ---
    const token = options.token ?? localStorage.getItem(TOKEN_KEY);
    const isFormData = options.body instanceof FormData;

    const headers = {
        // If the body is FormData (file upload), let the browser set Content-Type automatically.
        // Otherwise, default to JSON.
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
    };
    if (token) headers.Authorization = token; // raw token, NO "Bearer " prefix

    // --- Make the Fetch Request ---
    let response;
    try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    } catch {
        // Network error (server down, no internet, etc.)
        throw new ApiError('Cannot reach the server. Please try again.', 0);
    }

    // --- Parse the Response Body ---
    let data = {};
    try {
        data = await response.json();
    } catch {
        // Some responses may not have a JSON body — that's okay
    }

    // --- Handle 401 Unauthorized ---
    // Fire a custom event so AuthContext can clear the session globally
    if (response.status === 401) {
        window.dispatchEvent(new Event('rydely:unauthorized'));
        throw new ApiError(data.message || 'Not authorized', 401);
    }

    // --- Handle Other Errors ---
    if (!response.ok || data.success === false) {
        throw new ApiError(data.message || 'Something went wrong', response.status);
    }

    return data;
};

// ============================================================
// Cars / Availability API
// ============================================================
export const carsApi = {
    /**
     * Check which cars are available for rent at a given location and date range.
     * POST /api/booking/check-availability
     */
    checkAvailability: ({ location, pickupDate, returnDate }) =>
        apiRequest('/api/booking/check-availability', {
            method: 'POST',
            body: JSON.stringify({ location, pickupDate, returnDate }),
        }),
};

// ============================================================
// Bookings API
// ============================================================
export const bookingApi = {
    /** Create a new booking. POST /api/booking/create */
    create: ({ car, pickupDate, returnDate }) =>
        apiRequest('/api/booking/create', {
            method: 'POST',
            body: JSON.stringify({ car, pickupDate, returnDate }),
        }),

    /** Get all bookings for the currently logged-in user. GET /api/booking/user */
    mine: () => apiRequest('/api/booking/user'),

    /** Get all bookings for cars owned by the current owner. GET /api/booking/owner */
    owner: () => apiRequest('/api/booking/owner'),

    /** Change a booking's status (approve, reject, etc.). POST /api/booking/change-status */
    changeStatus: ({ bookingId, status }) =>
        apiRequest('/api/booking/change-status', {
            method: 'POST',
            body: JSON.stringify({ bookingId, status }),
        }),
};

// ============================================================
// Owner API — Endpoints for car owners
// ============================================================
export const ownerApi = {
    /** Upgrade the current user's role to "owner". POST /api/owner/change-role */
    changeRole: () =>
        apiRequest('/api/owner/change-role', { method: 'POST' }),

    /** Add a new car listing. Sends FormData (includes image file). POST /api/owner/add-car */
    addCar: (formData) =>
        apiRequest('/api/owner/add-car', {
            method: 'POST',
            body: formData, // FormData — apiRequest skips Content-Type so browser sets multipart boundary
        }),

    /** Get all cars listed by the current owner. GET /api/owner/cars */
    cars: () => apiRequest('/api/owner/cars'),

    /** Toggle a car's availability on/off. POST /api/owner/toggle-car */
    toggleCar: (carId) =>
        apiRequest('/api/owner/toggle-car', {
            method: 'POST',
            body: JSON.stringify({ carId }),
        }),

    /** Delete a car listing permanently. POST /api/owner/delete-car */
    deleteCar: (carId) =>
        apiRequest('/api/owner/delete-car', {
            method: 'POST',
            body: JSON.stringify({ carId }),
        }),

    /** Get the owner dashboard summary (stats, recent bookings). GET /api/owner/dashboard */
    dashboard: () => apiRequest('/api/owner/dashboard'),
};
