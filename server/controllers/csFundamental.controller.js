import CSFundamental from '../models/csFundamental.model.js'
import UserProgress from '../models/userProgress.model.js'
import User from '../models/user.model.js'

// Get all subjects
export const getSubjects = async (req, res) => {
    try {
        const subjects = ['OS', 'CN', 'DBMS', 'System Design', 'OOPS']
        
        const subjectsWithCounts = await Promise.all(
            subjects.map(async (subject) => ({
                subject,
                topicCount: await CSFundamental.countDocuments({ subject })
            }))
        )

        return res.status(200).json({
            message: "Subjects retrieved",
            data: subjectsWithCounts
        })
    } catch (error) {
        console.error("Get Subjects Error:", error.message)
        return res.status(500).json({ message: `Failed to retrieve subjects: ${error.message}` })
    }
}

// Get all topics for a subject
export const getTopicsBySubject = async (req, res) => {
    try {
        const { subject } = req.params
        const userId = req.user?.id || req.userId

        if (!subject || !['OS', 'CN', 'DBMS', 'System Design', 'OOPS'].includes(subject)) {
            return res.status(400).json({ message: "Invalid subject" })
        }

        const topics = await CSFundamental.find({ subject }).sort({ createdAt: 1 })

        // Get user progress for each topic
        let userProgressMap = {}
        if (userId) {
            const progressList = await UserProgress.find({ userId, subject })
            progressList.forEach(p => {
                userProgressMap[p.topicId.toString()] = p
            })
        }

        const topicsWithProgress = topics.map(topic => ({
            ...topic.toObject(),
            userProgress: userProgressMap[topic._id.toString()] || null
        }))

        return res.status(200).json({
            message: "Topics retrieved",
            data: topicsWithProgress
        })
    } catch (error) {
        console.error("Get Topics Error:", error.message)
        return res.status(500).json({ message: `Failed to retrieve topics: ${error.message}` })
    }
}

// Get single topic detail
export const getTopicDetail = async (req, res) => {
    try {
        const { topicId } = req.params
        const userId = req.user?.id || req.userId

        const topic = await CSFundamental.findById(topicId)
            .populate('relatedTopics', 'title subject')

        if (!topic) {
            return res.status(404).json({ message: "Topic not found" })
        }

        let userProgress = null
        if (userId) {
            userProgress = await UserProgress.findOne({ userId, topicId })
        }

        return res.status(200).json({
            message: "Topic retrieved",
            data: {
                ...topic.toObject(),
                userProgress
            }
        })
    } catch (error) {
        console.error("Get Topic Error:", error.message)
        return res.status(500).json({ message: `Failed to retrieve topic: ${error.message}` })
    }
}

// Update user progress
export const updateProgress = async (req, res) => {
    try {
        const { topicId } = req.params
        const { status, timeSpent, isBookmarked, notes } = req.body
        const userId = req.user?.id || req.userId

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const topic = await CSFundamental.findById(topicId)
        if (!topic) {
            return res.status(404).json({ message: "Topic not found" })
        }

        let progress = await UserProgress.findOne({ userId, topicId })

        if (!progress) {
            progress = await UserProgress.create({
                userId,
                topicId,
                subject: topic.subject,
                status: status || 'in-progress',
                timeSpent: timeSpent || 0,
                isBookmarked: isBookmarked || false,
                notes: notes || ''
            })
        } else {
            if (status) progress.status = status
            if (timeSpent !== undefined) progress.timeSpent = timeSpent
            if (isBookmarked !== undefined) progress.isBookmarked = isBookmarked
            if (notes !== undefined) progress.notes = notes
            
            if (status === 'completed' && !progress.completedAt) {
                progress.completedAt = new Date()
            }
            
            progress.lastAccessedAt = new Date()
            await progress.save()
        }

        return res.status(200).json({
            message: "Progress updated",
            data: progress
        })
    } catch (error) {
        console.error("Update Progress Error:", error.message)
        return res.status(500).json({ message: `Failed to update progress: ${error.message}` })
    }
}

// Get user statistics
export const getUserStats = async (req, res) => {
    try {
        const userId = req.user?.id || req.userId

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const progressList = await UserProgress.find({ userId })

        const stats = {
            totalTopics: await CSFundamental.countDocuments(),
            topicsCompleted: progressList.filter(p => p.status === 'completed').length,
            topicsInProgress: progressList.filter(p => p.status === 'in-progress').length,
            bookmarkedTopics: progressList.filter(p => p.isBookmarked).length,
            totalTimeSpent: progressList.reduce((sum, p) => sum + p.timeSpent, 0),
            bySubject: {
                OS: {
                    completed: progressList.filter(p => p.subject === 'OS' && p.status === 'completed').length,
                    inProgress: progressList.filter(p => p.subject === 'OS' && p.status === 'in-progress').length,
                    total: await CSFundamental.countDocuments({ subject: 'OS' })
                },
                CN: {
                    completed: progressList.filter(p => p.subject === 'CN' && p.status === 'completed').length,
                    inProgress: progressList.filter(p => p.subject === 'CN' && p.status === 'in-progress').length,
                    total: await CSFundamental.countDocuments({ subject: 'CN' })
                },
                DBMS: {
                    completed: progressList.filter(p => p.subject === 'DBMS' && p.status === 'completed').length,
                    inProgress: progressList.filter(p => p.subject === 'DBMS' && p.status === 'in-progress').length,
                    total: await CSFundamental.countDocuments({ subject: 'DBMS' })
                },
                'System Design': {
                    completed: progressList.filter(p => p.subject === 'System Design' && p.status === 'completed').length,
                    inProgress: progressList.filter(p => p.subject === 'System Design' && p.status === 'in-progress').length,
                    total: await CSFundamental.countDocuments({ subject: 'System Design' })
                },
                OOPS: {
                    completed: progressList.filter(p => p.subject === 'OOPS' && p.status === 'completed').length,
                    inProgress: progressList.filter(p => p.subject === 'OOPS' && p.status === 'in-progress').length,
                    total: await CSFundamental.countDocuments({ subject: 'OOPS' })
                }
            }
        }

        return res.status(200).json({
            message: "Stats retrieved",
            data: stats
        })
    } catch (error) {
        console.error("Get Stats Error:", error.message)
        return res.status(500).json({ message: `Failed to retrieve stats: ${error.message}` })
    }
}

// Get bookmarked topics
export const getBookmarkedTopics = async (req, res) => {
    try {
        const userId = req.user?.id || req.userId

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const bookmarked = await UserProgress.find({ userId, isBookmarked: true })
            .populate('topicId', 'title subject difficulty')
            .sort({ createdAt: -1 })

        return res.status(200).json({
            message: "Bookmarked topics retrieved",
            data: bookmarked
        })
    } catch (error) {
        console.error("Get Bookmarked Error:", error.message)
        return res.status(500).json({ message: `Failed to retrieve bookmarked topics: ${error.message}` })
    }
}

// Search topics
export const searchTopics = async (req, res) => {
    try {
        const { query, subject } = req.query

        let filter = {}
        if (subject && ['OS', 'CN', 'DBMS', 'System Design', 'OOPS'].includes(subject)) {
            filter.subject = subject
        }

        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
                { keyPoints: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ]
        }

        const results = await CSFundamental.find(filter).limit(20)

        return res.status(200).json({
            message: "Search results",
            data: results
        })
    } catch (error) {
        console.error("Search Error:", error.message)
        return res.status(500).json({ message: `Failed to search: ${error.message}` })
    }
}
