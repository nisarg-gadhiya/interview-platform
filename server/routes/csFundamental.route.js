import express from 'express'
import {
    getSubjects,
    getTopicsBySubject,
    getTopicDetail,
    updateProgress,
    getUserStats,
    getBookmarkedTopics,
    searchTopics
} from '../controllers/csFundamental.controller.js'
import isAuth from '../middlewares/isAuth.js'

const router = express.Router()

router.get('/subjects', getSubjects)
router.get('/search', searchTopics)
router.get('/stats', isAuth, getUserStats)
router.get('/bookmarked', isAuth, getBookmarkedTopics)
router.get('/subject/:subject', getTopicsBySubject)
router.get('/detail/:topicId', getTopicDetail)
router.post('/progress/:topicId', isAuth, updateProgress)

export default router
