import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/user.model.js';
import connectDB from '../src/config/db.js';

dotenv.config();

const createBuyer = async () => {
    try {
        await connectDB();

        const buyerEmail = "buyer@medresale.com";
        const password = "buyer123";

        // Check if buyer already exists
        const existingBuyer = await User.findOne({ email: buyerEmail });
        if (existingBuyer) {
            console.log("\nBuyer user already exists!");
            console.log(`Email: ${buyerEmail}`);
            console.log(`Password: ${password} (if un-changed)`);
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const buyer = await User.create({
            name: "Test Buyer",
            email: buyerEmail,
            password: hashedPassword,
            role: "user", // Default role is sufficient for buying
            isVerified: true
        });

        console.log("\n--- BUYER CREATED ---");
        console.log(`Email: ${buyerEmail}`);
        console.log(`Password: ${password}`);
        console.log(`Role: ${buyer.role}`);
        console.log("---------------------\n");

        process.exit(0);
    } catch (error) {
        console.error("Error creating buyer:", error);
        process.exit(1);
    }
};

createBuyer();
