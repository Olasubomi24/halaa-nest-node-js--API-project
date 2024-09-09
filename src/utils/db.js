import { createPool } from 'mysql2/promise';

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "halail_nest",
};

const pool = createPool(dbConfig);

// Test connection on startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database');
    connection.release();  // Release the connection immediately after logging
  } catch (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  }
})();

const beginTransaction = async () => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  return connection;
};

const commitTransaction = async (connection) => {
  try {
    await connection.commit();
  } finally {
    connection.release(); // Always release the connection
  }
};

// Function to roll back a transaction
const rollbackTransaction = async (connection) => {
  try {
    await connection.rollback();
  } finally {
    connection.release(); // Always release the connection back to the pool
  }
};

export { beginTransaction, commitTransaction, rollbackTransaction, pool };
export default pool;
