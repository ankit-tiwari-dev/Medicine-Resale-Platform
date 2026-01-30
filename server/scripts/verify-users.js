import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const verifyUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const result = await mongoose.connection.db.collection('users').updateMany(
            {},
            { $set: { isVerified: true, otp: null, otpExpires: null } }
        );
        console.log(`Successfully verified ${result.modifiedCount} users.`);
        process.exit(0);
    } catch (error) {
        console.error('Error verifying users:', error);
        process.exit(1);
    }
};

verifyUsers();
