import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/user.model.js';
import { Rider } from '../src/models/rider.model.js';
import connectDB from '../src/config/db.js';

dotenv.config();

const createRider = async () => {
    try {
        await connectDB();

        const riderEmail = "rider@medresale.com";
        const password = "rider123";

        // Check if rider already exists
        let riderUser = await User.findOne({ email: riderEmail });

        if (!riderUser) {
            const hashedPassword = await bcrypt.hash(password, 10);
            riderUser = await User.create({
                name: "Test Rider",
                email: riderEmail,
                password: hashedPassword,
                role: "rider",
                isVerified: true,
                phone: "555-0199"
            });
            console.log("\n--- RIDER USER CREATED ---");
        } else {
            console.log("\n--- RIDER USER EXISTS ---");
        }

        // Check if Rider Profile exists
        let riderProfile = await Rider.findOne({ userId: riderUser._id });

        if (!riderProfile) {
            riderProfile = await Rider.create({
                userId: riderUser._id,
                isVerified: true,
                isActive: true,
                licenseNumber: "WB123456789",
                vehicleDetails: "Bike - Honda Shine - WB-02-1234",
                currentLocation: {
                    lat: 22.5726,
                    lng: 88.3639
                }
            });
            console.log("--- RIDER PROFILE CREATED ---");
        } else {
            console.log("--- RIDER PROFILE EXISTS ---");
        }

        console.log(`\nRider ID (User ID): ${riderUser._id}`);
        console.log(`Email: ${riderEmail}`);
        console.log(`Password: ${password}`);
        console.log(`Role: ${riderUser.role}`);
        console.log("-----------------------------\n");

        process.exit(0);
    } catch (error) {
        console.error("Error creating rider:", error);
        process.exit(1);
    }
};

createRider();
