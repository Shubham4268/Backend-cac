import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const content = req.body;

    if (content?.trim() === "") {
        return new ApiError(400,"Tweet cannot be empty")
    }

    const user = await User.findById(req.user?._id);

    const tweet = await Tweet.create({
        content,
        owner : user._id
    })

    if(!tweet){
        return new ApiError(400, "Something went wrong while making tweet")
    }

    return res
        .status(200)
        .json(
            200,
            {
                tweet
            },
            "Tweet made successfully",

        )
    

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
