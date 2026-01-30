import request from 'supertest';
import app from '../src/server.js';
import { User } from '../src/models/user.model.js';
import { Medicine } from '../src/models/medicine.model.js';
import { Rider } from '../src/models/rider.model.js';
import { Wallet } from '../src/models/wallet.model.js';
import bcrypt from 'bcryptjs';

describe('Medicine Resale Platform - Complete User Flow', () => {
    let sellerToken, adminToken, riderToken, buyerToken;
    let sellerId, adminId, riderId, buyerId;
    let medicineId;

    const testPassword = 'Password123!';

    // 1. Auth Flow: Setup Users
    it('Should register and login all roles', async () => {
        // Register Seller
        const sellerReg = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Seller User',
                email: 'seller@test.com',
                password: testPassword
            });
        expect(sellerReg.statusCode).toBe(201);
        sellerId = sellerReg.body.data.userId;

        // Verify Seller (Direct DB update in test for convenience of bypassing email)
        await User.findByIdAndUpdate(sellerId, { isVerified: true });

        // Login Seller
        const sellerLogin = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'seller@test.com', password: testPassword });

        if (sellerLogin.statusCode !== 200) console.error("SELLER LOGIN FAILED:", sellerLogin.body);
        expect(sellerLogin.statusCode).toBe(200);
        sellerToken = sellerLogin.body.data.accessToken;
        expect(sellerToken).toBeDefined();

        // Setup Admin (Create directly)
        const hashedPassword = await bcrypt.hash(testPassword, 10);
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@test.com',
            password: hashedPassword,
            role: 'admin',
            isVerified: true
        });
        adminId = admin._id;
        // Re-login to get token
        const adminLogin = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'admin@test.com', password: testPassword });

        if (adminLogin.statusCode !== 200) console.error("ADMIN LOGIN FAILED:", adminLogin.body);
        expect(adminLogin.statusCode).toBe(200);
        adminToken = adminLogin.body.data.accessToken;
        expect(adminToken).toBeDefined();

        // Setup Rider
        const riderUser = await User.create({
            name: 'Rider User',
            email: 'rider@test.com',
            password: hashedPassword,
            role: 'rider',
            isVerified: true
        });
        riderId = riderUser._id;
        await Rider.create({ userId: riderId, isActive: true });

        const riderLogin = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'rider@test.com', password: testPassword });
        riderToken = riderLogin.body.data.accessToken;

        // Setup Buyer
        const buyerReg = await User.create({
            name: 'Buyer User',
            email: 'buyer@test.com',
            password: hashedPassword,
            isVerified: true
        });
        buyerId = buyerReg._id;
        const buyerLogin = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'buyer@test.com', password: testPassword });
        buyerToken = buyerLogin.body.data.accessToken;
    });

    // 2. Medicine Upload
    it('Should allow seller to upload medicine', async () => {
        // We mock the upload because Cloudinary/Multer buffer handling is tricky in supertest without actual files
        // But the controller handles it. Let's see if we can send a mock file.
        const res = await request(app)
            .post('/api/v1/medicines/upload')
            .set('Authorization', `Bearer ${sellerToken}`)
            .field('description', 'Test medicine description')
            .field('forceMock', 'true')
            .attach('images', Buffer.from('fake-image-content'), 'medicine.jpg');

        expect(res.statusCode).toBe(201);
        expect(res.body.data.status).toBe('uploaded');
        medicineId = res.body.data._id;
    });

    // 3. Admin Verification & Assignment
    it('Should allow admin to verify and assign rider', async () => {
        // Verify
        const verifyRes = await request(app)
            .post(`/api/v1/admin/medicines/${medicineId}/verify`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ action: 'approve' });

        expect(verifyRes.statusCode).toBe(200);
        expect(verifyRes.body.data.status).toBe('verified');

        // Assign Rider
        const assignRes = await request(app)
            .post('/api/v1/admin/assign-rider')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ medicineId, riderId: riderId.toString() });

        expect(assignRes.statusCode).toBe(200);
        expect(assignRes.body.data.status).toBe('pickup_assigned');
    });

    // 4. Rider Collection
    it('Should allow rider to confirm collection', async () => {
        // Get tasks
        const tasks = await request(app)
            .get('/api/v1/rider/tasks')
            .set('Authorization', `Bearer ${riderToken}`);
        expect(tasks.body.data.length).toBeGreaterThan(0);

        // Confirm collection
        const confirmRes = await request(app)
            .post('/api/v1/rider/confirm-collection')
            .set('Authorization', `Bearer ${riderToken}`)
            .field('medicineId', medicineId)
            .attach('proof', Buffer.from('fake-proof-content'), 'proof.jpg');

        expect(confirmRes.statusCode).toBe(200);
        expect(confirmRes.body.data.status).toBe('collected');
    });

    // 5. Admin Approval & Wallet Credit
    it('Should allow admin to approve collection and credit wallet', async () => {
        const approveRes = await request(app)
            .post('/api/v1/admin/approve-collection')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ medicineId });

        expect(approveRes.statusCode).toBe(200);
        expect(approveRes.body.data.medicine.status).toBe('listed');

        // Check wallet
        const wallet = await Wallet.findOne({ userId: sellerId });
        expect(wallet.balance).toBeGreaterThan(0);
    });

    // 6. Buyer Purchase
    it('Should allow buyer to purchase medicine', async () => {
        const buyRes = await request(app)
            .post('/api/v1/orders')
            .set('Authorization', `Bearer ${buyerToken}`)
            .send({
                medicineId,
                shippingAddress: '123 Test Street, Kolkata'
            });

        expect(buyRes.statusCode).toBe(201);
        // Expect array of orders
        expect(Array.isArray(buyRes.body.data)).toBe(true);
        expect(buyRes.body.data[0].status).toBe('pending');

        const medicine = await Medicine.findById(medicineId);
        expect(medicine.status).toBe('sold');
    });

    // 7. Wallet Withdrawal
    it('Should allow seller to request withdrawal', async () => {
        const withdrawRes = await request(app)
            .post('/api/v1/wallet/withdraw')
            .set('Authorization', `Bearer ${sellerToken}`)
            .send({
                amount: 10,
                bankDetails: 'HDFC 123456789'
            });

        expect(withdrawRes.statusCode).toBe(201);

        const wallet = await Wallet.findOne({ userId: sellerId });
        // Initial credit was 80% of mock MRP (100) = 80.
        // Withdraw 10.
        expect(wallet.balance).toBe(70);
    });
});
