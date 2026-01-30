import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        console.log('--- USER LIST ---');
        users.forEach(u => {
            console.log(`Email: ${u.email}, Verified: ${u.isVerified}`);
        });
        console.log('-----------------');
        process.exit(0);
    } catch (error) {
        console.error('Error listing users:', error);
        process.exit(1);
    }
};

listUsers();
