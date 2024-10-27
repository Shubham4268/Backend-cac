import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

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

// Login user and generate access/refresh tokens
const loginUser = asyncHandler(async (req, res) => {
    // Extract email, username, and password from request body
    const { email, username, password } = req.body;

    // Check if username or email is provided
    if (!username && !email) {
        throw new ApiError(400, "Username or Email is required");
    }

    // Find the user based on the username or email
    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    // If user does not exist, throw error
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Verify if the provided password is correct
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Retrieve the logged-in user details, excluding sensitive fields
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Cookie options to secure access and refresh tokens
    const options = {
        httpOnly: true,        // Accessible only by the server
        secure: true           // Transmitted only over HTTPS
    };

    // Respond with the user details and set cookies with the tokens
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken  // Tokens also included for mobile clients where cookies may not be set
                },
                "User logged in successfully"
            )
        );
});

// Logout user and clear refresh token
const logoutUser = asyncHandler(async (req, res) => {
    // Update user to remove the refresh token from the database
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { refreshToken: undefined }
        },
        {
            new: true  // Return the updated user object
        }
    );

    // Options to secure cookie clearing process
    const options = {
        httpOnly: true,         // Server-only access
        secure: true            // HTTPS only
    };

    // Clear cookies and respond with logout success message
    return res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out"
            )
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    // Get the refresh token from the request cookies or body
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    // If no refresh token is provided, throw an "unauthorized" error
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        // Verify the provided refresh token using the secret key
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        // Find the user in the database based on the user ID in the decoded token
        const user = await User.findById(decodedToken?._id);

        // If no user is found, throw an error indicating an invalid refresh token
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        // Check if the incoming refresh token matches the one stored for the user
        // If not, throw an error indicating the refresh token is expired or already used
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        // Define options for secure HTTP-only cookies to store the new tokens
        const options = {
            httpOnly: true, // Prevent JavaScript access for security
            secure: true    // Use HTTPS for secure transport
        };

        // Generate new access and refresh tokens
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        // Send back the new tokens as HTTP-only cookies in the response
        // Also send a JSON response confirming the tokens were refreshed
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
            );
    } catch (error) {
        // If token verification fails, throw an error with the appropriate message
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});



export { registerUser, loginUser, logoutUser, refreshAccessToken };