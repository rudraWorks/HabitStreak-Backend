import Users from "../models/Users.js"
import jwt from 'jsonwebtoken'


const createToken = (email) => {
    return jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: '20d' }
    )
}

export const login = async (req, res) => {
    let { name, email, picture } = req.body
    name = name.trim()
    email = email.trim()
    picture = picture.trim()

    if (!name || !email || !picture) {
        return res.status(400).json({ message: 'Invalid input' })
    }

    try {
        let user = await Users.findOne({ email })
        if (!user) {
            user = await Users.create({ name, email, picture })
        }
        const token = createToken(user.email, 'user')
        return res.status(200).json({ token })
    }
    catch (e) {
        console.log(e.message);
        return res.status(400).json({ message: e.message })
    }
}

export const verifyToken = async (req, res) => {
    const { authorization } = req.headers
    if(!authorization)
        return res.status(401).json({message:'unauthorized'})
    try { 
        const { email } = jwt.verify(authorization, process.env.JWT_SECRET)
    } 
    catch (e) {
        return res.status(401).json({ message: 'user auth failed!' })
    }
    return res.status(200).json({ message:'user auth success' })

}