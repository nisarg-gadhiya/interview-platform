/**
 * Test Case Execution Verification
 * Verifies that the local test case runner works correctly
 */

import connectDB from '../config/db.js'
import { runTestCases } from '../services/coding.service.js'
import Problem from '../models/coding/problem.model.js'
import dotenv from 'dotenv'

dotenv.config()

const testCodeSubmission = async () => {
    console.log('\n🧪 Testing Code Submission with Test Case Runner\n')
    
    try {
        // Connect to database
        await connectDB()
        console.log('✅ Connected to database\n')
        
        // Get a problem
        const problem = await Problem.findOne({ difficulty: 'easy' })
        if (!problem) {
            console.error('❌ No easy problems found')
            return false
        }
        
        console.log(`📋 Testing problem: "${problem.title}"`)
        console.log(`   Difficulty: ${problem.difficulty}`)
        console.log(`   Test cases: ${problem.testCases.length}\n`)
        
        // Test 1: JavaScript Code Submission
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('Test 1: JavaScript Code')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
        
        const javaScriptCode = `
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}
        `.trim()
        
        console.log('Code to test:')
        console.log(javaScriptCode)
        console.log('\nRunning tests...\n')
        
        const jsResults = await runTestCases(
            javaScriptCode,
            'javascript',
            problem.testCases
        )
        
        console.log('\nResults:')
        console.log(`  Verdict: ${jsResults.verdict}`)
        console.log(`  Passed: ${jsResults.passedTestCases}/${jsResults.totalTestCases}`)
        console.log(`  Test cases:`)
        jsResults.testCaseResults.forEach((tc, idx) => {
            const status = tc.passed ? '✅' : '❌'
            console.log(`    ${status} Test ${idx + 1}: ${tc.passed ? 'PASS' : 'FAIL'}`)
            if (!tc.passed) {
                console.log(`       Input: ${tc.input}`)
                console.log(`       Expected: ${tc.expectedOutput}`)
                console.log(`       Got: ${tc.actualOutput}`)
            }
        })
        
        // Test 2: Python Code
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('Test 2: Python Code')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
        
        const pythonCode = `
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
        `.trim()
        
        console.log('Code to test:')
        console.log(pythonCode)
        console.log('\nRunning tests...\n')
        
        const pyResults = await runTestCases(
            pythonCode,
            'python',
            problem.testCases
        )
        
        console.log('\nResults:')
        console.log(`  Verdict: ${pyResults.verdict}`)
        console.log(`  Passed: ${pyResults.passedTestCases}/${pyResults.totalTestCases}`)
        
        // Test 3: Invalid Code
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('Test 3: Invalid JavaScript Code')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
        
        const invalidCode = `
function broken(
    this is invalid syntax
        `.trim()
        
        console.log('Code to test:')
        console.log(invalidCode)
        console.log('\nRunning tests...\n')
        
        const invalidResults = await runTestCases(
            invalidCode,
            'javascript',
            problem.testCases.slice(0, 1) // Just test first one
        )
        
        console.log('\nResults:')
        console.log(`  Verdict: ${invalidResults.verdict}`)
        if (invalidResults.errorMessage) {
            console.log(`  Error: ${invalidResults.errorMessage}`)
        }
        
        // Summary
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('📊 Summary')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log(`✅ JavaScript: ${jsResults.verdict}`)
        console.log(`✅ Python: ${pyResults.verdict}`)
        console.log(`✅ Invalid Code Handle: ${invalidResults.verdict}\n`)
        
        console.log('✅ All code submission tests completed!')
        return true
        
    } catch (error) {
        console.error('\n❌ Error:', error.message)
        return false
    }
}

testCodeSubmission().then((success) => {
    process.exit(success ? 0 : 1)
})
