import { Router } from 'express';
import { addVideoView, getVideoViews, removeView } from "../controllers/view.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/:videoId")
    .get(getVideoViews)
    .post(addVideoView)
    .delete(removeView);

// router.route("/u/:subscriberId").get(getSubscribedChannels);

export default router