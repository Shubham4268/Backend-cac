import mongoose, { get } from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { View } from "../models/view.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const { channelId } = req.params;
    const getTotalVideos = await Video.countDocuments({ owner: channelId })

    const getTotalSubscribers = await Subscription.countDocuments({ channel: channelId })
    // const getTotalViews = await  
    const getTotalLikesObject = await Video.aggregate(
        [
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(channelId),
                },
            },
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'video',
                    as: 'likesOfVideo',
                },
            },
            {
                $group: {
                    _id: null,
                    totalLikes: { $sum: { $size: '$likesOfVideo' } }, // Calculate size and sum directly
                },
            },
            {
                $project: { _id: 0, totalLikes: 1 }, // Clean up the result
            },
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
    );
    const getTotalLikes = getTotalLikesObject.length > 0 ? getTotalLikesObject[0].totalLikes : 0;

    const getTotalViewsObject = await Video.aggregate(
        [
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(channelId),
                },
            },
            {
                $lookup: {
                    from: 'views',
                    localField: '_id',
                    foreignField: 'video',
                    as: 'viewsOfVideo',
                },
            },
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: { $size: '$viewsOfVideo' } }, // Calculate size and sum directly
                },
            },
            {
                $project: { _id: 0, totalViews: 1 }, // Clean up the result
            },
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
    );

    const getTotalViews = getTotalViewsObject.length > 0 ? getTotalViewsObject[0].totalViews : 0;

    const user = req?.user;
    const subscribed = await Subscription.findOne({ channel: channelId, subscriber: user })
    const subscribedStatus = subscribed ? true : false

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    getTotalVideos,
                    getTotalSubscribers,
                    getTotalLikes,
                    getTotalViews,
                    subscribedStatus
                },
                "Le bhai dekh le"
            )
        )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const { channelId } = req.params;
    const getAllVideos = await Video.find({ owner: channelId }).populate('owner').sort({ createdAt: -1 })

    if (!getAllVideos) {
        new ApiResponse(200, "No videos on the channel")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                getAllVideos,
                "Fetched all video of channel")

        )
})

export {
    getChannelStats,
    getChannelVideos
}