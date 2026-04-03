import mongoose from 'mongoose'

const submissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CodingSession',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        enum: ['javascript', 'python', 'cpp', 'java', 'csharp', 'go', 'rust', 'typescript', 'ruby', 'php'],
        required: true
    },
    verdict: {
        type: String,
        enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded', 'Compilation Error', 'Pending'],
        default: 'Pending'
    },
    passedTestCases: {
        type: Number,
        default: 0
    },
    totalTestCases: {
        type: Number,
        required: true
    },
    executionTime: {
        type: Number // in milliseconds
    },
    memory: {
        type: Number // in KB
    },
    errorMessage: {
        type: String
    },
    testCaseResults: [{
        testCaseIndex: Number,
        input: String,
        expectedOutput: String,
        actualOutput: String,
        passed: Boolean
    }],
    judge0TokenId: {
        type: String
    }
}, { timestamps: true })

const Submission = mongoose.model('Submission', submissionSchema)

export default Submission
