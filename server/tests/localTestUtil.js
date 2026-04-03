/**
 * Local Code Submission Test Utility
 * Tests the core logic without requiring Judge0 API
 */

import Problem from '../models/coding/problem.model.js'
import CodingSession from '../models/coding/codingSession.model.js'
import Submission from '../models/coding/submission.model.js'
import User from '../models/user.model.js'
import { calculateProblemScore } from '../services/coding.service.js'

export const runLocalTests = async () => {
    console.log('\n🧪 Running Local Test Suite...\n')

    let testsPassed = 0
    let testsFailed = 0

    try {
        // Test 1: Database Connection
        console.log('📋 Test 1: Database Connection')
        try {
            const problemCount = await Problem.countDocuments()
            console.log(`✅ Database connected. Found ${problemCount} problems\n`)
            testsPassed++
        } catch (error) {
            console.error(`❌ Database connection failed: ${error.message}\n`)
            testsFailed++
        }

        // Test 2: Problem Seeding
        console.log('📋 Test 2: Problem Seeding')
        try {
            const easyProblems = await Problem.countDocuments({ difficulty: 'easy' })
            const mediumProblems = await Problem.countDocuments({ difficulty: 'medium' })
            const hardProblems = await Problem.countDocuments({ difficulty: 'hard' })

            if (easyProblems > 0 && mediumProblems > 0 && hardProblems > 0) {
                console.log(`✅ Problems seeded:`)
                console.log(`   Easy: ${easyProblems}, Medium: ${mediumProblems}, Hard: ${hardProblems}\n`)
                testsPassed++
            } else {
                console.error(`❌ Some problem difficulties missing\n`)
                testsFailed++
            }
        } catch (error) {
            console.error(`❌ Problem check failed: ${error.message}\n`)
            testsFailed++
        }

        // Test 3: User Creation
        console.log('📋 Test 3: User Creation')
        try {
            const testUser = await User.findOne({ email: 'test@example.com' })
            let userId

            if (!testUser) {
                const newUser = await User.create({
                    name: 'Test User',
                    email: 'test@example.com'
                })
                userId = newUser._id
                console.log(`✅ Test user created: ${userId}\n`)
            } else {
                userId = testUser._id
                console.log(`✅ Test user already exists: ${userId}\n`)
            }
            testsPassed++
        } catch (error) {
            console.error(`❌ User creation failed: ${error.message}\n`)
            testsFailed++
        }

        // Test 4: Coding Session Creation
        console.log('📋 Test 4: Coding Session Creation')
        try {
            const testUser = await User.findOne({ email: 'test@example.com' })
            
            // Check for existing session
            let session = await CodingSession.findOne({
                userId: testUser._id,
                status: 'ongoing'
            })

            if (!session) {
                const problems = await Problem.find().limit(3).lean()
                session = await CodingSession.create({
                    userId: testUser._id,
                    problems: problems.map(p => p._id),
                    startTime: new Date(),
                    status: 'ongoing',
                    duration: 60
                })
            }

            console.log(`✅ Session created/resumed: ${session._id}\n`)
            testsPassed++
        } catch (error) {
            console.error(`❌ Session creation failed: ${error.message}\n`)
            testsFailed++
        }

        // Test 5: Problem Retrieval
        console.log('📋 Test 5: Problem Retrieval')
        try {
            const problems = await Problem.find().limit(3).lean()

            if (problems.length === 3) {
                console.log(`✅ Retrieved 3 problems:`)
                problems.forEach(p => {
                    console.log(`   - ${p.title} (${p.difficulty})`)
                })
                console.log('')
                testsPassed++
            } else {
                console.error(`❌ Could not retrieve 3 problems\n`)
                testsFailed++
            }
        } catch (error) {
            console.error(`❌ Problem retrieval failed: ${error.message}\n`)
            testsFailed++
        }

        // Test 6: Score Calculation
        console.log('📋 Test 6: Score Calculation')
        try {
            const easyScore = calculateProblemScore('easy', 4, 4)
            const mediumScore = calculateProblemScore('medium', 4, 4)
            const hardScore = calculateProblemScore('hard', 4, 4)

            console.log(`✅ Score calculation:`)
            console.log(`   Easy (4/4): ${easyScore}`)
            console.log(`   Medium (4/4): ${mediumScore}`)
            console.log(`   Hard (4/4): ${hardScore}`)
            console.log(`   Total: ${easyScore + mediumScore + hardScore}\n`)
            testsPassed++
        } catch (error) {
            console.error(`❌ Score calculation failed: ${error.message}\n`)
            testsFailed++
        }

        // Test 7: Submission Creation
        console.log('📋 Test 7: Submission Creation')
        try {
            const testUser = await User.findOne({ email: 'test@example.com' })
            const session = await CodingSession.findOne({
                userId: testUser._id,
                status: 'ongoing'
            })
            const problem = await Problem.findById(session.problems[0])

            const submission = await Submission.create({
                userId: testUser._id,
                problemId: problem._id,
                sessionId: session._id,
                code: 'console.log("test");',
                language: 'javascript',
                verdict: 'Accepted',
                passedTestCases: 4,
                totalTestCases: 4,
                testCaseResults: [
                    { testCaseIndex: 0, passed: true, input: '1', expectedOutput: '1', actualOutput: '1' },
                    { testCaseIndex: 1, passed: true, input: '2', expectedOutput: '2', actualOutput: '2' },
                    { testCaseIndex: 2, passed: true, input: '3', expectedOutput: '3', actualOutput: '3' },
                    { testCaseIndex: 3, passed: true, input: '4', expectedOutput: '4', actualOutput: '4' }
                ]
            })

            console.log(`✅ Submission created: ${submission._id}\n`)
            testsPassed++
        } catch (error) {
            console.error(`❌ Submission creation failed: ${error.message}\n`)
            testsFailed++
        }

        // Test 8: Session Update
        console.log('📋 Test 8: Session Update')
        try {
            const testUser = await User.findOne({ email: 'test@example.com' })
            const session = await CodingSession.findOne({
                userId: testUser._id,
                status: 'ongoing'
            })

            session.solvedProblems = 1
            session.status = 'completed'
            session.endTime = new Date()
            session.score = 100
            await session.save()

            console.log(`✅ Session updated: ${session._id}`)
            console.log(`   Score: ${session.score}`)
            console.log(`   Solved: ${session.solvedProblems}\n`)
            testsPassed++
        } catch (error) {
            console.error(`❌ Session update failed: ${error.message}\n`)
            testsFailed++
        }

        // Summary
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log(`✅ Tests Passed: ${testsPassed}`)
        console.log(`❌ Tests Failed: ${testsFailed}`)
        console.log(`📊 Total Tests: ${testsPassed + testsFailed}`)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

        if (testsFailed === 0) {
            console.log('🎉 All tests passed! System is ready.\n')
            return true
        } else {
            console.error('⚠️  Some tests failed. Check configuration.\n')
            return false
        }
    } catch (error) {
        console.error('💥 Critical error in test suite:', error)
        return false
    }
}

