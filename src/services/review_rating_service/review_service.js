//SubmitReview Service.js

import pool from "../../utils/db.js";

export const submitReview = async ({ merchantId, productId, userId, rating, comment }) => {
  const sql = `
    INSERT INTO reviews (merchant_id, product_id, user_id, rating, comment, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  const values = [merchantId, productId, userId, rating, comment];

  try {
    const [result] = await pool.execute(sql, values);
    return result.insertId;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw new Error('Failed to submit review');
  }
};



// FetchReviews

export const fetchReviews = async (productId) => {
  const sql = `
    SELECT 
      r.*, 
      u.username 
    FROM 
      reviews r 
    LEFT JOIN 
      users u 
    ON 
      r.user_id = u.id 
    WHERE 
      r.product_id = ?
  `;

  try {
    const [rows] = await pool.execute(sql, [productId]);
    return rows.map(row => ({
      ...row,
      username: row.username || 'Anonymous'
    }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw new Error('Failed to fetch reviews');
  }
};






