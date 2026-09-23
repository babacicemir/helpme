const accountRepository = require('../repositories/index')
const userRepository = require('../repositories/users')
const { hashedPassword } = require('../utils')
const bcrypt  = require('bcrypt')
const jwt = require('jsonwebtoken')

const createUser = async(userData) => {

    const existingUser = await userRepository.findUserByUsernameEmail(userData.username, userData.email)
     if (existingUser) {
        throw new Error('User with this email or username already exists')
    }
    
    const hashPassword = await hashedPassword(userData.password)

    const user = await accountRepository.createUser(userData, hashPassword)

    return user
}

const login = async (userData) => {
    const user = await userRepository.findUserByUsernameEmail(
        userData.username,
        userData.email
    )

    if (!user) {
        throw new Error('INVALID_CREDENTIALS')
    }

    const isPasswordMatching = await bcrypt.compare(
        userData.password,
        user.password
    )

    if (!isPasswordMatching) {
        throw new Error('INVALID_CREDENTIALS')
    }

    const payload = {
        id: user.id,
        username: user.username,
        role: user.role
    }

    const token = jwt.sign(
        payload,
        process.env.TOKEN_CODE,
        {
            expiresIn: '2h'
        }
    )

    return {
        token,
        user: payload
    }
}

module.exports = {
    createUser,
    login
}