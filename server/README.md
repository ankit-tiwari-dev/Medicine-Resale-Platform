# Medicine Resale & Verification Platform

![Medicine AI Mart](https://img.shields.io/badge/Status-In--Development-orange)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue)
![AI Powered](https://img.shields.io/badge/AI-Gemini%20Included-green)

A state-of-the-art MERN platform designed for the safe resale of unused medicines. The system integrates advanced AI for data extraction and a zero-cost, tamper-proof identity verification system for riders.

---

## 🚀 Key Modules & System Flow

### 1. Medicine Resale Lifecycle
1.  **Selection & Upload**: Users upload medicine photos.
2.  **AI Extraction**: Google Gemini AI automatically extracts Name, Expiry, Batch No, and price from the image.
3.  **Admin Verification**: Admins review the AI-extracted data against the photo.
4.  **Rider Collection**: Admin assigns a rider. The rider collects the medicine and uploads proof.
5.  **Wallet Credit**: Upon successful collection, the seller's wallet is credited.
6.  **Listing**: Verified medicines are listed for buyers to purchase.

### 2. Zero-Cost KYC (Rider Identity)
A robust offline verification system that requires **Zero External API Costs**:
- **Aadhaar Secure QR (V4)**: Decodes government-signed QR data (Name, DOB, Photo) using digital signatures.
- **Cross-Verification**: Automatically matches the OCR text from the physical Aadhaar card against the signed data in the QR code to detect identity fraud.
- **Selfie Face-Match**: Riders upload a live selfie which the Admin compares with the government-extracted photo.

---

## 🛠️ Features

### User/Seller Panel
- **AI-Powered Upload**: Snap a photo and let AI fill in the medicine details.
- **Wallet System**: Track earnings and request bank withdrawals.
- **Order Tracking**: Monitor your sales and delivery status.

### Buyer Panel
- **Verified Marketplace**: Browse medicines that have been individually verified by admins.
- **Secure Checkout**: Integrated with **Razorpay** for seamless payments.
- **Delivery Confirmation**: One-click delivery confirmation to release funds.

### 3. Startup Readiness & Security
To ensure a 100% production-ready launch, we have implemented enterprise-grade guardrails:
- **Rate Limiting**: Protects against DDoS and brute-force on Login, OTP, and KYC endpoints.
- **Request ID Tracing**: Every request is assigned a unique `X-Request-ID` for professional audit logging.
- **NoSQL & XSS Sanitization**: Automatically blocks injection attacks and malicious scripts.
- **Inventory Reservation (Cart TTL)**: Medicines are "locked" for 15 minutes once added to a cart, preventing double-buy conflicts.

### 4. Marketplace Trust (Disputes & Reviews)
- **Buyer Protection**: Buyers can raise disputes for wrong or expired medicines.
- **Peer-to-Peer Ratings**: A transparent review system for medicines and sellers to build community trust.

### Rider Panel
- **Task Management**: Real-time pickup assignments with seller location details.
- **Identity Trust**: Pass the multi-step KYC to start earning.

---

## 🛡️ Identity Fraud Policy
We maintain a strict zero-tolerance policy towards fraudulent identity documents.
- **Admin Review**: All KYC submissions are reviewed within **2 Business Days**.
- **Fraud Detection**: If any violation or tampering is detected (e.g., mismatched QR/Photo), the account and documents will be **Permanently Blacklisted**.
- **Compliance**: All data is stored securely and processed locally where possible to ensure privacy.

---

## 💻 Tech Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js (Express)
- **Database**: MongoDB (Mongoose)
- **AI Engine**: Google Gemini (OCR + NLP)
- **Identity Engine**: Tesseract.js & Aadhaar V4 Decoder
- **Storage**: Cloudinary
- **Payments**: Razorpay

---

## 📖 API Documentation
For detailed endpoint information, request/response structures, and authentication requirements, please refer to:
👉 [**API_DOCS.md**](./API_DOCS.md)

---

## 👨‍💻 Author
**Ankit Tiwari**  
*Full Stack Developer | AI Enthusiast*
