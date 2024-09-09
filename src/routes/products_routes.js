import express from 'express';
import { addProductController, updateProductController, deleteProductController, productListController, productDetailsByIdController, TopProductsController } from '../controllers/product_controller/product_controller.js';
import { reduceProductQuantity } from '../services/products_service/product_service.js';
import upload from '../middleware/muttlerMiddleware.js';

const productsRouter = express.Router();



productsRouter.post('/add_product', upload.array('productPictures', 10), addProductController);
productsRouter.post('/update_product/:productId', updateProductController);
productsRouter.post('/delete_product/:productId', deleteProductController);
productsRouter.get('/products_list', productListController);
productsRouter.get('/product_details/:productId', productDetailsByIdController);
productsRouter.get('/top_products', TopProductsController);
productsRouter.post('/reduce_products_quantity', reduceProductQuantity);

export default productsRouter;
