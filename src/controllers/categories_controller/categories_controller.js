// categoriesController.js
import { getAllCategoriesService,addCategoryService, getSubcategoriesByCategoryIdService, addSubcategoryService , updateCategoryService, updateSubcategoryService, deleteCategoryService, deleteSubcategoryService, getAllSubategoriesService} from '../../services/categories_service/categories_service.js';
import { StatusCodes } from 'http-status-codes';

const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await getAllCategoriesService();
    res.status(StatusCodes.OK).json(categories);
  } catch (error) {
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code:1,
      message: 'Something went wrong, please try again later',
    });
  }
};


const getAllSubcategoriesController = async (req, res) => {
  try {
    const sub_categories = await getAllSubategoriesService();
    res.status(StatusCodes.OK).json(sub_categories);
  } catch (error) {
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code:1,
      message: 'Something went wrong, please try again later',
    });
  }
};

const addCategoryController = async (req, res) => {
  try {
    const { categoryName, description } = req.body;
    const categoryId = await addCategoryService(categoryName, description);
    res.status(StatusCodes.OK).json({
     status_code: 0,
      message: "Category Successfully Added",
      categoryId
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Something went wrong, please try again later',
    });
  }
};


const updateCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { categoryName, description } = req.body;
    
    const result = await updateCategoryService(categoryId, categoryName, description);
    
    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Category updated successfully',
      
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Something went wrong, please try again later',
    });
  }
};


// Delete a category and its subcategories
const deleteCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const result = await deleteCategoryService(categoryId);

    let status_code = 0; 
    if (result.message !== 'Category and its subcategories deleted successfully') {
      status_code = 1; 
    }

    res.status(StatusCodes.OK).json({
      status_code: status_code,
      message: result.message
    });
  } catch (error) {
    console.error('Error:', error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Something went wrong, please try again later',
    });
  }
};




const getSubcategoriesByCategoryIdController = async (req, res) => {
  try {
    const { categoryId } = req.params; 
    const subcategories = await getSubcategoriesByCategoryIdService(categoryId); 
    res.status(StatusCodes.OK).json(subcategories);
  } catch (error) {
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Something went wrong, please try again later',
    });
  }
};



const addSubcategoryController = async (req, res) => {
  try {
    const { subcategoryName, description, categoryId } = req.body;
    const subcategoryId = await addSubcategoryService({ subcategoryName, description, categoryId }); 
    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: "SubCategory Successfully Added",
      
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code:1,
      message: 'Something went wrong, please try again later',
    });
  }
};


const updateSubcategoryController = async (req, res) => {
  try {
    const { subcategoryId } = req.params; 
    const { subcategoryName, description } = req.body; 

    const result = await updateSubcategoryService({ subcategoryName, description, subcategoryId });

    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Subcategory updated successfully',
  
    });
  } catch (error) {
    console.error('Error:', error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Something went wrong, please try again later',
    });
  }
};


// Delete a subcategory by its ID
const deleteSubcategoryController = async (req, res) => {
  try {
    const { subcategoryId } = req.params;

    const result = await deleteSubcategoryService(subcategoryId);

    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Subcategory deleted successfully',
    });
  } catch (error) {
    console.error('Error:', error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Something went wrong, please try again later',
    });
  }
};



export { getAllCategoriesController,getAllSubcategoriesController, addCategoryController, updateCategoryController,getSubcategoriesByCategoryIdController, addSubcategoryController, updateSubcategoryController, deleteCategoryController, deleteSubcategoryController};
