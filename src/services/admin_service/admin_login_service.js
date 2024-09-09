// adminService.js

import pool from '../../utils/db.js';
import bcrypt from 'bcrypt';

// adminService.js

const createAdmin = async (username, email, password) => {
  try {
    // Check if the username or email already exists
    const [rows] = await pool.execute(
      'SELECT COUNT(*) AS count FROM admins WHERE username = ? OR email = ?',
      [username, email]
    );

    if (rows[0].count > 0) {
      throw new Error('Username or email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new admin into the database
    const [result] = await pool.execute(
      'INSERT INTO admins (username, email, password, user_type_id) VALUES (?, ?, ?, 1)',
      [username, email, hashedPassword]
    );

    // Get the user_type_id from the database
    const adminId = result.insertId;
    const userTypeSql = 'SELECT user_type_id FROM admins WHERE admin_id = ?';
    const [userTypeResult] = await pool.execute(userTypeSql, [adminId]);
    const user_type_id = userTypeResult[0].user_type_id;

    // Return the ID of the newly created admin and user_type_id
    return { adminId, user_type_id };

  } catch (error) {
    // Handle errors
    if (error.message === 'Username or email already exists') {
      throw error;
    }
    console.error('Error creating admin:', error);
    throw new Error('Failed to create admin');
  }
};







const authenticateAdmin = async (email, password) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM admins WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      throw new Error('Admin not found');
    }

    const admin = rows[0];
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      throw new Error('Invalid password');
    }

    return {
      id: admin.id,
      email: admin.email, // Return email instead of username
    };
  } catch (error) {
    console.error('Error authenticating admin:', error);
    throw error;
  }
};



export { createAdmin, authenticateAdmin };
