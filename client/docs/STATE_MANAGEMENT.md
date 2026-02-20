# State Management

MedAImart uses **React Context + custom hooks** — no Redux or Zustand. State is intentionally light and colocated.

---

## AuthContext (`src/context/AuthContext.jsx`)

The single source of truth for authentication state.

### Provider
Located in `App.jsx`:
```jsx
<AuthProvider>
  <AppRouter />
</AuthProvider>
```

### State Shape

| State | Type | Description |
|---|---|---|
| `user` | `object \| null` | Current logged-in user (`name`, `email`, `role`, `_id`) |
| `isAuthenticated` | `boolean` | Derived from `user !== null` |
| `otpSession` | `object \| null` | Temporary session data between login → OTP steps |
| `rateLimit` | `object` | Whether the user is rate-limited |

### Exposed Functions

| Function | Returns | Description |
|---|---|---|
| `login(payload)` | `{ success, otpRequired, user? }` | Sends credentials, handles direct login or OTP trigger |
| `register(payload)` | `{ success, userId }` | Creates a new account |
| `submitOtp(payload)` | `{ success, user }` | Verifies OTP, sets auth state |
| `logout()` | `void` | Clears tokens + user state, redirects to `/login` |
| `refreshUser()` | `void` | Re-fetches `/auth/me` to sync user data |

### Usage
```jsx
import { useAuth } from '@/hooks/useAuth';

const { user, login, logout } = useAuth();
```

---

## ThemeContext (`src/theme/ThemeContext.jsx`)

Manages dark/light mode. Persists preference to `localStorage`.

```jsx
import { useTheme } from '@/hooks/useTheme';

const { isDarkMode, toggleTheme } = useTheme();
```

Automatically applies `class="dark"` to `<html>` element for Tailwind dark mode.

---

## `useApiQuery` Hook (`src/hooks/useApiQuery.js`)

Generic hook for all async data fetching inside the app.

```js
const { data, loading, error, execute } = useApiQuery(fetchFn, autoRun);
```

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `fetchFn` | `async function` | The API function to call (from `src/api/`) |
| `autoRun` | `boolean` | If `true`, runs immediately on mount |

### Returns

| Field | Type | Description |
|---|---|---|
| `data` | `any` | Response data (from `response.data.data`) |
| `loading` | `boolean` | `true` while fetching |
| `error` | `string \| null` | Error message if request failed |
| `execute()` | `function` | Call manually to refetch |

### Example
```jsx
import { useApiQuery } from '@/hooks/useApiQuery';
import { getAdminStats } from '@/api/adminApi';

const { data: stats, loading } = useApiQuery(getAdminStats, true);
```

> **Important**: `autoRun = true` is safe for read-only GET calls. Use `autoRun = false` and call `execute()` manually for POST/PATCH forms.

---

## Local Component State

For form state, modals, and UI-only state, standard `useState` is used directly inside the component. There is no global form state management.

```jsx
const [form, setForm] = useState({ medicineId: '', riderId: '' });
const [loading, setLoading] = useState(false);
```
