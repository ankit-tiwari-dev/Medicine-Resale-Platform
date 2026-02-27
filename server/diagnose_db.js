import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './src/models/user.model.js';
import { Rider } from './src/models/rider.model.js';
import { Otp } from './src/models/otp.model.js';

dotenv.config();

async function diagnose() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB.");

        const userCount = await User.countDocuments();
        const riderCount = await Rider.countDocuments();
        const otpCount = await Otp.countDocuments();

        console.log(`User Count: ${userCount}`);
        console.log(`Rider Count: ${riderCount}`);
        console.log(`Otp Count: ${otpCount}`);

        const latestUser = await User.findOne().sort({ createdAt: -1 });
        console.log("Latest User info:", latestUser ? {
            email: latestUser.email,
            isVerified: latestUser.isVerified,
            role: latestUser.role,
            createdAt: latestUser.createdAt
        } : "None");

        const latestRider = await Rider.findOne().sort({ createdAt: -1 });
        console.log("Latest Rider info:", latestRider ? {
            userId: latestRider.userId,
            isVerified: latestRider.isVerified,
            createdAt: latestRider.createdAt
        } : "None");

        const latestOtp = await Otp.findOne().sort({ createdAt: -1 });
        console.log("Latest Otp info:", latestOtp ? {
            email: latestOtp.email,
            createdAt: latestOtp.createdAt
        } : "None");

        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}

diagnose();
