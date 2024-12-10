import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription
    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel Id");
    }

    const userId = req.user?._id;

    const ifexist = await Subscription.exists({ subscriber: userId, channel: channelId })

    if (!ifexist) {
        const subscribed = await Subscription.create({
            subscriber: userId,
            channel: new mongoose.Types.ObjectId(channelId),
        })
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    ifexist,
                    "Channel subscribed"
                )
            )
    } else {
        const unsubscribed = await Subscription.findByIdAndDelete(ifexist._id);
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    ifexist,
                    "Channel unsubscribed"
                )
            )
    }


})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    // Validate channel ID
    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Aggregate to find subscribers
    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId),
            },
        },
        {
            $project: {
                _id: 0, // Optional: Exclude _id if not needed
                subscriber: 1, // Include only the subscriber field
            },
        },
    ]);

    // Check if there are any subscribers
    if (subscribers.length === 0) {
        throw new ApiError(404, "No subscribers found for this channel");
    }

    // Return the subscribers
    return res.status(200).json(
        new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    );
});


// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!mongoose.isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID");
    }

    const channels = await Subscription.aggregate([
        {
            $match : {
                subscriber : new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $project : {
                _id : 0,
                channel : 1
            }
        }
    ])

    if (!channels.length) {
        throw new ApiError(400, "Not subscribed to any channel")
    }

    return res.status(200).json( new ApiResponse (200,channels,"Channels fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}