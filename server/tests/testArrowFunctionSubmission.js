import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

// Test with arrow function code
const testArrowFunctionSubmission = async () => {
    try {
        console.log('\n🧪 Testing Arrow Function Code Submission...\n')
        
        // 1. Login with Google Auth
        console.log('1️⃣ Authenticating with Google Auth...')
        const timestamp = Date.now()
        const authRes = await axios.post(`${API_URL}/auth/google`, {
            name: `Test User ${timestamp}`,
            email: `testuser${timestamp}@example.com`
        })
        const token = authRes.data.token
        console.log('✅ Authentication successful')
        
        const headers = {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        }
        
        // 2. Start session
        console.log('\n2️⃣ Starting coding session...')
        const sessionRes = await axios.post(
            `${API_URL}/coding/session/start`,
            {},
            headers
        )
        const sessionId = sessionRes.data.sessionId
        const problems = sessionRes.data.problems
        console.log(`✅ Session started: ${sessionId}`)
        console.log(`   Problems loaded: ${problems.length}`)
        
        // 3. Submit arrow function code for the easy problem (Two Sum)
        console.log('\n3️⃣ Submitting arrow function code...')
        const arrowFunctionCode = `const twoSum = (nums, target) => {
    const map = new Map()
    for (let i = 0; i < nums.length; i++) {
        if (map.has(target - nums[i])) {
            return [map.get(target - nums[i]), i]
        }
        map.set(nums[i], i)
    }
    return []
}`
        
        const submitRes = await axios.post(
            `${API_URL}/coding/submit`,
            {
                sessionId,
                problemId: problems[0]._id,
                code: arrowFunctionCode,
                language: 'javascript'
            },
            headers
        )
        
        console.log('✅ Code submitted successfully!')
        console.log(`   Verdict: ${submitRes.data.submission.verdict}`)
        console.log(`   Passed: ${submitRes.data.submission.passedTestCases}/${submitRes.data.submission.totalTestCases}`)
        
        // Print test case results
        console.log('\n📋 Test Results:')
        submitRes.data.submission.testCaseResults.forEach((result, idx) => {
            console.log(`   Test ${idx + 1}: ${result.passed ? '✅ PASS' : '❌ FAIL'}`)
            console.log(`      Input: ${result.input.substring(0, 30)}...`)
            console.log(`      Expected: ${result.expectedOutput}`)
            console.log(`      Got: ${result.actualOutput}`)
        })
        
        console.log('\n✅ Test completed successfully!')
        process.exit(0)
        
    } catch (error) {
        console.error('\n❌ Test failed:')
        if (error.response) {
            console.error(`Status: ${error.response.status}`)
            console.error(`Message: ${error.response.data?.message}`)
            console.error(`Error: ${error.response.data?.error}`)
        } else {
            console.error(error.message)
        }
        process.exit(1)
    }
}

testArrowFunctionSubmission()
