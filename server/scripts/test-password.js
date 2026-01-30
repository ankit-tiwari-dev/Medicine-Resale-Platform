import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

console.log('Connected to:', mongoose.connection.db.databaseName);

// Find user directly from database
const user = await mongoose.connection.db.collection('users').findOne({
    email: 'test@example.com'
});

if (user) {
    console.log('\n✅ User found:');
    console.log('   Email:', user.email);
    console.log('   Name:', user.name);
    console.log('   Verified:', user.isVerified);

    // Test password
    const testPassword = 'password123';
    const isMatch = await bcrypt.compare(testPassword, user.password);

    console.log(`\n🔐 Password test:`);
    console.log(`   Testing password: "${testPassword}"`);
    console.log(`   Match: ${isMatch ? '✅ YES' : '❌ NO'}`);

    if (!isMatch) {
        console.log('\n⚠️  Password does not match! Creating new user with correct password...');

        // Delete and recreate
        await mongoose.connection.db.collection('users').deleteOne({ email: 'test@example.com' });

        const hashedPassword = await bcrypt.hash(testPassword, 10);
        await mongoose.connection.db.collection('users').insertOne({
            email: 'test@example.com',
            name: 'Test User',
            password: hashedPassword,
            role: 'user',
            isVerified: true,
            walletBalance: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log('✅ User recreated with correct password');
    }
} else {
    console.log('\n❌ User not found');
}

await mongoose.disconnect();
process.exit(0);
