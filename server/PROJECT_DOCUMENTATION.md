# Medicine Resale Platform - Project Documentation

Project Name: Medicine Resale & Verification Platform

Tech Stack
- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- AI APIs: Google Gemini (OCR + NLP extraction)
- Cloud Storage: Cloudinary
- Authentication: JWT (access + refresh), Google OAuth
- Payments: Razorpay

## Project Overview
This platform enables users to upload unused medicines for resale. The system uses AI to extract key details (name, expiry date, batch number, price) from uploaded images. Admins verify medicines, assign riders for collection, and approve collection so the seller wallet is credited. Buyers can browse verified listings, add to cart, and purchase medicines.

## User Panel Features
- Registration, login, OTP verification
- Upload medicine images
- AI extraction of:
  - Medicine name
  - Expiry date (validated: must be at least 30 days in the future)
  - Batch number
  - MRP/price
- Add medicine description
- Track upload status
- Wallet balance and transaction history
- Request withdrawal
- Order history and tracking
- Confirm delivery (buyer)

## Buyer Panel Features
- Browse listed medicines
- Search and filter (price, expiry, status)
- View medicine details
- Add to cart and purchase
- Order tracking and delivery confirmation

## Admin Panel Features
- Dashboard analytics (users, medicines, revenue)
- View uploaded medicines
- Verify medicine images and details
- Approve or reject listings with reason
- Assign riders for collection
- Approve collection and credit seller wallet
- Manage withdrawal requests (approve/reject)
- User management (list/update/delete)
- Order management (status updates)
- Admin activity logs

## Rider Panel Features
- Login with rider role
- View assigned collection tasks
- Upload proof of collection
- View rider stats (pending pickups, collected total)

## AI Integration
- Gemini models used to extract structured data from medicine images
- Fallback behavior when AI quota is exceeded
- Expiry validation rules enforced on upload/update

## Technology Stack (Implementation)
- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- AI: Google Gemini API
- Cloud Storage: Cloudinary
- Authentication: JWT, Google OAuth
- Payments and Wallet: Razorpay

## Database Collections
- Users
- Medicines
- Orders
- Wallets
- Transactions
- WithdrawRequests
- Riders
- AdminLogs
- Carts

## Project Workflow
1. User uploads medicine image
2. AI extracts details
3. Admin verifies data
4. Admin assigns rider for pickup
5. Rider collects medicine and uploads proof
6. Admin approves collection
7. User wallet is credited
8. Buyer purchases medicine
9. Admin updates order status (paid/shipped/delivered)
10. Buyer confirms delivery

## Future Enhancements
- Auto medicine verification
- QR code batch validation
- Real-time tracking
- Chat support
