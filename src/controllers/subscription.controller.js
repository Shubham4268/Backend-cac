import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"
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
const getSubscribedChannelsVideos = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    const { page = 1, limit = 10 } = req.query; // Default values: page 1, limit 10

    // Validate subscriber ID
    if (!mongoose.isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID");
    }

    // Fetch subscribed channels
    const channels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId),
            },
        },
        {
            $sort: {
                createdAt: -1, // Sort by `createdAt` field in descending order (-1)
            },
        },
        {
            $lookup: {
                from: "users", // The collection name of the `Channel` model
                localField: "channel", // The field in Subscription that references the Channel ID
                foreignField: "_id", // The field in the Channel model that matches the localField
                as: "channelDetails", // The output array field name
            },
        },
        {
            $unwind: "$channelDetails", // Deconstruct the array to get the populated object directly
        },
        {
            $project: {
                _id: 0, // Exclude the default `_id` field
                "channel._id": "$channelDetails._id",
                "channel.fullName": "$channelDetails.fullName",
                "channel.avatar": "$channelDetails.avatar",
                "channel.username": "$channelDetails.username",

            },
        },
    ]);


    if (!channels.length) {
        throw new ApiError(400, "Not subscribed to any channel");
    }

    const channelIds = channels.map(channel => channel.channel);

    // Calculate pagination parameters
    const skip = (page - 1) * limit;

    // Fetch videos with pagination
    const videos = await Video.find({
        owner: { $in: channelIds },
    })
        .populate('owner') // Populate channel details
        .sort({ createdAt: -1 }) // Sort by latest to oldest
        .skip(skip) // Skip videos for previous pages
        .limit(Number(limit)); // Limit the number of videos per page

    if (!videos.length) {
        throw new ApiError(404, "No videos found from the subscribed channels");
    }

    // Count total videos for pagination metadata
    const totalVideos = await Video.countDocuments({
        owner: { $in: channelIds },
    });


    const tweets = await User.aggregate([
        {
          $match: {
            _id: { $in: channelIds.map(channel => channel._id) }, // Extract `_id` from each channel object
          },
        },
        {
          $lookup: {
            from: "tweets",
            localField: "_id",
            foreignField: "owner",
            as: "userTweets",
          },
        },
        {
          $unwind: "$userTweets", // Deconstruct the `userTweets` array into individual documents
        },
        {
          $sort: {
            "userTweets.createdAt": -1, // Sort tweets by `createdAt` (descending order)
          },
        },
        {
          $group: {
            _id: "$_id", // Group back by user
            fullName: { $first: "$fullName" },
            avatar: { $first: "$avatar" },
            userTweets: {
              $push: {
                _id: "$userTweets._id",
                content: "$userTweets.content", // Replace 'content' with desired fields
                createdAt: "$userTweets.createdAt",
              },
            },
          },
        },
      ]);
      

    // Return paginated response
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                channels,
                videos,
                tweets,
                pagination: {
                    totalVideos,
                    totalPages: Math.ceil(totalVideos / limit),
                    currentPage: Number(page),
                },
            },
            "Channels and videos fetched successfully"
        )
    );
});





export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannelsVideos
}