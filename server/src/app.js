import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()
   
// Configure CORS
// const corsOptions = {
//   origin: 'https://twitubefrontend.vercel.app', // Your frontend URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true, // Allow cookies and credentials
// };

// app.options('*', (req, res) => {
//   res.setHeader('Access-Control-Allow-Origin', 'https://twitubefrontend.vercel.app'); // Your frontend URL
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials
//   return res.status(200).end(); // Respond with 200 OK to preflight request
// });
// Apply CORS middleware before your routes
// app.use(cors({
//   origin : process.env.CORS_ORIGIN,
//   credentials : true
// }))

app.use(cors({
  origin: 'https://twitubefrontend.vercel.app', // Allow only your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  credentials: true // Include cookies if needed
}));
console.log("You are connected to backend")


// Handle preflight OPTIONS requests explicitly (if needed)

app.use(express.json({limit : '16kb'}))
// Some times urls are written as shubham+joshi or shubham%20joshi. to make express understand:-
app.use(express.urlencoded({extended : true, limit : '16kb'}))
app.use(express.static("public"))  // Static stores files, images in the server in public folder
app.use(cookieParser())            // req gets the Access of cookies via middleware


app.get('/', (req, res) => {
  res.send('Welcome to my Node.js & MongoDB app!');
});

// import Routes
import userRouter from "./routes/user.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import videoRouter from "./routes/video.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import viewRouter from "./routes/view.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import { ApiError } from "./utils/ApiError.js"

// routes declaration

app.use("/api/v1/users", userRouter)          // The userRouter is imported and mounted on the /api/v1/users path. Any request to this path will be forwarded to userRouter.
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/playlists", playlistRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/views", viewRouter)
app.use("/api/v1/healthchecks", healthcheckRouter)
app.use("/api/v1/dashboards", dashboardRouter)
// URL : http://localhost:8000/api/v1/users/register

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
      data: err.data,
    });
  }

  // Handle other errors
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export {app}