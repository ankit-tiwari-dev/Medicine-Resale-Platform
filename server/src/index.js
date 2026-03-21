import app from "./server.js";
import 'dotenv/config';
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            logger.info(`Server is running at port : ${PORT}`);
        });
    })
    .catch((err) => {
        logger.error(`MONGODB connection failed error : ${err.message}`);
        process.exit(1);
    });
