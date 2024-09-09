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


export const addvideo = async ({
  video_description,
  video_title,
  video_url,
}) => {
  const connection = await pool.getConnection();

  try {
    // Retrieve the current maximum videoId
    const sqlMaxId = `
      SELECT COALESCE(MAX(video_id), 0) AS maxId FROM videos
    `;

    const [maxIdResult] = await connection.execute(sqlMaxId);
    let i = maxIdResult[0].maxId; // Initialize i with the current maxId
    i++; // Increment i to get the new video ID

    // SQL to insert video details into the database
    const sqlInsert = `
      INSERT INTO videos 
        (video_id,   video_description, video_title, video_url, time_in)
      VALUES (?, ?, ?, ?, NOW())
    `;

    const values = [
      i, // Use the incremented i as the new video_id
      video_description,
      video_title,
      video_url,
    ];

    const [insertResult] = await connection.execute(sqlInsert, values);

    // SQL to retrieve the newly inserted video details
    const sqlSelect = `
      SELECT video_id,   video_description, video_title, video_url, time_in FROM videos WHERE video_id = ?
    `;

    const [rows] = await connection.execute(sqlSelect, [i]);
    const video = rows[0];

    return video;
  } catch (error) {
    console.error('Error in addvideo:', error);
    throw new Error('Failed to add video: ' + error.message);
  } finally {
    connection.release();
  }
};






// updateProductservice.js

export const updateVideo = async (videoId, updates) => {
  const values = [];
  let sql = 'UPDATE videos SET ';

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

  // Add the updated_at field if any fields were updated
  if (updatedFields.length > 0) {
    sql += 'time_in = NOW(), ';
  }

  // Remove the trailing comma and space
  sql = sql.slice(0, -2);

  // Add the WHERE clause to specify the product_id
  sql += ' WHERE video_id = ?';
  values.push(videoId);

  try {
    const [result] = await pool.execute(sql, values);
    return { affectedRows: result.affectedRows, updatedFields }; // Return affectedRows and updatedFields
  } catch (error) {
    console.error('Error in updateVideo:', error);
    throw new Error('Failed to update video');
  }
};




// deleteProduct
export const deleteVideo = async (videoId) => {
  const sql = 'DELETE FROM videos WHERE video_id = ?';

  try {
    const [result] = await pool.execute(sql, [videoId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete video');
  }
};


// productList
export const videoList = async () => {
  const sql = `SELECT video_id, video_description, video_title, video_url, time_in FROM videos `;

  try {
    const [rows] = await pool.execute(sql);
    return rows;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw new Error('Failed to fetch videos');
  }
};





// ProductDetails
export const videoDetailsById = async (videoId) => {
  try {
    const query = `
     SELECT video_id, video_description, video_title, video_url, time_in FROM videos WHERE video_id = ?
    `;

    const [rows] = await pool.execute(query, [videoId]);

    if (rows.length === 0) {
      throw new Error('Video not found in the database');
    }

    const video = rows[0];
    return video;
  } catch (error) {
    if (error.message === 'Video not found in the database') {
      throw error;
    } else {
      console.error('Error fetching video details from the database:', error);
      throw new Error('Failed to fetch video details from the database');
    }
  }
};


