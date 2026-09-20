const accountService = require('../../services/index')
const userService = require('../../services/users')

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

const createJob = async(req, res, next) => {
    try{
        const jobData = {
            categoryId: req.body.categoryId,
            title: req.body.title,
            description: req.body.description,
            budget: req.body.budget,
            deadline: req.body.deadline,
            location: req.body.location
        }

        const createdJob = await userService.createJob(req.user.id, jobData)

        return res.status(201).json({
            success: true,
            message: 'Job created successfully',
            data: createdJob
        })
    }
    catch(error){
        next(error)
    }
}

const getUserJobs = async(req, res, next) => {
    try{
        const jobs = await userService.getUserJobs(req.user.id)
        return res.status(200).json({
            success: true,
            message: 'Jobs successfully retrieved',
            data: jobs
        })

    }
    catch(error){
        next(error)
    }
}

const deleteUsersJob = async(req, res, next) => {
    try{
        const jobId = req.params.id  
        const job = await userService.deleteUsersJob(req.user.id, jobId)
        return res.status(200).json({
            success: true,
            message: 'Job deleted successfully',
            data: job
        })
    }
    catch(error){
        next(error)
    }
}

const getAllOffers = async (req, res, next) => {

    try {
        const jobId = req.params.id  
        const userId = req.user.id
        const offers = await userService.getAllOffers(userId, jobId)

        return res.status(200).json({
            success: true,
            data: offers,
        })
    } catch (error) {
        next(error)
    }
}

const acceptOffer = async(req, res, next) => {
    try{
        const offerId = req.params.id 
        const userId = req.user.id 
        const accepedtOffer = await userService.acceptOffer(userId, offerId)

        return res.status(201).json({
            success: true,
            message: 'Offer successfully accepted',
            data: accepedtOffer
        })
    }
    catch(error){
        next(error)
    }
}

const rejectOffer = async(req, res, next) => {
    try{
        const offerId = req.params.id 
        const userId = req.user.id 
        const rejectedOffer = await userService.rejectOffer(userId, offerId)

        return res.status(201).json({
            success: true,
            message: 'Offer successfully rejected',
            data: rejectedOffer
        })
    }
    catch(error){
        next(error)
    }
}

const deleteOffer = async (req, res, next) => {
    try {
        const { id } = req.params
        const userId = req.user.id

        const deletedOffer = await userService.deleteOffer(id, userId)

        return res.status(200).json({
            success: true,
            message: 'Offer deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

const sendMessage = async(req, res, next) => {
    try{
        const senderId = req.user.id 
        const jobId = req.params.id
        const message = req.body.message

        const createdMessage = await userService.createMessage(jobId, senderId, message)
        return res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: createdMessage
        })
    }
    catch(error){
        next(error)
    }
}



module.exports = {
    createUser,
    login,
    createJob,
    getUserJobs,
    deleteUsersJob,
    getAllOffers,
    acceptOffer,
    rejectOffer,
    deleteOffer,
    sendMessage
}
