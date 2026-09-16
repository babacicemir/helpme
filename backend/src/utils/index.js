const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const hashedPassword = (password) =>{
    const encryptedPassword = bcrypt.hashSync(password, 10)
    return encryptedPassword
}

module.exports={
    hashedPassword,
}