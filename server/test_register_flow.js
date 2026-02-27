import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://localhost:5000/api/v1/auth';

async function testRegistrationFlow() {
    const testEmail = `test_${Date.now()}@example.com`;
    console.log(`Testing with email: ${testEmail}`);

    try {
        // 1. Call Register
        console.log("Calling /register...");
        const regRes = await axios.post(`${API_URL}/register`, {
            email: testEmail,
            name: "Test User",
            password: "password123",
            role: "rider"
        });
        console.log("Register Response:", regRes.status, regRes.data.message);

        // 2. Check DB
        await mongoose.connect(process.env.MONGODB_URI);
        const { User } = await import('./src/models/user.model.js');
        const { Rider } = await import('./src/models/rider.model.js');
        const { Otp } = await import('./src/models/otp.model.js');

        const user = await User.findOne({ email: testEmail });
        const rider = user ? await Rider.findOne({ userId: user._id }) : null;
        const otp = await Otp.findOne({ email: testEmail });

        console.log("--- DB STATUS AFTER REGISTER ---");
        console.log("User Record exists?", !!user);
        console.log("Rider Record exists?", !!rider);
        console.log("Otp Record exists?", !!otp);

        if (user || rider) {
            console.error("❌ BUG: User or Rider created before OTP!");
        } else if (otp) {
            console.log("✅ SUCCESS: Only Otp record created.");
        } else {
            console.error("❌ ERROR: No Otp record created either!");
        }

        await mongoose.disconnect();
    } catch (e) {
        console.error("Test failed:", e.message);
        if (e.response) console.error(e.response.data);
    }
}

testRegistrationFlow();
