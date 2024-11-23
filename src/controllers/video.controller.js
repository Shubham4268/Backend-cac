import mongoose, { get, isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query = "", sortBy = "createdAt", sortType = "desc", userId } = req.query;

    // Construct the filter object
//     filter is an object that defines the search criteria for the database query:
// If query is provided, it searches for video titles that match the string using a regular expression ($regex) for partial matching. The $options: "i" makes the search case-insensitive.
// If userId is provided, it adds a filter to match videos by the user’s ID.
    const filter = {};
    if (query) {
        filter.title = { $regex: query, $options: "i" }; // Case-insensitive search by title
    }
    if (userId) {
        filter.user = userId; // Filter by userId if provided
    }

    // Count total videos matching the filter
    const totalVideos = await Video.countDocuments(filter);

    // Fetch videos with aggregation for pagination and sorting
    const videos = await Video.aggregate([
        { $match: filter },
        {
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1, // Dynamic sorting
            },
        },
        { $skip: (page - 1) * parseInt(limit) },
        { $limit: parseInt(limit) },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                user: 1,
                createdAt: 1,
                owner : 1,
                views : 1
            },
        },
    ]);

    // Check if videos exist
    if (!videos.length) {
        throw new ApiError(404, "No videos found");
    }

    // Pagination indicators
    const hasNextPage = page * limit < totalVideos;
    const hasPreviousPage = page > 1;

    // Send response
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalVideos,
                currentPage: parseInt(page),
                limit: parseInt(limit),
                nextPage: hasNextPage ? parseInt(page) + 1 : null,
                previousPage: hasPreviousPage ? parseInt(page) - 1 : null,
                videos,
            },
            "Videos fetched successfully"
        )
    );
});


const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if (!title || !description) {
        throw new ApiError(400, "All fields are required")
    }

    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path


    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "Video and thumbnail are required")
    }

    const video = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!video || !thumbnail) {
        throw new ApiError(400, "Video and thumbnail are required")
    }

    // const video = "https://res.cloudinary.com/djp8zilvt/video/upload/v1732013164/samples/dance-2.mp4"
    const createdVideo = await Video.create({
        title,
        description,
        videoFile: video.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration,
        // duration: 10,
        owner: req.user?._id
    })

    if (!createdVideo) {
        throw new ApiError(400, "Could not create the video")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                createdVideo,
                "Video created successfully"
            )
        )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const videoFile = await Video.findById(videoId)

    if (!videoFile) {
        throw new ApiError(400, "Couldn't find the video")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videoFile,
                "Video fetched successfully")

        )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;
    //TODO: update video details like title, description, thumbnail
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    if (!title?.trim() || !description?.trim()) {
        throw new ApiError(400, "Both title and description are required");
    }

    const updatedThumbnailLocalPath = req.file?.thumnail[0]?.path

    if (!updatedThumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail not found")
    }

    const updatedThumbnail = await uploadOnCloudinary(updatedThumbnailLocalPath);

    const updatedVideoDetails = await Video.findByIdAndUpdate(videoId, {
        $set: {
            title,
            description,
            thumbnail: updatedThumbnail.url
        }
    })

    if ((!updatedVideoDetails)) {
        throw new ApiError(400, "Could not update video details")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedVideoDetails,
                "Video details updated successfully"
            )
        )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    //TODO: delete video
    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if (!deletedVideo) {
        throw new ApiError(400, "Video not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deletedVideo,
                "Video deleted successfully"
            )
        )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const getVideo = await Video.findById(videoId);

    if (!getVideo) {
        throw new ApiError(200, "Video not found")
    }

    getVideo.isPublished = !getVideo.isPublished;
    await getVideo.save();

    res.
        status(200)
        .json(
            new ApiResponse(
                200,
                getVideo.isPublished,
                "Publish status toggled successfully"
            )
        )

});


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
