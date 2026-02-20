# MedAImart — Medicine Resale Platform

A full-stack, production-grade medicine resale platform with AI-powered medicine verification, Razorpay payments, role-based access control, rider KYC, and an admin terminal.

---

## 🏗️ Project Structure

```
Medicine Resale Platform/
├── client/          ← React + Vite frontend
│   └── docs/        ← Frontend documentation (start here)
├── server/          ← Node.js + Express backend
│   ├── API_DOCS.md  ← Full REST API reference
│   └── README.md    ← Backend setup guide
└── figma-design/    ← Design reference app
```

---

## ⚡ Quick Start

### Backend
```bash
cd server
npm install
cp .env.example .env    # Configure MongoDB, JWT, Razorpay, Cloudinary, Nodemailer
npm run dev             # Runs at http://localhost:5000
```

### Frontend
```bash
cd client
npm install
# Set VITE_API_BASE_URL=http://localhost:5000/api/v1 in .env
npm run dev             # Runs at http://localhost:5173
```

---

## 🔐 User Roles

| Role | Default Route | Capabilities |
|---|---|---|
| `user` / `seller` | `/dashboard` | Browse, buy, sell medicines, wallet |
| `rider` | `/rider/dashboard` | Assigned pickups, KYC, collection confirmation |
| `admin` | `/admin` | Full platform management |

---

## 📚 Documentation

| Area | Link |
|---|---|
| **Frontend** | [`client/docs/README.md`](./client/docs/README.md) |
| **Backend API** | [`server/API_DOCS.md`](./server/API_DOCS.md) |
| **Architecture** | [`client/docs/ARCHITECTURE.md`](./client/docs/ARCHITECTURE.md) |
| **Pages & Routes** | [`client/docs/PAGES_AND_ROUTING.md`](./client/docs/PAGES_AND_ROUTING.md) |
| **Components** | [`client/docs/COMPONENTS.md`](./client/docs/COMPONENTS.md) |
| **State & Data Flow** | [`client/docs/STATE_MANAGEMENT.md`](./client/docs/STATE_MANAGEMENT.md) |
| **API Integration** | [`client/docs/API_INTEGRATION.md`](./client/docs/API_INTEGRATION.md) |
| **Theming** | [`client/docs/THEMING.md`](./client/docs/THEMING.md) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + OTP (Nodemailer) + Google OAuth |
| Payments | Razorpay |
| Media | Cloudinary |
| AI | Groq Vision (medicine scan) |
| KYC | Sandbox.co.in |
| Deploy | Docker + ecosystem.config.js (PM2) |
