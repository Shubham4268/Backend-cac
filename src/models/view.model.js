import mongoose, { Schema } from "mongoose";

const viewSchema = new Schema({
    viewer : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    video : {
        type : Schema.Types.ObjectId,
        ref : "Video"
    },
},{timestamps : true} )


export const View = mongoose.model("View",viewSchema)