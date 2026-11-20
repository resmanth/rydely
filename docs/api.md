# Rydely Backend API Contract & Specifications

## Base URL & Configuration
- **Base URL**: `http://localhost:3000` (configurable via `VITE_API_URL`)
- **Authentication**: Raw JWT passed in HTTP header:
  ```http
  Authorization: <token>
  ```
  *(Note: No `Bearer ` prefix)*
- **Response Structure**:
  - Logical errors are returned with status **HTTP 200** and `{ success: false, message: string }`.
  - Auth failures (expired/missing token in protected routes) return **HTTP 401**.

---

## Required Backend Environment Variables
Configured in `backend/.env`:
- `PORT`: Express server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string (e.g. `mongodb+srv://...`)
- `JWT_SECRET`: Secret key for signing and verifying JSON Web Tokens
- `IMAGEKIT_PUBLIC_KEY`: ImageKit API public key for image uploads
- `IMAGEKIT_PRIVATE_KEY`: ImageKit API private key
- `IMAGEKIT_URL_ENDPOINT`: ImageKit URL endpoint for CDN delivery

---

## Endpoint Specifications

### 1. User Endpoints (`/api/user`)

#### Register
- **POST** `/api/user/register`
- **Body**: `{ "name": "...", "email": "...", "password": "..." (min 8 chars) }`
- **Response**: `{ "success": true, "token": "..." }`

#### Login
- **POST** `/api/user/login`
- **Body**: `{ "email": "...", "password": "..." }`
- **Response**: `{ "success": true, "token": "..." }`

#### Get Current User Profile (Auth Required)
- **GET** `/api/user/data`
- **Header**: `Authorization: <token>`
- **Response**:
  ```json
  {
    "success": true,
    "user": {
      "_id": "...",
      "name": "...",
      "email": "...",
      "role": "user" | "owner",
      "image": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

---

### 2. Availability & Cars (`/api/booking`)

#### Check Car Availability (Public)
- **POST** `/api/booking/check-availability`
- **Body**:
  ```json
  {
    "location": "Mumbai",
    "pickupDate": "2026-11-21T10:00:00.000Z",
    "returnDate": "2026-11-23T18:00:00.000Z"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "availableCars": [
      {
        "_id": "...",
        "owner": "ObjectId",
        "brand": "Mahindra",
        "model": "XUV700",
        "image": "...",
        "year": 2024,
        "category": "suv",
        "seating_capacity": 7,
        "fuel_type": "Diesel",
        "transmission": "Automatic",
        "pricePerDay": 3499,
        "location": "Mumbai",
        "description": "...",
        "isAvailable": true,
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
  ```
- **Notes**: Matches `location` with strict equality against `Car.location`. Only returns cars where `isAvailable: true` and no overlapping non-cancelled bookings exist.

---

### 3. Bookings (`/api/booking`)

#### Create Booking (Auth Required)
- **POST** `/api/booking/create`
- **Header**: `Authorization: <token>`
- **Body**:
  ```json
  {
    "car": "<carId>",
    "pickupDate": "2026-11-21T10:00:00.000Z",
    "returnDate": "2026-11-23T18:00:00.000Z"
  }
  ```
- **Response**: `{ "success": true, "message": "Booking Created" }`
- **Price Calculation**: Days = `Math.ceil((returnDate - pickupDate) / 86400000)`, Price = `days * car.pricePerDay`.

#### Get User Bookings (Auth Required)
- **GET** `/api/booking/user`
- **Header**: `Authorization: <token>`
- **Response**:
  ```json
  {
    "success": true,
    "bookings": [
      {
        "_id": "...",
        "car": { /* Populated Car object */ },
        "user": "<userId>",
        "owner": "<ownerId>",
        "pickupDate": "...",
        "returnDate": "...",
        "status": "pending" | "confirmed" | "cancelled",
        "price": 6998,
        "createdAt": "..."
      }
    ]
  }
  ```

#### Get Owner Bookings (Auth Required, Role: Owner)
- **GET** `/api/booking/owner`
- **Header**: `Authorization: <token>`
- **Response**: `{ "success": true, "bookings": [...] }` (populated with `car` and `user`)

#### Change Booking Status (Auth Required, Owner)
- **POST** `/api/booking/change-status`
- **Header**: `Authorization: <token>`
- **Body**: `{ "bookingId": "...", "status": "confirmed" | "cancelled" }`
- **Response**: `{ "success": true, "message": "Status Updated" }`

---

### 4. Owner Management (`/api/owner`)

#### Switch Role to Owner (Auth Required)
- **POST** `/api/owner/change-role`
- **Header**: `Authorization: <token>`
- **Response**: `{ "success": true, "message": "Role changed to owner" }`

#### Add Car Listing (Auth Required)
- **POST** `/api/owner/add-car`
- **Header**: `Authorization: <token>` (multipart/form-data)
- **Body**:
  - `image`: File (image binary)
  - `carData`: JSON string containing:
    ```json
    {
      "brand": "Porsche",
      "model": "911 Carrera",
      "year": 2023,
      "category": "luxury",
      "seating_capacity": 4,
      "fuel_type": "Petrol",
      "transmission": "Automatic",
      "pricePerDay": 24000,
      "location": "Mumbai",
      "description": "..."
    }
    ```
- **Response**: `{ "success": true, "message": "Car Added Successfully" }`

#### List Owner's Cars (Auth Required)
- **GET** `/api/owner/cars`
- **Header**: `Authorization: <token>`
- **Response**: `{ "success": true, "cars": [...] }`

#### Toggle Car Availability (Auth Required)
- **POST** `/api/owner/toggle-car`
- **Body**: `{ "carId": "..." }`
- **Response**: `{ "success": true, "message": "Car availability updated", "isAvailable": boolean }`

#### Delete Car (Auth Required)
- **POST** `/api/owner/delete-car`
- **Body**: `{ "carId": "..." }`
- **Response**: `{ "success": true, "message": "Car deleted successfully" }`

#### Owner Dashboard Analytics (Auth Required, Role: Owner)
- **GET** `/api/owner/dashboard`
- **Response**:
  ```json
  {
    "success": true,
    "dashboardData": {
      "totalCars": 3,
      "totalBookings": 8,
      "pendingBookings": 1,
      "completedBookings": 6,
      "recentBookings": [...],
      "monthlyRevenue": 145000
    }
  }
  ```
