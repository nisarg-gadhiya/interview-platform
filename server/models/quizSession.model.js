import mongoose from 'mongoose'

const quizSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: String,
        required: true
    },
    questions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'AptitudeQuestion'
    },
    userAnswers: {
        type: [String],
        default: []
    },
    score: {
        type: Number,
        default: 0
    },
    totalQuestions: {
        type: Number,
        default: 0
    },
    correctAnswers: {
        type: Number,
        default: 0
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        default: null
    },
    timeTaken: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number,
        default: 1200 // 20 minutes in seconds
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'abandoned'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const QuizSession = mongoose.model("QuizSession", quizSessionSchema)

export default QuizSession
