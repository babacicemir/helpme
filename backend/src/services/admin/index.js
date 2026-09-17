const adminRepository = require('../../repositories/admin')

const getAllUsers = async() => {
    
    const users = await adminRepository.getAllUsers()
    
    return users

}

const deleteUser = async(id) => {
    const user = await adminRepository.deleteUser(id)
    
    if (!user) {
        const error = new Error('User not found or already deleted')
        error.statusCode = 404

        throw error
    }

    return user
}

const getAllJobs = async() => {

    const jobs = adminRepository.getAllJobs()
    return jobs

}

module.exports={
    getAllUsers,
    deleteUser,
    getAllJobs
}