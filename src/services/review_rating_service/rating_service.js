// SumitRating

import pool from "../../utils/db.js";

export const submitRating = async ({merchantId, productId, userId, rating}) => {
  const sql = `
    INSERT INTO ratings (merchant_id, product_id, user_id, rating, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  const values = [merchantId,productId, userId, rating];

  try {
    const [result] = await pool.execute(sql, values);
    return result.insertId;
  } catch (error) {

    console.error('Error submitting rating:', error);
    throw new Error('Failed to submit rating');
  }
};


// AverageRating

export const fetchAverageRating = async (productId) => {
  const sql = 'SELECT AVG(rating) AS average_rating FROM ratings WHERE product_id = ?';

  try {
    const [rows] = await pool.execute(sql, [productId]);
    return { averageRating: rows[0].average_rating || 0 }; 
  } catch (error) {
    console.error('Error fetching average rating:', error);
    throw new Error('Failed to fetch average rating');
  }
};




