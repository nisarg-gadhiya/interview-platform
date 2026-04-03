import express from 'express'
import { startQuiz, submitQuiz, getQuizHistory, getQuizStats } from '../controllers/aptitude.controller.js'
import isAuth from '../middlewares/isAuth.js'

const router = express.Router()

// Start a quiz
router.get('/start', isAuth, startQuiz)

// Submit quiz answers
router.post('/submit', isAuth, submitQuiz)

// Get quiz history
router.get('/history', isAuth, getQuizHistory)

// Get quiz statistics
router.get('/stats', isAuth, getQuizStats)

export default router
