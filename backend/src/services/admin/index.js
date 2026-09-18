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

const deleteJob = async(id) => {

    const deletedJob = await adminRepository.deleteJob(id)
    if(!deletedJob){
        const error = new Error('Job not found!')
        error.statusCode = 404
        
        throw error
    }
    
    return deletedJob
}

const getAllServices = async()=> {

    const services = await adminRepository.getAllServices()
    return services
}

const deleteService = async(id) => {
    const deletedService = await adminRepository.deleteService(id)
    if(!deletedService){
        const error = new Error('Service not found!')
        error.statusCode = 404
        throw error
    }
    return deletedService
}

module.exports={
    getAllUsers,
    deleteUser,
    getAllJobs,
    deleteJob,
    getAllServices,
    deleteService
}