import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverUrl } from '../utils/serverUrl'

const API_URL = `${serverUrl}/api/coding`

// Get token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    if (!token) {
        console.warn("⚠️ No token found in localStorage")
    }
    return {
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true
    }
}

// Async thunks
export const startCodingSession = createAsyncThunk(
    'oa/startSession',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/session/start`,
                {},
                getAuthHeaders()
            )
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to start session')
        }
    }
)

export const submitCodeThunk = createAsyncThunk(
    'oa/submitCode',
    async ({ sessionId, problemId, code, language }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/submit`,
                { sessionId, problemId, code, language },
                getAuthHeaders()
            )
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to submit code')
        }
    }
)

export const finishCodingSession = createAsyncThunk(
    'oa/finishSession',
    async ({ sessionId }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/session/finish`,
                { sessionId },
                getAuthHeaders()
            )
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to finish session')
        }
    }
)

export const getSessionDetails = createAsyncThunk(
    'oa/getSessionDetails',
    async ({ sessionId }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/session/${sessionId}`,
                getAuthHeaders()
            )
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch session')
        }
    }
)

export const getOAHistory = createAsyncThunk(
    'oa/getHistory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/history`,
                getAuthHeaders()
            )
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch history')
        }
    }
)

export const getProblems = createAsyncThunk(
    'oa/getProblems',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/problems`)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch problems')
        }
    }
)

const initialState = {
    // Session state
    currentSession: null,
    sessionId: null,
    problems: [],
    currentProblemIndex: 0,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    isSessionActive: false,
    timeRemaining: 3600, // 60 minutes in seconds

    // Code editor state
    code: '',
    language: 'javascript',
    isSubmitting: false,
    isRunning: false,

    // Submission state
    latestSubmission: null,
    submissions: {},
    
    // Per-problem storage
    codeByProblem: {}, // Maps problem index to code
    languageByProblem: {}, // Maps problem index to language
    solvedProblems: [], // Track which problems are solved (array of indices)

    // Results
    sessionResult: null,
    history: [],

    // UI state
    showRunOutput: false,
    runOutput: null,
    tabSwitchCount: 0
}

const oaSlice = createSlice({
    name: 'oa',
    initialState,
    reducers: {
        // Local state management
        setCode: (state, action) => {
            state.code = action.payload
        },
        setLanguage: (state, action) => {
            state.language = action.payload
        },
        setCurrentProblemIndex: (state, action) => {
            const newIndex = action.payload
            // Save current problem's code before switching
            if (state.currentProblemIndex !== newIndex) {
                state.codeByProblem[state.currentProblemIndex] = state.code
                state.languageByProblem[state.currentProblemIndex] = state.language
            }
            // Load new problem's code
            state.currentProblemIndex = newIndex
            state.code = state.codeByProblem[newIndex] || ''
            state.language = state.languageByProblem[newIndex] || 'javascript'
        },
        decrementTimeRemaining: (state) => {
            if (state.timeRemaining > 0) {
                state.timeRemaining -= 1
            }
        },
        setTimeRemaining: (state, action) => {
            state.timeRemaining = action.payload
        },
        resetOAState: (state) => {
            return initialState
        },
        setShowRunOutput: (state, action) => {
            state.showRunOutput = action.payload
        },
        setRunOutput: (state, action) => {
            state.runOutput = action.payload
        },
        incrementTabSwitchCount: (state) => {
            state.tabSwitchCount += 1
        },
        autoSaveCode: (state, action) => {
            const { problemIndex, code } = action.payload
            if (!state.submissions[problemIndex]) {
                state.submissions[problemIndex] = {}
            }
            state.submissions[problemIndex].code = code
        },
        setIsRunning: (state, action) => {
            state.isRunning = action.payload
        },
        markProblemSolved: (state, action) => {
            const problemIndex = action.payload
            if (!state.solvedProblems.includes(problemIndex)) {
                state.solvedProblems.push(problemIndex)
            }
        },
        clearSolvedProblems: (state) => {
            state.solvedProblems = []
        }
    },
    extraReducers: (builder) => {
        // Start session
        builder
            .addCase(startCodingSession.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(startCodingSession.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.sessionId = action.payload.sessionId
                state.problems = action.payload.problems
                state.isSessionActive = true
                state.timeRemaining = action.payload.duration * 60
                state.currentSession = null
            })
            .addCase(startCodingSession.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })

        // Submit code
        builder
            .addCase(submitCodeThunk.pending, (state) => {
                state.isSubmitting = true
            })
            .addCase(submitCodeThunk.fulfilled, (state, action) => {
                state.isSubmitting = false
                state.latestSubmission = action.payload.submission
                state.submissions[state.currentProblemIndex] = action.payload.submission
                state.showRunOutput = true
                state.runOutput = action.payload.submission
                
                // Mark problem as solved if all tests passed
                if (action.payload.submission.passedTestCases === action.payload.submission.totalTestCases) {
                    if (!state.solvedProblems.includes(state.currentProblemIndex)) {
                        state.solvedProblems.push(state.currentProblemIndex)
                    }
                }
            })
            .addCase(submitCodeThunk.rejected, (state, action) => {
                state.isSubmitting = false
                state.error = action.payload
            })

        // Finish session
        builder
            .addCase(finishCodingSession.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(finishCodingSession.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.isSessionActive = false
                state.sessionResult = action.payload.result
            })
            .addCase(finishCodingSession.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })

        // Get history
        builder
            .addCase(getOAHistory.fulfilled, (state, action) => {
                state.history = action.payload.sessions
            })
            .addCase(getOAHistory.rejected, (state, action) => {
                state.error = action.payload
            })

        // Get problems
        builder
            .addCase(getProblems.fulfilled, (state, action) => {
                // This is for displaying available problems outside of a session
            })
    }
})

export const {
    setCode,
    setLanguage,
    setCurrentProblemIndex,
    decrementTimeRemaining,
    setTimeRemaining,
    resetOAState,
    setShowRunOutput,
    setRunOutput,
    incrementTabSwitchCount,
    autoSaveCode,
    setIsRunning,
    markProblemSolved,
    clearSolvedProblems
} = oaSlice.actions

export default oaSlice.reducer
