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

module.exports = {
    createJob,
    getUserJobs
}