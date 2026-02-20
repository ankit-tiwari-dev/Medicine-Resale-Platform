# API Integration

The frontend communicates with the backend through a structured **3-layer API architecture**: Axios instance → domain API files → page components via `useApiQuery`.

---

## Layer 1: Axios Instance (`src/services/api.js`)

A single configured Axios instance used by all API functions.

- **Base URL**: `VITE_API_BASE_URL` (or falls back to `http://localhost:5000/api/v1`)
- **Request interceptor**: Attaches `Authorization: Bearer <token>` from `localStorage`
- **Response interceptor**: Handles `401` → attempts token refresh → retries → logs out on failure

---

## Layer 2: API Domain Files (`src/api/`)

Each backend domain has its own file. All functions are `async` and return the Axios response.

| File | Domain | Key Functions |
|---|---|---|
| `authApi.js` | Authentication | `login`, `register`, `verifyOtp`, `resendOtp`, `logout`, `getMe` |
| `adminApi.js` | Admin Terminal | `getAdminStats`, `getAdminLogs`, `getAdminUsers`, `getAdminOrders`, `verifyRiderKyc`, `assignRiderToMedicine`, `getAdminWithdrawals`, `approveWithdrawal`, `rejectWithdrawal`, `getPendingKycRiders`, `getAvailableRiders`, `getAdminMedicines`, `verifyMedicine`, `deleteAdminUser`, `updateAdminUser`, `updateAdminOrderStatus` |
| `medicineApi.js` | Medicines | `browseMedicines`, `uploadMedicine`, `getMyMedicines`, `getMedicineById` |
| `cartApi.js` | Cart | `getCart`, `addToCart`, `removeFromCart`, `clearCart` |
| `orderApi.js` | Orders | `createOrder`, `getMyOrders`, `getOrderById`, `getOrderTracking`, `confirmDelivery` |
| `paymentApi.js` | Razorpay | `createPaymentOrder`, `verifyPayment` |
| `walletApi.js` | Wallet | `getWalletBalance`, `getTransactions`, `requestWithdrawal` |
| `riderApi.js` | Rider Portal | `getRiderTasks`, `getRiderStats`, `confirmCollection` |

---

## Layer 3: Page Consumption

### Auto-fetched data (GET)

```jsx
import { useApiQuery } from '@/hooks/useApiQuery';
import { getAdminStats } from '@/api/adminApi';

const { data, loading, error } = useApiQuery(getAdminStats, true);
```

### Manual / form submission (POST, PATCH, DELETE)

```jsx
import { deleteAdminUser } from '@/api/adminApi';
import toast from 'react-hot-toast';

const handleDelete = async (userId) => {
  try {
    await deleteAdminUser(userId);
    toast.success('User removed');
  } catch (err) {
    toast.error('Failed to remove user');
  }
};
```

---

## Environment Variable

Set in `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

> All env variables must be prefixed with `VITE_` to be accessible in the browser via `import.meta.env`.

---

## Error Handling

Use `extractErrorMessage(error, fallback)` from `src/utils/errors.js`:

```js
import { extractErrorMessage } from '@/utils/errors';

toast.error(extractErrorMessage(error, 'Something went wrong'));
```

This parses `error.response.data.message` or falls back to the provided default string.
