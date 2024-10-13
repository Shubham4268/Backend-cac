import { Router } from "express";
import { registerUser } from "../controllers/users.controller.js";

const router = Router()
// sets up a route that listens for POST requests to /register and calls the registerUser controller when this route is hit.
router.route("/register").post(registerUser)


export default router;