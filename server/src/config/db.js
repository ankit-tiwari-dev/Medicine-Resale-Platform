import mongoose from "mongoose";
import { DB_NAME } from "../utils/constants.js";
import logger from "../utils/logger.js";

const connectDB = async (uri = process.env.MONGODB_URI) => {
    try {
        let connectionUri;
        try {
            const parsedUrl = new URL(uri);
            if (!parsedUrl.pathname || parsedUrl.pathname === '/') {
                parsedUrl.pathname = `/${DB_NAME}`;
            }
            connectionUri = parsedUrl.toString();
        } catch (e) {
            const cleanUri = uri.endsWith('/') ? uri.slice(0, -1) : uri;
            connectionUri = `${cleanUri}/${DB_NAME}`;
        }

        logger.info(`Connecting to MongoDB: ${connectionUri.split('@')[1] || connectionUri} ...`);

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