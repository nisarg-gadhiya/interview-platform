import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getSessionDetails } from '../redux/oaSlice'
import { BsCheckCircle, BsXCircle, BsArrowLeft } from 'react-icons/bs'
import Navbar from '../components/Navbar'
import { motion } from 'motion/react'

const OAResultPage = () => {
    const { sessionId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { sessionResult } = useSelector(state => state.oa)
    const { userData } = useSelector(state => state.user)

    useEffect(() => {
        if (!userData) {
            navigate('/auth')
        }
    }, [userData, navigate])

    if (!sessionResult) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading results...</p>
                </div>
            </div>
        )
    }

    const result = sessionResult
    const totalScore = result.totalScore
    const maxScore = 100 + 200 + 300 // Easy + Medium + Hard
    const scorePercentage = Math.round((totalScore / maxScore) * 100)

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-20">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <div className={`inline-block p-4 rounded-full mb-6 ${
                        scorePercentage >= 70 ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                        {scorePercentage >= 70 ? (
                            <BsCheckCircle className="text-green-600" size={48} />
                        ) : (
                            <BsXCircle className="text-yellow-600" size={48} />
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Assessment Complete!
                    </h1>

                    <p className="text-xl text-gray-600">
                        {scorePercentage >= 90 ? 'Outstanding performance!' :
                         scorePercentage >= 70 ? 'Great job! Keep improving' :
                         'Good effort! Practice more'}
                    </p>
                </motion.div>

                {/* Score Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-linear-to-br from-green-50 to-blue-50 rounded-2xl p-8 mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <p className="text-4xl font-bold text-gray-900">{totalScore}</p>
                            <p className="text-gray-600 mt-2">Total Score</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-green-600">{scorePercentage}%</p>
                            <p className="text-gray-600 mt-2">Percentage</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-blue-600">{result.solvedProblems}/{result.totalProblems}</p>
                            <p className="text-gray-600 mt-2">Problems Solved</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-purple-600">{result.timeSpent}</p>
                            <p className="text-gray-600 mt-2">Minutes</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
                            <span className="text-sm font-semibold text-gray-700">{scorePercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${scorePercentage}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className={`h-full ${
                                    scorePercentage >= 70 ? 'bg-linear-to-r from-green-500 to-green-600' :
                                    'bg-linear-to-r from-yellow-500 to-yellow-600'
                                }`}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Problem Results */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Problem Results</h2>
                    <div className="space-y-4">
                        {result.problemResults && result.problemResults.map((prob, idx) => (
                            <div key={idx} className={`rounded-xl p-6 border-2 ${
                                prob.verdict === 'Accepted'
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-red-50 border-red-200'
                            }`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {prob.verdict === 'Accepted' ? (
                                                <BsCheckCircle className="text-green-600" size={24} />
                                            ) : (
                                                <BsXCircle className="text-red-600" size={24} />
                                            )}
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {prob.title}
                                                </h3>
                                                <span className={`inline-block px-3 py-1 rounded text-xs font-semibold mt-1 ${
                                                    prob.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                    prob.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {prob.difficulty.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600">Verdict</p>
                                                <p className={`font-semibold ${
                                                    prob.verdict === 'Accepted' ? 'text-green-700' : 'text-red-700'
                                                }`}>
                                                    {prob.verdict}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Test Cases</p>
                                                <p className="font-semibold text-gray-900">
                                                    {prob.passedTestCases}/{prob.totalTestCases}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Score</p>
                                                <p className="font-semibold text-gray-900">{prob.score}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-12 flex gap-4"
                >
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 rounded-xl hover:bg-gray-300 font-semibold transition flex items-center justify-center gap-2"
                    >
                        <BsArrowLeft size={20} />
                        Back to Home
                    </button>
                    <button
                        onClick={() => {
                            window.location.href = '/oa'
                        }}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold transition"
                    >
                        Try Again
                    </button>
                </motion.div>
            </div>
        </div>
    )
}

export default OAResultPage
