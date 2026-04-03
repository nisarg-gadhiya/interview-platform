import React, { useState } from 'react'
import axios from 'axios'
import ResultCard from '../components/ResultCard'
import { serverUrl } from '../utils/serverUrl'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

const ResumeAnalyzer = () => {
  const navigate = useNavigate()
  const [resumeText, setResumeText] = useState('')
  const [uploadMethod, setUploadMethod] = useState('text') // 'text' or 'file'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [fileName, setFileName] = useState('')

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (event) => {
        setResumeText(event.target.result)
      }
      reader.readAsText(file)
    }
  }

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('Please provide resume text or upload a file')
      return
    }

    if (resumeText.trim().length < 100) {
      setError('Resume text is too short. Please provide at least 100 characters.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await axios.post(
        `${serverUrl}/api/resume/analyze`,
        { resumeText },
        { withCredentials: true }
      )

      if (response.data.data) {
        setResult(response.data.data)
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to analyze resume. Please try again.'
      setError(errorMessage)
      console.error('Analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setResumeText('')
    setResult(null)
    setError('')
    setFileName('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-12 flex items-start gap-4">
          <button 
            onClick={() => navigate("/")} 
            className="mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition"
          >
            <FaArrowLeft className="text-gray-600" size={20} />
          </button>
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Resume Analyzer
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              Get AI-powered insights to improve your resume and boost your career
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Resume</h2>

            {/* Upload Method Toggle */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setUploadMethod('text')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  uploadMethod === 'text'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Paste Text
              </button>
              <button
                onClick={() => setUploadMethod('file')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  uploadMethod === 'file'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Upload File
              </button>
            </div>

            {/* Input Area */}
            {uploadMethod === 'text' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste your resume text
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume content here..."
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload resume file (TXT, PDF text)
                </label>
                <div className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                  <input
                    type="file"
                    accept=".txt,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    className="cursor-pointer block"
                  >
                    <div className="mb-2">📄</div>
                    <p className="text-sm text-gray-600 mb-1">
                      {fileName ? `Selected: ${fileName}` : 'Click to select file or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500">Supported: TXT, PDF</p>
                  </label>
                </div>
                {resumeText && (
                  <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded text-green-800 text-sm">
                    ✓ File loaded ({resumeText.length} characters)
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-800">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className={`flex-1 py-3 px-4 rounded-lg font-bold text-white transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 active:scale-95'
                }`}
              >
                {loading ? 'Analyzing...' : 'Analyze Resume'}
              </button>
              {resumeText && (
                <button
                  onClick={handleClear}
                  className="py-3 px-6 bg-green-100 text-green-700 rounded-lg font-bold hover:bg-green-200 transition-all"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Loading Spinner */}
            {loading && (
              <div className="mt-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div>
            {result ? (
              <ResultCard result={result} onAnalyzeNew={handleClear} />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 h-full flex items-center justify-center border-2 border-green-100">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Analysis Results
                  </h3>
                  <p className="text-gray-600">
                    Upload your resume and click "Analyze" to get detailed insights and suggestions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeAnalyzer
