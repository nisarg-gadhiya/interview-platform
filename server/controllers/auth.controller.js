import User from '../models/user.model.js'
import generateToken from '../config/token.js'

export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body

        let user = await User.findOne({ email })

        if (!user) {
            user = await User.create({
                name,
                email
            })
        }

        const token = generateToken(user._id.toString())

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({...user.toObject(), token})

    } catch (error) {
        return res.status(500).json({ message: `Google Auth error ${error}` })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "Logout Successful!!!" })
    } catch (error) {
        return res.status(500).json({ message: "Logout Failed" })
    }
}