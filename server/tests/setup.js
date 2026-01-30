import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';

let mongo = null;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    console.log("TEST MONGODB URI:", uri);
    await connectDB(uri);

    // Clean DB only once at start of all tests
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
});

afterAll(async () => {
    if (mongo) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongo.stop();
    }
});

// Mock environment variables
process.env.JWT_SECRET = 'test_jwt_secret_supreme_fidelity';
process.env.NODE_ENV = 'test';
