import AptitudeQuestion from '../models/aptitudeQuestion.model.js'

export const getRandomQuestions = async (company, limit = 15) => {
    try {
        const questions = await AptitudeQuestion.aggregate([
            { $match: { companyTag: company } },
            { $sample: { size: limit } }
        ])

        if (!questions || questions.length === 0) {
            throw new Error(`No questions found for company: ${company}`)
        }

        // Remove correct answers from questions sent to frontend
        const questionsWithoutAnswers = questions.map(q => ({
            _id: q._id,
            question: q.question,
            options: q.options,
            topic: q.topic,
            difficulty: q.difficulty
        }))

        return questionsWithoutAnswers
    } catch (error) {
        console.error("Error fetching random questions:", error.message)
        throw error
    }
}

export const calculateScore = async (sessionId, userAnswers, questions) => {
    try {
        let correctCount = 0

        // Get full question details with correct answers
        const fullQuestions = await AptitudeQuestion.find({
            _id: { $in: questions }
        })

        // Create a map of question IDs to their full details
        const questionMap = {}
        fullQuestions.forEach(q => {
            questionMap[q._id.toString()] = q
        })

        // Build detailed results array
        const detailedResults = []
        userAnswers.forEach((answer, index) => {
            const questionId = questions[index]
            const question = questionMap[questionId.toString()]
            const isCorrect = answer === question.correctAnswer

            if (isCorrect) {
                correctCount++
            }

            detailedResults.push({
                questionId: questionId,
                question: question.question,
                topic: question.topic,
                difficulty: question.difficulty,
                options: question.options,
                userAnswer: answer,
                correctAnswer: question.correctAnswer,
                isCorrect: isCorrect
            })
        })

        const score = Math.round((correctCount / questions.length) * 100)

        return {
            score,
            correctAnswers: correctCount,
            totalQuestions: questions.length,
            detailedResults: detailedResults
        }
    } catch (error) {
        console.error("Error calculating score:", error.message)
        throw error
    }
}