export const validateCodeSubmission = (code, language) => {
    console.log(`\n🔍 Validating ${language} code...`)

    const validations = {
        javascript: () => {
            // Basic check for syntax errors
            try {
                new Function(code)
                return { valid: true, message: '✅ JavaScript code is syntactically valid' }
            } catch (error) {
                return { valid: false, message: `❌ JavaScript error: ${error.message}` }
            }
        },
        python: () => {
            // Python validation would require a Python runtime
            // For now, do simple checks
            if (code.includes('def ') || code.includes('class ')) {
                return { valid: true, message: '✅ Python code structure looks valid' }
            }
            return { valid: true, message: '✅ Python code accepted for testing' }
        },
        java: () => {
            if (code.includes('public class') && code.includes('public static void main')) {
                return { valid: true, message: '✅ Java code structure looks valid' }
            }
            return { valid: false, message: '❌ Java code missing required structure' }
        }
    }

    const validator = validations[language] || (() => ({ valid: true, message: '✅ Language accepted' }))
    return validator()
}

export const simulateTestCase = (code, language, testCase) => {
    console.log(`\n⚙️  Simulating test case: Input="${testCase.input}", Expected="${testCase.output}"`)

    // This is a simple simulation - in production, use Judge0 or similar
    if (language === 'javascript') {
        try {
            const func = new Function(`
                ${code}
                return (${code.match(/function\s+\w+/)?.[0]?.split(/\s+/)?.[1] || 'reverseArray'})(${testCase.input})
            `)
            const result = func()
            const passed = result?.toString() === testCase.output?.toString()
            return { passed, result, expected: testCase.output }
        } catch (error) {
            return { passed: false, error: error.message }
        }
    }

    // For other languages, we'd need external execution
    return { passed: null, message: 'Requires external runtime' }
}
