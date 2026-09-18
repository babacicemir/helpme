const adminService = require('../../services/admin')

const getAllUsers = async (req, res, next) => {
    try {
        const users = await adminService.getAllUsers()

        return res.status(200).json({
            success: true,
            data: users,
        })
    } catch (error) {
        next(error)
    }
}

const deleteUser = async(req, res, next) => {
    try{
        const id = req.params.id
        const user = await adminService.deleteUser(id)
        
        return res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: user,
        })

    }catch(error){
        next(error)
    }
}

const getAllJobs = async(req, res, next) => {
    try{
        const jobs = await adminService.getAllJobs()
        return res.status(200).json({
            success: true,
            data: jobs
        })

    }catch(error){
        next(error)
    }
}

const deleteJob = async(req, res, next) => {
    try{
        const id = req.params.id 
        const deletedJob = await adminService.deleteJob(id)
        return res.status(200).json({
            success: true,
            message: 'Job deleted successfully',
            data: deletedJob,
        })

    }catch(error){
        next(error)
    }
}

const getAllServices = async(req, res, next) => {
    try{
        const services = await adminService.getAllServices()
        return res.status(200).json({
            success: true,
            data: services
        })
    }
    catch(error){
        next(error)
    }
}

const deleteService = async(req, res, next) => {
    try{
        const id = req.params.id
        const deletedService = await adminService.deleteService(id)
        return res.status(200).json({
            success: true,
            message: 'Service deleted successfully',
            data: deletedService,
        })
    }
    catch(error) {
        next(error)
    }
}



module.exports = {
    getAllUsers,
    deleteUser,
    getAllJobs,
    deleteJob,
    getAllServices,
    deleteService
}