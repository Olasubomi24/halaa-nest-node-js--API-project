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


export const addHalalItem = async ({
  halal_id,
  halal_nest_item_name,
  }) => {
    const connection = await pool.getConnection();
  
    try {
      // Retrieve the current maximum HalalItemId
      const sqlMaxId = `
        SELECT COALESCE(MAX(halal_nest_item_id), 0) AS maxId FROM item_on_halal_nest
      `;
  
      const [maxIdResult] = await connection.execute(sqlMaxId);
      let i = maxIdResult[0].maxId; // Initialize i with the current maxId
      i++; // Increment i to get the new halal_nest_item_id
  
      // Ensure none of the values are undefined
      const values = [
        i, // Use the incremented i as the new HalalItem_id
        halal_id || null,
        halal_nest_item_name || null,
      ];
  
      // SQL to insert HalalItem details into the database
      const sqlInsert = `
        INSERT INTO item_on_halal_nest 
          ( halal_id, halal_nest_item_id,halal_nest_item_name FROM item_on_halal_nest)
        VALUES (?, ?, ?, ?)
      `;
  
      const [insertResult] = await connection.execute(sqlInsert, values);
  
      // SQL to retrieve the newly inserted HalalItem details
      const sqlSelect = `
         SELECT halal_id, halal_nest_item_id,halal_nest_item_name FROM item_on_halal_nest  WHERE halal_nest_item_id = ?
      `;
  
      const [rows] = await connection.execute(sqlSelect, [i]);
      const HalalItem = rows[0];
  
      return HalalItem;
    } catch (error) {
      console.error('Error in addHalalItem:', error);
      throw new Error('Failed to add HalalItem: ' + error.message);
    } finally {
      connection.release();
    }
  };






// updateProductservice.js

export const updateHalalItem = async (HalalItemId, updates) => {
    const values = [];
    let sql = 'UPDATE HalalItems SET ';
  
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
  

  
    // Remove the trailing comma and space
    sql = sql.slice(0, -2);
  
    // Add the WHERE clause to specify the HalalItem_id
    sql += ' WHERE halal_nest_item_id = ?';
    values.push(HalalItemId);
  
    try {
      const [result] = await pool.execute(sql, values);
      return { affectedRows: result.affectedRows, updatedFields }; // Return affectedRows and updatedFields
    } catch (error) {
      console.error('Error in updateHalalItem:', error);
      throw new Error('Failed to update HalalItem');
    }
  };
  




// deleteProduct
export const deleteHalalItem = async (HalalItemId) => {
    const sql = 'DELETE FROM item_on_halal_nest WHERE halal_nest_item_id = ?';
  
    try {
      const [result] = await pool.execute(sql, [HalalItemId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in deleteHalalItem:', error);
      throw new Error('Failed to delete HalalItem');
    }
  };
  
  


// productList
export const halalItemList = async () => {
    const sql = `
       SELECT halal_id, halal_nest_item_id,halal_nest_item_name, icon FROM item_on_halal_nest 
    `;
  
    try {
      const [rows] = await pool.execute(sql);
      return rows;
    } catch (error) {
      console.error('Error fetching HalalItems:', error);
      throw new Error('Failed to fetch HalalItems');
    }
  };
  

  export const ListOfItemOnHalanest = async () => {
    const sql = `
         SELECT halal_id , halal_name FROM halal_item
    `;
  
    try {
      const [rows] = await pool.execute(sql);
      return rows;
    } catch (error) {
      console.error('Error fetching HalalItems:', error);
      throw new Error('Failed to fetch HalalItems');
    }
  };


// ProductDetails
export const halalItemDetailsById = async (HalalItemId) => {
    const sql = `
        SELECT halal_id, halal_nest_item_id,halal_nest_item_name, icon FROM item_on_halal_nest  WHERE halal_id = ?
    `;
  
    try {
      const [rows] = await pool.execute(sql, [HalalItemId]);
 
      if (rows.length === 0) {
        throw new Error('HalalItem not found in the database');
      }
  
      return rows; // Return the HalalItem details
    } catch (error) {
      if (error.message === 'HalalItem not found in the database') {
        throw error;
      } else {
        console.error('Error fetching HalalItem details from the database:', error);
        throw new Error('Failed to fetch HalalItem details from the database');
      }
    }
  };
  


