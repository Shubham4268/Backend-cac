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
    const { userId } = req.params;

    const tweets = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
            },
        },
        {
            $lookup: {
                from: "tweets",
                localField: "_id",
                foreignField: "owner",
                as: "userTweets"

            }
        },
        {
            $project: {
                fullName: 1,
                avatar: 1,
                // createdAt : 1,
                // Only include specific fields in userTweets (e.g., text)
                userTweets: {
                    $map: {
                        input: "$userTweets",
                        as: "tweet",
                        in: {
                            _id: "$$tweet._id",
                            content: "$$tweet.content", // Replace 'text' with the desired field name(s)
                            createdAt: "$$tweet.createdAt"
                        },
                    },
                },
            },
        },
    ])


    return res.status(200)
        .json(
            new ApiResponse(200, tweets[0], "Tweets fetched successfully")
        )
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!tweetId) {
        throw new ApiError(400, "No twitter Id")
    }

    if (!content?.trim()) {
        return new ApiError(400, "Tweet cannot be empty")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, {
        $set: {
            content
        }
    },
        { new: true }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedTweet,
                "Tweet updated successfully"
            )
        )


})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params;

    if (!tweetId) {
        throw new ApiError(400, "No twitter Id")
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    if (!deletedTweet) {
        throw new ApiError(404, "Tweet not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Tweet deleted successfully"
            )
        )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
