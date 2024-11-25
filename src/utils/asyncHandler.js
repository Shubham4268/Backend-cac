// In an Express app, when dealing with asynchronous functions, it can be tedious to write try-catch blocks for every async route to catch potential errors. This asyncHandler simplifies that by automatically catching and forwarding any errors to the error-handling middleware, eliminating the need for repetitive try-catch blocks.

const asyncHandler = (requestHandler ) => {
    return (req,res,next) => {
        Promise
        .resolve(requestHandler(req,res,next))
        .catch((err)=>next(err))
    }
}


export {asyncHandler};

// callback function calling a function
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next) 
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success : false,
//             message : err.message
//         })
//     }
// }

