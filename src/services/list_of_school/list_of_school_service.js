// addproduct Service
import pool from "../../utils/db.js";
import path from 'path';
import fs from 'fs';
import uploadToDrive from "../../utils/upload_to_drive.js";


const safeParseJSON = (data) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    // console.error('Safe parse error:', error);
    return {}; // Return an empty object or a default value if parsing fails
  }
};


// export const addListOfSchool = async ({
//   school_name,
//   halal_id,
//   halal_nest_item_id,
//   location,
//   min_tutorial_fee,
//   max_tutorial_fee,
//   living_facility,
//   video_url,
//   image_1,// This should be an array
//   image_2   // This should be an array
// }) => {
//   const connection = await pool.getConnection();

//   try {
//       // Generate school_id based on the current date and time in 'YmdHis' format
//       const school_id = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
//          // Validate inputs
//     // if (!Array.isArray(image_1) || image_1.length === 0) {
//     //   throw new Error('Product pictures are required');
//     // }
//     //     // Validate inputs
//     //     if (!Array.isArray(image_2) || image_2.length === 0) {
//     //       throw new Error('Product pictures are required');
//     //     }

//         // Upload product pictures to Google Drive
//         const image = await uploadToDrive(image_1);

//         // Create a JSON object for picture links
//         const imageLinks = {};
//         imageLinks.forEach((file, index) => {
//           pictureLinks[`picture${index + 1}`] = file.webViewLink;
//         });
    
//             // Upload product pictures to Google Drive
//     const uploadedFiles = await uploadToDrive(image_2);

//     // Create a JSON object for picture links
//     const pictureLinks = {};
//     uploadedFiles.forEach((file, index) => {
//       pictureLinks[`picture${index + 1}`] = file.webViewLink;
//     });

//       // Ensure none of the values are undefined
//       const values = [
//           halal_id || null,
//           school_id,
//           halal_nest_item_id || null,
//           school_name || null,
//           location || null,
//           min_tutorial_fee || null,
//           max_tutorial_fee || null,
//           living_facility || null,
//           video_url || null,
//           image_1,// This should be an array
//           image_2 
//       ];

//       // SQL to insert school details into the database
//       const sqlInsert = `
//         INSERT INTO schools 
//           (        SELECT id, halal_id, school_id, halal_nest_item_id, school_name, location, min_tutorial_fee, max_tutorial_fee, living_facility,image_1,image_2,video_url, time_in )
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
//       `;

//       const [insertResult] = await connection.execute(sqlInsert, values);

//       // SQL to retrieve the newly inserted school details
//       const sqlSelect = `
//         SELECT id, halal_id, school_id, halal_nest_item_id, school_name, location, min_tutorial_fee, max_tutorial_fee, living_facility,image_1,image_2,video_url, time_in 
//         FROM schools 
//         WHERE school_id = ?
//       `;

//       const [rows] = await connection.execute(sqlSelect, [school_id]);
//       const school = rows[0];

//       return school;
//   } catch (error) {
//       console.error('Error in addListOfSchool:', error);
//       throw new Error('Failed to add school: ' + error.message);
//   } finally {
//       connection.release();
//   }
// };






// updateProductservice.js

