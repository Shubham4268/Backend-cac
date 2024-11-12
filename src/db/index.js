import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected!! Host : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection failed ", error);
        process.exit(1)     // Calling process.exit() will force the process to exit as quickly as possible even if there are still asynchronous operations pending that have not yet completed fully
    }
}

export default connectDB;