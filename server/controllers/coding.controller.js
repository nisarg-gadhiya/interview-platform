import CodingSession from '../models/coding/codingSession.model.js'
import Submission from '../models/coding/submission.model.js'
import Problem from '../models/coding/problem.model.js'
import { runTestCases, calculateProblemScore } from '../services/coding.service.js'
import User from "../models/user.model.js";
import { deductCredits } from "../services/credit.service.js";
import { CREDIT_COSTS } from "../config/credits.js";

export const startCodingSession = async (req, res) => {
    try {
        const userId = req.user?.id || req.userId;

        console.log("📝 startCodingSession called");
        console.log("req.user:", req.user);
        console.log("req.userId:", req.userId);
        console.log("extracted userId:", userId);

        if (!userId) {
            console.log("❌ No userId found");
            return res.status(400).json({ message: "User not authenticated" });
        }

        // 🔥 STEP 1: Check if session already exists (IMPORTANT)
        const existingSession = await CodingSession.findOne({
            userId,
            status: "ongoing",
        }).populate("problems");

        if (existingSession) {
            console.log("ℹ️ User already has ongoing session:", existingSession._id);

            const problemsToReturn = existingSession.problems.map((p) => {
                const problemObj = p.toObject ? p.toObject() : p;
                problemObj.testCases = problemObj.testCases.filter(tc => !tc.isHidden);
                return problemObj;
            });

            return res.status(200).json({
                message: "Existing coding session resumed",
                sessionId: existingSession._id,
                problems: problemsToReturn,
                duration: existingSession.duration,
            });
        }

        // 🔥 STEP 2: Fetch user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 🔥 STEP 3: Deduct credits (ONLY if new session)
        try {
            await deductCredits(user, CREDIT_COSTS.CODING_OA);
        } catch (err) {
            return res.status(400).json({
                message: "Not enough credits",
            });
        }

        // 🔥 STEP 4: Fetch problems
        const easyProblem = await Problem.findOne({ difficulty: "easy" }).lean();
        const mediumProblem = await Problem.findOne({ difficulty: "medium" }).lean();
        const hardProblem = await Problem.findOne({ difficulty: "hard" }).lean();

        console.log("🔍 Easy problem:", easyProblem?._id);
        console.log("🔍 Medium problem:", mediumProblem?._id);
        console.log("🔍 Hard problem:", hardProblem?._id);

        if (!easyProblem || !mediumProblem || !hardProblem) {
            return res.status(500).json({
                message: "Not enough problems in database. Please check server setup.",
            });
        }

        // 🔥 STEP 5: Create session
        const session = new CodingSession({
            userId,
            problems: [easyProblem._id, mediumProblem._id, hardProblem._id],
            startTime: new Date(),
            status: "ongoing",
        });

        await session.save();

        // 🔥 STEP 6: Clean problems (remove hidden test cases)
        const problemsToReturn = [easyProblem, mediumProblem, hardProblem].map((p) => {
            const problemObj = p.toObject ? p.toObject() : p;
            problemObj.testCases = problemObj.testCases.filter(tc => !tc.isHidden);
            return problemObj;
        });

        return res.status(200).json({
            message: "Coding session started",
            sessionId: session._id,
            problems: problemsToReturn,
            duration: session.duration,
        });

    } catch (error) {
        console.error("Start session error:", error);
        return res.status(500).json({
            message: "Failed to start coding session",
            error: error.message,
        });
    }
};

