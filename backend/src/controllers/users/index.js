const accountService = require('../../services/index')

const createUser = async (req, res) => {
    try {
        const userData = req.body

        const user = await accountService.createUser(userData)

        return res.status(201).json({
            success: true,
            message: 'User is successfully created!',
            data: user
        })

    } catch (error) {
        console.error(error)

        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    createUser
}
