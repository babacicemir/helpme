const accountRepository = require('../repositories/index')
const userRepository = require('../repositories/users')
const { hashedPassword } = require('../utils')

const createUser = async(userData) => {

    const existingUser = await userRepository.findUser(userData.username, userData.email)
     if (existingUser) {
        throw new Error('User with this email or username already exists')
    }
    
    const hashPassword = hashedPassword(userData.password)

    const user = await accountRepository.createUser(userData, hashPassword)

    return user
}

module.exports = {
    createUser,
}