import mongoose from 'mongoose'

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    constraints: {
        type: String,
        required: true
    },
    inputFormat: {
        type: String,
        required: true
    },
    outputFormat: {
        type: String,
        required: true
    },
    sampleInput: {
        type: String,
        required: true
    },
    sampleOutput: {
        type: String,
        required: true
    },
    testCases: [{
        input: {
            type: String,
            required: true
        },
        output: {
            type: String,
            required: true
        },
        isHidden: {
            type: Boolean,
            default: false
        }
    }],
    category: {
        type: String,
        enum: ['arrays', 'strings', 'trees', 'graphs', 'dp', 'sorting', 'searching', 'other'],
        default: 'other'
    }
}, { timestamps: true })

const Problem = mongoose.model('Problem', problemSchema)

export default Problem
