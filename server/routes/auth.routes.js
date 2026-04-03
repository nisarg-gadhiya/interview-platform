import express from "express";
import { googleAuth, logout } from "../controllers/auth.controller.js";

const authRouter = express.Router();

// Google login
authRouter.post("/google", googleAuth);

// Logout
authRouter.post("/logout", logout);

export default authRouter;