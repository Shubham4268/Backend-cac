import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    return res.status(200).json(
        new ApiResponse(200, { 
            status: "healthy",
            uptime: `${Math.floor(uptime)} seconds`,
            memoryUsage: {
                rss: memoryUsage.rss, // Resident Set Size
                heapTotal: memoryUsage.heapTotal,
                heapUsed: memoryUsage.heapUsed
            }
        }, "OK")
    );
});


export {
    healthcheck
    }
    