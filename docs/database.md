# Rydely Database Schema (MongoDB / Mongoose)

Rydely uses MongoDB connected via Mongoose ODM.

---

## 1. User Model (`backend/models/User.js`)

Represents registered platform members (both customers/riders and vehicle owners).

```javascript
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["owner", "user"], default: 'user' },
    image: { type: String, default: '' },
}, { timestamps: true });
```

### Fields:
- `_id`: `ObjectId` - Unique identifier
- `name`: `String` (Required) - User's full name
- `email`: `String` (Required, Unique) - User's email address
- `password`: `String` (Required) - Hashed password
- `role`: `String` (`"user"` | `"owner"`, default: `"user"`) - Access level
- `image`: `String` (Default: `""`) - Profile image URL
- `createdAt`: `Date` - Timestamp
- `updatedAt`: `Date` - Timestamp

---

## 2. Car Model (`backend/models/Car.js`)

Represents vehicles listed by hosts/owners available for rent.

```javascript
const carSchema = new mongoose.Schema({
    owner: { type: ObjectId, ref: 'User' },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    image: { type: String, required: true },
    year: { type: Number, required: true },
    category: { type: String, required: true },
    seating_capacity: { type: Number, required: true },
    fuel_type: { type: String, required: true },
    transmission: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });
```

### Fields:
- `_id`: `ObjectId` - Unique vehicle identifier
- `owner`: `ObjectId` (Ref: `User`) - Creator/Host of the car listing
- `brand`: `String` (Required) - Vehicle brand / manufacturer (e.g., `"Mahindra"`, `"BMW"`)
- `model`: `String` (Required) - Vehicle model (e.g., `"XUV700"`, `"911 Carrera"`)
- `image`: `String` (Required) - Hosted image URL (ImageKit)
- `year`: `Number` (Required) - Manufacturing year (e.g., `2024`)
- `category`: `String` (Required) - Vehicle classification (`"suv"`, `"mpv"`, `"4x4"`, `"luxury"`)
- `seating_capacity`: `Number` (Required) - Number of passenger seats
- `fuel_type`: `String` (Required) - `"Petrol"`, `"Diesel"`, `"Hybrid"`, `"Electric"`
- `transmission`: `String` (Required) - `"Automatic"`, `"Manual"`
- `pricePerDay`: `Number` (Required) - Daily rental fee in INR
- `location`: `String` (Required) - Exact pickup city (e.g., `"Mumbai"`, `"Bengaluru"`, `"Delhi NCR"`, `"Goa"`)
- `description`: `String` (Required) - Vehicle description and rental guidelines
- `isAvailable`: `Boolean` (Default: `true`) - Host availability toggle
- `createdAt`: `Date` - Timestamp
- `updatedAt`: `Date` - Timestamp

---

## 3. Booking Model (`backend/models/Booking.js`)

Tracks reservation requests and confirmed rentals.

```javascript
const bookingSchema = new mongoose.Schema({
    car: {
        type: ObjectId,
        ref: "Car",
        required: true
    },
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    owner: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    pickupDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },
    price: {
        type: Number,
        required: true
    }
}, { timestamps: true });
```

### Fields:
- `_id`: `ObjectId` - Booking identifier
- `car`: `ObjectId` (Ref: `Car`, Required) - Booked vehicle
- `user`: `ObjectId` (Ref: `User`, Required) - Renter
- `owner`: `ObjectId` (Ref: `User`, Required) - Host receiving the booking
- `pickupDate`: `Date` (Required) - Trip start date and time
- `returnDate`: `Date` (Required) - Trip return date and time
- `status`: `String` (`"pending"` | `"confirmed"` | `"cancelled"`, default: `"pending"`)
- `price`: `Number` (Required) - Calculated total price (`ceil(days) * pricePerDay`)
- `createdAt`: `Date` - Timestamp
- `updatedAt`: `Date` - Timestamp
