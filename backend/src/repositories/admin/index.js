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

const addCategory = async(categoryData) => {
    const query = 'INSERT INTO categories(name, description) VALUES ($1, $2) RETURNING *'
    const values = [categoryData.name, categoryData.description]
    const result = await pool.query(query, values)

    return result.rows[0]
}

const findCategory = async(name) => {
    const query='SELECT * FROM categories WHERE name = $1'
    const values=[name]
    const result = await pool.query(query, values)

    return result.rows[0]
}

const deleteCategory = async(id) => {
    const query = 'DELETE FROM categories WHERE id=$1 RETURNING*'
    const values = [id]
    const result = await pool.query(query, values)
    return result.rows[0]
}

const updateCategory = async(categoryData, id) => {
    const query = 'UPDATE categories SET name = COALESCE($1, name), description=COALESCE($2, description) WHERE id=$3 RETURNING*'
    const values = [categoryData.name, categoryData.description, id]
    const result = await pool.query(query, values)
    return result.rows[0]
}

const getAllReports = async() => {
    const query = `
        SELECT
            r.id AS report_id,
            reporter.id AS reporter_id,
            reporter.username AS reporter_username,
            r.reported_user_id,
            reported_user.username AS reported_username,
            r.reported_job_id,
            j.title AS job_title,
            r.reported_service_id,
            s.title AS service_title,
            rr.id AS reason_id,
            rr.name AS reason,
            r.description,
            r.evidence_image,
            r.status,
            r.action,
            r.created_at,
            r.updated_at
        FROM reports_helpme AS r

        JOIN users_db AS reporter
            ON r.reporter_id = reporter.id

        LEFT JOIN users_db AS reported_user
            ON r.reported_user_id = reported_user.id

        LEFT JOIN jobs AS j
            ON r.reported_job_id = j.id

        LEFT JOIN services AS s
            ON r.reported_service_id = s.id

        JOIN report_reasons AS rr
            ON r.reason_id = rr.id

        ORDER BY r.created_at DESC
    `

    const result = await pool.query(query)

    return result.rows
}

const blockUser = async(userId) => {
    const query = 'UPDATE users_db SET is_blocked=TRUE WHERE id=$1 AND deleted_at IS NULL RETURNING*'
    const values = [userId]
    const result = await pool.query(query, values)
    return result.rows[0]
}

const unBlockUser = async(userId) => {
    const query = 'UPDATE users_db SET is_blocked=FALSE WHERE id=$1 AND deleted_at IS NULL RETURNING*'
    const values = [userId]
    const result = await pool.query(query, values)
    return result.rows[0]
}

const getBlockedUsers = async () => {
    const query = `
        SELECT
            b.id AS blocked_user_id,

            u.id AS user_id,
            u.username,
            u.email,
            u.first_name,
            u.last_name,

            r.id AS reason_id,
            r.name AS reason,

            b.message,
            b.blocked_at,
            b.unblocked_at

        FROM blocked_users AS b

        JOIN users_db AS u
            ON b.user_id = u.id

        JOIN report_reasons AS r
            ON b.reason_id = r.id

        ORDER BY b.blocked_at DESC
    `

    const result = await pool.query(query)

    return result.rows
}

module.exports = {
    getAllUsers, 
    deleteUser,
    getAllJobs,
    deleteJob,
    getAllServices,
    deleteService,
    addCategory,
    findCategory,
    deleteCategory,
    updateCategory,
    getAllReports,
    blockUser,
    unBlockUser,
    getBlockedUsers
}