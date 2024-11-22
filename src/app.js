import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit : '16kb'}))
// Some times urls are written as shubham+joshi or shubham%20joshi. to make express understand:-
app.use(express.urlencoded({extended : true, limit : '16kb'}))
app.use(express.static("public"))  // Static stores files, images in the server in public folder
app.use(cookieParser())            // req gets the Access of cookies via middleware



// import Routes
import userRouter from "./routes/user.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import videoRouter from "./routes/video.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import commentRouter from "./routes/comment.routes.js"

// routes declaration

app.use("/api/v1/users", userRouter)          // The userRouter is imported and mounted on the /api/v1/users path. Any request to this path will be forwarded to userRouter.
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/playlists", playlistRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/comments", commentRouter)
// URL : http://localhost:8000/api/v1/users/register
export {app}