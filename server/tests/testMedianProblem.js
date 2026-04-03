import connectDB from '../config/db.js'
import { runTestCases } from '../services/coding.service.js'
import Problem from '../models/coding/problem.model.js'
import dotenv from 'dotenv'

dotenv.config()

const testMedianProblem = async () => {
    console.log('\n🧪 Testing Median of Two Sorted Arrays Problem\n')
    
    try {
        await connectDB()
        console.log('✅ Connected to database\n')
        
        const problem = await Problem.findOne({ title: 'Median of Two Sorted Arrays' })
        if (!problem) {
            console.error('❌ Problem not found')
            return false
        }
        
        console.log(`📋 Testing: "${problem.title}"`)
        console.log(`   Difficulty: ${problem.difficulty}`)
        console.log(`   Test cases: ${problem.testCases.length}\n`)
        
        // Test solution
        const code = `
function findMedianSortedArrays(nums1, nums2) {
    const merged = [...nums1, ...nums2].sort((a, b) => a - b);
    const len = merged.length;
    const mid = Math.floor(len / 2);
    
    if (len % 2 === 1) {
        return merged[mid];
    } else {
        return (merged[mid - 1] + merged[mid]) / 2;
    }
}
        `.trim()
        
        console.log('Code to test:')
        console.log(code)
        console.log('\nRunning tests...\n')
        
        const results = await runTestCases(code, 'javascript', problem.testCases)
        
        console.log('\nResults:')
        console.log(`  Verdict: ${results.verdict}`)
        console.log(`  Passed: ${results.passedTestCases}/${results.totalTestCases}`)
        console.log(`  Test cases:`)
        results.testCaseResults.forEach((tc, idx) => {
            const status = tc.passed ? '✅' : '❌'
            console.log(`    ${status} Test ${idx + 1}: ${tc.passed ? 'PASS' : 'FAIL'}`)
            if (!tc.passed) {
                console.log(`       Input: ${tc.input}`)
                console.log(`       Expected: ${tc.expectedOutput}`)
                console.log(`       Got: ${tc.actualOutput}`)
            }
        })
        
        console.log('\n✅ Test completed!')
        return results.passedTestCases === results.totalTestCases
    } catch (error) {
        console.error('\n❌ Error:', error.message)
        console.error(error)
        return false
    }
}

testMedianProblem().then((success) => {
    process.exit(success ? 0 : 1)
})
