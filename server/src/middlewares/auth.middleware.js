import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"


// Verify if the user has a valid JWT token for authentication
// _ (underscore) is used for unused parameter 'res'
export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
      // Log cookies and Authorization header for debugging
      console.log("Cookies:", req.cookies);
      console.log("Authorization Header:", req.header("Authorization"));
  
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        throw new ApiError(401, "You are not authorized: Unauthorized access");
      }
  
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
      const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
      if (!user) {
        throw new ApiError(401, "Invalid access token");
      }
  
      req.user = user;
      next();
    } catch (error) {
      console.error("JWT Verification Error:", error.message); // Log error details
      throw new ApiError(401, error?.message || "Invalid access token");
    }
  });
  