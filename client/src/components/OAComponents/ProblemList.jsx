import React from 'react'
import { BsCheckCircle, BsCircle, BsCheck } from 'react-icons/bs'

const ProblemList = ({ problems, currentIndex, onSelectProblem, solvedProblems = [] }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Problems ({problems.length})</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {problems.map((problem, index) => {
                    const isSolved = solvedProblems && solvedProblems.includes(index)
                    const isCurrentIndex = currentIndex === index
                    
                    return (
                        <button
                            key={problem._id}
                            onClick={() => onSelectProblem(index)}
                            className={`p-4 rounded-xl border-2 transition text-left relative ${
                                isCurrentIndex
                                    ? 'border-green-500 bg-green-50'
                                    : isSolved
                                    ? 'border-green-400 bg-green-50'
                                    : 'border-gray-200 bg-white hover:border-green-300'
                            }`}
                        >
                            {/* Solved checkmark badge */}
                            {isSolved && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                                    <BsCheck size={14} />
                                </div>
                            )}
                            
                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    {isCurrentIndex ? (
                                        <BsCheckCircle className="text-green-600" size={20} />
                                    ) : (
                                        <BsCircle className={isSolved ? 'text-green-500' : 'text-gray-400'} size={20} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-gray-900">
                                        Q{index + 1}: {problem.title}
                                    </div>
                                    <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${
                                        problem.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                        problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {problem.difficulty.toUpperCase()}
                                    </span>
                                    {isSolved && (
                                        <div className="text-xs text-green-600 font-semibold mt-1">
                                            ✓ Solved
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default ProblemList
