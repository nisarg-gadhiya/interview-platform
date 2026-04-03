import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
    startCodingSession,
    submitCodeThunk,
    finishCodingSession,
    setCode,
    setLanguage,
    setCurrentProblemIndex,
    decrementTimeRemaining,
    setTimeRemaining,
    resetOAState,
    setShowRunOutput,
    incrementTabSwitchCount,
    setIsRunning,
    markProblemSolved
} from '../redux/oaSlice'
import OATimer from '../components/OAComponents/OATimer'
import ProblemList from '../components/OAComponents/ProblemList'
import CodeEditor from '../components/OAComponents/CodeEditor'
import ResultPanel from '../components/OAComponents/ResultPanel'
import Navbar from '../components/Navbar'
import { BiExit } from 'react-icons/bi'
import { HiSparkles } from 'react-icons/hi'

const OAPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { userData } = useSelector(state => state.user)
    const {
        sessionId,
        problems,
        currentProblemIndex,
        code,
        language,
        isSessionActive,
        timeRemaining,
        isSubmitting,
        isRunning,
        showRunOutput,
        runOutput,
        status,
        error,
        solvedProblems
    } = useSelector(state => state.oa)

    const [showConfirmExit, setShowConfirmExit] = useState(false)
    const [isVisible, setIsVisible] = useState(true)

    // Check if session exists
    useEffect(() => {
        if (!userData) {
            navigate('/auth')
            return
        }

        if (!sessionId && status === 'idle') {
            // Start a new session
            dispatch(startCodingSession())
        }
    }, [userData, sessionId, dispatch, navigate, status])

    // Timer countdown
    useEffect(() => {
        if (!isSessionActive || timeRemaining <= 0) return

        const timer = setInterval(() => {
            dispatch(decrementTimeRemaining())
        }, 1000)

        return () => clearInterval(timer)
    }, [isSessionActive, timeRemaining, dispatch])

    // Auto-finish when time ends
    useEffect(() => {
        if (timeRemaining <= 0 && isSessionActive && sessionId) {
            dispatch(finishCodingSession({ sessionId }))
        }
    }, [timeRemaining, isSessionActive, sessionId, dispatch])

    // Tab visibility detection (anti-cheat)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                dispatch(incrementTabSwitchCount())
            }
            setIsVisible(!document.hidden)
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, [dispatch])

    useEffect(() => {
    const handleUnload = () => {
        if (sessionId) {
            const data = JSON.stringify({ sessionId });

            navigator.sendBeacon(
                'http://localhost:8000/api/coding/session/finish', 
                data
            );
        }
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
        window.removeEventListener('beforeunload', handleUnload);
    };
}, [sessionId]);

    const handleSubmit = async () => {
        if (!problems[currentProblemIndex] || !code.trim()) {
            alert('Please write code before submitting')
            return
        }

        const problemId = problems[currentProblemIndex]._id
        dispatch(submitCodeThunk({
            sessionId,
            problemId,
            code,
            language
        }))
    }

    const handleRun = async () => {
        if (!problems[currentProblemIndex] || !code.trim()) {
            alert('Please write code before running')
            return
        }

        // For now, just show a sample test with the first test case
        const problem = problems[currentProblemIndex]
        const sampleTestCase = problem.testCases[0]

        dispatch(setIsRunning(true))
        
        // Simulate running code (in production, this would call the backend)
        setTimeout(() => {
            dispatch(setShowRunOutput(true))
            dispatch(setIsRunning(false))
            // This will show mock output - you can replace with actual execution
            alert('Run feature - Testing with sample input: ' + sampleTestCase.input)
        }, 1000)
    }

    const handleFinishSession = () => {
        dispatch(finishCodingSession({ sessionId }))
        setTimeout(() => {
            navigate(`/oa-result/${sessionId}`)
        }, 1000)
    }

    if (status === 'loading' && !isSessionActive) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Starting your session...</p>
                </div>
            </div>
        )
    }

    if (!isSessionActive && problems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <p className="text-gray-600 mb-4">Failed to load problems</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    const currentProblem = problems[currentProblemIndex]

    return (
        <div className={`min-h-screen bg-gray-50 transition-opacity ${!isVisible ? 'opacity-50' : ''}`}>
            <Navbar />

            {/* Warning Banner */}
            {!isVisible && (
                <div className="bg-red-500 text-white px-4 py-3 text-center">
                    ⚠️ Tab switching detected. Please focus on this window.
                </div>
            )}

            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <HiSparkles className="text-green-600" size={20} />
                        <span className="text-gray-600">Session: {sessionId?.slice(-8)}</span>
                    </div>

                    <OATimer timeRemaining={timeRemaining} />

                    <button
                        onClick={() => setShowConfirmExit(true)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                        <BiExit size={20} />
                        Exit
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Problem List and Description */}
                <div className="lg:col-span-2 space-y-6">
                    <ProblemList
                        problems={problems}
                        currentIndex={currentProblemIndex}
                        solvedProblems={solvedProblems}
                        onSelectProblem={(index) => {
                            dispatch(setCurrentProblemIndex(index))
                            dispatch(setShowRunOutput(false))
                        }}
                    />

                    {/* Problem Description */}
                    {currentProblem && (
                        <div className="bg-white rounded-2xl shadow-md p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {currentProblem.title}
                            </h2>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-6 ${
                                currentProblem.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                currentProblem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                                {currentProblem.difficulty.toUpperCase()}
                            </span>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                                    <p className="text-gray-600 whitespace-pre-wrap">
                                        {currentProblem.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Constraints</h3>
                                        <p className="text-gray-600 text-sm whitespace-pre-wrap">
                                            {currentProblem.constraints}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Input Format</h3>
                                        <p className="text-gray-600 text-sm whitespace-pre-wrap">
                                            {currentProblem.inputFormat}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Output Format</h3>
                                    <p className="text-gray-600 whitespace-pre-wrap">
                                        {currentProblem.outputFormat}
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-900 mb-2">Sample Input</h3>
                                    <pre className="text-gray-600 text-sm overflow-x-auto">
                                        {currentProblem.sampleInput}
                                    </pre>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-900 mb-2">Sample Output</h3>
                                    <pre className="text-gray-600 text-sm overflow-x-auto">
                                        {currentProblem.sampleOutput}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Code Editor */}
                <div className="space-y-4">
                    {!showRunOutput ? (
                        <CodeEditor
                            code={code}
                            language={language}
                            onCodeChange={(value) => dispatch(setCode(value))}
                            onLanguageChange={(lang) => dispatch(setLanguage(lang))}
                            onSubmit={handleSubmit}
                            onRun={handleRun}
                            isSubmitting={isSubmitting}
                            isRunning={isRunning}
                        />
                    ) : (
                        <ResultPanel
                            result={runOutput}
                            onEdit={() => dispatch(setShowRunOutput(false))}
                        />
                    )}

                    {!showRunOutput && (
                        <div className="flex gap-2 flex-col">
                            <div className="flex gap-3">
                                <button
                                    onClick={handleRun}
                                    disabled={isRunning}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold transition flex items-center justify-center gap-2"
                                >
                                    {isRunning ? 'Running...' : '▶ Run Code'}
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold transition"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                            <button
                                onClick={() => {
                                    dispatch(setCode(''))
                                    dispatch(setLanguage('javascript'))
                                }}
                                className="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-semibold transition"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Exit Confirmation Modal */}
            {showConfirmExit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-xl">
                    <div className="bg-white rounded-2xl p-8 max-w-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Exit Session?</h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to exit? Your progress will be saved.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmExit(false)}
                                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFinishSession}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                            >
                                Exit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default OAPage
