const { pool } = require("../../config/database")

const getAllUsers = async() => {
    const query = 'SELECT * FROM users_db'
    const result = await pool.query(query)
    return result.rows
}

module.exports = {
    getAllUsers
}