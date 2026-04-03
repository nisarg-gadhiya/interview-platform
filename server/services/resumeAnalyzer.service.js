import axios from "axios";

export const analyzeResumeWithAI = async (resumeText) => {
    try {
        if (!resumeText || !resumeText.trim()) {
            throw new Error("Resume text cannot be empty");
        }

        console.log("Resume analysis initiated");

        // Check if API key exists
        const apiKey = process.env.OPENROUTER_API_KEY?.trim();
        if (!apiKey) {
            console.error("❌ OpenRouter API key is missing or empty");
            throw new Error("OpenRouter API key not configured. Please add OPENROUTER_API_KEY to .env file");
        }

        console.log("✅ API Key found, length:", apiKey.length);

        const prompt = `You are a professional resume analyst and career coach. Analyze this resume comprehensively and return ONLY valid JSON.

CRITICAL: Return this exact JSON structure with detailed analysis:
{
  "score": <5-95 number, assess overall quality holistically>,
  "strengths": ["detailed strength 1", "detailed strength 2", "detailed strength 3"],
  "weaknesses": ["specific weakness 1", "specific weakness 2", "specific weakness 3"],
  "missingSkills": ["important skill 1", "important skill 2", "important skill 3"],
  "suggestions": ["actionable tip 1", "actionable tip 2", "actionable tip 3", "actionable tip 4"]
}

ANALYSIS INSTRUCTIONS:

SCORE (5-95):
- 85-95: Excellent resume, professional layout, clear achievements, strong content
- 75-84: Good resume, well structured, most key elements present
- 65-74: Average resume, some good elements but needs improvement
- 55-64: Below average, missing key sections or unclear presentation
- 45-54: Poor resume, significant gaps or formatting issues
- 35-44: Very poor, barely usable as-is
- 5-34: Minimal/unusable content

STRENGTHS (Identify 3 genuine positive aspects):
- Comment on specific sections (education, experience, skills, format)
- Mention any quantified achievements if present
- Note good use of formatting or organization
- Be specific: "Includes metrics in projects showing X% improvement" instead of generic praise

WEAKNESSES (Identify 3 specific areas for improvement):
- Point out missing or unclear sections
- Note weak action verbs or vague descriptions
- Identify formatting, grammar, or structure issues
- Be specific: "Lacks quantifiable results in work experience" not just "needs work"

MISSING SKILLS (3 skills that should be added):
- Industry-relevant technical or soft skills
- In-demand skills for current job market
- Certifications or tools relevant to field
- Be specific to what's currently missing

SUGGESTIONS (4+ actionable, specific recommendations):
- How to improve weaknesses (not just what's wrong)
- How to highlight strengths better
- Specific formatting improvements
- How to make it more compelling
- Tailor content suggestions based on actual resume content

IMPORTANT RULES:
- Return ONLY JSON object
- NO markdown, NO code blocks, NO extra text
- All fields must contain meaningful, specific data
- NEVER use placeholder text like "N/A" or generic advice
- Score must be 5-95 (not 0, not 100)
- Each item should be 1-2 sentences, specific and actionable

RESUME TO ANALYZE:
${resumeText}

RETURN ONLY THE JSON OBJECT:`;

        console.log("📤 Sending request to OpenRouter API...");
        console.log("📏 Resume length:", resumeText.length, "characters");

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-4o-mini",
                temperature: 0.7,
                max_tokens: 2000,
                messages: [
                    {
                        role: "system",
                        content: "You are an expert career coach and professional resume reviewer with 20+ years of experience. Your job is to analyze resumes thoroughly and provide actionable, specific feedback. Always be honest about weaknesses but constructive. Return ONLY raw JSON, never use markdown or code blocks. Be specific and avoid generic feedback."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'AI Interview Agent'
                },
                timeout: 30000
            }
        );

        console.log("✅ OpenRouter API response received, status:", response.status);

        const content = response?.data?.choices?.[0]?.message?.content;

        if (!content || !content.trim()) {
            throw new Error("Empty response from AI API");
        }

        console.log("📝 Raw AI response:", content.substring(0, 200) + "...");

        // Parse JSON response from AI
        let analysisResult;
        try {
            // Remove markdown code block wrapper if present (```json ... ```)
            let jsonContent = content.trim();
            
            // Remove leading ```json or ``` 
            jsonContent = jsonContent.replace(/^```(?:json)?\s*\n?/, '');
            
            // Remove trailing ```
            jsonContent = jsonContent.replace(/\n?```\s*$/, '');
            
            console.log("🔍 Cleaned JSON content:", jsonContent.substring(0, 200) + "...");
            
            analysisResult = JSON.parse(jsonContent);
        } catch (parseError) {
            console.error("JSON Parse Error:", content);
            console.error("Parse error details:", parseError.message);
            throw new Error("Invalid JSON response from AI: " + parseError.message);
        }

        // Validate and normalize response structure
        if (!analysisResult || typeof analysisResult !== 'object') {
            throw new Error("Invalid response format - not an object");
        }

        // Ensure score exists and is a number
        if (analysisResult.score === undefined || typeof analysisResult.score !== 'number') {
            analysisResult.score = 50; // Default score if missing
        }
        analysisResult.score = Math.min(95, Math.max(5, analysisResult.score)); // Clamp 5-95

        // Ensure arrays exist and have at least some content, or fill with defaults
        if (!Array.isArray(analysisResult.strengths) || analysisResult.strengths.length === 0) {
            analysisResult.strengths = [
                "Document was submitted for analysis",
                "Demonstrates willingness to improve professional presentation",
                "Has foundational structure for a resume"
            ];
        }

        if (!Array.isArray(analysisResult.weaknesses) || analysisResult.weaknesses.length === 0) {
            analysisResult.weaknesses = [
                "Requires significant formatting and content improvements",
                "Missing key professional accomplishments and metrics",
                "Needs better organization and clarity in sections"
            ];
        }

        if (!Array.isArray(analysisResult.missingSkills) || analysisResult.missingSkills.length === 0) {
            analysisResult.missingSkills = [
                "Relevant technical skills for your industry",
                "Key certifications or professional credentials",
                "Quantifiable metrics showcasing impact and achievements"
            ];
        }

        if (!Array.isArray(analysisResult.suggestions) || analysisResult.suggestions.length === 0) {
            analysisResult.suggestions = [
                "Start with a strong professional summary highlighting your key value proposition",
                "Add specific, quantifiable achievements (e.g., increased sales by 25%, reduced costs by $50K)",
                "Reorganize content with clear section headers and consistent formatting",
                "Include relevant skills section targeting the job description",
                "Use strong action verbs at the start of each accomplishment"
            ];
        }

        // Ensure all arrays contain strings only
        analysisResult.strengths = analysisResult.strengths.filter(s => s && typeof s === 'string');
        analysisResult.weaknesses = analysisResult.weaknesses.filter(w => w && typeof w === 'string');
        analysisResult.missingSkills = analysisResult.missingSkills.filter(sk => sk && typeof sk === 'string');
        analysisResult.suggestions = analysisResult.suggestions.filter(sg => sg && typeof sg === 'string');

        console.log("✅ Response validation and normalization passed");
        console.log("📊 Analysis Results:", {
            score: analysisResult.score,
            strengthsCount: analysisResult.strengths.length,
            weaknessesCount: analysisResult.weaknesses.length,
            missingSkillsCount: analysisResult.missingSkills.length,
            suggestionsCount: analysisResult.suggestions.length
        });
        
        console.log("✅ Resume analysis completed successfully");
        return analysisResult;

    } catch (error) {
        console.error("❌ Resume Analysis Error:", error.message);
        if (error.response) {
            console.error("API Error Status:", error.response.status);
            console.error("API Error Headers:", error.response.headers);
            console.error("API Error Data:", JSON.stringify(error.response.data, null, 2));
            
            if (error.response.status === 401) {
                console.error("🔑 Authentication failed - API key is invalid or expired");
            }
        }
        throw new Error("Failed to analyze resume: " + error.message);
    }
};

export const extractResumeSections = (resumeText) => {
    try {
        const sections = {
            skills: [],
            experience: [],
            projects: []
        };

        // Basic extraction patterns
        const skillPattern = /(?:skills?|technical skills?|competencies?)[\s\n]*:?[\s\n]*([^\n]+(?:\n(?![\w\s]*:)[^\n]+)*)/gi;
        const expPattern = /(?:experience|work experience|employment)[\s\n]*:?[\s\n]*([^\n]+(?:\n(?![\w\s]*:)[^\n]+)*)/gi;
        const projPattern = /(?:projects?|portfolio)[\s\n]*:?[\s\n]*([^\n]+(?:\n(?![\w\s]*:)[^\n]+)*)/gi;

        let match;

        while ((match = skillPattern.exec(resumeText)) !== null) {
            const skillItems = match[1].split(/[,\n]/).filter(s => s.trim());
            sections.skills.push(...skillItems.map(s => s.trim()));
        }

        while ((match = expPattern.exec(resumeText)) !== null) {
            const expItems = match[1].split(/\n/).filter(e => e.trim());
            sections.experience.push(...expItems.map(e => e.trim()));
        }

        while ((match = projPattern.exec(resumeText)) !== null) {
            const projItems = match[1].split(/\n/).filter(p => p.trim());
            sections.projects.push(...projItems.map(p => p.trim()));
        }

        return sections;
    } catch (error) {
        console.error("Resume extraction error:", error);
        return { skills: [], experience: [], projects: [] };
    }
};
