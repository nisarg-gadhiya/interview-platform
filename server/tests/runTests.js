/**
 * Quick Test Runner
 * Run with: node tests/runTests.js
 * 
 * This runs local tests without needing the full test framework
 */

import connectDB from '../config/db.js'
import { seedCodingProblems } from '../seeds/codingProblems.seed.js'
import { runLocalTests } from './localTestUtil.js'
import dotenv from 'dotenv'

dotenv.config()

const runTests = async () => {
    try {
        console.log('🚀 Starting Test Suite\n')
        
        // Connect to database
        console.log('📡 Connecting to database...')
        await connectDB()
        console.log('✅ Connected\n')
        
        // Seed problems if needed
        console.log('🌱 Seeding problems...')
        await seedCodingProblems()
        console.log('✅ Problems seeded\n')
        
        // Run tests
        const success = await runLocalTests()
        
        process.exit(success ? 0 : 1)
    } catch (error) {
        console.error('💥 Test runner error:', error)
        process.exit(1)
    }
}

// Check environment
console.log('═══════════════════════════════════════════════════════════')
console.log('🧪 CODE SUBMISSION TEST RUNNER')
console.log('═══════════════════════════════════════════════════════════')
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
console.log(`DB: ${process.env.MONGODB_URL ? '✅ Configured' : '❌ Not configured'}`)
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Configured' : '❌ Not configured'}`)
console.log('═══════════════════════════════════════════════════════════\n')

runTests()
