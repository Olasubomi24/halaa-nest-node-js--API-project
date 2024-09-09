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


export const addProduct = async ({
  categoryId,
  subCategoryId,
  merchantId,
  productName,
  shortProductName,
  productDescription,
  productPrice,
  productModel,
  productColor,
  productPictures, // This should be an array
  expiryDate,
  productDiscountPercentage,
  vat,
  productQuantity,
}) => {
  const connection = await pool.getConnection();

  try {
    // Validate inputs
    if (!Array.isArray(productPictures) || productPictures.length === 0) {
      throw new Error('Product pictures are required');
    }

    // Upload product pictures to Google Drive
    const uploadedFiles = await uploadToDrive(productPictures);

    // Create a JSON object for picture links
    const pictureLinks = {};
    uploadedFiles.forEach((file, index) => {
      pictureLinks[`picture${index + 1}`] = file.webViewLink;
    });

    // SQL to insert product details into the database
    const sqlInsert = `
      INSERT INTO products 
        (category_id, sub_category_id, merchant_id, product_name, short_product_name, 
         product_description, product_price, product_model, 
         product_color, product_picture, expiry_date, product_discount_percentage, vat, product_quantity, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [
      categoryId,
      subCategoryId,
      merchantId,
      productName,
      shortProductName,
      productDescription,
      productPrice,
      productModel,
      productColor,
      JSON.stringify(pictureLinks), // Store the JSON object as a string
      expiryDate || null,
      productDiscountPercentage,
      vat,
      productQuantity,
    ];

    const [insertResult] = await connection.execute(sqlInsert, values);
    const insertedId = insertResult.insertId;

    // SQL to retrieve the newly inserted product details
    const sqlSelect = `
      SELECT * FROM products WHERE product_id = ?
    `;

    const [rows] = await connection.execute(sqlSelect, [insertedId]);
    const product = rows[0];

    // Parse the JSON object back into JavaScript object
    if (product.product_picture) {
      product.product_picture = JSON.parse(product.product_picture);
    }

    return product;
  } catch (error) {
    console.error('Error in addProduct:', error);
    throw new Error('Failed to add product: ' + error.message);
  } finally {
    connection.release();
  }
};




// updateProductservice.js

export const updateProduct = async (productId, updates) => {
  const values = [];
  let sql = 'UPDATE products SET ';

  // Keep track of updated fields
  const updatedFields = [];

  // Iterate over the updates object
  for (const key in updates) {
    // Only append fields with non-null values to the SQL query
    if (updates[key] !== null) {
      sql += `${key} = ?, `;
      values.push(updates[key]);
      updatedFields.push(key); // Track updated field
    }
  }

  // Add the updated_at field if any fields were updated
  if (updatedFields.length > 0) {
    sql += 'updated_at = NOW(), ';
  }

  // Remove the trailing comma and space
  sql = sql.slice(0, -2);

  // Add the WHERE clause to specify the product_id
  sql += ' WHERE product_id = ?';
  values.push(productId);

  try {
    const [result] = await pool.execute(sql, values);
    return { affectedRows: result.affectedRows, updatedFields }; // Return affectedRows and updatedFields
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update product');
  }
};



// deleteProduct
export const deleteProduct = async (productId) => {
  const sql = 'DELETE FROM products WHERE product_id = ?';

  try {
    const [result] = await pool.execute(sql, [productId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete product');
  }
};


// productList
export const productList = async () => {
  const sql = `
    SELECT 
      p.* 
    FROM 
      products p
    JOIN 
      merchants m 
    ON 
      p.merchant_id = m.merchant_id
  `;

  try {
    const [rows] = await pool.execute(sql);

    // Safely parse the JSON object for product_picture
    rows.forEach(row => {
      if (row.product_picture) {
        row.product_picture = safeParseJSON(row.product_picture);
      } else {
        row.product_picture = {}; // Handle the case where product_picture is null or undefined
      }
    });

    return rows;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};





// ProductDetails
export const productDetailsById = async (productId) => {
  try {
    const query = `
      SELECT 
        p.*, 
        m.names AS merchantName,
        m.zippy_wallet_number AS merchantNumber
      FROM 
        products p 
      JOIN 
        merchants m 
      ON 
        p.merchant_id = m.merchant_id 
      WHERE 
        p.product_id = ?
    `;

    const [rows] = await pool.execute(query, [productId]);

    if (rows.length === 0) {
      throw new Error('Product not found in the database');
    }

    const product = rows[0];

    // Safely handle product_picture
    product.product_picture = safeParseJSON(product.product_picture);

    return product;
  } catch (error) {
    if (error.message === 'Product not found in the database') {
      throw error;
    } else {
      console.error('Error fetching product details from the database:', error);
      throw new Error('Failed to fetch product details from the database');
    }
  }
};






export const getTopProducts = async (limit = 5) => {
  try {
    const sql = `
      SELECT oi.product_id, COUNT(*) AS purchase_count
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      JOIN merchants m ON p.merchant_id = m.merchant_id
      GROUP BY oi.product_id
      ORDER BY purchase_count DESC
      LIMIT ?
    `;
    const [rows] = await pool.execute(sql, [limit]);

    // Extract relevant information from the database response
    const topProducts = rows.map(row => ({
      productId: row.product_id,
      purchaseCount: row.purchase_count
    }));

    return topProducts;
  } catch (error) {
    console.error('Error fetching top products:', error);
    throw new Error('Failed to fetch top products');
  }
};




export const reduceProductQuantity = async (productId, quantity) => {
  const connection = await pool.getConnection();

  try {
    // Start a transaction
    await connection.beginTransaction();

    // Check current quantity
    const [rows] = await connection.execute('SELECT product_quantity FROM products WHERE product_id = ?', [productId]);
    const currentQuantity = rows[0]?.product_quantity;

    if (currentQuantity === undefined) {
      throw new Error('Product not found');
    }

    if (currentQuantity < quantity) {
      throw new Error('Insufficient product quantity');
    }

    // Update the product quantity
    const newQuantity = currentQuantity - quantity;
    await connection.execute('UPDATE products SET product_quantity = ? WHERE product_id = ?', [newQuantity, productId]);

    // Commit the transaction
    await connection.commit();

    return {
      message: 'Product quantity updated successfully',
      productId,
      newQuantity,
    };
  } catch (error) {
    // Rollback the transaction in case of any error
    await connection.rollback();
    console.error('Error updating product quantity:', error);
    throw new Error('Failed to update product quantity');
  } finally {
    connection.release();
  }
};

