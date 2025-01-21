import dotenv from "dotenv"
import connectDB from "./src/db/index.js"
import {app} from './src/app.js'

dotenv.config({
    path : './.env'
})
console.log("Connected");

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Error: ",error);
        throw error
    })

    app.listen(process.env.PORT || 8000, ()=>{
        console.log("Server is running on port: ", process.env.PORT);
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed !! ", err);
})










/*
(async () => {
    try {
        mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        application.on("Error",(error)=>{
            console.log("Error: ",error);
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
})()                                // ifi  // used arrow function instead of normal function
*/
