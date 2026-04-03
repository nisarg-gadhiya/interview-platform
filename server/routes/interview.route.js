import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { analyzeResume, finishInterview, generateQuestion, submitAnswer, getMyInterviews, getInterviewReport } from "../controllers/interview.controller.js";
import { upload } from "../middlewares/multer.js";

const interviewRouter = express.Router();

interviewRouter.post("/resume", upload.single("resume"), analyzeResume);
interviewRouter.post("/generate-questions", isAuth, generateQuestion)
interviewRouter.post("/submit-answer", isAuth, submitAnswer)
interviewRouter.post("/finish", isAuth, finishInterview)

interviewRouter.get("/get-interviews", isAuth, getMyInterviews)
interviewRouter.get("/report/:id", isAuth, getInterviewReport)

export default interviewRouter;