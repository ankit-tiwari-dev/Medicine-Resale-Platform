import app from "./server.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running at port : ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MONGODB connection failed error : ", err);
        process.exit(1);
    });
