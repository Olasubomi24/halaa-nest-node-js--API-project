// services/userService.js

import pool from "../../utils/db.js";
import bcrypt from 'bcrypt';

export const registerUser = async ({ username, phonenumber, email, password }) => {
  try {
    // Check if the email already exists
    const [existingUsers] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      throw new Error('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const insertSql = `
      INSERT INTO users (username, phonenumber, email, password, user_type_id, created_at)
      VALUES (?, ?, ?, ?, 3, NOW())
    `;
    const insertValues = [username, phonenumber, email, hashedPassword];
    const [insertResult] = await pool.execute(insertSql, insertValues);
    const userId = insertResult.insertId;

    // Fetch the user_type_id
    const selectSql = 'SELECT user_type_id FROM users WHERE id = ?';
    const [selectResult] = await pool.execute(selectSql, [userId]);
    const userTypeId = selectResult[0].user_type_id;

    return { userId, userTypeId };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};


export const signIn = async (email, password) => {
  try {
    const query = 'SELECT id,username, phonenumber, email, password FROM users WHERE email = ?';
    const [rows] = await pool.execute(query, [email]);
    if (rows.length === 0) {
      return { user: null, isValidPassword: false };
    }
    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    // Remove the password field before returning the user object
    delete user.password;
    return { user, isValidPassword };
  } catch (error) {
    throw error;
  }
};


// Add billing address
export const addBillingAddress = async (userId, address_details) => {
  try {
    const {contact_person, phonenumber,address, city, state, postal_code, country,} = address_details;

    const insertSql = `
      INSERT INTO billing_addresses (user_id,contact_person,phonenumber,address, city, state, postal_code, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const insertValues = [userId, contact_person, phonenumber, address, city, state, postal_code, country];
    const [insertResult] = await pool.execute(insertSql, insertValues);

    return { billingAddressId: insertResult.insertId };
  } catch (error) {
    console.error('Error adding billing address:', error);
    throw error;
  }
};

// Get all billing addresses for a user
export const getBillingAddresses = async (userId) => {
  try {
    const query = 'SELECT * FROM billing_addresses WHERE user_id = ?';
    const [rows] = await pool.execute(query, [userId]);

    return rows;
  } catch (error) {
    console.error('Error fetching billing addresses:', error);
    throw error;
  }
};

export const updateBillingAddress = async (billingAddressId, address_details) => {
  try {
    const { contact_person, phonenumber, address, city, state, postal_code, country } = address_details;

    const updateFields = [];
    const updateValues = [];

    // Push field names and values
    if (contact_person) {
      updateFields.push('contact_person = ?');
      updateValues.push(contact_person);
    }

    if (phonenumber) {
      updateFields.push('phonenumber = ?');
      updateValues.push(phonenumber);
    }

    if (address) {
      updateFields.push('address = ?');
      updateValues.push(address);
    }

    if (city) {
      updateFields.push('city = ?');
      updateValues.push(city);
    }

    if (state) {
      updateFields.push('state = ?');
      updateValues.push(state);
    }

    if (postal_code) {
      updateFields.push('postal_code = ?');
      updateValues.push(postal_code);
    }

    if (country) {
      updateFields.push('country = ?');
      updateValues.push(country);
    }

    // Add the billingAddressId as the last parameter
    updateValues.push(billingAddressId);

    // Construct the SQL query
    const updateSql = `
      UPDATE billing_addresses
      SET ${updateFields.join(', ')}, updated_at = NOW()
      WHERE id = ?
    `;

    // Execute the SQL query
    await pool.execute(updateSql, updateValues);

    return { success: true };
  } catch (error) {
    console.error('Error updating billing address:', error);
    throw error;
  }
};



export const deleteBillingAddress = async (billingAddressId) => {
  try {
    const deleteSql = 'DELETE FROM billing_addresses WHERE id = ?';
    await pool.execute(deleteSql, [billingAddressId]);

    return { success: true };
  } catch (error) {
    console.error('Error deleting billing address:', error);
    throw error;
  }
};
