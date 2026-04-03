import React from 'react'

const ResultCard = ({ result, onAnalyzeNew }) => {
  if (!result) return null

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <p className="text-gray-600 text-sm font-medium mb-2">RESUME SCORE</p>
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32">
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
                  stroke={result.score >= 75 ? '#10b981' : result.score >= 50 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8"
                  strokeDasharray={`${(result.score / 100) * 314} 314`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-900">{result.score}</span>
              </div>
            </div>
          </div>
          <p className="text-lg font-semibold text-gray-700">
            {result.score >= 75 ? '🎉 Excellent' : result.score >= 50 ? '👍 Good' : '💪 Needs Work'}
          </p>
        </div>
      </div>

      {/* Strengths */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-green-500 mr-2">✓</span> Strengths
        </h3>
        <ul className="space-y-3">
          {result.strengths?.map((strength, idx) => (
            <li key={idx} className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✓</span>
              <span className="text-gray-700">{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-red-500 mr-2">⚠</span> Areas to Improve
        </h3>
        <ul className="space-y-3">
          {result.weaknesses?.map((weakness, idx) => (
            <li key={idx} className="flex items-start">
              <span className="text-red-500 mr-3 mt-1">•</span>
              <span className="text-gray-700">{weakness}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Missing Skills */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-green-600 mr-2">🎯</span> Missing Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {result.missingSkills?.map((skill, idx) => (
            <span
              key={idx}
              className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-green-600 mr-2">💡</span> Suggestions
        </h3>
        <ol className="space-y-3">
          {result.suggestions?.map((suggestion, idx) => (
            <li key={idx} className="flex">
              <span className="flex-shrink-0 bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">
                {idx + 1}
              </span>
              <span className="text-gray-700 pt-0.5">{suggestion}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Extracted Sections */}
      {(result.skills?.length > 0 || result.experience?.length > 0 || result.projects?.length > 0) && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Extracted Information</h3>
          <div className="space-y-4">
            {result.skills?.length > 0 && (
              <div>
                <p className="font-semibold text-gray-700 mb-2">Skills Found:</p>
                <div className="flex flex-wrap gap-2">
                  {result.skills.slice(0, 10).map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                  {result.skills.length > 10 && (
                    <span className="inline-block text-gray-600 text-sm">
                      +{result.skills.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {result.experience?.length > 0 && (
              <div>
                <p className="font-semibold text-gray-700 mb-2">Experience:</p>
                <ul className="space-y-1">
                  {result.experience.slice(0, 5).map((exp, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{exp}</span>
                    </li>
                  ))}
                  {result.experience.length > 5 && (
                    <p className="text-sm text-gray-600">
                      +{result.experience.length - 5} more entries
                    </p>
                  )}
                </ul>
              </div>
            )}

            {result.projects?.length > 0 && (
              <div>
                <p className="font-semibold text-gray-700 mb-2">Projects:</p>
                <ul className="space-y-1">
                  {result.projects.slice(0, 5).map((project, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{project}</span>
                    </li>
                  ))}
                  {result.projects.length > 5 && (
                    <p className="text-sm text-gray-600">
                      +{result.projects.length - 5} more entries
                    </p>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={onAnalyzeNew}
        className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all active:scale-95"
      >
        Analyze Another Resume
      </button>
    </div>
  )
}

export default ResultCard
