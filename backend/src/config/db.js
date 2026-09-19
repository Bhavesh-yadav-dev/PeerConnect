import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// SSL configuration for cloud MySQL providers (Aiven, Railway, TiDB, etc.)
const sslConfig = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production'
  ? { rejectUnauthorized: false }
  : undefined;

// Create connection pool to peer_tutoring database
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'peer_tutoring',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000
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
