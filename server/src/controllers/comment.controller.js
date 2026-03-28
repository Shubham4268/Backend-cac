import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        // Step 1: Join user document (plain $lookup, works on all MongoDB versions)
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerArr"
            }
        },
        // Step 2: Unwind — preserveNullAndEmptyArrays keeps comments whose owner was deleted
        {
            $unwind: {
                path: "$ownerArr",
                preserveNullAndEmptyArrays: true
            }
        },
        // Step 3: Shape the final document
        {
            $project: {
                _id: 1,
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                owner: {
                    _id: "$ownerArr._id",
                    fullName: "$ownerArr.fullName",
                    username: "$ownerArr.username",
                    avatar: "$ownerArr.avatar"
                }
            }
        },
        { $sort: { createdAt: -1 } },
        { $skip: (pageNum - 1) * limitNum },
        { $limit: limitNum },
    ])

    const totalComments = await Comment.countDocuments({
        video: new mongoose.Types.ObjectId(videoId),
    });

    const hasNextPage = pageNum * limitNum < totalComments;
    const hasPreviousPage = pageNum > 1;

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalComments,
                currentPage: pageNum,
                limit: limitNum,
                nextPage: hasNextPage ? pageNum + 1 : null,
                previousPage: hasPreviousPage ? pageNum - 1 : null,
                comments,
            },
            "Comments fetched successfully"
        )
    );
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    const { content } = req.body;

    if (!mongoose.isValidObjectId(videoId) || ! await Video.exists(new mongoose.Types.ObjectId(videoId))) {
        throw new ApiError(400, "Video Id is invalid")
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Content is required")
    }

    const comment = await Comment.create({
        content,
        video: new mongoose.Types.ObjectId(videoId),
        owner: req.user?._id
    })

    if (!comment) {
        throw new ApiError(400, "Unable to comment")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                comment,
                "Comment added successfully"
            )
        )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params;
    const { content } = req.body;

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Comment Id is invalid")
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Content is required")
    }

    const updatedComment = await Comment.findByIdAndUpdate(commentId, {
        $set: {
            content
        }
    }, { new: true })
    if (!updatedComment) {
        throw new ApiError(400, "Could not update comment")
    }

    return res.status(200).json(new ApiResponse(200, updatedComment, "Comment updated successfully"))
})


const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Comment Id is invalid")
    }

    const deletedComment = await Comment.findByIdAndDelete(new mongoose.Types.ObjectId(commentId))

    if (!deleteComment) {
        throw new ApiError(400, "Unable to delete the comment")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deletedComment,
                "Comment deleted successfully"
            )
        )

})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
