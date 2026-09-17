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

const login = async (req, res) => {
    try {
        const token = await accountService.login(req.body);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 2 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: 'Login successful'
        });

    } catch (error) {
        if (error.message === 'INVALID_CREDENTIALS') {
            return res.status(401).json({
                error: 'Invalid username/email or password'
            });
        }

        console.error(error);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};


module.exports = {
    createUser,
    login
}
