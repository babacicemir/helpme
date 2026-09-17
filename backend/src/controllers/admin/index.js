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

module.exports = {
    getAllUsers
}