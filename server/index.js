import express from 'express'
import dotenv from 'dotenv'
import connectDB from '../server/config/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.route.js'
import interviewRouter from './routes/interview.route.js'
import paymentRouter from "./routes/payment.routes.js";
import resumeRouter from './routes/resume.route.js'
import aptitudeRouter from './routes/aptitude.route.js'
import csFundamentalRouter from './routes/csFundamental.route.js'
import codingRouter from './routes/coding.route.js'
import { seedAptitudeQuestions } from './seeds/aptitudeQuestions.seed.js'
import { seedCSFundamentalTopics } from './seeds/csFundamental.seed.js'
import { seedCodingProblems } from './seeds/codingProblems.seed.js'

dotenv.config()
const app = express()

app.use(cors({
    origin: "https://interview-platform-1-ni5z.onrender.com",
    "http://interview-platform-1-ni5z.onrender.com"
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '50mb' }))
app.use(express.text({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/payment", paymentRouter);
app.use("/api/resume", resumeRouter)
app.use("/api/aptitude", aptitudeRouter)
app.use("/api/cs-fundamentals", csFundamentalRouter)
app.use("/api/coding", codingRouter)

let port = process.env.PORT

app.listen(port,async ()=>{
    console.log(`server running on port ${port}`)
    await connectDB()
    await seedAptitudeQuestions()
    await seedCSFundamentalTopics()
    await seedCodingProblems()
})
