import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"


// Verify if the user has a valid JWT token for authentication
// _ (underscore) is used for unused parameter 'res'
export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Retrieve token from cookies or Authorization header (for mobile clients)
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        // Check if token is provided
        if (!token) {
            throw new ApiError(401, "Unauthorized access");
        }

        // Verify the JWT token using the secret key
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find the user associated with the token, excluding sensitive data
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // If user is not found, throw error
        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        // Attach the user object to the request for further use in the request lifecycle
        req.user = user;
        next(); // Move to the next middleware or route handler
    } catch (error) {
        // Handle token verification errors
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});