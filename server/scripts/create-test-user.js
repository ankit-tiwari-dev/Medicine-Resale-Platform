import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
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
    console.log(`   Has Password: ${!!user.password}`);
    console.log(`   Verified: ${user.isVerified}`);
    console.log(`   Role: ${user.role}`);
});

// Create a test user with known credentials
const testEmail = 'test@example.com';
const testPassword = 'password123';
const hashedPassword = await bcrypt.hash(testPassword, 10);

// Delete existing test user if exists
await mongoose.connection.db.collection('users').deleteOne({ email: testEmail });

// Create new test user
const result = await mongoose.connection.db.collection('users').insertOne({
    email: testEmail,
    name: 'Test User',
    password: hashedPassword,
    role: 'user',
    isVerified: true,
    walletBalance: 0,
    createdAt: new Date(),
    updatedAt: new Date()
});

console.log('\n✅ Created test user:');
console.log(`   Email: ${testEmail}`);
console.log(`   Password: ${testPassword}`);
console.log(`   Role: user`);

await mongoose.disconnect();
console.log('\nDisconnected from MongoDB');
process.exit(0);
