import mongoose from 'mongoose';
import { User } from '../src/models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

console.log('Connected to:', mongoose.connection.db.databaseName);

// Try to find user using the User model (same as login controller)
const user = await User.findOne({ email: 'test@example.com' });

if (user) {
    console.log('\n✅ User found via User model:');
    console.log('   Email:', user.email);
    console.log('   Name:', user.name);
    console.log('   Has Password:', !!user.password);
    console.log('   Verified:', user.isVerified);
} else {
    console.log('\n❌ User NOT found via User model');

    // Try direct query
    const directUser = await mongoose.connection.db.collection('users').findOne({
        email: 'test@example.com'
    });

    if (directUser) {
        console.log('\n⚠️  User exists in DB but not found via model!');
        console.log('   This suggests a schema/model issue');
    }
}

await mongoose.disconnect();
process.exit(0);
