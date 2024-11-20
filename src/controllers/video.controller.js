import mongoose, { get, isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

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

    const createdVideo = await Video.create({
        title,
        description,
        videoFile: video.url,
        thumbnail: thumbnail.url,
        duration: video.duration,
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

    getVideo.isPublished  = !getVideo.isPublished;
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
