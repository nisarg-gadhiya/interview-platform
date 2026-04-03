import mongoose from 'mongoose'

const aptitudeQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: function(arr) {
                return arr.length === 4
            },
            message: "Must have exactly 4 options"
        }
    },
    correctAnswer: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        enum: ['Quantitative', 'Logical', 'Verbal'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    companyTag: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const AptitudeQuestion = mongoose.model("AptitudeQuestion", aptitudeQuestionSchema)

export default AptitudeQuestion
