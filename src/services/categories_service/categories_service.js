import pool from "../../utils/db.js";
import { beginTransaction,rollbackTransaction, commitTransaction } from "../../utils/db.js";


const getAllCategoriesService = async () => {
  const [rows] = await pool.execute('SELECT * FROM categories');
  return rows;
};


const getAllSubategoriesService = async () => {
  const [rows] = await pool.execute('SELECT * FROM sub_categories');
  return rows;
};


const addCategoryService = async (categoryName, description) => {
  const [result] = await pool.execute('INSERT INTO categories (category_name, description) VALUES (?, ?)', [
    categoryName,
    description,
  ]);
  return result.insertId;
};


const updateCategoryService = async (categoryId, categoryName, description) => {
  try {
    const sql = 'UPDATE categories SET category_name = ?, description = ? WHERE category_id = ?';
    const [result] = await pool.execute(sql, [categoryName, description, categoryId]);
    return { affectedRows: result.affectedRows };
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }
};


const deleteCategoryService = async (categoryId) => {
  let connection;
  try {
    
    connection = await beginTransaction();

    const [categoryRows] = await connection.execute('SELECT * FROM categories WHERE category_id = ?', [categoryId]);

    if (categoryRows.length === 0) {
      await commitTransaction(connection);
      return { message: 'Category and its subcategories have already been deleted or do not exist' };
    }

    // Delete subcategories associated with the category first
    await connection.execute('DELETE FROM sub_categories WHERE category_id = ?', [categoryId]);

    // Delete the category
    await connection.execute('DELETE FROM categories WHERE category_id = ?', [categoryId]);

    await commitTransaction(connection);

    return { message: 'Category and its subcategories deleted successfully' };
  } catch (error) {
    // Rollback the transaction in case of any error
    if (connection) {
      await rollbackTransaction(connection);
    }
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category and its subcategories');
  }
};


const getSubcategoriesByCategoryIdService = async (categoryId) => {
  const [rows] = await pool.execute('SELECT * FROM sub_categories WHERE category_id = ?', [categoryId]);
  return rows;
};


const addSubcategoryService = async ({subcategoryName, description, categoryId}) => {
  const [result] = await pool.execute(
    'INSERT INTO sub_categories (subcategory_name, description, category_id) VALUES (?, ?, ?)',
    [subcategoryName, description, categoryId]
  );
  return result.insertId;
};


const updateSubcategoryService = async ({ subcategoryName, description, subcategoryId }) => {
  try {
    const sql = 'UPDATE sub_categories SET subcategory_name = ?, description = ? WHERE subcategory_id = ?';
    const [result] = await pool.execute(sql, [subcategoryName, description, subcategoryId]);
    return { affectedRows: result.affectedRows };
  } catch (error) {
    console.error('Error updating subcategory:', error);
    throw new Error('Failed to update subcategory');
  }
};


// Delete a subcategory by its ID
const deleteSubcategoryService = async (subcategoryId) => {
  try {
    const [result] = await pool.execute('DELETE FROM sub_categories WHERE subcategory_id = ?', [subcategoryId]);
    return { affectedRows: result.affectedRows };
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    throw new Error('Failed to delete subcategory');
  }
};

export { getAllCategoriesService,getAllSubategoriesService, addCategoryService, updateCategoryService, getSubcategoriesByCategoryIdService, addSubcategoryService , updateSubcategoryService,deleteCategoryService, deleteSubcategoryService};
