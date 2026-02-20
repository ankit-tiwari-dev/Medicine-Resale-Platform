# Pages & Routing

All routes are defined in `src/routes/AppRouter.jsx`.

---

## Public Routes (No auth required)

| Route | Page | Description |
|---|---|---|
| `/` | `LandingPage` | Marketing homepage |
| `/browse` | `BrowseMedicinesPage` | AI-verified medicine catalog |
| `/login` | `LoginPage` | Email + password login with OTP flow |
| `/register` | `RegisterPage` | User registration |
| `/register-rider` | `RegisterRiderPage` | Rider account creation |
| `/verify-otp` | `OtpVerificationPage` | OTP entry after login/register |

---

## User / Seller Dashboard (`/dashboard`) — Role: `user`, `seller`

| Route | Page | Description |
|---|---|---|
| `/dashboard` | `DashboardHomePage` | Overview: orders, medicines, wallet |
| `/dashboard/my-medicines` | `MyMedicinesPage` | Seller's listed medicines |
| `/dashboard/upload-medicine` | `UploadMedicinePage` | AI-assisted medicine upload |
| `/dashboard/wallet` | `WalletPage` | Balance, transactions, withdrawals |
| `/dashboard/orders` | `OrdersPage` | Order history |
| `/dashboard/orders/:id` | `OrderDetailsPage` | Single order detail + tracking |
| `/dashboard/cart` | `CartPage` | Shopping cart + checkout |
| `/dashboard/profile` | `ProfilePage` | Account settings |

---

## Admin Terminal (`/admin`) — Role: `admin`

| Route | Page | Description |
|---|---|---|
| `/admin` | `AdminDashboardPage` | Stats, Revenue chart, Quick actions |
| `/admin/users` | `AdminUsersPage` | Manage platform users, roles |
| `/admin/orders` | `AdminOrdersPage` | All orders, status management |
| `/admin/medicines-review` | `AdminMedicinesReviewPage` | Approve/reject AI-scanned listings |
| `/admin/riders-kyc` | `AdminRidersKycPage` | Rider KYC onboarding gate |
| `/admin/assign-rider` | `AdminAssignRiderPage` | Bind riders to medicine lots |
| `/admin/withdrawals` | `AdminWithdrawalsPage` | Payout approval management |
| `/admin/logs` | `AdminLogsPage` | Immutable system audit trail |
| `/admin/stats` | `AdminStatsPage` | Deep analytics & raw data view |

---

## Rider Portal (`/rider`) — Role: `rider`

| Route | Page | Description |
|---|---|---|
| `/rider/dashboard` | `RiderDashboardPage` | Active tasks overview |
| `/rider/tasks` | `RiderTasksPage` | All assigned pickups |
| `/rider/kyc` | `RiderKycPage` | KYC document upload flow |
| `/rider/profile` | `RiderProfilePage` | Rider profile & settings |

---

## Route Guard — `ProtectedRoute`

```jsx
<ProtectedRoute roles={['admin']}>
  <AdminLayout />
</ProtectedRoute>
```

- **No `roles` prop** → any authenticated user can access
- **`roles` prop** → only users whose `user.role` is in the array can access
- Admin users who hit a non-admin route are redirected → `/admin`
- Non-authenticated users are redirected → `/login` with `state.from` preserved for post-login redirect

---

## Login → Redirect Flow

1. `LoginPage` calls `AuthContext.login()`
2. If `result.otpRequired`, navigates to `/verify-otp`
3. Otherwise (or after `OtpVerificationPage` OTP success):
   - If `user.role === 'admin'` → navigate to `/admin`
   - Else → restore `location.state.from` or default to `/dashboard`
