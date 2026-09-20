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

const updateMessage = async(messageId, userId, newMessage) => {
    const query = 'UPDATE messages SET message=$1 WHERE id=$2 AND sender_id=$3 RETURNING*'
    const values = [newMessage, messageId, userId]
    const result = await pool.query(query, values)
    return result.rows[0]
}

const deleteMessage = async(messageId, userId) => {
    const query = 'DELETE FROM messages WHERE id=$1 AND sender_id=$2 RETURNING*'
    const values = [messageId, userId]
    const result = await pool.query(query, values)
    return result.rows[0]
}

const getMessagesByJob = async(jobId) => {
    const query = 'SELECT * FROM messages WHERE job_id=$1 ORDER BY id ASC'
    const values = [jobId]
    const result = await pool.query(query, values)
    return result.rows
}

const getMessageById = async(id) => {
    const query = 'SELECT * FROM MESSAGES WHERE id=$1'
    const values = [id] 
    const result = await pool.query(query, values)
    return result.rows[0]
}

const createReplyMessage = async(messageData) => {
    const query = 'INSERT INTO messages(job_id, sender_id, message, parent_message_id ) VALUES($1, $2, $3, $4) RETURNING*'
    const values = [messageData.jobId, messageData.senderId, messageData.message, messageData.parentMessageId]
    const result = await pool.query(query, values)
    return result.rows[0]
}

const addReview = async(reviewData) => {
    const query = 'INSERT INTO reviews(reviewer_id, reviewee_id, rating, comment) VALUES($1, $2, $3, $4) RETURNING*'
    const values = [reviewData.reviewerId, reviewData.revieweeId, reviewData.rating, reviewData.comment]
    const result = await pool.query(query, values)
    return result.rows[0]
}

const getReceivedReviews = async(id) => {
    const query = 'SELECT r.id, r.reviewer_id, u.username, u.first_name, u.last_name, r.rating, r.comment, r.created_at FROM reviews AS r JOIN users_db AS u ON r.reviewer_id = u.id WHERE r.reviewee_id = $1 ORDER BY r.created_at DESC'
    const values = [id]
    const result = await pool.query(query, values)
    return result.rows[0]
}

const getGivenReviews = async(id) => {
    const query = 'SELECT r.id, r.reviewer_id, u.username, u.first_name, u.last_name, r.rating, r.comment, r.created_at FROM reviews AS r JOIN users_db AS u ON r.reviewee_id = u.id WHERE r.reviewer_id = $1 ORDER BY r.created_at DESC'
    const values = [id]
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
    findJobById,
    updateMessage,
    deleteMessage,
    getMessagesByJob,
    findJobById,
    createReplyMessage,
    getMessageById,
    addReview,
    getReceivedReviews,
    getGivenReviews
}