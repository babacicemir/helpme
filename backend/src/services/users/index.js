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

const sendOffer = async(userId, jobId, offerData) => {
    const user = await usersRepository.getUserById(userId)
    if(!user){
        const error = new Error('User not found')
        error.statusCode = 404
        throw error
    }
    const job = await usersRepository.getJobById(jobId)
    if(!job){
        const error = new Error('Job not found')
        error.statusCode = 404
        throw error
    }

    const data = {
        jobId,
        userId,
        price: offerData.price,
        deliveryDays: offerData.delivery_days,
        message: offerData.message
    }

    const offer = await usersRepository.sendOffer(data)
    return offer
}

const getUserOffers = async(id) => {
    const user = await usersRepository.getUserById(id)
    if (!user) {
        const error = new Error('User not found')
        error.statusCode = 404
        throw error
    }
    const offers = await usersRepository.getMyOffers(id)
    return offers
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

const updateMessage = async (messageId, userId, message) => {
    const updatedMessage = await usersRepository.updateMessage(messageId, userId, message)
     if (!updatedMessage) {
        const error = new Error('Message not found or you are not the owner')
        error.statusCode = 404
        throw error
    }
    return updatedMessage
}

const deleteMessage = async (messageId, userId) => {
    const deletedMessage = await usersRepository.deleteMessage(messageId, userId)

    if (!deletedMessage) {
        const error = new Error('Message not found or you are not the owner')
        error.statusCode = 404
        throw error
    }

    return deletedMessage
}

const getMessagesByJob = async(jobId) => {
    const messages = await usersRepository.getMessagesByJob(jobId)
    return messages
}

const createReplyMessage = async(messageId, userId, message) => {
    const originalMessage = await usersRepository.getMessageById(messageId)

    if (!originalMessage) {
        const error = new Error('Message not found')
        error.statusCode = 404
        throw error
    }

    if (originalMessage.parent_message_id !== null) {
        const error = new Error('You can only reply to a main message')
        error.statusCode = 400
        throw error
    }

    const messageData = {
        jobId: originalMessage.job_id,
        senderId: userId,
        message,
        parentMessageId: originalMessage.id
    }

    const reply = await usersRepository.createReplyMessage(messageData)
    return reply
}

const addRating = async(reviewerId, revieweeId, ratingData) => {
    if(reviewerId === Number(revieweeId)){
        const error = new Error('You cannot rate yourself')
        error.statusCode = 400
        throw error
    }
    const user = await usersRepository.getUserById(revieweeId)
    if(!user){
        const error = new Error('User not found')
        error.statusCode = 404
        throw error
    }

    const reviewData = {
        reviewerId,
        revieweeId,
        rating: ratingData.rating,
        comment: ratingData.comment
    }

    const rating = await usersRepository.addReview(reviewData)

    return rating

}

const getReceivedReviews = async(id) => {
    const reviews = await usersRepository.getReceivedReviews(id)
    return reviews
}

const getGivenReviews = async(id) => {
    const reviews = await usersRepository.getGivenReviews(id)
    return reviews
}

const getLatestJobs = async () => {
    const jobs = await usersRepository.getLatestJobs()

    return jobs
}

const getAllCategories = async() => {
    const categories = await usersRepository.getAllCategories()
    return categories
}

const updateJob = async (jobId, userId, jobData) => {
    const updatedJob = await usersRepository.updateJob( jobId, userId, jobData )

    if (!updatedJob) {
        const error = new Error('Job not found')
        error.statusCode = 404
        throw error
    }

    return updatedJob
}


module.exports = {
    createJob,
    getUserJobs,
    deleteUsersJob,
    getAllOffers,
    acceptOffer,
    rejectOffer,
    deleteOffer,
    sendOffer,
    createMessage,
    updateMessage,
    deleteMessage,
    getMessagesByJob,
    createReplyMessage,
    addRating,
    getReceivedReviews,
    getGivenReviews,
    getUserOffers,
    getLatestJobs,
    getAllCategories,
    updateJob
}