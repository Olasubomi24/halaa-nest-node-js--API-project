import pool from "./db";

export const beginTransaction = async () => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  return connection;
};

export const rollbackTransaction = async (connection) => {
  if (connection) {
    try {
      await connection.rollback();
    } finally {
      connection.release();
    }
  }
};

export const commitTransaction = async (connection) => {
  if (connection) {
    try {
      await connection.commit();
    } finally {
      connection.release();
    }
  }
};
