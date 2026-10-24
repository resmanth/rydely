<div align="center">

# 🏎️ R Y D E L Y

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1000&color=6C63FF&center=true&vCenter=true&random=false&width=500&lines=Book+your+ride+in+seconds+%F0%9F%9A%97;List+your+cars+and+earn+%F0%9F%92%B0;Full-stack+car+rental+platform+%E2%9A%A1" alt="Typing SVG" />

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](https://jwt.io/)

<br/>

![GitHub repo size](https://img.shields.io/github/repo-size/resmanth/rydely?style=flat-square&color=6C63FF)
![GitHub last commit](https://img.shields.io/github/last-commit/resmanth/rydely?style=flat-square&color=6C63FF)
![GitHub](https://img.shields.io/github/license/resmanth/rydely?style=flat-square&color=6C63FF)

<br/>

[**🚀 Getting Started**](#-getting-started-1) · [**📡 API Reference**](#-api-reference) · [**🏗️ Architecture**](#-architecture) · [**🤝 Contributing**](#-contributing)

</div>

<br/>

## 🎯 What is Rydely?

> **Rydely** is a modern, full-stack car rental platform that bridges the gap between customers looking for rides and vehicle owners ready to earn. Seamless booking. Real-time availability. Role-based dashboards. All in one place.

```
  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │   Customer   │────▶│    Rydely     │◀────│  Car Owner   │
  │  Browse/Book │     │   Platform   │     │  List/Manage │
  └──────────────┘     └──────┬───────┘     └──────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   Admin Dashboard  │
                    │   Monitor & Control│
                    └───────────────────┘
```

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
<br><strong>React</strong>
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=nodejs" width="48" height="48" alt="Node.js" />
<br><strong>Node.js</strong>
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=express" width="48" height="48" alt="Express" />
<br><strong>Express</strong>
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=postgres" width="48" height="48" alt="PostgreSQL" />
<br><strong>PostgreSQL</strong>
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=prisma" width="48" height="48" alt="Prisma" />
<br><strong>Prisma</strong>
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=css" width="48" height="48" alt="CSS" />
<br><strong>CSS</strong>
</td>
</tr>
</table>

---

## 🚀 Getting Started

> **Prerequisites:** Node.js `v18+` · PostgreSQL `v14+` · npm or yarn

#### 1️⃣ Clone & Install

```bash
# Clone the repo
git clone https://github.com/resmanth/rydely.git && cd rydely

# Install backend deps
cd server && npm install

# Install frontend deps
cd ../client && npm install
```

#### 2️⃣ Configure Environment

Create `server/.env`:

```env
# 🗄️ Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/rydely"

# 🔐 Auth
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# ⚙️ Server
PORT=5000
NODE_ENV=development
```

#### 3️⃣ Database Setup

```bash
cd server
npx prisma migrate dev --name init    # Run migrations
npx prisma db seed                     # Seed data (optional)
```

#### 4️⃣ Launch

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm start
```

<div align="center">

| Service    | URL                         |
| ---------- | --------------------------- |
| 🌐 Frontend | `http://localhost:3000`     |
| ⚡ API      | `http://localhost:5000`     |

</div>

---

## 📡 API Reference

<details>
<summary><strong>🔐 Authentication</strong></summary>

<br/>

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login & get token |
| `GET` | `/api/auth/me` | Get current user profile |

</details>

<details>
<summary><strong>🚗 Vehicles</strong></summary>

<br/>

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `GET` | `/api/vehicles` | List all available vehicles |
| `GET` | `/api/vehicles/:id` | Get vehicle details |
| `POST` | `/api/vehicles` | Add a new vehicle *(owner)* |
| `PUT` | `/api/vehicles/:id` | Update vehicle *(owner)* |
| `DELETE` | `/api/vehicles/:id` | Remove vehicle *(owner)* |

</details>

<details>
<summary><strong>📅 Bookings</strong></summary>

<br/>

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `GET` | `/api/bookings` | Get user's bookings |
| `POST` | `/api/bookings` | Create a booking |
| `PATCH` | `/api/bookings/:id` | Update booking status *(owner/admin)* |
| `DELETE` | `/api/bookings/:id` | Cancel a booking |

</details>

<details>
<summary><strong>⭐ Reviews</strong></summary>

<br/>

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `GET` | `/api/vehicles/:id/reviews` | Get reviews for a vehicle |
| `POST` | `/api/vehicles/:id/reviews` | Add a review |

</details>

---

## 🏗️ Architecture

```
rydely/
│
├── 📂 client/                    # ⚛️  React Frontend
│   ├── public/
│   └── src/
│       ├── components/           #     Reusable UI components
│       ├── pages/                #     Page-level views
│       ├── services/             #     API service layer
│       ├── context/              #     React context providers
│       ├── hooks/                #     Custom hooks
│       ├── utils/                #     Helper utilities
│       └── App.js                #     Root component
│
├── 📂 server/                    # 🟢 Node.js/Express Backend
│   ├── prisma/
│   │   ├── schema.prisma         #     Database schema
│   │   ├── migrations/           #     DB migrations
│   │   └── seed.js               #     Database seeder
│   ├── src/
│   │   ├── controllers/          #     Route handlers
│   │   ├── middleware/           #     Auth & validation
│   │   ├── routes/               #     Route definitions
│   │   ├── services/             #     Business logic
│   │   ├── utils/                #     Helpers
│   │   └── index.js              #     Entry point
│   └── .env                      #     Environment config
│
└── 📄 README.md
```

---

## 🤝 Contributing

We love contributions! Here's how to get involved:

```
1. Fork it 🍴
2. Create your branch    →  git checkout -b feature/awesome-thing
3. Commit changes        →  git commit -m 'Add awesome thing'
4. Push to branch        →  git push origin feature/awesome-thing
5. Open a Pull Request   →  🎉
```

> **Please** follow the existing code style, write meaningful commits, and add tests where applicable.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=6C63FF&height=100&section=footer" width="100%"/>

**Built with ❤️ by [Ujjain gang](https://github.com/resmanth)**

⭐ Star this repo if you found it helpful!

</div>
