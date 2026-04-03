import express from 'express'
import {
    startCodingSession,
    submitCode,
    finishCodingSession,
    getSessionDetails,
    getOAHistory,
    getProblems,
    getProblemDetail
} from '../controllers/coding.controller.js'
import isAuth from '../middlewares/isAuth.js'
import CodingSession from '../models/coding/codingSession.model.js'
import Problem from '../models/coding/problem.model.js'

const router = express.Router() 

// Public routes
router.get('/problems', getProblems)
router.get('/problem/:problemId', getProblemDetail)

// Debug route - clear all ongoing sessions (admin only for debugging)
router.delete('/debug/clear-sessions', async (req, res) => {
    try {
        const result = await CodingSession.deleteMany({ status: 'ongoing' })
        res.status(200).json({ message: `Cleared ${result.deletedCount} ongoing sessions` })
    } catch (error) {
        res.status(500).json({ message: "Error clearing sessions", error: error.message })
    }
})

// Debug route - check system status
router.get('/debug/status', async (req, res) => {
    try {
        const problemCount = await Problem.countDocuments()
        const sessionCount = await CodingSession.countDocuments({ status: 'ongoing' })
        const easyCount = await Problem.countDocuments({ difficulty: 'easy' })
        const mediumCount = await Problem.countDocuments({ difficulty: 'medium' })
        const hardCount = await Problem.countDocuments({ difficulty: 'hard' })
        
        res.status(200).json({
            totalProblems: problemCount,
            ongoingSessions: sessionCount,
            difficulties: {
                easy: easyCount,
                medium: mediumCount,
                hard: hardCount
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Error fetching status", error: error.message })
    }
})

// Protected routes
router.post('/session/clear', isAuth, async (req, res) => {
    try {
        const userId = req.user?.id || req.userId
        const result = await CodingSession.deleteMany({ userId, status: 'ongoing' })
        res.status(200).json({ message: `Cleared ${result.deletedCount} of your ongoing session(s)` })
    } catch (error) {
        res.status(500).json({ message: "Error clearing your session", error: error.message })
    }
})
router.post('/session/start', isAuth, startCodingSession)
router.post('/submit', isAuth, submitCode)
router.post('/session/finish', finishCodingSession)
router.get('/session/:sessionId', isAuth, getSessionDetails)
router.get('/history', isAuth, getOAHistory)

export default router
