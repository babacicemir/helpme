const usersRepository = require('../../repositories/users')

const createJob = async(user_id, jobData) => {
    
    const createdJob = await usersRepository.createJob(user_id, jobData)
    if(!createdJob){
        const error = new Error('Error during creating a job!')
        error.statusCode = 400
        throw error
    }
    
    return createdJob
}

const getUserJobs = async(user_id) => {

    const jobs = await usersRepository.getUserJobs(user_id)

    return jobs
}

const deleteUsersJob = async(user_id, job_id) => {
    const job = await usersRepository.deleteUsersJob(user_id, job_id)
    if(!job){
        const error = new Error('Job not found')
        error.statusCode = 404
        throw error
    }
    return job
}

const getAllOffers = async(user_id, job_id) => {
    const offers = await usersRepository.getOffersByJob(job_id, user_id)
    return offers
}

const acceptOffer = async(userId, offerId) => {
    const acceptedOffer = await usersRepository.acceptOffer(offerId, userId)
    if(!acceptedOffer){
        const error = new Error('Offer not found or cannot be accepted!')
        error.statusCode = 404
        throw error
    }
    return acceptedOffer
}

const rejectOffer = async(userId, offerId) => {
    const rejectedOffer = await usersRepository.rejectOffer(offerId, userId)
    if(!rejectedOffer){
        const error = new Error('Offer not found or cannot be rejected!')
        error.statusCode = 404
        throw error
    }
    return rejectedOffer
}

const deleteOffer = async(offerId, userId) => {
    const deletedOffer = await usersRepository.deleteOffer(offerId, userId)
    if(!deletedOffer){
        const error = new Error('Offer not found or cannot be deleted')
        error.statusCode = 404
        throw error
    }
    return deletedOffer
}

const createMessage = async(jobId, senderId, message) => {
    const job = await usersRepository.findJobById(jobId)
    if (!job) {
        const error = new Error('Job not found')
        error.statusCode = 404
        throw error
    }

    const messageData = {
        jobId,
        senderId,
        message
    }

    const sendMessage = await usersRepository.createMessage(messageData)
    return sendMessage
}




module.exports = {
    createJob,
    getUserJobs,
    deleteUsersJob,
    getAllOffers,
    acceptOffer,
    rejectOffer,
    deleteOffer,
    createMessage
}