// addproduct Service
import pool from "../../utils/db.js";
import path from 'path';
import uploadToDrive from "../../utils/upload_to_drive.js";


const safeParseJSON = (data) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    // console.error('Safe parse error:', error);
    return {}; // Return an empty object or a default value if parsing fails
  }
};


export const addQuote = async ({
    quote_header,
    quote_title,
    quote_content,
  }) => {
    const connection = await pool.getConnection();
  
    try {
      // Retrieve the current maximum quoteId
      const sqlMaxId = `
        SELECT COALESCE(MAX(quote_id), 0) AS maxId FROM quotes
      `;
  
      const [maxIdResult] = await connection.execute(sqlMaxId);
      let i = maxIdResult[0].maxId; // Initialize i with the current maxId
      i++; // Increment i to get the new quote ID
  
      // Ensure none of the values are undefined
      const values = [
        i, // Use the incremented i as the new quote_id
        quote_header || null,
        quote_title || null,
        quote_content || null,
      ];
  
      // SQL to insert quote details into the database
      const sqlInsert = `
        INSERT INTO quotes 
          (quote_id, quote_header, quote_title, quote_content, insert_dt)
        VALUES (?, ?, ?, ?, NOW())
      `;
  
      const [insertResult] = await connection.execute(sqlInsert, values);
  
      // SQL to retrieve the newly inserted quote details
      const sqlSelect = `
        SELECT quote_id, quote_header, quote_title, quote_content, insert_dt FROM quotes WHERE quote_id = ?
      `;
  
      const [rows] = await connection.execute(sqlSelect, [i]);
      const quote = rows[0];
  
      return quote;
    } catch (error) {
      console.error('Error in addQuote:', error);
      throw new Error('Failed to add quote: ' + error.message);
    } finally {
      connection.release();
    }
  };






// updateProductservice.js

export const updateQuote = async (quoteId, updates) => {
    const values = [];
    let sql = 'UPDATE quotes SET ';
  
    // Keep track of updated fields
    const updatedFields = [];
  
    console.log('Received updates:', updates);
  
    // Iterate over the updates object
    for (const key in updates) {
      if (updates[key] !== null && updates[key] !== undefined) {
        sql += `${key} = ?, `;
        values.push(updates[key]);
        updatedFields.push(key); // Track updated field
      }
    }
  
    // Add the insert_dt field if any fields were updated
    if (updatedFields.length > 0) {
      sql += 'insert_dt = NOW(), ';
    }
  
    // Remove the trailing comma and space
    sql = sql.slice(0, -2);
  
    // Add the WHERE clause to specify the quote_id
    sql += ' WHERE quote_id = ?';
    values.push(quoteId);
  
    try {
      const [result] = await pool.execute(sql, values);
      return { affectedRows: result.affectedRows, updatedFields }; // Return affectedRows and updatedFields
    } catch (error) {
      console.error('Error in updateQuote:', error);
      throw new Error('Failed to update quote');
    }
  };
  




// deleteProduct
export const deleteQuote = async (quoteId) => {
    const sql = 'DELETE FROM quotes WHERE quote_id = ?';
  
    try {
      const [result] = await pool.execute(sql, [quoteId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in deleteQuote:', error);
      throw new Error('Failed to delete quote');
    }
  };
  
  


// productList
export const quoteList = async () => {
    const sql = `
      SELECT quote_id, quote_header, quote_title, quote_content, insert_dt 
      FROM quotes
    `;
  
    try {
      const [rows] = await pool.execute(sql);
      return rows;
    } catch (error) {
      console.error('Error fetching quotes:', error);
      throw new Error('Failed to fetch quotes');
    }
  };
  





// ProductDetails
export const quoteDetailsById = async () => {
    const sql = `
     SELECT quote_id, quote_header, quote_title, quote_content, insert_dt
     FROM quotes ORDER BY RAND(DATE(NOW()) + 0) LIMIT 1
    `;
  
    try {
      const [rows] = await pool.execute(sql);
  
      if (rows.length === 0) {
        throw new Error('quote not found in the database');
      }
  
      return rows[0]; // Return the quote details
    } catch (error) {
      if (error.message === 'quote not found in the database') {
        throw error;
      } else {
        console.error('Error fetching quote details from the database:', error);
        throw new Error('Failed to fetch quote details from the database');
      }
    }
  };
  


