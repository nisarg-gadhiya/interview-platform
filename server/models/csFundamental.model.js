import mongoose from 'mongoose'

const csFundamentalSchema = new mongoose.Schema({
    subject: {
        type: String,
        enum: ['OS', 'CN', 'DBMS', 'System Design', 'OOPS'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    keyPoints: {
        type: [String],
        default: []
    },
    examples: {
        type: [String],
        default: []
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    relatedTopics: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'CSFundamental'
    },
    tags: {
        type: [String],
        default: []
    },
    sourceAttribution: {
        type: String,
        default: 'Internal'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const CSFundamental = mongoose.model("CSFundamental", csFundamentalSchema)

export default CSFundamental
