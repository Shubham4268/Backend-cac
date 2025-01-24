import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// CORS setup
const allowedOrigins = [
  process.env.CORS_ORIGIN 
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true); // Allow requests with no origin
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Make sure this is true
};


app.use(cookieParser());
app.use(cors(corsOptions));

// Middleware to parse JSON and URL-encoded data
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static("public")); // Serve static files from the "public" folder

// Basic health check route
app.get("/", (_, response) => {
  response.status(200).send("Server is working fine");
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
  if (process.env.NODE_ENV === 'development') {
    console.error(err); // Log error in development mode for debugging
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export { app };
