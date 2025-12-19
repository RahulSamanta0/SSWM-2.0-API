import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool;
export default function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      multipleStatements: true
    });
    pool.getConnection()
      .then(connection => {
        console.log('Database connected successfully.');
        connection.release();
      })
      .catch(err => {
        console.error('Error connecting to the database:', err);
      });
  }
  return pool;
}