// Submit code for a problem
export const submitCode = async (req, res) => {
    try {
        const userId = req.user?.id || req.userId
        const { sessionId, problemId, code, language } = req.body

        console.log(`\n📝 Code submission received`)
        console.log(`   User: ${userId}`)
        console.log(`   Session: ${sessionId}`)
        console.log(`   Problem: ${problemId}`)
        console.log(`   Language: ${language}`)
        console.log(`   Code length: ${code?.length} chars`)

        if (!userId || !sessionId || !problemId || !code || !language) {
            console.log(`❌ Missing required fields`)
            return res.status(400).json({ message: "Missing required fields" })
        }

        // Verify session belongs to user
        const session = await CodingSession.findOne({
            _id: sessionId,
            userId
        })

        if (!session) {
            console.log(`❌ Session not found: ${sessionId}`)
            return res.status(404).json({ message: "Session not found" })
        }

        console.log(`✅ Session verified: ${sessionId}`)

        // Get problem with all test cases
        const problem = await Problem.findById(problemId)
        if (!problem) {
            console.log(`❌ Problem not found: ${problemId}`)
            return res.status(404).json({ message: "Problem not found" })
        }

        console.log(`✅ Problem found: "${problem.title}"`)
        console.log(`   Test cases: ${problem.testCases.length}`)

        // Run test cases
        console.log(`⏱️  Starting test execution...`)
        const testResults = await runTestCases(code, language, problem.testCases)
        console.log(`✅ Test execution complete`)
        console.log(`   Verdict: ${testResults.verdict}`)
        console.log(`   Passed: ${testResults.passedTestCases}/${testResults.totalTestCases}`)

        // Create submission record
        const submission = new Submission({
            userId,
            problemId,
            sessionId,
            code,
            language,
            verdict: testResults.verdict,
            passedTestCases: testResults.passedTestCases,
            totalTestCases: testResults.totalTestCases,
            errorMessage: testResults.errorMessage,
            testCaseResults: testResults.testCaseResults
        })

        await submission.save()
        console.log(`✅ Submission saved: ${submission._id}`)

        // Update session
        session.submissions.push(submission._id)
        
        // Check if problem is solved (all test cases passed)
        if (testResults.passedTestCases === testResults.totalTestCases) {
            // Mark problem as solved if first successful submission
            const previousSubmissions = await Submission.find({
                problemId,
                sessionId,
                verdict: 'Accepted'
            })
            
            if (previousSubmissions.length === 1) {
                session.solvedProblems += 1
                console.log(`✅ Problem marked as solved!`)
            }
        }

        await session.save()
        console.log(`✅ Session updated`)

        // Calculate score
        const problemScore = calculateProblemScore(
            problem.difficulty,
            testResults.passedTestCases,
            testResults.totalTestCases
        )

        console.log(`✅ Score calculated: ${problemScore} points`)
        console.log(`✅ Sending response to client\n`)

        res.status(200).json({
            message: "Code submitted",
            submission: {
                id: submission._id,
                verdict: testResults.verdict,
                passedTestCases: testResults.passedTestCases,
                totalTestCases: testResults.totalTestCases,
                testCaseResults: testResults.testCaseResults.map(tcr => ({
                    testCaseIndex: tcr.testCaseIndex,
                    passed: tcr.passed,
                    input: tcr.input,
                    expectedOutput: tcr.expectedOutput,
                    actualOutput: tcr.actualOutput
                })),
                problemScore,
                errorMessage: testResults.errorMessage
            }
        })
    } catch (error) {
        console.error(`\n❌ Submit code error: ${error.message}`)
        console.error(`Stack: ${error.stack}`)
        
        // Return more helpful error message
        const errorMessage = error.message || 'Unknown error'
        const details = {
            message: "Failed to submit code",
            error: errorMessage
        }
        
        // Don't send full stack trace in production, but do log it
        console.error('Full error:', error)
        
        res.status(500).json(details)
    }
}

