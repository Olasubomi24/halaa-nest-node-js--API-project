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


export const addEndosment = async ({
    school_id,
    name,
    story,
  }) => {
    const connection = await pool.getConnection();
  
    try {
      // Retrieve the current maximum endosmentId
      const sqlMaxId = `
        SELECT COALESCE(MAX(endosment_id), 0) AS maxId FROM endosments
      `;
  
      const [maxIdResult] = await connection.execute(sqlMaxId);
      let i = maxIdResult[0].maxId; // Initialize i with the current maxId
      i++; // Increment i to get the new Endosment ID
  
      // Ensure none of the values are undefined
      const values = [
        i, // Use the incremented i as the new endosment_id
        school_id || null,
        name || null,
        story || null,
      ];
  
      // SQL to insert Endosment details into the database
      const sqlInsert = `
        INSERT INTO endosments 
          (endosment_id, school_id, name, story, insert_dt)
        VALUES (?, ?, ?, ?, NOW())
      `;
  
      const [insertResult] = await connection.execute(sqlInsert, values);
  
      // SQL to retrieve the newly inserted Endosment details
      const sqlSelect = `
        SELECT endosment_id, school_id, name, story, insert_dt FROM endosments WHERE endosment_id = ?
      `;
  
      const [rows] = await connection.execute(sqlSelect, [i]);
      const Endosment = rows[0];
  
      return Endosment;
    } catch (error) {
      console.error('Error in addEndosment:', error);
      throw new Error('Failed to add Endosment: ' + error.message);
    } finally {
      connection.release();
    }
  };






// updateProductservice.js

export const updateEndosment = async (endosmentId, updates) => {
    const values = [];
    let sql = 'UPDATE endosments SET ';
  
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
  
    // Add the WHERE clause to specify the endosment_id
    sql += ' WHERE endosment_id = ?';
    values.push(endosmentId);
  
    try {
      const [result] = await pool.execute(sql, values);
      return { affectedRows: result.affectedRows, updatedFields }; // Return affectedRows and updatedFields
    } catch (error) {
      console.error('Error in updateEndosment:', error);
      throw new Error('Failed to update Endosment');
    }
  };
  




// deleteProduct
export const deleteEndosment = async (endosmentId) => {
    const sql = 'DELETE FROM endosments WHERE endosment_id = ?';
  
    try {
      const [result] = await pool.execute(sql, [endosmentId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in deleteEndosment:', error);
      throw new Error('Failed to delete Endosment');
    }
  };
  
  


// productList
export const endosmentList = async () => {
    const sql = `
      SELECT endosment_id, school_id, name, story, insert_dt
      FROM endosments
    `;
  
    try {
      const [rows] = await pool.execute(sql);
      return rows;
    } catch (error) {
      console.error('Error fetching endosments:', error);
      throw new Error('Failed to fetch endosments');
    }
  };
  





// ProductDetails
export const endosmentDetailsById = async (schoolId) => {
    const sql = `
      SELECT endosment_id, school_id, name, story, insert_dt 
      FROM endosments 
      WHERE school_id = ?
    `;
  
    try {
      const [rows] = await pool.execute(sql, [schoolId]);
  
      if (rows.length === 0) {
        throw new Error('Endosment not found in the database');
      }
  
      return rows[0]; // Return the Endosment details
    } catch (error) {
      if (error.message === 'Endosment not found in the database') {
        throw error;
      } else {
        console.error('Error fetching Endosment details from the database:', error);
        throw new Error('Failed to fetch Endosment details from the database');
      }
    }
  };
  


