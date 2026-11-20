<div align="center">

# 🏎️ R Y D E L Y

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1000&color=FF3535&center=true&vCenter=true&random=false&width=500&lines=Book+your+ride+in+seconds+%F0%9F%9A%97;List+your+cars+and+earn+%F0%9F%92%B0;Full-stack+peer-to-peer+rental+%E2%9A%A1" alt="Typing SVG" />

<br/>

[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express 5](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![ImageKit](https://img.shields.io/badge/ImageKit-0055FF?style=for-the-badge&logo=imagekit&logoColor=white)](https://imagekit.io/)
[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](https://jwt.io/)

<br/>

[**🚀 Getting Started**](#-getting-started) · [**📡 API Reference**](#-api-reference) · [**🏗️ Architecture**](#-architecture) · [**🛠️ Tech Stack**](#-tech-stack) · [**🤝 Contributing**](#-contributing)

</div>

<br/>

## 🎯 What is Rydely?

> **Rydely** is a self-drive peer-to-peer car rental platform bridging the gap between drivers seeking machines and vehicle owners looking to monetize idle assets. Features real-time date availability, interactive 3D WebGL car visualizers, multi-city searching, host vehicle listing management, and instant booking workflows.

```
  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │   Renter     │────▶│    Rydely     │◀────│  Car Owner   │
  │ Search & Book│     │   Platform   │     │  List & Host │
  └──────────────┘     └──────┬───────┘     └──────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   Host Operations │
                    │ Fleet & Bookings  │
                    └───────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework & Tooling**: [React 19](https://react.dev/), [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **3D Graphics & Animations**: [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei)
- **Smooth Scrolling**: [Lenis](https://lenis.darkroom.engineering/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

### Backend
- **Runtime & Server**: [Node.js](https://nodejs.org/), [Express 5](https://expressjs.com/)
- **Database & ODM**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: JSON Web Tokens (JWT), Bcrypt password hashing
- **Media & Storage**: [ImageKit SDK](https://imagekit.io/) CDN, Multer multipart handling
- **Security & CORS**: CORS enabled, environment isolation

---

## 🚀 Getting Started

> **Prerequisites:** Node.js `v18+` · MongoDB connection URI · npm

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/resmanth/rydely.git
cd rydely
```

#### 2️⃣ Configure & Run Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.zues2dm.mongodb.net
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

Start the backend API:

```bash
npm run server
```

*(Server starts on `http://localhost:3000` and displays `Database Connected`)*

#### 3️⃣ Configure & Run Frontend

In a new terminal window:

```bash
cd frontend
npm install
```

Create `frontend/.env` (or copy from `.env.example`):

```env
VITE_API_URL=http://localhost:3000
```

Start Vite dev server:

```bash
npm run dev
```

<div align="center">

| Service    | URL                         |
| ---------- | --------------------------- |
| 🌐 Frontend | `http://localhost:5173`     |
| ⚡ Backend  | `http://localhost:3000`     |

</div>

---

## 📡 API Reference

All requests requiring authentication expect the raw JWT token in the `Authorization` header (`Authorization: <raw_jwt>`).

<details>
<summary><strong>🔐 User & Auth (<code>/api/user</code>)</strong></summary>

<br/>

| Method | Endpoint | Description | Auth Required |
|:------:|----------|-------------|:-------------:|
| `POST` | `/api/user/register` | Register new user account (`{ name, email, password }`) | ❌ |
| `POST` | `/api/user/login` | Login & receive JWT (`{ email, password }`) | ❌ |
| `GET` | `/api/user/data` | Get profile & current role (`user` / `owner`) | ✅ |

</details>

<details>
<summary><strong>🚘 Availability & Search (<code>/api/booking</code>)</strong></summary>

<br/>

| Method | Endpoint | Description | Auth Required |
|:------:|----------|-------------|:-------------:|
| `POST` | `/api/booking/check-availability` | Check available cars (`{ location, pickupDate, returnDate }`) | ❌ |

</details>

<details>
<summary><strong>📅 Bookings (<code>/api/booking</code>)</strong></summary>

<br/>

| Method | Endpoint | Description | Auth Required |
|:------:|----------|-------------|:-------------:|
| `POST` | `/api/booking/create` | Reserve vehicle (`{ car, pickupDate, returnDate }`) | ✅ |
| `GET` | `/api/booking/user` | Fetch active user's bookings | ✅ |
| `GET` | `/api/booking/owner` | Fetch reservations made on owner's cars | ✅ *(Owner)* |
| `POST` | `/api/booking/change-status` | Confirm or decline booking (`{ bookingId, status }`) | ✅ *(Owner)* |

</details>

<details>
<summary><strong>👑 Host & Fleet Operations (<code>/api/owner</code>)</strong></summary>

<br/>

| Method | Endpoint | Description | Auth Required |
|:------:|----------|-------------|:-------------:|
| `POST` | `/api/owner/change-role` | Upgrade current user role to `owner` | ✅ |
| `POST` | `/api/owner/add-car` | Add vehicle with image (multipart: `image`, `carData` JSON) | ✅ |
| `GET` | `/api/owner/cars` | Fetch all vehicles listed by the host | ✅ |
| `POST` | `/api/owner/toggle-car` | Toggle vehicle availability on/off (`{ carId }`) | ✅ |
| `POST` | `/api/owner/delete-car` | Permanently remove car listing (`{ carId }`) | ✅ |
| `GET` | `/api/owner/dashboard` | Fleet analytics (revenue, bookings count, recent rides) | ✅ *(Owner)* |

</details>

---

## 🏗️ Architecture

```
rydely/
│
├── 📂 frontend/                  # ⚛️ React 19 + Vite 6 + Tailwind 4
│   ├── public/
│   ├── src/
│   │   ├── assets/               #     3D models, textures, images, video backgrounds
│   │   ├── components/           #     CarCard, Navbar, 3D Canvas, Preloader, Hero
│   │   ├── context/              #     AuthContext (session, login, token management)
│   │   ├── data/                 #     Supported cities (canonical search mapping)
│   │   ├── pages/                #     Home, Cars, CarDetails, Profile, ListYourCar
│   │   │   └── owner/            #     Host HQ: Dashboard, Fleet Manager, Bookings
│   │   ├── services/             #     Centralized apiRequest, carMapper & API modules
│   │   ├── App.jsx               #     Router configuration & Global Layout
│   │   └── main.jsx              #     Vite entry point
│   ├── .env.example
│   └── package.json
│
├── 📂 backend/                   # 🟢 Express 5 + MongoDB + Mongoose
│   ├── configs/                  #     Database connection (db.js) & ImageKit (imagekit.js)
│   ├── controllers/              #     userController, bookingController, ownerController
│   ├── middleware/               #     auth.js (raw JWT validation), multer.js
│   ├── models/                   #     Mongoose schemas (User, Car, Booking)
│   ├── routes/                   #     userRoutes, bookingRoutes, ownerRoutes
│   ├── utils/                    #     checkAvailability helper
│   ├── server.js                 #     Express server entry point
│   └── package.json
│
├── 📂 docs/                      # 📑 Project Documentation
│   ├── api.md                    #     Detailed backend API contract & specifications
│   └── database.md               #     Database schemas & relationships
│
└── 📄 README.md
```

---

## 🤝 Contributing

```bash
1. Fork the repo 🍴
2. Create your feature branch    →  git checkout -b feature/awesome-feature
3. Commit your changes          →  git commit -m 'feat: Add awesome feature'
4. Push to the branch           →  git push origin feature/awesome-feature
5. Open a Pull Request          →  🎉
```

---

## 📄 License

Distributed under the **MIT License**.

<div align="center">
