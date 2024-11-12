import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// Register a new user using the asyncHandler to manage asynchronous errors.
// If the request is successful, the server responds with status 200 and a JSON message.
const registerUser = asyncHandler(async (req, res) => {
    /*  Steps - 
    get user details from frontend
    validate the inputs - not empty
    check if user is already registered
    check if files are uploaded properly on local path
    upload them on cloudinary ,avatar
    create user object - create db entry
    remove password, refreshToken field from response
    check for user creation
    return response
    */

    // Extract user details from the request body
    const { fullName, email, username, password } = req.body;

    // Validate input fields - check if any field is empty
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required"); // Throw error if any field is missing
    }

    // Check if a user with the same email or username already exists in the database
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    // If a user with the same email or username exists, throw a conflict error
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // Get file paths for avatar and cover image from the uploaded files in the request
    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    // Check if avatar image is provided, if not, throw an error
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    // Upload avatar and cover image to Cloudinary and get the URLs
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // If avatar upload fails, throw an error
    if (!avatar) {
        throw new ApiError(400, "Avatar image is required");
    }

    // Create a new user in the database with the provided details
    const user = await User.create({
        fullName,
        avatar: avatar.url, // Set avatar URL from Cloudinary
        coverImage: coverImage?.url || "", // Set cover image URL, or empty string if not uploaded
        email,
        password,
        username: username.toLowerCase() // Convert username to lowercase
    });

    // Fetch the created user from the database without sensitive fields (password, refreshToken)
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // If user creation fails, throw a server error
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Return a successful response with the created user details
    console.log(res.status(201));

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});

// No need of async handlers because we are handling any web requests but it is an internal method
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false }); // save method validates for each field while saving everytime, so to avoid needless validation, validateBeforeSave is set to false.

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something wnt wrong while generating Refresh and Access tokens")
    }
}
const loginUser = asyncHandler(async (req, res) => {
    // request data from frontend
    // validate data
    // check username or email
    // find user
    // check password
    // generate access and refresh tokens
    // send cookies

    const { email, username, password } = req.body

    if (!username || !email) {
        throw new ApiError(400, "Username or Email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {                // Only server can modify the cookies when these options are declared
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken      // Sending the tokens is good practice bcz user might need it when developing mobile application where cookies cannot be set
                },
                "User logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {

})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")

        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body



    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "User fetched successfully"
        ))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        { new: true }

    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    //TODO: delete old image - assignment

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")

    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Avatar image updated successfully")
        )
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    //TODO: delete old image - assignment


    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar")

    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Cover image updated successfully")
        )
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
    // Extracts the 'username' parameter from the URL path (route parameters)
    const { username } = req.params;

    // Checks if 'username' is provided and is not an empty string after trimming whitespaces
    if (!username?.trim()) {
        throw new ApiError(400, "Username is missing"); // Throws a 400 Bad Request error if username is missing
    }

    // Queries the 'User' collection to find the user's channel profile
    const channel = await User.aggregate([
        {
            // Matches a user document where the 'username' matches the provided one, case-insensitively
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            // looks through the subscriptions collection to find the documents in which the channel list is matched with userId of visited channel
            $lookup: {
                from: "subscriptions",  // The collection to join (subscriptions)
                localField: "_id",   // id of the channel(user) being matched 
                foreignField: "channel", // list of channels to look through to match it with localfield
                as: "subscribers"  // Stores the matched documents in a new field named 'subscribers'
            }
        },
        {
            // looks through the subscriptions collection to find the documents in which the subscriber list is matched with userId of visited channel
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber", 
                as: "subscribedTo"
            }
        },
        {
            // Adds computed fields to the document
            $addFields: {
                // 'subscribersCount' is set to the number of elements in the 'subscribers' array
                subscribersCount: {
                    $size: "$subscribers"
                },
                // 'channelsSubscribedToCount' is set to the number of elements in the 'subscribedTo' array
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                // 'isSubscribed' is a boolean indicating whether the current user is subscribed to this channel
                isSubscribed: {
                    $cond: {
                        // Checks if the current user's ID is in the list of 'subscribers'
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            // Projects (selects) specific fields to include in the final result
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ]);

    // Logs the retrieved channel data to the console (for debugging purposes)
    console.log(channel);

    // Checks if no channel was found (empty array), and if so, throws a 404 Not Found error
    if (!channel?.length) {
        throw new ApiError(404, "Channel does not exist");
    }

    // Returns a successful response with the first (and only) channel document
    return res
        .status(200)
        .json(
            new ApiResponse(200, channel[0], "User channel fetched successfully")
        );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage, 
    getUserChannelProfile
};