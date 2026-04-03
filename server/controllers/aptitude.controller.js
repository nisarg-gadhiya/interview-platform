import AptitudeQuestion from '../models/aptitudeQuestion.model.js'
import QuizSession from '../models/quizSession.model.js'
import User from '../models/user.model.js'
import { getRandomQuestions, calculateScore } from '../services/aptitude.service.js'

export const startQuiz = async (req, res) => {
    try {
        const { company } = req.query
        const userId = req.user?.id || req.userId

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" })
        }

        if (!company) {
            return res.status(400).json({ message: "Company is required" })
        }

        // Verify user exists
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        console.log(`Starting quiz for user ${userId} at company ${company}`)

        // Get random questions
        const questions = await getRandomQuestions(company, 25)

        // Create quiz session
        const quizSession = await QuizSession.create({
            userId,
            company,
            questions: questions.map(q => q._id),
            totalQuestions: questions.length,
            startTime: new Date(),
            duration: 3000 // 50 minutes
        })

        console.log(`Quiz session created: ${quizSession._id}`)

        return res.status(200).json({
            message: "Quiz started successfully",
            data: {
                sessionId: quizSession._id,
                company,
                questions,
                duration: quizSession.duration
            }
        })

    } catch (error) {
        console.error("Start Quiz Error:", error.message)
        return res.status(500).json({ message: `Failed to start quiz: ${error.message}` })
    }
}

export const submitQuiz = async (req, res) => {
    try {
        const { sessionId, userAnswers } = req.body
        const userId = req.user?.id || req.userId

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        if (!sessionId || !userAnswers) {
            return res.status(400).json({ message: "Session ID and answers are required" })
        }

        // Get quiz session
        const session = await QuizSession.findById(sessionId)
        if (!session) {
            return res.status(404).json({ message: "Quiz session not found" })
        }

        if (session.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized access to this session" })
        }

        console.log(`Submitting quiz for session ${sessionId}`)

        // Calculate score
        const scoreData = await calculateScore(sessionId, userAnswers, session.questions)

        // Calculate time taken
        const endTime = new Date()
        const timeTaken = Math.round((endTime - session.startTime) / 1000)

        // Update session
        await QuizSession.findByIdAndUpdate(sessionId, {
            userAnswers,
            score: scoreData.score,
            correctAnswers: scoreData.correctAnswers,
            endTime,
            timeTaken,
            status: 'completed'
        })

        console.log(`Quiz completed with score: ${scoreData.score}`)

        return res.status(200).json({
            message: "Quiz submitted successfully",
            data: {
                score: scoreData.score,
                correctAnswers: scoreData.correctAnswers,
                totalQuestions: scoreData.totalQuestions,
                timeTaken: timeTaken,
                percentage: scoreData.score,
                detailedResults: scoreData.detailedResults
            }
        })

    } catch (error) {
        console.error("Submit Quiz Error:", error.message)
        return res.status(500).json({ message: `Failed to submit quiz: ${error.message}` })
    }
}

export const getQuizHistory = async (req, res) => {
    try {
        const userId = req.user?.id || req.userId

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const history = await QuizSession.find({ userId, status: 'completed' })
            .sort({ createdAt: -1 })
            .limit(10)

        return res.status(200).json({
            message: "Quiz history retrieved",
            data: history
        })

    } catch (error) {
        console.error("Get History Error:", error.message)
        return res.status(500).json({ message: `Failed to retrieve history: ${error.message}` })
    }
}

export const getQuizStats = async (req, res) => {
    try {
        const userId = req.user?.id || req.userId

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const sessions = await QuizSession.find({ userId, status: 'completed' })

        let bestScore = 0
        let totalQuizzes = sessions.length
        let averageScore = 0

        if (sessions.length > 0) {
            bestScore = Math.max(...sessions.map(s => s.score))
            averageScore = Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length)
        }

        const lastQuiz = sessions.length > 0 ? sessions[0] : null

        return res.status(200).json({
            message: "Quiz stats retrieved",
            data: {
                totalQuizzes,
                bestScore,
                averageScore,
                lastScore: lastQuiz?.score || 0,
                lastCompany: lastQuiz?.company || null
            }
        })

    } catch (error) {
        console.error("Get Stats Error:", error.message)
        return res.status(500).json({ message: `Failed to retrieve stats: ${error.message}` })
    }
}
