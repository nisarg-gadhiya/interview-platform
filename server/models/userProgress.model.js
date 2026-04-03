import mongoose from 'mongoose'

const userProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CSFundamental',
        required: true
    },
    subject: {
        type: String,
        enum: ['OS', 'CN', 'DBMS', 'System Design', 'OOPS'],
        required: true
    },
    status: {
        type: String,
        enum: ['not-started', 'in-progress', 'completed'],
        default: 'not-started'
    },
    timeSpent: {
        type: Number,
        default: 0 // in seconds
    },
    isBookmarked: {
        type: Boolean,
        default: false
    },
    notes: {
        type: String,
        default: ''
    },
    completedAt: {
        type: Date,
        default: null
    },
    lastAccessedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const UserProgress = mongoose.model("UserProgress", userProgressSchema)

export default UserProgress
