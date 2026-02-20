# MedAImart — Frontend Documentation

Welcome to the client-side documentation for **MedAImart**, an AI-powered medicine resale platform. This folder contains all technical references for the React frontend application.

---

## 📚 Documentation Index

| Document | Description |
|---|---|
| [Architecture](./ARCHITECTURE.md) | Folder structure, tech stack, build config |
| [Pages & Routing](./PAGES_AND_ROUTING.md) | All pages, their routes, and role-based guards |
| [Components](./COMPONENTS.md) | Reusable UI components reference |
| [State Management](./STATE_MANAGEMENT.md) | Context, hooks, and API data flow |
| [API Integration](./API_INTEGRATION.md) | How the frontend talks to the backend |
| [Theming & Styles](./THEMING.md) | Design tokens, dark mode, Tailwind config |

---

## 🚀 Quick Start

```bash
# Install dependencies
cd client
npm install

# Create .env file
cp .env.example .env   # Set VITE_API_BASE_URL

# Start dev server
npm run dev            # Runs at http://localhost:5173

# Lint check
npx eslint src/

# Production build
npm run build
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |
| HTTP | Axios (via `/src/services/api.js`) |
| Toasts | React Hot Toast |
| Theme | Custom `ThemeContext` (dark/light) |

---

## 🔐 User Roles

The app supports three distinct roles, each with separate pages and navigation:

| Role | Dashboard Route | Description |
|---|---|---|
| `user` / `seller` | `/dashboard` | Browse, buy, sell medicines, wallet |
| `rider` | `/rider/dashboard` | View assigned tasks, confirm pickups |
| `admin` | `/admin` | Platform management, KYC, analytics |

> Routing is enforced by `ProtectedRoute` — unauthorized access redirects to the appropriate role dashboard or login page.
