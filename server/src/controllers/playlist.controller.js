import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description = "" } = req.body;

    // Validate playlist name
    if (!name) {
        throw new ApiError(400, "Name is required");
    }

    // Ensure user exists in the request
    const user = req.user?._id;
    if (!user) {
        throw new ApiError(400, "User not found");
    }

    // Create the playlist

    const playlist = await Playlist.create({
        name,
        description,
        owner: user
    });


    // Handle playlist creation failure
    if (!playlist) {
        throw new ApiError(400, "Unable to create playlist");
    }

    // Return success response
    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist created successfully")
    );

});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Validate user ID
    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    // Use aggregation pipeline to match user playlists and populate videos
    const userPlaylists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId) // Match playlists by owner
            }
        },
        {
            $lookup: {
                from: "videos", // Name of the Video collection
                localField: "videos", // Field in Playlist collection that references videos
                foreignField: "_id", // Field in Video collection to match
                as: "videos" // Name of the new array with populated video documents
            }
        },
        {
            $sort: { createdAt: -1 } // Optional: Sort playlists by createdAt
        }
    ]);

    if (!userPlaylists || userPlaylists.length === 0) {
        throw new ApiError(404, "No playlists found");
    }

    // Respond with the populated playlists
    return res.status(200).json(
        new ApiResponse(
            200,
            userPlaylists,
            "User playlists fetched successfully"
        )
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    // Validate playlist ID
    if (!mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    try {
        // Find playlist and populate nested fields
        const playlist = await Playlist.findById(playlistId)
            .populate({
                path: "videos",
                populate: {
                    path: "owner", // Populate owner inside videos
                    select: "username fullName avatar", // Fetch relevant fields from owner
                },
            });

        // Check if playlist exists
        if (!playlist) {
            throw new ApiError(404, "Playlist not found");
        }

        // Return response
        return res.status(200).json(
            new ApiResponse(200, playlist, "Playlist fetched successfully")
        );
    } catch (error) {
        // Handle unexpected errors
        throw new ApiError(500, `Failed to fetch playlist: ${error.message}`);
    }
});




const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    // Validate IDs
    if (!mongoose.isValidObjectId(playlistId) || !mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Playlist ID or Video ID");
    }

    // Ensure the video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Check if video already exists in the playlist
    const playlist = await Playlist.findOne({
        _id: playlistId,
        videos: videoId // Match videoId directly in the videos array
    });

    if (playlist) {
        return res.status(200).json(new ApiResponse(400, {}, "Video already exists in the playlist"));
    }

    // Add the video to the playlist
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $addToSet: { videos: video } }, // Add videoId to the videos array if it doesn't exist
        { new: true } // Return the updated document
    );

    if (!updatedPlaylist) {
        throw new ApiError(400, "Unable to add video to the playlist");
    }

    // Respond with the updated playlist
    return res.status(200).json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "Video added to the playlist successfully"
        )
    );
});


const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    // Validate Object IDs
    if (!mongoose.isValidObjectId(playlistId) || !mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist ID or video ID");
    }

    // Find and update the playlist in one query
    const updatedPlaylist = await Playlist.findOneAndUpdate(
        { _id: playlistId, videos: videoId }, // Ensure the video exists in the playlist
        { $pull: { videos: new mongoose.Types.ObjectId(videoId) } }, // Update operation
        { new: true } // Option to return the updated document
    );

    // Check if the playlist was found
    const playlistExists = await Playlist.exists({ _id: playlistId });
    if (!playlistExists) {
        throw new ApiError(404, "Playlist not found");
    }
    if (!updatedPlaylist) {
        // If no document is returned, either playlist not found or video not in playlist
        throw new ApiError(400, "Video not found in playlist");
    }
    // Return the updated playlist
    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Video removed from playlist")
    );
});


const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist Id");
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)

    if (!deletedPlaylist) {
        throw new ApiError(400, "Unable to delete playlist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deletedPlaylist,
                "Playlist deleted successfully"
            )
        )

})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist

    if (!mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist Id");
    }

    if (!name || !description) {
        throw new ApiError(400, "All fields are required")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId,
        {
            $set: {
                name,
                description
            }
        }, { new: true }
    )

    if (!updatedPlaylist) {
        throw new ApiError(400, "Could not update playlist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedPlaylist,
                "Playlist updated successfully"
            )

        )

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
