import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool to peer_tutoring database
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database: ' + (process.env.DB_NAME || 'peer_tutoring'));
    connection.release();
  } catch (error) {
    console.error('MySQL database connection failed:', error.message);
  }
};

export default pool;
