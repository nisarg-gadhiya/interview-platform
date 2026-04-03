import Resume from '../models/resume.model.js'
import User from '../models/user.model.js'
import { analyzeResumeWithAI, extractResumeSections } from '../services/resumeAnalyzer.service.js'

export const analyzeResume = async (req, res) => {
    try {
        const { resumeText } = req.body
        const userId = req.user?.id || req.userId

        if (!resumeText || !resumeText.trim()) {
            return res.status(400).json({ message: "Resume text is required" })
        }

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (user.credits < 20) {
            return res.status(400).json({ message: "Not enough credits" })
        }

        console.log(`Analyzing resume for user ${userId}`)

        const sections = extractResumeSections(resumeText)

        const optimizedResume = `
Skills: ${sections.skills?.join(", ")}

Projects:
${sections.projects?.join("\n")}

Experience:
${sections.experience?.join("\n")}
        `.slice(0, 20000)

        const analysisResult = await analyzeResumeWithAI(optimizedResume)

        user.credits -= 20
        await user.save()

        const newResume = await Resume.create({
            userId,
            extractedText: resumeText,
            score: analysisResult.score,
            strengths: analysisResult.strengths,
            weaknesses: analysisResult.weaknesses,
            missingSkills: analysisResult.missingSkills,
            suggestions: analysisResult.suggestions,
            skills: sections.skills,
            experience: sections.experience,
            projects: sections.projects
        })

        console.log("Resume analysis completed successfully")

        return res.status(200).json({
            message: "Resume analyzed successfully",
            data: newResume
        })

    } catch (error) {
        console.error("Resume Analysis Error:", error.message)
        console.error("Full error:", error)

        return res.status(500).json({
            message: `Resume analysis failed: ${error.message}`
        })
    }
}

export const getUserResumes = async (req, res) => {
    try {
        const userId = req.user?.id || req.userId

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" })
        }

        const resumes = await Resume.find({ userId }).sort({ createdAt: -1 }).limit(10)

        return res.status(200).json({
            message: "Resumes retrieved successfully",
            data: resumes
        })

    } catch (error) {
        console.error("Get Resumes Error:", error.message)
        return res.status(500).json({ message: `Failed to retrieve resumes: ${error.message}` })
    }
}

export const getResumeById = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user?.id || req.userId

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" })
        }

        const resume = await Resume.findOne({ _id: id, userId })

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" })
        }

        return res.status(200).json({
            message: "Resume retrieved successfully",
            data: resume
        })

    } catch (error) {
        console.error("Get Resume Error:", error.message)
        return res.status(500).json({ message: `Failed to retrieve resume: ${error.message}` })
    }
}

export const deleteResume = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user?.id || req.userId

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" })
        }

        const resume = await Resume.findOneAndDelete({ _id: id, userId })

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" })
        }

        return res.status(200).json({
            message: "Resume deleted successfully"
        })

    } catch (error) {
        console.error("Delete Resume Error:", error.message)
        return res.status(500).json({ message: `Failed to delete resume: ${error.message}` })
    }
}
