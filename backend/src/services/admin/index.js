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

const addCategory = async(categoryData) => {

    const existingCategory = await adminRepository.findCategory(categoryData.name)
    if(existingCategory){
        const error = new Error('Category already exists')
        error.statusCode = 409
        throw error
    }
    const addedCategory = await adminRepository.addCategory(categoryData)
    return addedCategory
}

const deleteCategory = async(id) => {
    const deletedCategory = await adminRepository.deleteCategory(id)
    if(!deletedCategory){
        const error = new Error('Category not found!')
        error.statusCode = 404
        throw error
    }
    return deletedCategory
}

const updateCategory = async (id, categoryData) => {
    const existingCategory = await adminRepository.findCategory(categoryData.name)

    if (existingCategory && existingCategory.id !== Number(id)) {
        const error = new Error('Category already exists')
        error.statusCode = 409

        throw error
    }

    const updatedCategory = await adminRepository.updateCategory(categoryData, id)

    if (!updatedCategory) {
        const error = new Error('Category not found!')
        error.statusCode = 404

        throw error
    }

    return updatedCategory
}

const getAllReports = async() => {
    
    const reports = await adminRepository.getAllReports()
    return reports

}

const blockUser = async(userId) => {
    const user = await adminRepository.blockUser(userId)
    if(!user){
        const error = new Error('User not found!')
        error.statusCode = 404
        throw error
    }
    return user
}


const unBlockUser = async(userId) => {
    const user = await adminRepository.unBlockUser(userId)
    if(!user){
        const error = new Error('User not found!')
        error.statusCode = 404
        throw error
    }
    return user
}

const getBlockedUsers = async () => {
    const blockedUsers = await adminRepository.getBlockedUsers()

    return blockedUsers
}

module.exports={
    getAllUsers,
    deleteUser,
    getAllJobs,
    deleteJob,
    getAllServices,
    deleteService,
    addCategory,
    deleteCategory,
    updateCategory,
    getAllReports,
    blockUser ,
    unBlockUser,
    getBlockedUsers
}