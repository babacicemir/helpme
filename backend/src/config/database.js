const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

const createDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    client.release();
    console.log("Database connection OK");
  } catch (err) {
    console.error("Database connection error:", err.message);
    throw err;
  }
};

module.exports = {
  pool,
  createDatabaseConnection,
};