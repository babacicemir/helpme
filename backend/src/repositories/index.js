const { pool } = require('../config/database')
const createUser = async(userData, hashedPassword) => {
    const query = 'INSERT INTO users_db(first_name, last_name, username, email, password, location, bio, profile_img) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;'
    const values = [userData.firstName, userData.lastName, userData.username, userData.email, hashedPassword, userData.location, userData.bio, userData.profileImg]
    const result = await pool.query(query, values) 
    return result.rows[0]
} 

module.exports={
    createUser
}