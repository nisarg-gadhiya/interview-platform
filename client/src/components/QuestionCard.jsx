import React from 'react'

const QuestionCard = ({ question, questionNumber, totalQuestions, selectedAnswer, onSelectAnswer }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="mb-6">
        <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
          {question.topic} - {question.difficulty}
        </span>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-8">
        {question.question}
      </h3>

      <div className="space-y-3">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onSelectAnswer(option)}
            className={`w-full p-4 text-left rounded-lg border-2 font-semibold transition ${
              selectedAnswer === option
                ? 'border-green-500 bg-green-50 text-green-900'
                : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
            }`}
          >
            <span className="flex items-center">
              <span className="w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center">
                {selectedAnswer === option && (
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                )}
              </span>
              {option}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuestionCard
