import React from 'react'
import { BsCheckCircle, BsXCircle } from 'react-icons/bs'

const ResultPanel = ({ result, onEdit }) => {
    if (!result) {
        return (
            <div className="bg-white rounded-2xl shadow-md p-6 min-h-50 flex items-center justify-center">
                <p className="text-gray-600">No results yet</p>
            </div>
        )
    }

    const isAccepted = result.verdict === 'Accepted'
    const passRatio = result.passedTestCases / result.totalTestCases

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col h-150">
            {/* Header with Verdict */}
            <div className={`p-4 border-b-2 ${isAccepted ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                <div className="flex items-center gap-2">
                    {isAccepted ? (
                        <BsCheckCircle className="text-green-600" size={24} />
                    ) : (
                        <BsXCircle className="text-red-600" size={24} />
                    )}
                    <span className={`font-bold text-lg ${isAccepted ? 'text-green-700' : 'text-red-700'}`}>
                        {result.verdict}
                    </span>
                </div>
            </div>

            {/* Score Section */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                        <p className="text-2xl font-bold text-gray-900">
                            {result.passedTestCases}/{result.totalTestCases}
                        </p>
                        <p className="text-xs text-gray-600">Test Cases Passed</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">
                            {Math.round(passRatio * 100)}%
                        </p>
                        <p className="text-xs text-gray-600">Pass Rate</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">
                            {result.problemScore || 0}
                        </p>
                        <p className="text-xs text-gray-600">Points</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                    <div
                        className={`h-full transition-all ${isAccepted ? 'bg-green-600' : 'bg-red-600'}`}
                        style={{ width: `${passRatio * 100}%` }}
                    />
                </div>
            </div>

            {/* Test Cases Results */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {result.testCaseResults && result.testCaseResults.map((tc, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                            {tc.passed ? (
                                <BsCheckCircle className="text-green-600" size={18} />
                            ) : (
                                <BsXCircle className="text-red-600" size={18} />
                            )}
                            <span className="text-sm font-semibold text-gray-900">
                                Test Case {tc.testCaseIndex + 1}
                            </span>
                        </div>

                        <div className="space-y-2 text-xs">
                            <div>
                                <p className="font-semibold text-gray-700">Input</p>
                                <pre className="bg-gray-50 p-2 rounded overflow-x-auto text-gray-600">
                                    {tc.input}
                                </pre>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-700">Expected</p>
                                <pre className="bg-gray-50 p-2 rounded overflow-x-auto text-gray-600">
                                    {tc.expectedOutput}
                                </pre>
                            </div>
                            {!tc.passed && (
                                <div>
                                    <p className="font-semibold text-gray-700">Actual</p>
                                    <pre className="bg-red-50 p-2 rounded overflow-x-auto text-red-600">
                                        {tc.actualOutput || '(empty)'}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {result.errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm font-semibold text-red-900 mb-1">Error</p>
                        <p className="text-xs text-red-700 font-mono">
                            {result.errorMessage}
                        </p>
                    </div>
                )}
            </div>

            {/* Edit Button */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={onEdit}
                    className="w-full px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                >
                    ← Back to Editor
                </button>
            </div>
        </div>
    )
}

export default ResultPanel
