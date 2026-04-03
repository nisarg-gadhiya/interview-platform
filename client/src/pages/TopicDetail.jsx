import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaBookmark, FaRegBookmark, FaCheck } from 'react-icons/fa'
import axios from 'axios'
import { serverUrl } from '../utils/serverUrl'

const TopicDetail = () => {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const [topic, setTopic] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userProgress, setUserProgress] = useState(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [userNotes, setUserNotes] = useState('')
  const [notesSaved, setNotesSaved] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    fetchTopicDetail()
  }, [topicId])

  useEffect(() => {
    return () => {
      if (topic && startTime) {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000)
        handleUpdateProgress(timeSpent)
      }
    }
  }, [])

  const fetchTopicDetail = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${serverUrl}/api/cs-fundamentals/detail/${topicId}`,
        { withCredentials: true }
      )
      const data = response.data.data
      setTopic(data)
      
      if (data.userProgress) {
        setUserProgress(data.userProgress)
        setIsBookmarked(data.userProgress.isBookmarked)
        setIsCompleted(data.userProgress.status === 'completed')
        setUserNotes(data.userProgress.notes)
      }
    } catch (err) {
      setError('Failed to load topic')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProgress = async (timeSpent = 0) => {
    try {
      const status = isCompleted ? 'completed' : 'in-progress'
      await axios.post(
        `${serverUrl}/api/cs-fundamentals/progress/${topicId}`,
        {
          status,
          timeSpent,
          isBookmarked,
          notes: userNotes
        },
        { withCredentials: true }
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggleBookmark = async () => {
    setIsBookmarked(!isBookmarked)
    await handleUpdateProgress()
  }

  const handleToggleComplete = async () => {
    setIsCompleted(!isCompleted)
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    
    try {
      const status = !isCompleted ? 'completed' : 'in-progress'
      await axios.post(
        `${serverUrl}/api/cs-fundamentals/progress/${topicId}`,
        {
          status,
          timeSpent,
          isBookmarked,
          notes: userNotes
        },
        { withCredentials: true }
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveNotes = async () => {
    await handleUpdateProgress()
    setNotesSaved(true)
    setTimeout(() => setNotesSaved(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 rounded-full bg-white shadow hover:shadow-md transition mb-4"
          >
            <FaArrowLeft className="text-gray-600" size={20} />
          </button>
          <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-800">
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <button 
              onClick={() => navigate(-1)}
              className="mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition"
            >
              <FaArrowLeft className="text-gray-600" size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900">{topic.title}</h1>
              <div className="flex gap-3 mt-3">
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {topic.subject}
                </span>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  topic.difficulty === 'Easy' ? 'text-green-600 bg-green-50' :
                  topic.difficulty === 'Medium' ? 'text-orange-600 bg-orange-50' :
                  'text-red-600 bg-red-50'
                }`}>
                  {topic.difficulty}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleToggleBookmark}
              className="p-3 rounded-full bg-white shadow hover:shadow-md transition"
            >
              {isBookmarked ? (
                <FaBookmark className="text-yellow-500" size={20} />
              ) : (
                <FaRegBookmark className="text-gray-400" size={20} />
              )}
            </button>
            <button
              onClick={handleToggleComplete}
              className={`p-3 rounded-full shadow hover:shadow-md transition ${
                isCompleted ? 'bg-green-100' : 'bg-white'
              }`}
            >
              <FaCheck className={isCompleted ? 'text-green-600' : 'text-gray-400'} size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="prose max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {topic.content}
              </div>
            </div>
          </div>

          {/* Key Points */}
          {topic.keyPoints && topic.keyPoints.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Points</h2>
              <ul className="space-y-3">
                {topic.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex gap-3 text-gray-700">
                    <span className="text-indigo-600 font-bold flex-shrink-0">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Examples */}
          {topic.examples && topic.examples.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Examples</h2>
              <div className="space-y-4">
                {topic.examples.map((example, idx) => (
                  <div key={idx} className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-600">
                    <pre className="text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap">
                      {example}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Topics */}
          {topic.relatedTopics && topic.relatedTopics.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Topics</h2>
              <div className="flex flex-wrap gap-3">
                {topic.relatedTopics.map((relatedTopic) => (
                  <button
                    key={relatedTopic._id}
                    onClick={() => navigate(`/cs-fundamentals/topic/${relatedTopic._id}`)}
                    className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-200 transition"
                  >
                    {relatedTopic.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* User Notes */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Notes</h2>
            <textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Add your own notes here..."
              className="w-full h-40 p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none resize-none"
            />
            <button
              onClick={handleSaveNotes}
              className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
            >
              {notesSaved ? '✓ Notes Saved' : 'Save Notes'}
            </button>
          </div>

          {/* Source Attribution */}
          {topic.sourceAttribution && topic.sourceAttribution !== 'Internal' && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Source:</span> {topic.sourceAttribution}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TopicDetail
