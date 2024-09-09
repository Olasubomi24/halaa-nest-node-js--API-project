import express from 'express';
import * as categoriesController from '../controllers/categories_controller/categories_controller.js';

const categoryRouter = express.Router();

categoryRouter.get('/all_categories', categoriesController.getAllCategoriesController);
categoryRouter.get('/all_subcategories', categoriesController.getAllSubcategoriesController);
categoryRouter.post('/delete_categories/:categoryId', categoriesController.deleteCategoryController);
categoryRouter.post('/delete_subcategories/:subcategoryId', categoriesController.deleteSubcategoryController);
categoryRouter.post('/add_categories', categoriesController.addCategoryController);
categoryRouter.post('/update_categories/:categoryId', categoriesController.updateCategoryController);
categoryRouter.get('/subcategories/:categoryId', categoriesController.getSubcategoriesByCategoryIdController);
categoryRouter.post('/update_subcategories/:subcategoryId', categoriesController.updateSubcategoryController);
categoryRouter.post('/add_subcategories', categoriesController.addSubcategoryController);

export default categoryRouter;
