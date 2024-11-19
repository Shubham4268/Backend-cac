import mongoose, { Schema, Types } from "mongoose";

const playListSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videos: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    owner : Schema.Types.ObjectId,
    ref : "User",
    
}, { timestamps: true })

export const Playlist = mongoose.model("Playlist", playListSchema)