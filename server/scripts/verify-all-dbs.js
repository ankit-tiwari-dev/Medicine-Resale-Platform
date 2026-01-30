import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const DB_NAME = "MedAImart";

const fixAllDBs = async () => {
    try {
        // Fix the misnamed one
        const misnamedUri = `${process.env.MONGODB_URI}${DB_NAME}`;
        console.log('Verifying users in:', misnamedUri);
        await mongoose.connect(misnamedUri);
        await mongoose.connection.db.collection('users').updateMany(
            {},
            { $set: { isVerified: true, otp: null, otpExpires: null } }
        );
        await mongoose.disconnect();

        // Also fix the intended one just in case
        console.log('Verifying users in:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        await mongoose.connection.db.collection('users').updateMany(
            {},
            { $set: { isVerified: true, otp: null, otpExpires: null } }
        );
        await mongoose.disconnect();

        console.log('All users in both potential databases verified.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixAllDBs();
