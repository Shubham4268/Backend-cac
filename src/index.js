import dotenv from "dotenv"
import connectDB from "./db/index.js"

dotenv.config({
    path : './env'
})

connectDB()










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
