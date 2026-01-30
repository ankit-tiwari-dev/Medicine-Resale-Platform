import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

console.log('Connected to MongoDB:', mongoose.connection.db.databaseName);

// Find the test user
const testUser = await mongoose.connection.db.collection('users').findOne({
    email: 'test@example.com'
});

if (testUser) {
    console.log('\n✅ Test user exists:');
    console.log('   Email:', testUser.email);
    console.log('   Name:', testUser.name);
    console.log('   Has Password:', !!testUser.password);
    console.log('   Verified:', testUser.isVerified);
    console.log('   Role:', testUser.role);
} else {
    console.log('\n❌ Test user NOT found!');
}

// List all users
const allUsers = await mongoose.connection.db.collection('users').find({}).toArray();
console.log(`\n📋 Total users in database: ${allUsers.length}`);
allUsers.forEach((user, i) => {
    console.log(`   ${i + 1}. ${user.email} (${user.role})`);
});

await mongoose.disconnect();
process.exit(0);
