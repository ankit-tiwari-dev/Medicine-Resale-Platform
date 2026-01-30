# Medicine Resale Platform - API Documentation

Base URL: `http://localhost:5000/api/v1`

## Authentication (`/auth`)

### Register
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**: `{ name, email, password, phone, role }`

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**: `{ email, password }`

### Verify OTP
- **URL**: `/auth/verify-otp`
- **Method**: `POST`
- **Body**: `{ email, otp }`

---

## Medicines (`/medicines`)

### Upload Medicine (Seller)
- **URL**: `/medicines/upload`
- **Method**: `POST`
- **Headers**: `Content-Type: multipart/form-data`
- **Body**: `images` (files), `description` (text)
- **Notes**: Uses AI to extract Name, MRP, Expiry, Batch.

### Get My Medicines (Seller)
- **URL**: `/medicines/my-medicines`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`

### Browse Medicines
- **URL**: `/medicines`
- **Method**: `GET`
- **Query Params**: `?search=name&minPrice=10&sort=price_asc`

### Get Medicine Details
- **URL**: `/medicines/:id`
- **Method**: `GET`

### Update Medicine
- **URL**: `/medicines/:id`
- **Method**: `PATCH`
- **Body**: `{ name, price, description, ... }`

---

## Cart (`/cart`)

### Get Cart
- **URL**: `/cart`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`

### Add to Cart
- **URL**: `/cart/add`
- **Method**: `POST`
- **Body**: `{ medicineId, quantity }`

### Remove from Cart
- **URL**: `/cart/remove/:medicineId`
- **Method**: `DELETE`

### Clear Cart
- **URL**: `/cart/clear`
- **Method**: `DELETE`

---

## Orders (`/orders`)

### Create Order (Checkout)
- **URL**: `/orders`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "items": ["medicineId1", "medicineId2"], // Optional if buying from cart (frontend sends IDs)
    "shippingAddress": "123 St, City"
  }
  ```
- **Notes**: 
  - Supports single item purchase via `medicineId`.
  - Supports multi-item purchase via `items`.
  - Automatically groups items by Seller and creates separate Orders.

### Get My Orders
- **URL**: `/orders/my-orders`
- **Method**: `GET`

### Get Order Details
- **URL**: `/orders/:id`
- **Method**: `GET`

---

## Payment (`/payment`) - Razorpay

### Create Payment Order
- **URL**: `/payment/create-order`
- **Method**: `POST`
- **Body**: `{ amount: 100 }` (Amount in INR)
- **Response**: `{ id: "order_xyz", amount: 10000, ... }`

### Verify Payment
- **URL**: `/payment/verify`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "razorpay_order_id": "order_xyz",
    "razorpay_payment_id": "pay_abc",
    "razorpay_signature": "signature_string",
    "order_db_ids": ["db_order_id_1", "db_order_id_2"] // Optional: IDs of orders to mark as paid
  }
  ```

---

## Admin (`/admin`)
- `/admin/medicines`: Get all medicines
- `/admin/medicines/:id/verify`: Approve/Reject medicine
- `/admin/users`: Manage users
- `/admin/orders`: View all orders
- `/admin/withdrawals`: Manage withdraw requests

## Wallet (`/wallet`)
- `/wallet/balance`: Get balance
- `/wallet/withdraw`: Request withdrawal

## Rider (`/rider`)
- `/rider/tasks`: View assigned tasks
- `/rider/confirm-collection`: Upload proof of collection
