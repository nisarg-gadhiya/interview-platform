import React from 'react'

const QuizTimer = ({ timeLeft }) => {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const isWarning = timeLeft < 600 // Less than 10 minutes

  return (
    <div className={`rounded-2xl shadow-lg p-6 text-center ${
      isWarning
        ? 'bg-red-50 border-2 border-red-300'
        : 'bg-teal-50 border-2 border-teal-300'
    }`}>
      <p className={`font-semibold ${isWarning ? 'text-red-700' : 'text-teal-700'}`}>
        Time Remaining
      </p>
      <p className={`text-5xl font-bold mt-2 ${isWarning ? 'text-red-600' : 'text-teal-600'}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </p>
      {isWarning && (
        <p className="text-red-600 text-sm mt-2">⚠️ Hurry up! Less than 10 minutes left</p>
      )}
    </div>
  )
}

export default QuizTimer
