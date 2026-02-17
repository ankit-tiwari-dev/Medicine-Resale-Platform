# Medicine Resale Platform - API Documentation

Base URL: `http://localhost:5000/api/v1`

Auth conventions
- `Authorization: Bearer <token>` required for all endpoints unless stated otherwise.
- `/admin/*` requires `admin` role.
- `/rider/*` requires `rider` role.

---

## System (`/`)

### Health Check
- **URL**: `/health`
- **Method**: `GET`
- **Role**: Public
- **Response**:
  ```json
  { "status": "ok", "uptime": 123.45 }
  ```

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

### Resend OTP
- **URL**: `/auth/resend-otp`
- **Method**: `POST`
- **Role**: Public
- **Body**:
  ```json
  { "email": "asha@example.com" }
  ```
- **Response**: `{ success: true, message: "A new verification code has been sent to your email." }`

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
  - `image` (file, exactly 1)
  - `description` (text, optional)
  - `stock` (number, default: 1)
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
    "stock": 10,
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
- `PATCH /admin/medicine/verify/:id`
  ```json
  { "action": "approve", "reason": "Images clear and details match" }
  ```

### Riders & Collection
- `GET /admin/available-riders`: List active riders.
- `POST /admin/assign-rider`
  ```json
  { "medicineId": "ID", "riderId": "ID" }
  ```
- `POST /admin/approve-collection`: Credits seller wallet.
  ```json
  { "medicineId": "ID" }
  ```

### KYC Management
- `GET /admin/kyc/pending`: List riders awaiting admin approval.
- `PATCH /admin/kyc/verify/:id`: Approve or Reject KYC.
  ```json
  { "action": "approve", "reason": "All documents match" }
  ```

### User & Order Management
- `GET /admin/users` (query: `role`, `page`, `limit`)
- `PATCH /admin/user/:id`: Update role/status.
- `GET /admin/orders`: List all orders.
- `PATCH /admin/order/status/:id`: Update status (e.g., `shipped`).

### Withdrawals
- `GET /admin/withdrawals` (query: `status`)
- `PATCH /admin/withdrawal/approve/:id`: Approves bank transfer.
- `PATCH /admin/withdrawal/reject/:id`

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

### 9. Rider KYC

#### Upload KYC Documents
- **URL**: `/api/v1/kyc/upload-docs`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: `Bearer <token>` (Rider Role)
  - `Content-Type`: `multipart/form-data`
- **Body**: (key: value)
  - `aadharFront`: File
  - `aadharBack`: File
  - `panFront`: File
  - `panBack`: File
  - `licenseFront`: File
  - `licenseBack`: File
  - `rcFront`: File
  - `rcBack`: File
  - `insuranceFront`: File
  - `bankProof`: File (Cancelled Cheque/Passbook)
  - `selfie`: File
- **Response**:
  ```json
  {
      "statusCode": 200,
      "data": { "documents": { ...urls... } },
      "message": "Documents uploaded successfully"
  }
  ```

#### Verify Aadhaar QR (Anchor)
- **URL**: `/api/v1/kyc/verify-aadhar-qr`
- **Method**: `POST`
- **Body**: `{ "qrData": "numeric_string_from_qr" }`
- **Response**: Extracted Aadhaar details + `isVerified: true`

#### Verify QR-OCR Parity (PAN/DL/RC)
- **URL**: `/api/v1/kyc/verify-parity`
- **Method**: `POST`
- **Body**:
  ```json
  {
      "docType": "pan", // or 'license', 'rc'
      "qrData": "scanned_qr_content"
  }
  ```
- **Response**:
  ```json
  {
      "statusCode": 200,
      "data": {
          "extractedData": { ... },
          "parityResult": {
              "visualName": "JOHN DOE",
              "visualNumber": "ABCDE1234F",
              "matchScore": 95,
              "isFabricated": false,
              "isMatch": true
          }
      },
      "message": "PAN verified with QR-OCR parity successfully"
  }
  ```

#### Verify Payout & Insurance Docs
- **URL**: `/api/v1/kyc/verify-payout`
- **Method**: `POST`
- **Response**:
  ```json
  {
      "statusCode": 200,
      "data": { "results": { "bank": "extracted", "insurance": "extracted" } },
      "message": "Payout documents processed successfully"
  }
  ```

#### Submit Consent
- **URL**: `/api/v1/kyc/submit-consent`
- **Method**: `POST`
- **Body**: `{ "consentGiven": true }`
- **Response**:
  ```json
  {
      "statusCode": 200,
      "data": { "status": "verified_pending_admin" },
      "message": "KYC submitted for final review. Admin will verify within 2 business days."
  }
  ```

---



