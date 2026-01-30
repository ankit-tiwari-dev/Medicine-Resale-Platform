import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const DB_NAME = "MedAImart";

const checkSpecificDB = async () => {
    try {
        const uri = `${process.env.MONGODB_URI}${DB_NAME}`;
        console.log('Connecting to:', uri);
        await mongoose.connect(uri);
        console.log('Connected to:', mongoose.connection.db.databaseName);

        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        console.log('--- USER LIST ---');
        users.forEach(u => {
            console.log(`Email: ${u.email}, Verified: ${u.isVerified}`);
        });
        console.log('-----------------');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkSpecificDB();
