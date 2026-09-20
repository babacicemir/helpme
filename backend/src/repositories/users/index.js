const { pool } = require("../../config/database")

const findUserByUsernameEmail = async (username, email) => {
    const query = 'SELECT * FROM users_db WHERE email=$1 OR username=$2'
    const values = [email, username]
    const result = await pool.query(query, values)
    
    return result.rows[0]
}

const getAllUsers = async() => {
    const query = 'SELECT * FROM users_db'
    const result = await pool.query(query)
    return result.rows
}

const getUserById = async(id) => {
    const query = 'SELECT * FROM users_db WHERE id=$1'
    const values = [id]
    const result = await pool.query(query, values)
    return result.rows[0]
}

const createJob = async(user_id, jobData) => {
    const query = 'INSERT INTO jobs(user_id, category_id, title, description, budget, deadline, location) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING*'
    const values = [user_id, jobData.categoryId, jobData.title, jobData.description, jobData.budget, jobData.deadline, jobData.location]
    const result = await pool.query(query, values)
    return result.rows[0]
}

const getUserJobs = async(user_id) => {
    const query = 'SELECT * FROM jobs WHERE user_id=$1'
    const values = [user_id]
    const result = await pool.query(query, values)
    return result.rows[0]
}

const deleteUsersJob = async(user_id, job_id) => {
    const query = 'DELETE FROM jobs WHERE user_id=$1 AND id=$2 RETURNING *'
    const values = [user_id, job_id]
    const result = await pool.query(query, values)
    return result.rows[0]
}

const getOffersByJob = async(job_id, user_id) => {
    const query =  `
        SELECT
            o.id,
            o.job_id,
            o.user_id,
            u.username,
            u.first_name,
            u.last_name,
            o.price,
            o.delivery_days,
            o.message,
            o.status,
            o.created_at,
            o.updated_at
        FROM offers AS o

        JOIN users_db AS u
            ON o.user_id = u.id

        JOIN jobs AS j
            ON o.job_id = j.id

        WHERE o.job_id = $1
        AND j.user_id = $2

        ORDER BY o.created_at DESC
    `
    const values = [job_id, user_id]
    const result = await pool.query(query, values)
    return result.rows
}

const acceptOffer = async(offerId, userId) => {
    const query =  `
        UPDATE offers AS o
        SET
            status = 'ACCEPTED',
            updated_at = CURRENT_TIMESTAMP
        FROM jobs AS j
        WHERE o.id = $1
        AND o.job_id = j.id
        AND j.user_id = $2
        AND o.status = 'PENDING'
        RETURNING *
    `
    const values = [offerId, userId]
    const result = await pool.query(query, values)
    return result.rows[0]
}

const rejectOffer = async(offerId, userId) => {
    const query =  `
        UPDATE offers AS o
        SET
            status = 'REJECTED',
            updated_at = CURRENT_TIMESTAMP
        FROM jobs AS j
        WHERE o.id = $1
        AND o.job_id = j.id
        AND j.user_id = $2
        AND o.status = 'PENDING'
        RETURNING *
    `
    const values = [offerId, userId]
    const result = await pool.query(query, values)
    return result.rows[0]
}

const deleteOffer = async(offerId, userId) => {
    const query = 'DELETE FROM offers WHERE id=$1 AND user_id=$2 AND status=$3 RETURNING *'
    values = [offerId, userId, 'PENDING']
    const result = await pool.query(query, values)
    return result.rows[0]
}

const createMessage = async(messageData) => {
    const query = 'INSERT INTO messages(job_id, sender_id, message) VALUES($1, $2, $3) RETURNING*'
    const values = [messageData.jobId, messageData.senderId, messageData.message]
    const result = await pool.query(query, values)
    return result.rows[0]
}

const findJobById = async (jobId) => {
    const query = "SELECT id, user_id, title FROM jobs WHERE id = $1"
    const values = [jobId]

    const result = await pool.query(query, values)

    return result.rows[0]
}

module.exports = { 
    findUserByUsernameEmail,
    getAllUsers,
    getUserById,
    createJob,
    getUserJobs,
    deleteUsersJob,
    getOffersByJob,
    acceptOffer,
    rejectOffer,
    deleteOffer,
    createMessage,
    findJobById
}