import mongoose from "mongoose";
import { DB_NAME } from "../utils/constants.js";
import logger from "../utils/logger.js";

const connectDB = async (uri = process.env.MONGODB_URI) => {
    try {
        // Ensure URI doesn't end with a slash before appending DB_NAME
        const cleanUri = uri.endsWith('/') ? uri.slice(0, -1) : uri;
        const connectionUri = `${cleanUri}/${DB_NAME}`;

        logger.info(`Connecting to MongoDB: ${cleanUri.split('@')[1] || cleanUri} ...`);

        const connectionInstance = await mongoose.connect(connectionUri, {
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

        logger.info(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        logger.error(`MONGODB connection error: ${error.message}`);
        // In testing, we might want to throw instead of exit
        if (process.env.NODE_ENV === 'test') {
            throw error;
        }
        process.exit(1)
    }
}

export default connectDB