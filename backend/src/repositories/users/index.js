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
    const query = "DELETE FROM jobs WHERE user_id=$1 AND id=$2 RETURNING *"
    const values = [user_id, job_id]
    const result = await pool.query(query, values)
    return result.rows[0]
}

module.exports = { 
    findUserByUsernameEmail,
    getAllUsers,
    getUserById,
    createJob,
    getUserJobs,
    deleteUsersJob
}