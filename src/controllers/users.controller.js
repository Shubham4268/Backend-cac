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

        return {accessToken,refreshToken}


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
    
    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
    const options = {                // Only server can modify the cookies when these options are declared
        httpOnly : true,                
        secure : true
    }
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInUser, accessToken, refreshToken      // Sending the tokens is good practice bcz user might need it when developing mobile application where cookies cannot be set
            },
            "User logged in successfully"
        )
    ) 
})

const logoutUser = asyncHandler(async(req, res) => {
    
})

export { registerUser, loginUser };