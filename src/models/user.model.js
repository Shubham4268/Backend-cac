import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        
        username : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
            index : true,
        },
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
        },
        fullname : {
            type : String,
            required : true,
            trim : true,
            index : true,
        },
        avatar : {
            type : String,      // cloudinary url
            required : true,
        },
        coverImage : {
            type : String,
        },
        watchHistory: [
                {
                    type : Schema.Types.ObjectId,
                    ref : "Video"
                }
        ],
        password : {
            type : String,
            required : [true, "Password is required"]
        },
        refreshToken:{
            type : String
        }
    },
    {
        timestamps : true
    }
)

// When the data is getting saved, just before that pre middleware is triggered.
// Arrow function does not have this context, so do not use it.
userSchema.pre("save",  async function (next) {
    if(!this.isModified("password")) return next();
    // Need to check if the password is modified, else the middleware will be triggered each time when user clicks on save button
    this.password = bcrypt.hash(this.password, 10)
    next()
})

// Add method to check if the password is correct
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)
}
export const User = mongoose.model("User", userSchema )