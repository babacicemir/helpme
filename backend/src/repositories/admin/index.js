const { pool } = require("../../config/database")

const getAllUsers = async() => {
    const query = 'SELECT * FROM users_db WHERE deleted_at IS NULL'
    const result = await pool.query(query)
    return result.rows
}

const deleteUser = async(id) => {
    const query = ' UPDATE users_db SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, username, email, deleted_at'
    const values = [id]
    const result = await pool.query(query, values)
    return result.rows[0]
}

const getAllJobs = async() => {
    const query = `
    SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.username,
        u.email,
        u.location AS user_location,
        j.id AS job_id,
        j.title,
        j.description AS job_description,
        j.budget,
        j.deadline,
        j.location AS job_location,
        j.status,
        j.created_at AS job_created_at,
        j.updated_at AS job_updated_at,
        c.id AS category_id,
        c.name AS category,
        c.description AS category_description
    FROM users_db AS u
    JOIN jobs AS j
        ON u.id = j.user_id
    JOIN categories AS c
        ON j.category_id = c.id
    WHERE u.deleted_at IS NULL
    AND j.status = 'OPEN'
    ORDER BY j.created_at DESC
`
    const result = await pool.query(query)
    return result.rows
}

const deleteJob = async(id) => {
    const query = 'DELETE FROM jobs WHERE id=$1 RETURNING *'
    const values = [id]
    const result = await pool.query(query, values)
    return result.rows[0] 
}

const getAllServices = async() => {
    const query = `
    SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.username,
        u.email,
        u.location AS user_location,

        s.id AS service_id,
        s.title,
        s.description AS service_description,
        s.price,
        s.delivery_days,
        s.status,
        s.created_at AS service_created_at,
        s.updated_at AS service_updated_at,

        c.id AS category_id,
        c.name AS category,
        c.description AS category_description

    FROM users_db AS u
    JOIN services AS s
        ON u.id = s.user_id
    JOIN categories AS c
        ON s.category_id = c.id

    WHERE u.deleted_at IS NULL

    ORDER BY s.created_at DESC
    `
    const result = await pool.query(query)
    return result.rows
}

const deleteService = async(id) => {
    const query = 'DELETE FROM services WHERE id=$1 RETURNING *'
    const values = [id]
    const result = await pool.query(query, values)
    return result.rows[0]
}

module.exports = {
    getAllUsers, 
    deleteUser,
    getAllJobs,
    deleteJob,
    getAllServices,
    deleteService
}