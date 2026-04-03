import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaBook } from 'react-icons/fa'
import axios from 'axios'
import { serverUrl } from '../utils/serverUrl'

const CSFundamentals = () => {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchSubjects()
    fetchStats()
  }, [])

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/cs-fundamentals/subjects`)
      setSubjects(response.data.data)
    } catch (err) {
      setError('Failed to load subjects')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/cs-fundamentals/stats`,
        { withCredentials: true }
      )
      setStats(response.data.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubjectClick = (subject) => {
    navigate(`/cs-fundamentals/${subject}`)
  }

  const subjectColors = {
    'OS': 'from-blue-400 to-blue-600',
    'CN': 'from-purple-400 to-purple-600',
    'DBMS': 'from-green-400 to-green-600',
    'System Design': 'from-orange-400 to-orange-600',
    'OOPS': 'from-pink-400 to-pink-600'
  }

  const subjectIcons = {
    'OS': '💻',
    'CN': '🌐',
    'DBMS': '🗄️',
    'System Design': '🏗️',
    'OOPS': '🔧'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex items-start gap-4">
          <button 
            onClick={() => navigate("/")}
            className="mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition"
          >
            <FaArrowLeft className="text-gray-600" size={20} />
          </button>
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 flex items-center gap-3">
              <FaBook className="text-indigo-600" />
              CS Fundamentals
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              Master core computer science concepts
            </p>
          </div>
        </div>

        {/* Stats Section */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <p className="text-sm font-semibold text-gray-600 mb-2">Total Topics</p>
              <p className="text-4xl font-bold text-indigo-600">{stats.totalTopics}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <p className="text-sm font-semibold text-gray-600 mb-2">Completed</p>
              <p className="text-4xl font-bold text-green-600">{stats.topicsCompleted}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <p className="text-sm font-semibold text-gray-600 mb-2">In Progress</p>
              <p className="text-4xl font-bold text-orange-600">{stats.topicsInProgress}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <p className="text-sm font-semibold text-gray-600 mb-2">Bookmarked</p>
              <p className="text-4xl font-bold text-pink-600">{stats.bookmarkedTopics}</p>
            </div>
          </div>
        )}

        {/* Subjects Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-800">
            {error}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <div
                key={subject.subject}
                onClick={() => handleSubjectClick(subject.subject)}
                className={`bg-gradient-to-br ${subjectColors[subject.subject]} rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition transform`}
              >
                <div className="text-5xl mb-4">{subjectIcons[subject.subject]}</div>
                <h2 className="text-2xl font-bold text-white mb-2">{subject.subject}</h2>
                <p className="text-white text-opacity-90 mb-4">
                  {subject.topicCount} topics
                </p>
                {stats?.bySubject[subject.subject] && (
                  <div className="bg-white bg-opacity-20 rounded-lg p-3 text-white text-sm">
                    <p>✓ {stats.bySubject[subject.subject].completed} completed</p>
                    <p>⟳ {stats.bySubject[subject.subject].inProgress} in progress</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quick Resources */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">How to Use CS Fundamentals</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl mb-2">📖</div>
              <p className="font-semibold text-gray-900">Read & Learn</p>
              <p className="text-sm text-gray-600 mt-2">Study comprehensive theory concepts</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">🔖</div>
              <p className="font-semibold text-gray-900">Bookmark</p>
              <p className="text-sm text-gray-600 mt-2">Save important topics for quick access</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">📝</div>
              <p className="font-semibold text-gray-900">Take Notes</p>
              <p className="text-sm text-gray-600 mt-2">Add your own notes while learning</p>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg">
              <div className="text-2xl mb-2">✓</div>
              <p className="font-semibold text-gray-900">Track Progress</p>
              <p className="text-sm text-gray-600 mt-2">Monitor your learning journey</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CSFundamentals
