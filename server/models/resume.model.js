import mongoose from 'mongoose'

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    extractedText: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        min: 0,
        max: 100
    },
    strengths: [String],
    weaknesses: [String],
    missingSkills: [String],
    suggestions: [String],
    skills: [String],
    projects: [String],
    experience: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const Resume = mongoose.model("Resume", resumeSchema)

export default Resume
