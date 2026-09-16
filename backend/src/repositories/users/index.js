const { pool } = require("../../config/database")

const findUser = async (username, email) => {
    const query = 'SELECT * FROM users_db WHERE email=$1 OR username$2'
    const values = [username, email]
    const result = await pool.query(query, values)
    
    return result.rows[0]
}

module.exports = { 
    findUser
}