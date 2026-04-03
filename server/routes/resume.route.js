import express from 'express'
import { analyzeResume, getUserResumes, getResumeById, deleteResume } from '../controllers/resume.controller.js'
import isAuth from '../middlewares/isAuth.js'

const router = express.Router()

// Analyze resume
router.post('/analyze', isAuth, analyzeResume)

// Get all user resumes
router.get('/history', isAuth, getUserResumes)

// Get specific resume
router.get('/:id', isAuth, getResumeById)

// Delete resume
router.delete('/:id', isAuth, deleteResume)

export default router
