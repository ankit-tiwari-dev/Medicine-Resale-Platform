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

---

## Security & Production Guardrails
- **Global Rate Limit**: 100 requests per 15 minutes.
- **Auth Rate Limit**: 10 requests per hour (Login/OTP).
- **KYC Rate Limit**: 5 attempts per day.
- **Request ID**: Check the `X-Request-ID` response header for professional audit tracing.
- **Sanitization**: All inputs are sanitized against NoSQL injection and XSS.

---

## Disputes (`/disputes`)
- `POST /disputes/raise`: Raise a dispute for a delivered order.
  - `Body`: `orderId`, `reason`, `description`, `evidence` (files)
- `GET /disputes/`: List disputes (Role-based views).
- `POST /disputes/:disputeId/resolve` (Admin only): Resolve or Reject a dispute.

---

## Reviews (`/reviews`)
- `POST /reviews/add`: Review a purchased medicine.
  - `Body`: `orderId`, `medicineId`, `rating`, `comment`
- `GET /reviews/seller/:sellerId`: View average rating and history.
- `GET /reviews/medicine/:medicineId`: View specific medicine reviews.

---

## Admin (`/admin`)
**Auth**: `admin` role required.

### Medicines
- `GET /admin/medicines` (query: `status`)
- `POST /admin/medicines/:id/verify`
  ```json
  { "action": "approve", "reason": "Images clear and details match" }
  ```

### Riders & Collection
- `GET /admin/riders`: List available riders.
- `POST /admin/assign-rider`
  ```json
  { "medicineId": "ID", "riderId": "ID" }
  ```
- `POST /admin/approve-collection`: Credits seller wallet.
  ```json
  { "medicineId": "ID" }
  ```

### User & Order Management
- `GET /admin/users` (query: `role`, `page`, `limit`)
- `PATCH /admin/users/:id`: Update role/status.
- `GET /admin/orders`: List all orders.
- `PATCH /admin/orders/:id/status`: Update status (e.g., `shipped`).

### Withdrawals
- `GET /admin/withdrawals` (query: `status`)
- `POST /admin/withdrawals/:id/approve`: Approves bank transfer.
- `POST /admin/withdrawals/:id/reject`

### System Monitoring
- `GET /admin/logs`: view activity history.
- `GET /admin/stats`: Overview of system performance.

---

## Wallet (`/wallet`)
**Auth**: `seller/buyer` authenticated.

- `GET /wallet/balance`: View current balance and held amount.
- `GET /wallet/transactions`: View full history (credits/debits).
- `POST /wallet/withdraw`: Request a bank withdrawal.
  ```json
  {
    "amount": 500,
    "bankDetails": {
      "accountNumber": "123456789",
      "ifsc": "IFSC001"
    }
  }
  ```

---

## Rider (`/rider`)

**Base URL path**: `/rider`
**Auth**: `Authorization: Bearer <token>` required. User must have `rider` role.

### Get Assigned Tasks
- **URL**: `/rider/tasks`
- **Method**: `GET`
- **Query Params**: `history=true` (optional, shows completed tasks)
- **Response**: Array of Medicine objects with seller details.

### Get Rider Stats
- **URL**: `/rider/stats`
- **Method**: `GET`
- **Response**:
  ```json
  {
      "success": true,
      "data": {
          "totalCollected": 5,
          "pendingPickups": 2
      }
  }
  ```

### Confirm Collection
- **URL**: `/rider/confirm-collection`
- **Method**: `POST`
- **Headers**: `Content-Type: multipart/form-data`
- **Body**:
  - `medicineId` (text): ID of the medicine collected
  - `proof` (file): Image of the medicine in rider's hand
- **Response**: Updated medicine object.

---

### KYC Verification (Identity - Offline Flow)

Riders must complete these steps to be verified. The flow uses **Digital Aadhaar QR** and **OCR** for PAN/DL.

#### 1. Upload Document Photos
- **URL**: `/kyc/upload-docs`
- **Method**: `POST`
- **Headers**: `Content-Type: multipart/form-data`
- **Body**:
  - `aadharFront` (file)
  - `aadharBack` (file)
  - `panFront` (file)
  - `panBack` (file)
  - `licenseFront` (file)
  - `licenseBack` (file)
  - `selfie` (file): Live photo of the rider's face
- **Response**: URLs of the uploaded proofs.

#### 2. Verify Aadhaar via Secure QR
- **URL**: `/kyc/verify-aadhar-qr`
- **Method**: `POST`
- **Body**:
  ```json
  { "qrData": "20510656815277038..." } 
  ```
- **Notes**: 
  - Extract the "long decimal string" from the secure QR.
  - **Cross-Verification**: The system will automatically OCR the `aadharFront` and match the Name/DOB with the QR data. If they don't match, it returns a `document_mismatch` error.

#### 3. Extract PAN & DL Details (OCR)
- **URL**: `/kyc/verify-ocr`
- **Method**: `POST`
- **Response**: 
  ```json
  {
    "extractedData": {
      "pan": { "panNumber": "ABCDE1234F" },
      "license": { "licenseNumber": "DL-04-202300..." }
    }
  }
  ```
- **Notes**: Automatically processes the previously uploaded `panPhoto` and `licensePhoto` using AI.

#### 4. Final Consent
- **URL**: `/kyc/submit-consent`
- **Method**: `POST`
- **Body**: `{ "consentGiven": true }`
- **Response**: Status changed to `verified_pending_admin`.

---

### DigiLocker Flow (Alternative)
- `GET /kyc/digilocker/url`: Generates auth URL.
- `GET /kyc/digilocker/callback`: Handles verification callback.