// Finish coding session
export const finishCodingSession = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ message: "Session ID required" });
        }

        const session = await CodingSession.findById(sessionId)
            .populate('problems')
            .populate('submissions');

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        // ✅ prevent duplicate finish
        if (session.status === 'completed') {
            return res.status(200).json({ message: "Session already completed" });
        }

        // Calculate total score
        let totalScore = 0;
        const problemScores = {};

        for (const submission of session.submissions) {
            const problem = await Problem.findById(submission.problemId);
            if (problem && submission.verdict === 'Accepted') {
                const score = calculateProblemScore(
                    problem.difficulty,
                    submission.passedTestCases,
                    submission.totalTestCases
                );

                totalScore += score;

                problemScores[submission.problemId] = Math.max(
                    problemScores[submission.problemId] || 0,
                    score
                );
            }
        }

        // ✅ Close session
        session.status = 'completed';
        session.endTime = new Date();
        session.score = totalScore;

        await session.save();

        // ✅ FIX TIME BUG (IMPORTANT)
        const timeSpent = Math.min(
            Math.floor((session.endTime - session.startTime) / 60000),
            session.duration
        );

        // Prepare result
        const result = {
            sessionId: session._id,
            totalScore,
            totalProblems: session.problems.length,
            solvedProblems: session.solvedProblems,
            timeSpent,
            problemResults: await Promise.all(
                session.submissions.map(async (sub) => {
                    const problem = await Problem.findById(sub.problemId);
                    return {
                        problemId: sub.problemId,
                        title: problem.title,
                        difficulty: problem.difficulty,
                        verdict: sub.verdict,
                        passedTestCases: sub.passedTestCases,
                        totalTestCases: sub.totalTestCases,
                        score: problemScores[sub.problemId] || 0
                    };
                })
            )
        };

        console.log("✅ Session finished:", sessionId);

        res.status(200).json({
            message: "Coding session finished",
            result
        });

    } catch (error) {
        console.error("Finish session error:", error);
        res.status(500).json({
            message: "Failed to finish coding session",
            error: error.message
        });
    }
};

// Get session details
export const getSessionDetails = async (req, res) => {
    try {
        const userId = req.user?.id || req.userId
        const { sessionId } = req.params

        if (!userId || !sessionId) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        const session = await CodingSession.findOne({
            _id: sessionId,
            userId
        }).populate({
            path: 'problems',
            select: 'title difficulty'
        }).populate({
            path: 'submissions',
            select: 'problemId verdict passedTestCases totalTestCases'
        })

        if (!session) {
            return res.status(404).json({ message: "Session not found" })
        }

        res.status(200).json({
            message: "Session details retrieved",
            session
        })
    } catch (error) {
        console.error("Get session error:", error)
        res.status(500).json({ message: "Failed to fetch session", error: error.message })
    }
}

// Get user's OA history
export const getOAHistory = async (req, res) => {
    try {
        const userId = req.user?.id || req.userId

        if (!userId) {
            return res.status(400).json({ message: "User not authenticated" })
        }

        const sessions = await CodingSession.find({
            userId,
            status: 'completed'
        }).select('_id score solvedProblems totalProblems createdAt status')

        res.status(200).json({
            message: "OA history retrieved",
            sessions
        })
    } catch (error) {
        console.error("Get history error:", error)
        res.status(500).json({ message: "Failed to fetch OA history", error: error.message })
    }
}

// Get problems (public)
export const getProblems = async (req, res) => {
    try {
        const problems = await Problem.find().select('title difficulty category')

        res.status(200).json({
            message: "Problems retrieved",
            problems,
            count: problems.length
        })
    } catch (error) {
        console.error("Get problems error:", error)
        res.status(500).json({ message: "Failed to fetch problems", error: error.message })
    }
}

// Get problem by ID
export const getProblemDetail = async (req, res) => {
    try {
        const { problemId } = req.params

        const problem = await Problem.findById(problemId)

        if (!problem) {
            return res.status(404).json({ message: "Problem not found" })
        }

        // Remove hidden test cases if not in admin mode
        const problemData = problem.toObject()
        problemData.testCases = problemData.testCases.filter(tc => !tc.isHidden)

        res.status(200).json({
            message: "Problem details retrieved",
            problem: problemData
        })
    } catch (error) {
        console.error("Get problem error:", error)
        res.status(500).json({ message: "Failed to fetch problem", error: error.message })
    }
}
