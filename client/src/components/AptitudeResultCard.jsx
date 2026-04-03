import React, { useState } from 'react'

const AptitudeResultCard = ({ result, onTakeAnother }) => {
  const [showDetailedReview, setShowDetailedReview] = useState(false)

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <p className="text-sm font-semibold text-green-600 mb-2">QUIZ SCORE</p>
          <div className="flex justify-center mb-4">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={result.percentage >= 75 ? '#10b981' : result.percentage >= 50 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8"
                  strokeDasharray={`${(result.percentage / 100) * 314} 314`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold text-gray-900">{result.percentage}%</span>
              </div>
            </div>
          </div>
          <p className="text-lg font-semibold text-gray-700">
            {result.percentage >= 75 ? '🎉 Excellent' : result.percentage >= 50 ? '👍 Good' : '💪 Needs Improvement'}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <p className="text-sm font-semibold text-gray-600 mb-2">Correct Answers</p>
          <p className="text-4xl font-bold text-green-600">
            {result.correctAnswers}/{result.totalQuestions}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <p className="text-sm font-semibold text-gray-600 mb-2">Time Taken</p>
          <p className="text-4xl font-bold text-blue-600">
            {formatTime(result.timeTaken)}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <p className="text-sm font-semibold text-gray-600 mb-2">Accuracy</p>
          <p className="text-4xl font-bold text-purple-600">
            {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
          </p>
        </div>
      </div>

      {/* Performance Breakdown */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Summary</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700 font-semibold">Correct Answers</span>
              <span className="text-green-600 font-bold">{result.correctAnswers}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" 
                   style={{ width: `${(result.correctAnswers / result.totalQuestions) * 100}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700 font-semibold">Wrong Answers</span>
              <span className="text-red-600 font-bold">{result.totalQuestions - result.correctAnswers}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" 
                   style={{ width: `${((result.totalQuestions - result.correctAnswers) / result.totalQuestions) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Review Toggle Button */}
      <button
        onClick={() => setShowDetailedReview(!showDetailedReview)}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
      >
        {showDetailedReview ? 'Hide Detailed Review' : 'View Detailed Review'}
      </button>

      {/* Detailed Question Review */}
      {showDetailedReview && result.detailedResults && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Detailed Answer Review</h3>
          
          {result.detailedResults.map((item, index) => (
            <div 
              key={index} 
              className={`rounded-2xl shadow-lg p-6 border-2 ${
                item.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              }`}
            >
              {/* Question Header */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    item.isCorrect 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-red-200 text-red-800'
                  }`}>
                    Question {index + 1} - {item.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                  <span className="text-xs font-semibold text-gray-600 bg-gray-200 px-2 py-1 rounded">
                    {item.topic} - {item.difficulty}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">{item.question}</h4>
              </div>

              {/* Options */}
              <div className="space-y-2 mb-4">
                {item.options.map((option, optIdx) => {
                  const isUserAnswer = option === item.userAnswer
                  const isCorrectAnswer = option === item.correctAnswer
                  
                  return (
                    <div
                      key={optIdx}
                      className={`p-3 rounded-lg border-2 font-semibold ${
                        isCorrectAnswer
                          ? 'border-green-500 bg-green-100 text-green-900'
                          : isUserAnswer && !item.isCorrect
                          ? 'border-red-500 bg-red-100 text-red-900'
                          : 'border-gray-300 bg-white text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold ${
                          isCorrectAnswer
                            ? 'border-green-600 bg-green-600 text-white'
                            : isUserAnswer && !item.isCorrect
                            ? 'border-red-600 bg-red-600 text-white'
                            : 'border-gray-400'
                        }`}>
                          {isCorrectAnswer ? '✓' : isUserAnswer && !item.isCorrect ? '✗' : String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1">{option}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Answer Summary */}
              <div className="bg-white bg-opacity-70 rounded-lg p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700 font-semibold">Your Answer:</span>
                  <span className={`font-bold ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {item.userAnswer || 'Not answered'}
                  </span>
                </div>
                {!item.isCorrect && (
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-semibold">Correct Answer:</span>
                    <span className="font-bold text-green-600">{item.correctAnswer}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={onTakeAnother}
        className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
      >
        Take Another Quiz
      </button>
    </div>
  )
}

export default AptitudeResultCard
