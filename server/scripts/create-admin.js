import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/user.model.js';
import connectDB from '../src/config/db.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = "admin@medresale.com";
        const password = "admin123";

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("\nAdmin user already exists!");
            console.log(`Email: ${adminEmail}`);
            console.log(`Password: ${password} (if un-changed)`);
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await User.create({
            name: "System Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
            isVerified: true
        });

        console.log("\n--- ADMIN CREATED ---");
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${password}`);
        console.log(`Role: ${admin.role}`);
        console.log("---------------------\n");

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();
