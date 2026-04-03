import axios from "axios";

export const askAi = async (messages) =>{
    try{
        console.log("askAi called with messages count:", messages.length);
        
        if(!messages || !Array.isArray(messages) || messages.length === 0){
            throw new Error("Invalid messages array");
        }
        
        console.log("API Key exists:", !!process.env.OPENROUTER_API_KEY);
        
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions",{
            model: "openai/gpt-4o-mini",
            messages: messages
        },
        {
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'AI Interview Agent',
            },
        }
    );
        console.log("OpenRouter response status:", response.status);
        const content = response?.data?.choices?.[0]?.message?.content;

        if(!content || !content.trim()){
            throw new Error("Invalid response from OpenRouter API");
        }
        return content
    }
    catch(error){
        console.error("OpenRouter Error - Status:", error.response?.status);
        console.error("OpenRouter Error - Data:", error.response?.data);
        console.error("OpenRouter Error - Message:", error.message);
        throw new Error("Failed to get response from OpenRouter API: " + error.message);
    }
}