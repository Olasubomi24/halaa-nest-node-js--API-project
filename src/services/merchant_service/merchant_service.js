import axios from 'axios';
import pool from '../../utils/db.js';
import dotenv from 'dotenv';
import { zippyApi } from '../../utils/axios_utils.js';

dotenv.config();

// Function to check if the merchant already exists and return merchant_id if exists
export const checkMerchantExists = async (zippy_wallet_number) => {
  try {
    const [rows] = await pool.execute(
      'SELECT merchant_id FROM merchants WHERE zippy_wallet_number = ?',
      [zippy_wallet_number]
    );

    // If a row is found, return the merchant_id
    if (rows.length > 0) {
      return rows[0].merchant_id;
    } else {
      return null; // Merchant does not exist
    }
  } catch (error) {

    console.error('Error checking merchant existence:', error);
    throw new Error('Failed to check merchant existence');
  }
};



// Function to register a merchant
export const confirmMerchantRegistration = async ({ zippy_wallet_number, status, ...merchantDetails }) => {
  try {
    // Check if the merchant already exists in the database
    const merchantExists = await checkMerchantExists(zippy_wallet_number);

    if (merchantExists) {
      throw new Error('Merchant already has a Marketplace account');
    }

    // If status is 1, cancel without saving to the database
    if (status === 1) {
      console.log('Registration cancelled');
      return { message: 'Registration not completed' };
    }

    // Save the merchant details to the databasexx
    const registered_at = new Date();
    const sql = `
      INSERT INTO merchants
        (names, gender, email, address, bvn, zippy_wallet_number, providus_account_no, registered_at, user_type_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 2)
    `;
    const [result] = await pool.execute(sql, [
      merchantDetails.names,
      merchantDetails.gender,
      merchantDetails.email,
      merchantDetails.address,
      merchantDetails.bvn,
      zippy_wallet_number,
      merchantDetails.providus_account_no,
      registered_at,
    ]);

    const merchant_id = result.insertId;

    // Get the user_type_id from the database
    const userTypeSql = `
      SELECT user_type_id FROM merchants WHERE merchant_id = ?
    `;
    const [userTypeResult] = await pool.execute(userTypeSql, [merchant_id]);
    const user_type_id = userTypeResult[0].user_type_id;

    console.log('Merchant registered successfully');

    return {
      message: 'Registration successful',
      merchant_id,
      user_type_id,
      ...merchantDetails,
    };
  } catch (error) {
    console.error(error);

    if (error.message === 'Merchant already has a Marketplace account') {
      throw error;
    } else {
      throw new Error(`Failed to register merchant: ${error.message}`);
    }
  }
};



export const displayMerchantDetails = async ({ zippy_wallet_number }) => {
  try {
    // Make API call to get merchant details
    const zippyResponse = await zippyApi.post('', {
      customer_id: zippy_wallet_number,
    });

    if (zippyResponse.data.status_code === 0) {
      const merchantDetails = zippyResponse.data.result[0];

      return { result: [merchantDetails] };
    } else {

      if (zippyResponse.data.message === "No  Record found") {
        throw new Error('Merchant does not have a ZippyWorld account, kindly register on zippworld');
      } else {

        throw new Error('Failed to fetch merchant details from Zippyworld');
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch merchant details: ${error.message}`);
  }
};



// Function to fetch all sellers
export const fetchAllMerchants = async () => {
  try {
    const [rows] = await pool.execute('SELECT * FROM merchants');
    return rows;
  } catch (error) {
    console.error('Error fetching merchants:', error);
    throw new Error('Failed to fetch merchants');
  }
};


export const deactivateMerchant = async (merchantId) => {
  try {
    // Check the current active status of the merchant
    const [rows] = await pool.execute('SELECT active_status FROM merchants WHERE merchant_id = ?', [merchantId]);
    const currentStatus = rows[0]?.active_status; // Get the active status from the query result

    // Check if the current status is already 'deactivated'
    if (currentStatus && currentStatus.toLowerCase() === 'deactivated') {
      throw new Error('Seller has already been deactivated');
    }

    // If not already deactivated, update the status
    const sql = 'UPDATE merchants SET active_status = ? WHERE merchant_id = ?';
    const values = ['deactivated', merchantId]; 

    const [result] = await pool.execute(sql, values);

    if (result.affectedRows === 0) {
      throw new Error('Seller not found');
    }

    return {
      message: 'Seller deactivated successfully',
      merchantId,
    };
  } catch (error) {
    console.error('Error deactivating seller:', error);
    throw error; // Only throw the error once
  }
};


export const activateMerchant = async (merchantId) => {
  try {
    // Check the current active status of the merchant
    const [rows] = await pool.execute('SELECT active_status FROM merchants WHERE merchant_id = ?', [merchantId]);
    const currentStatus = rows[0]?.active_status; // Get the active status from the query result

    // Check if the current status is already 'active'
    if (currentStatus && currentStatus.toLowerCase() === 'active') {
      throw new Error('Seller is already active');
    }

    // If not already active, update the status
    const sql = 'UPDATE merchants SET active_status = ? WHERE merchant_id = ?';
    const values = ['active', merchantId]; 

    const [result] = await pool.execute(sql, values);

    if (result.affectedRows === 0) {
      throw new Error('Seller not found');
    }

    return {
      message: 'Seller activated successfully',
      merchantId,
    };
  } catch (error) {
    console.error('Error activating seller:', error);
    throw error; // Only throw the error once
  }
};


