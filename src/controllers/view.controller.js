import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { View } from "../models/view.model.js"
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js";

// writtenbyme = {
//     const addVideoView = asyncHandler(async (req, res) => {
//     const { videoId } = req.params;

//     // Check if videoId is a valid MongoDB ObjectId
//     if (!mongoose.isValidObjectId(videoId)) {
//         throw new ApiError(400, "Invalid Video Id");
//     }

//     const userId = req.user?._id; // Retrieve the user ID from the authenticated user

//     // Check if the view already exists
//     const isViewed = await View.exists({ video: videoId, viewer: userId });

//     if (!isViewed) {
//         // Add a new view record
//         const addedView = await View.create({
//             video: videoId,
//             viewer: userId,
//         });

//         if (!addedView) {
//             throw new ApiError(400, "Couldn't add the view");
//         }

//         // Add the video to the user's watch history
//         const addToWatchHistory = await User.findByIdAndUpdate(
//             userId,
//             {
//                 $addToSet: { watchHistory: videoId },
//             },
//             { new: true } // Return the updated document
//         );

//         if (!addToWatchHistory) {
//             throw new ApiError(400, "Couldn't add the video to watch history");
//         }

//         // Return success response
//         return res.status(200).json(
//             new ApiResponse(200, addedView, "Video is viewed")
//         );
//     }
//     return res.status(200).json(
//         new ApiResponse(200, {} , "Already Viewed")
//     );


// })
// }

const addVideoView = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Validate videoId
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }

    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    // Use MongoDB upsert operation to reduce round-trips
    const addedView = await View.updateOne(
        { video: videoId, viewer: userId },
        { $setOnInsert: { video: videoId, viewer: userId, createdAt: new Date() } },
        { upsert: true }
    );

    const wasNew = !!addedView.upsertedCount; // `true` if a new document was inserted


    // Add video to user's watch history (idempotent using $addToSet)
    await User.findByIdAndUpdate(
        userId,
        { $addToSet: { watchHistory: videoId } },
        { new: true } // Return updated document (optional, depends on need)
    );

    if (wasNew) {
        await Video.findByIdAndUpdate(videoId,
            {
                $inc: { views: 1 }, // Increment the views field by 1
            },
            { new: true } // Return the updated document
        );
    }


    // Return appropriate response
    const message = wasNew
        ? "Video is viewed for the first time"
        : "Video has already been viewed";
    return res.status(200).json(new ApiResponse(200, null, message));
});

const removeView = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Validate videoId
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }
    const removedView = await View.findOneAndDelete({
        video: videoId,
        viewer: userId
    })


    if (!removedView) {
        throw new ApiError(400, "No view to remove")
    }

    const removeFromWatchHistory = await User.findByIdAndUpdate(userId,
        {
            $pull: {
                watchHistory: videoId
            }
        }, // Update peration
        { new: true }
    )

    if (!removeFromWatchHistory) {
        throw ApiError(400, "Cannot remove from watch history")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                removedView,
                "Removed the view"
            )
        )

})

const getVideoViews = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Validate videoId
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }

    const views = await View.countDocuments({ video: videoId })

    if (!views) {
        return new ApiResponse(200, {}, "No views yet")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, views, "Views fetched successfully")
        )
})

export {
    addVideoView,
    getVideoViews,
    removeView
}