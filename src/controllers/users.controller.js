import { asyncHandler } from "../utils/asyncHandler.js";

// Register a new user using the asyncHandler to manage asynchronous errors.
// If the request is successful, the server responds with status 200 and a JSON message.
const registerUser = asyncHandler(async (req,res) => {
    res.status(200).json({
        message : 'ok'
    })
})

export {registerUser};