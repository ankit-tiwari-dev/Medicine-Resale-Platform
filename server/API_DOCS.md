# Medicine Resale Platform - API Documentation

Base URL: `http://localhost:5000/api/v1`

Auth conventions
- `Authorization: Bearer <token>` required for all endpoints unless stated otherwise.
- `/admin/*` requires `admin` role.
- `/rider/*` requires `rider` role.

## Authentication (`/auth`)

### Register
- **URL**: `/auth/register`
- **Method**: `POST`
- **Role**: Public
- **Body**:
  ```json
  {
    "name": "Asha Patel",
    "email": "asha@example.com",
    "password": "StrongPass123"
  }
  ```
- **Response**: `{ userId }` and OTP is emailed.

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Role**: Public
- **Body**:
  ```json
  {
    "email": "asha@example.com",
    "password": "StrongPass123"
  }
  ```

### Verify OTP
- **URL**: `/auth/verify-otp`
- **Method**: `POST`
- **Role**: Public
- **Body**: one of the following
  ```json
  { "email": "asha@example.com", "otp": "123456" }
  ```
  ```json
  { "userId": "64f0c2e2c7a1c9b1c2f9d001", "userOtp": "123456" }
  ```

### Refresh Access Token
- **URL**: `/auth/refresh-token`
- **Method**: `POST`
- **Role**: Public
- **Body** (optional, if not using cookie):
  ```json
  { "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
  ```

### Logout
- **URL**: `/auth/logout`
- **Method**: `POST`
- **Role**: Authenticated

### Google OAuth
- **URL**: `/auth/google`
- **Method**: `GET`
- **Role**: Public

### Google OAuth Callback
- **URL**: `/auth/callback`
- **Method**: `GET`
- **Role**: Public

### Get Current User
- **URL**: `/auth/me`
- **Method**: `GET`
- **Role**: Authenticated

---

## Medicines (`/medicines`)

### Browse Medicines
- **URL**: `/medicines`
- **Method**: `GET`
- **Auth**: Not required
- **Role**: Public
- **Query Params**:
  - `status` (default: `listed`)
  - `search`
  - `minPrice`
  - `maxPrice`
  - `expiryAfter` (YYYY-MM-DD)
  - `sort` (`price_asc`, `price_desc`, `expiry`)

### Upload Medicine (Seller)
- **URL**: `/medicines/upload`
- **Method**: `POST`
- **Role**: Seller/User
- **Headers**: `Content-Type: multipart/form-data`
- **Body**:
  - `images` (files, up to 5)
  - `description` (text, optional)
  - `forceMock` (boolean or "true" to force AI mock)
- **Validation**:
  - If expiry date is extracted, it must be at least 30 days in the future.

### Get My Medicines (Seller)
- **URL**: `/medicines/my-medicines`
- **Method**: `GET`
- **Role**: Seller/User

### Update Medicine
- **URL**: `/medicines/:id`
- **Method**: `PATCH`
- **Role**: Seller (owner) or Admin
- **Body** (send any fields you want to update):
  ```json
  {
    "name": "Paracetamol 500mg",
    "expiryDate": "2027-12-31",
    "batchNumber": "BATCH-9821",
    "price": 120,
    "description": "Blister pack, sealed"
  }
  ```

### Get Medicine Details
- **URL**: `/medicines/:id`
- **Method**: `GET`
- **Role**: Authenticated

---

## Cart (`/cart`)

### Get Cart
- **URL**: `/cart`
- **Method**: `GET`
- **Role**: Buyer/User

### Add to Cart
- **URL**: `/cart/add`
- **Method**: `POST`
- **Role**: Buyer/User
- **Body**:
  ```json
  {
    "medicineId": "64f0c2e2c7a1c9b1c2f9d123",
    "quantity": 2
  }
  ```

### Remove from Cart
- **URL**: `/cart/remove/:medicineId`
- **Method**: `DELETE`
- **Role**: Buyer/User

