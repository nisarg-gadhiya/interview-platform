import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import axios from 'axios'
import { serverUrl } from '../utils/serverUrl'
import QuestionCard from '../components/QuestionCard'
import QuizTimer from '../components/QuizTimer'
import ResultCard from '../components/AptitudeResultCard'

const AptitudeTest = () => {
  const navigate = useNavigate()
  const companies = ['TCS', 'Infosys', 'Amazon', 'Google', 'Microsoft', 'Wipro', 'HCL', 'Accenture']

  const [stage, setStage] = useState('company-select') // company-select, quiz, result
  const [selectedCompany, setSelectedCompany] = useState('')
  const [sessionId, setSessionId] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [timeLeft, setTimeLeft] = useState(3000) // 50 minutes
  const [quizStarted, setQuizStarted] = useState(false)

  // Handle company selection
  const handleStartQuiz = async (company) => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.get(
        `${serverUrl}/api/aptitude/start?company=${company}`,
        { withCredentials: true }
      )

      if (response.data.data) {
        setSessionId(response.data.data.sessionId)
        setQuestions(response.data.data.questions)
        setUserAnswers(new Array(response.data.data.questions.length).fill(null))
        setTimeLeft(response.data.data.duration)
        setStage('quiz')
        setQuizStarted(true)
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to start quiz'
      setError(errorMessage)
      console.error('Start quiz error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Timer effect
  useEffect(() => {
    if (stage !== 'quiz' || !quizStarted) return

    if (timeLeft <= 0) {
      handleSubmitQuiz()
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, stage, quizStarted])

  // Handle answer selection
  const handleSelectAnswer = (answer) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = answer
    setUserAnswers(newAnswers)
  }

  // Navigation functions
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  // Submit quiz
  const handleSubmitQuiz = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.post(
        `${serverUrl}/api/aptitude/submit`,
        {
          sessionId,
          userAnswers
        },
        { withCredentials: true }
      )

      if (response.data.data) {
        setResult(response.data.data)
        setStage('result')
        setQuizStarted(false)
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit quiz'
      setError(errorMessage)
      console.error('Submit quiz error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBackHome = () => navigate("/")

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex items-start gap-4">
          <button 
            onClick={handleBackHome}
            className="mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition"
          >
            <FaArrowLeft className="text-gray-600" size={20} />
          </button>
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Aptitude Quiz
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              Test your skills with company-based assessments
            </p>
          </div>
        </div>

        {/* Company Selection */}
        {stage === 'company-select' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Select a Company</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {companies.map((company) => (
                <button
                  key={company}
                  onClick={() => handleStartQuiz(company)}
                  disabled={loading}
                  className="p-6 border-2 border-green-200 rounded-xl text-center font-bold text-lg hover:bg-green-50 hover:border-green-500 transition cursor-pointer disabled:opacity-50"
                >
                  {company}
                </button>
              ))}
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-800">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {loading && (
              <div className="mt-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            )}
          </div>
        )}

        {/* Quiz */}
        {stage === 'quiz' && questions.length > 0 && (
          <div className="space-y-6">
            <QuizTimer timeLeft={timeLeft} />

            <QuestionCard
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              selectedAnswer={userAnswers[currentQuestionIndex]}
              onSelectAnswer={handleSelectAnswer}
            />

            {/* Navigation and Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>

              {/* Question Navigator */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">Quick Navigate:</p>
                <div className="flex flex-wrap gap-2">
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-8 h-8 rounded text-xs font-bold transition ${
                        idx === currentQuestionIndex
                          ? 'bg-green-600 text-white'
                          : userAnswers[idx]
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex-1 py-3 px-4 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400 disabled:opacity-50 transition"
                >
                  Previous
                </button>

                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={loading}
                    className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition"
                  >
                    {loading ? 'Submitting...' : 'Submit Quiz'}
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-800">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Result */}
        {stage === 'result' && result && (
          <ResultCard result={result} onTakeAnother={() => {
            setStage('company-select')
            setUserAnswers([])
            setCurrentQuestionIndex(0)
            setError('')
          }} />
        )}
      </div>
    </div>
  )
}

export default AptitudeTest
