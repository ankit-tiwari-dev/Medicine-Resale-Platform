# Frontend Architecture

## Folder Structure

```
client/
├── docs/                        ← You are here
├── public/                      ← Static assets (favicon etc.)
├── src/
│   ├── api/                     ← All API call functions, grouped by domain
│   │   ├── adminApi.js
│   │   ├── authApi.js
│   │   ├── cartApi.js
│   │   ├── medicineApi.js
│   │   ├── orderApi.js
│   │   ├── paymentApi.js
│   │   ├── riderApi.js
│   │   ├── walletApi.js
│   │   └── ...
│   ├── assets/                  ← Images and static brand files
│   ├── components/
│   │   ├── auth/                ← Auth-specific components (AuthSplitLayout, AuthCard)
│   │   ├── common/              ← Shared UI: Button, Badge, EmptyState, Spinner...
│   │   ├── forms/               ← FormInput and form field wrappers
│   │   ├── landing/             ← Landing page sections
│   │   └── layout/              ← Header, Footer, Sidebar, AdminFigmaHeader...
│   ├── context/
│   │   └── AuthContext.jsx      ← Global auth state (user, login, logout, submitOtp)
│   ├── hooks/
│   │   ├── useApiQuery.js       ← Generic async data fetch hook
│   │   ├── useAuth.js           ← Reads from AuthContext
│   │   └── useTheme.js          ← Reads from ThemeContext
│   ├── layouts/
│   │   ├── AppLayout.jsx        ← Buyer/Seller shell (Header + Outlet)
│   │   ├── AdminLayout.jsx      ← Admin shell (AdminFigmaHeader + Outlet)
│   │   ├── AuthLayout.jsx       ← Centered auth card layout
│   │   ├── AuthSplitLayout.jsx  ← Split-screen auth variant
│   │   └── RiderLayout.jsx      ← Rider shell
│   ├── pages/
│   │   ├── admin/               ← Admin-only pages
│   │   ├── buyer/               ← Buyer-specific pages
│   │   ├── public/              ← Login, Register, OTP, Landing, Browse
│   │   ├── rider/               ← Rider-specific pages
│   │   └── user/                ← Shared user pages (Profile, Orders, Wallet...)
│   ├── routes/
│   │   ├── AppRouter.jsx        ← Route tree (BrowserRouter + all routes)
│   │   └── ProtectedRoute.jsx   ← Role-based route guard
│   ├── services/
│   │   └── api.js               ← Axios instance + interceptors
│   ├── styles/                  ← Global CSS + Tailwind base layers
│   ├── theme/
│   │   └── ThemeContext.jsx     ← Dark/light mode toggle and persistence
│   ├── utils/
│   │   ├── constants.js         ← API_BASE_URL, ROLES, STORAGE_KEYS
│   │   ├── errors.js            ← extractErrorMessage utility
│   │   └── formatters.js        ← Currency, date formatting helpers
│   ├── App.jsx                  ← Wraps AppRouter with all providers
│   └── main.jsx                 ← Entry point, ReactDOM.createRoot
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Key Design Decisions

### 1. Provider Stack (`App.jsx`)
All providers are composed in `App.jsx` in this order:
```
ThemeProvider → AuthProvider → BrowserRouter → AppRouter
```

### 2. Route Guards (`ProtectedRoute`)
- Checks `user` from `AuthContext`; if not logged in → redirects to `/login`
- Accepts an optional `roles` prop (array). If the user's role is not in the list → redirects to their default dashboard
- Admin fallback is always `/admin`, not `/dashboard`

### 3. API Layer (`src/api/`)
Every domain has its own file. Each file exports named async functions that call the shared Axios instance from `src/services/api.js`. No raw `axios` calls exist in page components.

### 4. Data Fetching (`useApiQuery`)
```js
const { data, loading, error, execute } = useApiQuery(fetchFn, autoRun);
```
- `autoRun = true` triggers the fetch on mount
- `execute()` can be called manually to refresh
- Returns `{ data, loading, error }` — no external state management library needed
