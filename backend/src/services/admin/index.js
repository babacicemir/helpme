const adminRepository = require('../../repositories/admin')

const getAllUsers = async() => {
    
    const users = await adminRepository.getAllUsers()
    
    return users

}

module.exports={
    getAllUsers,
}