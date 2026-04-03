import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaBookmark, FaRegBookmark, FaSearch } from 'react-icons/fa'
import axios from 'axios'
import { serverUrl } from '../utils/serverUrl'

const SubjectTopics = () => {
  const { subject } = useParams()
  const navigate = useNavigate()
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredTopics, setFilteredTopics] = useState([])

  useEffect(() => {
    fetchTopics()
  }, [subject])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTopics(topics)
    } else {
      setFilteredTopics(
        topics.filter(topic =>
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.keyPoints?.some(kp => kp.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      )
    }
  }, [searchQuery, topics])

  const fetchTopics = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${serverUrl}/api/cs-fundamentals/subject/${subject}`,
        { withCredentials: true }
      )
      setTopics(response.data.data || [])
    } catch (err) {
      setError('Failed to load topics')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleTopicClick = (topicId) => {
    navigate(`/cs-fundamentals/topic/${topicId}`)
  }

  const handleBookmarkClick = async (e, topicId, currentState) => {
    e.stopPropagation()
    try {
      await axios.post(
        `${serverUrl}/api/cs-fundamentals/progress/${topicId}`,
        { isBookmarked: !currentState },
        { withCredentials: true }
      )
      
      setTopics(topics.map(topic => 
        topic._id === topicId 
          ? { ...topic, userProgress: { ...topic.userProgress, isBookmarked: !currentState } }
          : topic
      ))
    } catch (err) {
      console.error(err)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50'
      case 'Medium': return 'text-orange-600 bg-orange-50'
      case 'Hard': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const subjectEmojis = {
    'OS': '💻',
    'CN': '🌐',
    'DBMS': '🗄️',
    'System Design': '🏗️',
    'OOPS': '🔧'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button 
            onClick={() => navigate("/cs-fundamentals")}
            className="p-3 rounded-full bg-white shadow hover:shadow-md transition"
          >
            <FaArrowLeft className="text-gray-600" size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              {subjectEmojis[subject]} {subject}
            </h1>
            <p className="text-gray-600 mt-2">Master all concepts in {subject}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <FaSearch className="absolute left-4 top-4 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-600 focus:outline-none"
          />
        </div>

        {/* Topics List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-800">
            {error}
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">
              {searchQuery ? 'No topics found matching your search' : 'No topics available yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTopics.map((topic) => (
              <div
                key={topic._id}
                onClick={() => handleTopicClick(topic._id)}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:bg-indigo-50 transition cursor-pointer flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{topic.title}</h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${getDifficultyColor(topic.difficulty)}`}>
                      {topic.difficulty}
                    </span>
                  </div>
                  
                  {topic.userProgress?.status && (
                    <div className="mb-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        topic.userProgress.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : topic.userProgress.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {topic.userProgress.status === 'completed' ? '✓ Completed' : '⟳ In Progress'}
                      </span>
                    </div>
                  )}

                  {topic.keyPoints && topic.keyPoints.length > 0 && (
                    <div className="text-sm text-gray-600">
                      <p className="font-semibold mb-1">Key Points:</p>
                      <p>{topic.keyPoints.slice(0, 2).join(' • ')}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => handleBookmarkClick(e, topic._id, topic.userProgress?.isBookmarked)}
                  className="ml-4 p-3 hover:bg-yellow-100 rounded-full transition"
                >
                  {topic.userProgress?.isBookmarked ? (
                    <FaBookmark className="text-yellow-500" size={20} />
                  ) : (
                    <FaRegBookmark className="text-gray-400" size={20} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SubjectTopics
