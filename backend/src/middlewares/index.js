const jwt = require('jsonwebtoken')
const { getUserById } = require('../repositories/users')

const checkJWT = async(req, res, next) => {
    const token = req.cookies.token 
    if(!token){
        return res.status(401).json({error: "Missing token"})
        }
    
    try{

        const decoded = jwt.verify(token, process.env.TOKEN_CODE)
        const user = await getUserById(decoded.id)
        if(user){
            req.user = decoded 
            next()
        }else{
            return res.status(401).json({ error: 'Unauthorized' })
        }
    }
    catch(error){
        return res.status(400).json({ error: 'Invalid token' })
    }
}

const checkAccess = (expectedRole) => {
    return async (req, res, next) => {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Missing token'
            })
        }

        try {
            const decoded = jwt.verify(
                token,
                process.env.TOKEN_CODE
            )

            const user = await getUserId(decoded.id)

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                })
            }

            if (user.role !== expectedRole) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                })
            }

            req.user = decoded

            next()
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            })
        }
    }
}

module.exports = {
    checkJWT,
    checkAccess
}