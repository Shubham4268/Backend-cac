import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

console.log(process.env.CORS_ORIGIN);

// Handle CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'https://twitubefrontend.vercel.app', // Allow your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    credentials: true, // Allow cookies or Authorization headers
  })
);

// Explicit handling of preflight requests
app.options("*", (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'https://twitubefrontend.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204); // No content for preflight request
});

// Middleware
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static("public")); // Serve static files from the "public" folder
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Welcome to my Node.js & MongoDB app!');
});

// Import Routes
import userRouter from "./routes/user.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import videoRouter from "./routes/video.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import viewRouter from "./routes/view.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import { ApiError } from "./utils/ApiError.js";

// Declare routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/views", viewRouter);
app.use("/api/v1/healthchecks", healthcheckRouter);
app.use("/api/v1/dashboards", dashboardRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
      data: err.data,
    });
  }

  // Generic error handler
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export { app };
