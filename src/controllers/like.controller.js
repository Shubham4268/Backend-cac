import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Video Id is invalid")
    }

    const userId = req.user?._id;

    const ifLiked = await Like.exists({ video: new mongoose.Types.ObjectId(videoId), likedBy: userId })

    if (!ifLiked) {
        const like = await Like.create({
            video: new mongoose.Types.ObjectId(videoId),
            likedBy: userId
        })
        if (!like) {
            throw new ApiError(400, "Could not like")
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    ifLiked,
                    "Video liked"
                )
            )
    }
    else {
        const unlike = await Like.findByIdAndDelete(ifLiked._id)
        if (!unlike) {
            throw new ApiError(400, "Could not like")
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    ifLiked,
                    "Video unliked"
                )
            )
    }


})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Comment Id is invalid")
    }

    const userId = req.user?._id;

    const ifLiked = await Like.exists({ comment: new mongoose.Types.ObjectId(commentId), likedBy: userId })

    if (!ifLiked) {
        const like = await Like.create({
            comment: new mongoose.Types.ObjectId(commentId),
            likedBy: userId
        })
        if (!like) {
            throw new ApiError(400, "Could not like")
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    like,
                    "Comment Liked"
                )
            )
    }
    else {
        const unlike = await Like.findByIdAndDelete(ifLiked._id)
        if (!unlike) {
            throw new ApiError(400, "Could not like")
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    unlike,
                    "Comment unliked"
                )
            )
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if (!mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "Tweet Id is invalid")
    }

    const userId = req.user?._id;

    const ifLiked = await Like.exists({ tweet: new mongoose.Types.ObjectId(tweetId), likedBy: userId })

    if (!ifLiked) {
        const like = await Like.create({
            tweet: new mongoose.Types.ObjectId(tweetId),
            likedBy: userId
        })
        if (!like) {
            throw new ApiError(400, "Could not like")
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    like,
                    "Tweet Liked"
                )
            )
    }
    else {
        const unlike = await Like.findByIdAndDelete(ifLiked._id)
        if (!unlike) {
            throw new ApiError(400, "Could not like")
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    unlike,
                    "Tweet unliked"
                )
            )
    }

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user?._id;

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: userId
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetails",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            owner: 1
                        }
                    }
                ]
            },
        },
        { $unwind: "$videoDetails" },
        {
            $project: {
                videoDetails: 1,
                _id: 0
            }
        }
    ])

    if (!likedVideos.length) {
        return res.status(200).json(
            new ApiResponse(200, [], "No liked videos found")
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedVideos,
                "Liked videos fetched"
            )
        )
})

const userLikeStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Video Id is invalid")
    }

    const userId = req.user?._id;

    const likeStatus = await Like.findOne({ video: videoId, likedBy: userId })

    const likesOnVideo = await Like.countDocuments({ video: videoId })

    const statusOfLike = likeStatus ? true : false  

    const returnObject = { statusOfLike, likesOnVideo }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                returnObject,
                "Current video is Liked"
            )
        )

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    userLikeStatus
}