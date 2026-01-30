import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../src/models/user.model.js';
import connectDB from '../src/config/db.js';

dotenv.config();

const listUsers = async () => {
    try {
        await connectDB();

        const users = await User.find({}, 'name email role _id');

        console.log("\n--- USER LIST ---");
        users.forEach(user => {
            console.log(`ID: ${user._id} | Name: ${user.name} | Role: ${user.role} | Email: ${user.email}`);
        });
        console.log("-----------------\n");

        process.exit(0);
    } catch (error) {
        console.error("Error listing users:", error);
        process.exit(1);
    }
};

listUsers();
