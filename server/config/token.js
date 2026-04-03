import jwt from 'jsonwebtoken'

const generateToken = (userId)=>{
    try{
        const token = jwt.sign({userId} , process.env.JWT_SECRET , {expiresIn:"7d"})
        console.log("🔐 Token generated for userId:", userId);
        console.log("🔑 JWT_SECRET exists:", !!process.env.JWT_SECRET);
        return token
    }
    catch(error){
        console.log("❌ Token generation error:", error)
    }
}

export default generateToken