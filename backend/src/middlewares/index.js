const jwt = require('jsonwebtoken')
const { getUserById } = require('../repositories/users')

const chechJWT = async(req, res, next) => {
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

module.exports = {
    chechJWT
}