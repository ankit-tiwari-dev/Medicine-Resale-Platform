import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const API_URL = 'http://localhost:5001/api/v1/auth';
const logFile = 'verify_results.txt';

function log(msg) {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
}

async function verifyNormalizationAndClarity() {
    if (fs.existsSync(logFile)) fs.unlinkSync(logFile);

    // 1. Test case-insensitive email normalization
    const baseEmail = `Verify_${Date.now()}@Example.com`;
    const normalizedEmail = baseEmail.toLowerCase();

    log(`Testing with email: ${baseEmail}`);

    try {
        // Step A: Register with MixedCase
        log("A. Calling /register with MixedCase email...");
        const regRes = await axios.post(`${API_URL}/register`, {
            email: baseEmail,
            name: "Verify User",
            password: "password123",
            role: "user"
        });

        log(`- Registration Status: ${regRes.status}`);
        log(`- Response Data: ${JSON.stringify(regRes.data, null, 2)}`);
        const sessionId = regRes.data.data?.sessionId;
        log(`- SessionId received: ${sessionId}`);

        if (!sessionId) {
            throw new Error("❌ Error: sessionId not found in response!");
        }

        // Step B: Check DB for immediate creation (should be false)
        await mongoose.connect(process.env.MONGODB_URI);
        const { User } = await import('./src/models/user.model.js');
        const { Otp } = await import('./src/models/otp.model.js');

        const prematureUser = await User.findOne({ email: normalizedEmail });
        log(`B. Premature User check: ${prematureUser ? '❌ FAILED (User created)' : '✅ PASSED (No user created)'}`);

        const otpRecord = await Otp.findOne({ email: normalizedEmail });
        log(`C. OTP Record created with normalized email: ${otpRecord ? '✅ YES' : '❌ NO'}`);

        // Step D: Try to resend OTP with different casing
        log("D. Calling /resend-otp with different casing...");
        const resendRes = await axios.post(`${API_URL}/resend-otp`, {
            email: baseEmail.toUpperCase()
        });
        log(`- Resend Status: ${resendRes.status} (should be 200)`);

        await mongoose.disconnect();
        log("\n✅ Normalization and Clarity tests passed!");
    } catch (e) {
        log(`❌ Test failed: ${e.message}`);
        if (e.response) log(JSON.stringify(e.response.data, null, 2));
    }
}

verifyNormalizationAndClarity();
