import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content?.trim()) {
        return new ApiError(400, "Tweet cannot be empty")
    }

    const user = await User.findById(req.user?._id);

    const tweet = await Tweet.create({
        content,
        owner: user._id
    })

    if (!tweet) {
        return new ApiError(400, "Something went wrong while making tweet")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    tweet
                },
                "Tweet made successfully",
            )
        )
})

const getUserTweets = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    console.log(userId);
    
    const tweets = await User.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(userId)
            },
        },
        {
            $lookup : {
                from : "tweets",
                localField : "_id",
                foreignField : "owner",
                as : "userTweets"
                
            }
        },
        {
            $project: {
                username: 1,
                avatar: 1,
                // Only include specific fields in userTweets (e.g., text)
                userTweets: {
                    $map: {
                        input: "$userTweets",
                        as: "tweet",
                        in: {
                            content: "$$tweet.content", // Replace 'text' with the desired field name(s)
                        },
                    },
                },
            },
        },
    ])

    console.log(tweets);
    
    if (!tweets[0]?.length) {
        throw new ApiError(404, "No tweets by the user");
    }

    return res.status(200)
    .json(
        new ApiResponse(200, tweets[0], "Tweets fetched successfully")
    )



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
