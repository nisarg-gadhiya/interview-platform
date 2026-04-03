import mongoose from 'mongoose'

const codingSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'
    }],
    submissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission'
    }],
    startTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    duration: {
        type: Number,
        default: 60, // in minutes
    },
    status: {
        type: String,
        enum: ['ongoing', 'completed', 'abandoned'],
        default: 'ongoing'
    },
    score: {
        type: Number,
        default: 0
    },
    totalProblems: {
        type: Number,
        default: 3
    },
    solvedProblems: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const CodingSession = mongoose.model('CodingSession', codingSessionSchema)

export default CodingSession
