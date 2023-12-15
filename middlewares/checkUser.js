import jwt from "jsonwebtoken";

const checkUser = (req,res,next) => {
    const { authorization } = req.headers
    if (!authorization)
        return res.status(401).json({ message: 'unauthorized' })

    try {
        const { email } = jwt.verify(authorization, process.env.JWT_SECRET)
        req.email = email 
        next()
    }
    catch (e) {
        return res.status(401).json({ message: e.message })
    }

}

export default checkUser