import jwt from 'jsonwebtoken'

const isAuth = async (req, res, next) => {
    try {
        let token = req.cookies?.token
        
        console.log("🔍 Checking auth...");
        console.log("🍪 Cookies:", req.cookies ? Object.keys(req.cookies) : "none");
        console.log("📋 Auth header:", req.headers.authorization ? "present" : "missing");
        
        // Check Authorization header if no token in cookies
        if (!token) {
            const authHeader = req.headers.authorization
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.slice(7) // Remove 'Bearer ' prefix
                console.log("✅ Token extracted from header")
            }
        }
        
        if (!token) {
            console.log("❌ No token found in cookies or headers");
            return res.status(401).json({ message: "Unauthorized - No token" })
        }
        
        console.log("✅ Token found:", token.slice(0, 20) + "...");
        console.log("🔑 JWT_SECRET exists:", !!process.env.JWT_SECRET);
        
        if (!process.env.JWT_SECRET) {
            console.error("❌ JWT_SECRET not configured");
            return res.status(500).json({ message: "Server configuration error" })
        }
        
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
        
        console.log("✅ Token verified, userId:", verifyToken.userId);

        req.userId = verifyToken.userId
        req.user = { id: verifyToken.userId }

        next()

    } 
    catch (error) {
        console.log("❌ Auth error:", error.message);
        console.log("🐛 Full error:", error);
        return res.status(401).json({ message: "Unauthorized - Invalid token", error: error.message })
    }
}

export default isAuth