export const addListOfSchool = async ({
  school_name,
  halal_id,
  halal_nest_item_id,
  location,
  min_tutorial_fee,
  max_tutorial_fee,
  living_facility,
  video_url,
  image_1, // This should be an array of file paths
  image_2  // This should be an array of file paths
}) => {
  const connection = await pool.getConnection();

  try {
    // Generate school_id based on the current date and time in 'YmdHis' format
    const school_id = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);

    // Upload image_1 to Google Drive
    const uploadedImage1 = await uploadToDrive(image_1);
    const image1Links = uploadedImage1.map(file => file.webViewLink);

    // Upload image_2 to Google Drive
    const uploadedImage2 = await uploadToDrive(image_2);
    const image2Links = uploadedImage2.map(file => file.webViewLink);

    // Delete local files after successful upload
    image_1.forEach(filePath => fs.unlink(filePath, err => {
      if (err) console.error(`Failed to delete ${filePath}:`, err);
    }));
    image_2.forEach(filePath => fs.unlink(filePath, err => {
      if (err) console.error(`Failed to delete ${filePath}:`, err);
    }));

    // Ensure none of the values are undefined
    const values = [
      halal_id || null,
      school_id,
      halal_nest_item_id || null,
      school_name || null,
      location || null,
      min_tutorial_fee || null,
      max_tutorial_fee || null,
      living_facility || null,
      video_url || null,
      JSON.stringify(image1Links), // Store image_1 links as a JSON array
      JSON.stringify(image2Links)  // Store image_2 links as a JSON array
    ];

    // SQL to insert school details into the database
    const sqlInsert = `
      INSERT INTO schools 
        (halal_id, school_id, halal_nest_item_id, school_name, location, min_tutorial_fee, max_tutorial_fee, living_facility, video_url, image_1, image_2, time_in)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const [insertResult] = await connection.execute(sqlInsert, values);

    // SQL to retrieve the newly inserted school details
    const sqlSelect = `
     SELECT  halal_id, school_id, halal_nest_item_id, school_name, location, min_tutorial_fee, max_tutorial_fee, living_facility, video_url, image_1, image_2, time_in 
      FROM schools 
      WHERE school_id = ?
    `;

    const [rows] = await connection.execute(sqlSelect, [school_id]);
    const school = rows[0];

    return school;
  } catch (error) {
    console.error('Error in addListOfSchool:', error);
    throw new Error('Failed to add school: ' + error.message);
  } finally {
    connection.release();
  }
};

export const updateListOfSchool = async (schoolId, updates) => {
  const values = [];
  let sql = 'UPDATE schools SET ';

  // Keep track of updated fields
  const updatedFields = [];
  const restrictedFields = [];

  // Iterate over the updates object
  for (const key in updates) {
    // Check if the update attempts to modify halal_id or halal_nest_item_id
    if (key === 'halal_id' || key === 'halal_nest_item_id') {
      restrictedFields.push(key);
      continue;
    }

    if (updates[key] !== null && updates[key] !== undefined) {
      // Handle array of file paths by joining with commas
      const value = Array.isArray(updates[key]) ? updates[key].join(',') : updates[key];
      sql += `${key} = ?, `;
      values.push(value);
      updatedFields.push(key); // Track updated field
    }
  }

  // If no fields to update, throw an error
  if (updatedFields.length === 0) {
    throw new Error('No fields to update.');
  }

  // If any restricted fields were attempted to be updated, throw an error
  if (restrictedFields.length > 0) {
    throw new Error(`You cannot update ${restrictedFields.join(', ')}.`);
  }

  // Remove the trailing comma and space
  sql = sql.slice(0, -2);

  // Add the WHERE clause to specify the school_id
  sql += ' WHERE school_id = ?';
  values.push(schoolId);

  try {
    console.log('Executing SQL:', sql); // Log SQL query
    console.log('With values:', values); // Log values

    // Execute the query
    const [result] = await pool.execute(sql, values);

    // Return affected rows and updated fields
    return { affectedRows: result.affectedRows, updatedFields };
  } catch (error) {
    console.error('Error in updateListOfSchool:', error);
    throw new Error('Failed to update list of school: ' + error.message);
  }
};





  




// deleteProduct
export const deleteListOfSchool = async (schoolId) => {
    const sql = 'DELETE FROM schools WHERE school_id = ?';
  
    try {
      const [result] = await pool.execute(sql, [schoolId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in deleteSchoolList:', error);
      throw new Error('Failed to delete school');
    }
  };
  
  


// productList
export const schoolList = async () => {
    const sql = `
           SELECT  school_id,school_name FROM schools
    `;
  
    try {
      const [rows] = await pool.execute(sql);
      return rows;
    } catch (error) {
      console.error('Error fetching quotes:', error);
      throw new Error('Failed to fetch quotes');
    }
  };
  

// productList

  export const schoolDetails = async () => {
    const sql = `
                 SELECT id, halal_id, school_id, halal_nest_item_id, school_name, location, min_tutorial_fee, max_tutorial_fee, living_facility,image_1,image_2,video_url, time_in  FROM schools
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
export const schoolListById = async (schoolId) => {
    const sql = `
        SELECT id, halal_id, school_id, halal_nest_item_id, school_name, location, min_tutorial_fee, max_tutorial_fee, living_facility,image_1,image_2,video_url, time_in FROM schools  WHERE school_id = ?
    `;
  
    try {
      const [rows] = await pool.execute(sql, [schoolId]);
  
      if (rows.length === 0) {
        throw new Error('School list not found in the database');
      }
  
      return rows[0]; // Return the quote details
    } catch (error) {
      if (error.message === 'School list not found in the database') {
        throw error;
      } else {
        console.error('Error fetching School list from the database:', error);
        throw new Error('Failed to fetch quote details from the database');
      }
    }
  };
  


