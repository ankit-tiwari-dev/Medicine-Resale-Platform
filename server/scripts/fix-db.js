import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
await mongoose.connect(process.env.MONGODB_URI);

console.log('Connected to MongoDB');
console.log('Database name:', mongoose.connection.db.databaseName);

// List all users
const users = await mongoose.connection.db.collection('users').find({}).toArray();
console.log(`\nFound ${users.length} user(s):`);
users.forEach((user, index) => {
    console.log(`\n${index + 1}. Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Verified: ${user.isVerified}`);
    console.log(`   Role: ${user.role}`);
    if (user.otp) {
        console.log(`   OTP: ${user.otp}`);
        console.log(`   OTP Expires: ${user.otpExpires}`);
    }
});

// Mark all users as verified for testing
const result = await mongoose.connection.db.collection('users').updateMany(
    {},
    { $set: { isVerified: true, otp: null, otpExpires: null } }
);

console.log(`\n✅ Marked ${result.modifiedCount} user(s) as verified`);

// Try to drop phone index
try {
    const indexes = await mongoose.connection.db.collection('users').indexes();
    console.log('\nCurrent indexes:', indexes.map(i => i.name));

    if (indexes.some(i => i.name === 'phone_1')) {
        await mongoose.connection.db.collection('users').dropIndex('phone_1');
        console.log('✅ Successfully dropped phone_1 index');
    } else {
        console.log('ℹ️  phone_1 index does not exist');
    }
} catch (error) {
    console.error('❌ Error with indexes:', error.message);
}

await mongoose.disconnect();
console.log('\nDisconnected from MongoDB');
process.exit(0);
