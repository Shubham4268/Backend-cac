import { Router } from "express";
import { registerUser } from "../controllers/users.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()
// sets up a route that listens for POST requests to /register and calls the registerUser controller when this route is hit.
router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser
)


export default router;