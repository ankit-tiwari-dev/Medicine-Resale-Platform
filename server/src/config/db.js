import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async (uri = `${process.env.MONGODB_URI}${DB_NAME}`) => {
    try {
        const connectionInstance = await mongoose.connect(uri, {
            writeConcern: { w: 1 },
            retryWrites: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
            maxPoolSize: 10,
            minPoolSize: 5,
            connectTimeoutMS: 10000,
            heartbeatFrequencyMS: 10000,
        })

        console.log(`\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MONGODB connection error: ", error)
        // In testing, we might want to throw instead of exit
        if (process.env.NODE_ENV === 'test') {
            throw error;
        }
        process.exit(1)
    }
}

export default connectDB