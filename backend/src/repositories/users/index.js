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


module.exports = { 
    findUserByUsernameEmail,
}