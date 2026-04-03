import axios from 'axios'
import { expect } from 'chai'

const API_URL = 'http://localhost:8000/api'
let authToken = ''
let sessionId = ''
let problemId = ''

// Test Data
const testUser = {
    name: 'Test User',
    email: `testuser${Date.now()}@example.com`
}

const validCode = {
    javascript: `
function reverseArray(arr) {
    return arr.reverse();
}

// Test cases
const arr = [1, 2, 3];
console.log(reverseArray(arr));
    `,
    python: `
def reverse_array(arr):
    return arr[::-1]

arr = [1, 2, 3]
print(reverse_array(arr))
    `,
    java: `
public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        for (int x : arr) System.out.println(x);
    }
}
    `
}

const invalidCode = {
    javascript: `
function broken(
}
    `,
    python: `
def broken(:
    pass
    `,
    java: `
public class Solution {
    public static void main(String[] args) {
        int[] arr; broken syntax
    }
}
    `
}

describe('Code Submission Tests', () => {
    // Authentication Setup
    describe('1. Authentication Flow', () => {
        it('Should authenticate user via Google', async function() {
            try {
                const response = await axios.post(`${API_URL}/auth/google`, testUser)
                expect(response.status).to.equal(200)
                expect(response.data.token).to.exist
                authToken = response.data.token
                console.log('✅ User authenticated')
            } catch (error) {
                console.error('❌ Auth failed:', error.response?.data)
                throw error
            }
        })
    })

    // Session Management
    describe('2. Coding Session Management', () => {
        it('Should start a coding session', async function() {
            try {
                const response = await axios.post(
                    `${API_URL}/coding/session/start`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        },
                        withCredentials: true
                    }
                )
                expect(response.status).to.equal(200)
                expect(response.data.sessionId).to.exist
                expect(response.data.problems).to.be.an('array')
                expect(response.data.problems.length).to.be.greaterThan(0)
                sessionId = response.data.sessionId
                problemId = response.data.problems[0]._id
                console.log('✅ Session started:', sessionId)
                console.log(`✅ Got ${response.data.problems.length} problems`)
            } catch (error) {
                console.error('❌ Session start failed:', error.response?.data)
                throw error
            }
        })

        it('Should retrieve session details', async function() {
            try {
                const response = await axios.get(
                    `${API_URL}/coding/session/${sessionId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    }
                )
                expect(response.status).to.equal(200)
                expect(response.data.session._id).to.exist
                console.log('✅ Session details retrieved')
            } catch (error) {
                console.error('❌ Get session failed:', error.response?.data)
                throw error
            }
        })
    })

    // Code Submission Tests
    describe('3. Code Submission Tests', () => {
        it('Should submit valid JavaScript code', async function() {
            this.timeout(10000) // 10 second timeout
            try {
                const response = await axios.post(
                    `${API_URL}/coding/submit`,
                    {
                        sessionId,
                        problemId,
                        code: validCode.javascript,
                        language: 'javascript'
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    }
                )
                expect(response.status).to.equal(200)
                expect(response.data.submission).to.exist
                console.log('✅ Valid JavaScript code submitted')
                console.log(`   Verdict: ${response.data.submission.verdict}`)
                console.log(`   Passed: ${response.data.submission.passedTestCases}/${response.data.submission.totalTestCases}`)
            } catch (error) {
                console.error('❌ Submission failed:', error.response?.data)
                throw error
            }
        })

        it('Should submit valid Python code', async function() {
            this.timeout(10000)
            try {
                const response = await axios.post(
                    `${API_URL}/coding/submit`,
                    {
                        sessionId,
                        problemId,
                        code: validCode.python,
                        language: 'python'
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    }
                )
                expect(response.status).to.equal(200)
                console.log('✅ Valid Python code submitted')
                console.log(`   Verdict: ${response.data.submission.verdict}`)
            } catch (error) {
                console.error('❌ Python submission failed:', error.response?.data)
                throw error
            }
        })

        it('Should handle invalid code gracefully', async function() {
            this.timeout(10000)
            try {
                const response = await axios.post(
                    `${API_URL}/coding/submit`,
                    {
                        sessionId,
                        problemId,
                        code: invalidCode.javascript,
                        language: 'javascript'
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    }
                )
                console.log('✅ Invalid code handled')
                console.log(`   Verdict: ${response.data.submission.verdict}`)
                if (response.data.submission.verdict === 'Compilation Error') {
                    console.log(`   Error: ${response.data.submission.errorMessage}`)
                }
            } catch (error) {
                console.error('❌ Error handling failed:', error.response?.data)
            }
        })

        it('Should reject missing required fields', async function() {
            try {
                const response = await axios.post(
                    `${API_URL}/coding/submit`,
                    {
                        sessionId,
                        problemId
                        // Missing code and language
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    }
                )
                throw new Error('Should have been rejected')
            } catch (error) {
                if (error.response?.status === 400) {
                    console.log('✅ Correctly rejected missing fields')
                    expect(error.response.data.message).to.include('Missing required fields')
                } else {
                    throw error
                }
            }
        })
    })

    // Authorization Tests
    describe('4. Authorization Tests', () => {
        it('Should reject requests without token', async function() {
            try {
                await axios.post(
                    `${API_URL}/coding/submit`,
                    {
                        sessionId,
                        problemId,
                        code: validCode.javascript,
                        language: 'javascript'
                    }
                )
                throw new Error('Should have been rejected')
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('✅ Correctly rejected request without token')
                    expect(error.response.data.message).to.include('Unauthorized')
                } else {
                    throw error
                }
            }
        })

        it('Should reject invalid token', async function() {
            try {
                await axios.post(
                    `${API_URL}/coding/submit`,
                    {
                        sessionId,
                        problemId,
                        code: validCode.javascript,
                        language: 'javascript'
                    },
                    {
                        headers: {
                            Authorization: 'Bearer invalid-token-xyz'
                        }
                    }
                )
                throw new Error('Should have been rejected')
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('✅ Correctly rejected invalid token')
                } else {
                    throw error
                }
            }
        })
    })

    // Session Completion
    describe('5. Session Completion', () => {
        it('Should finish coding session', async function() {
            try {
                const response = await axios.post(
                    `${API_URL}/coding/session/finish`,
                    { sessionId },
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    }
                )
                expect(response.status).to.equal(200)
                expect(response.data.result).to.exist
                console.log('✅ Session finished')
                console.log(`   Total Score: ${response.data.result.totalScore}`)
                console.log(`   Solved: ${response.data.result.solvedProblems}/${response.data.result.totalProblems}`)
            } catch (error) {
                console.error('❌ Session finish failed:', error.response?.data)
                throw error
            }
        })

        it('Should retrieve OA history', async function() {
            try {
                const response = await axios.get(
                    `${API_URL}/coding/history`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    }
                )
                expect(response.status).to.equal(200)
                expect(response.data.sessions).to.be.an('array')
                console.log('✅ OA history retrieved')
                console.log(`   Total sessions: ${response.data.sessions.length}`)
            } catch (error) {
                console.error('❌ History retrieval failed:', error.response?.data)
                throw error
            }
        })
    })

    // Debugging
    describe('6. System Status', () => {
        it('Should check system status', async function() {
            try {
                const response = await axios.get(`${API_URL}/coding/debug/status`)
                expect(response.status).to.equal(200)
                console.log('✅ System Status:')
                console.log(`   Total Problems: ${response.data.totalProblems}`)
                console.log(`   Easy: ${response.data.difficulties.easy}`)
                console.log(`   Medium: ${response.data.difficulties.medium}`)
                console.log(`   Hard: ${response.data.difficulties.hard}`)
                console.log(`   Ongoing Sessions: ${response.data.ongoingSessions}`)
            } catch (error) {
                console.error('❌ Status check failed:', error.response?.data)
                throw error
            }
        })
    })
})

export { validCode, invalidCode }