### Clear Cart
- **URL**: `/cart/clear`
- **Method**: `DELETE`
- **Role**: Buyer/User

---

## Orders (`/orders`)

### Create Order (Checkout)
- **URL**: `/orders`
- **Method**: `POST`
- **Role**: Buyer/User
- **Body**:
  ```json
  {
    "items": ["64f0c2e2c7a1c9b1c2f9d123", "64f0c2e2c7a1c9b1c2f9d124"],
    "shippingAddress": "221B Baker Street, London"
  }
  ```
- **Notes**:
  - Use either `medicineId` (single buy) or `items` (multiple).
  - If both are provided, they are combined and de-duplicated.

### Get My Orders
- **URL**: `/orders/my-orders`
- **Method**: `GET`
- **Role**: Buyer/User

### Get Order Details
- **URL**: `/orders/:id`
- **Method**: `GET`
- **Role**: Buyer (owner), Seller (owner), or Admin

### Get Order Tracking
- **URL**: `/orders/:id/tracking`
- **Method**: `GET`
- **Role**: Buyer (owner), Seller (owner), or Admin

### Confirm Delivery (Buyer)
- **URL**: `/orders/:id/confirm-delivery`
- **Method**: `POST`
- **Role**: Buyer (owner)

---

## Payment (`/payment`) - Razorpay

### Create Payment Order
- **URL**: `/payment/create-order`
- **Method**: `POST`
- **Role**: Buyer/User
- **Body**:
  ```json
  {
    "amount": 499,
    "currency": "INR"
  }
  ```

### Verify Payment
- **URL**: `/payment/verify`
- **Method**: `POST`
- **Role**: Buyer/User
- **Body**:
  ```json
  {
    "razorpay_order_id": "order_JtY1gT3s5QpA1B",
    "razorpay_payment_id": "pay_JtY2Zc8d9LmN0P",
    "razorpay_signature": "generated_signature_here",
    "order_db_id": "64f0c2e2c7a1c9b1c2f9d555"
  }
  ```

---

## Admin (`/admin`)

### Medicines
- `GET /admin/medicines` (query: `status`)
- `POST /admin/medicines/:id/verify`
  ```json
  { "action": "approve", "reason": "Images clear and details match" }
  ```

### Riders
- `GET /admin/riders`
- `POST /admin/assign-rider`
  ```json
  { "medicineId": "64f0c2e2c7a1c9b1c2f9d123", "riderId": "64f0c2e2c7a1c9b1c2f9d777" }
  ```
- `POST /admin/approve-collection`
  ```json
  { "medicineId": "64f0c2e2c7a1c9b1c2f9d123" }
  ```

### Withdrawals
- `GET /admin/withdrawals` (query: `status`)
- `POST /admin/withdrawals/:id/approve`
- `POST /admin/withdrawals/:id/reject`
  ```json
  { "reason": "Bank details incomplete" }
  ```

### Users
- `GET /admin/users` (query: `role`, `page`, `limit`)
- `PATCH /admin/users/:id`
  ```json
  { "role": "rider", "isVerified": true }
  ```
- `DELETE /admin/users/:id`

### Orders
- `GET /admin/orders` (query: `status`)
- `PATCH /admin/orders/:id/status`
  ```json
  { "status": "shipped" }
  ```

### System
- `GET /admin/logs`
- `GET /admin/stats`

---

## Wallet (`/wallet`)
- `GET /wallet/balance`
- `GET /wallet/transactions`
- `POST /wallet/withdraw`
  ```json
  {
    "amount": 500,
    "bankDetails": {
      "accountNumber": "1234567890",
      "ifsc": "HDFC0001234",
      "accountName": "Asha Patel"
    }
  }
  ```

---

## Rider (`/rider`)
- `GET /rider/tasks` (query: `history=true`)
- `GET /rider/stats`
- `POST /rider/confirm-collection`
  - `Content-Type: multipart/form-data`
  - Fields: `medicineId` (text), `proof` (file)
