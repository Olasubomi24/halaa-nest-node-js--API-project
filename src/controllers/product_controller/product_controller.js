import { addProduct, updateProduct, deleteProduct, productList, productDetailsById, getTopProducts, reduceProductQuantity } from "../../services/products_service/product_service.js";
import { StatusCodes } from "http-status-codes";

export const addProductController = async (req, res) => {
  try {
    const {
      categoryId,
      subCategoryId,
      merchantId,
      productName,
      shortProductName,
      productDescription,
      productPrice,
      productModel,
      productColor,
      expiryDate,
      productDiscountPercentage,
      vat,
      productQuantity,
    } = req.body;

    // Retrieve the paths of all uploaded files
    const productPictures = req.files.map(file => file.path); // Use req.files to get an array of files

    const productDetails = await addProduct({
      categoryId,
      subCategoryId,
      merchantId,
      productName,
      shortProductName,
      productDescription,
      productPrice,
      productModel,
      productColor,
      productPictures, // Pass the array of picture paths
      expiryDate,
      productDiscountPercentage,
      vat,
      productQuantity,
    });

    if (productDetails) {
      res.status(StatusCodes.OK).json({
        status_code: 0,
        message: 'Product has been added successfully',
        productDetails,
      });
    } else {
      throw new Error('Cannot add Product');
    }
  } catch (error) {
    console.error(error);

    if (error.message.includes('File not found')) {
      res.status(StatusCodes.OK).json({
        status_code: 1,
        message: error.message,
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status_code: 1,
        message: 'Something went wrong, please try again later',
      });
    }
  }
};





// updateProductController.js
export const updateProductController = async (req, res) => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    const { affectedRows, updatedFields } = await updateProduct(productId, updates);

    if (affectedRows > 0) {
      const message = `${updatedFields.join(', ')} updated successfully`;
      res.status(StatusCodes.OK).json({
        status_code: 0,
        message,
      });
    } else {
      res.status(StatusCodes.OK).json({
        status_code: 1,
        message: 'Product not found or no changes were made',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Something went wrong, please try again later',
    });
  }
};



// deleteProductController

export const deleteProductController = async (req, res) => {
  try {
    const { productId } = req.params;
    const success = await deleteProduct(productId);

    if (success) {
      res.status(StatusCodes.OK).json({
        status_code: 0,
        message: 'Product deleted successfully',
      });
    } else {
      res.status(StatusCodes.OK).json({
        status_code: 1,
        message: 'Product not found or already deleted',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Something went wrong, please try again later',
    });
  }
};



// productListController

export const productListController = async (req, res) => {
  try {
    const products = await productList();

    if (products.length === 0) {
      throw new Error('No products available');
    }

    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Products fetched successfully',
      products,
    });
  } catch (error) {
    console.error('Error:', error);

    let errorMessage = 'Failed to fetch products';
    if (error.message === 'No products available') {
      // Return a JSON response with appropriate error message and status code
      return res.status(StatusCodes.OK).json({
        status_code: 1,
        message: 'No products available',
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Something went wrong, please try again later',
    });
  }
};




export const productDetailsByIdController = async (req, res) => {
  try {
    const { productId } = req.params;

    const productDetails = await productDetailsById(productId);

    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Product details fetched successfully',
      productDetails,
    });
  } catch (error) {
    console.error('Error:', error);
    
    if (error.message === "Product not found in the database") {
      return res.status(StatusCodes.OK).json({
        status_code: 1,
        message: 'Product not found!',
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Something went wrong, please try again later',
    });
  }
};



export const TopProductsController = async (req, res) => {
  try {
    // Get the limit parameter from the request query (default to 5 if not provided)
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;

    // Check if the limit is a valid number
    if (isNaN(limit) || limit <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status_code: 1,
        message: 'Invalid limit parameter. Please provide a valid positive integer.',
      });
    }

    const topProducts = await getTopProducts(limit);

    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Top products fetched successfully',
      topProducts
    });
  } catch (error) {
    console.error('Error:', error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Something went wrong, please try again later',
    });
  }
};



export const reduceProductQuantityController = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const result = await reduceProductQuantity(productId, quantity);
    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: result.message,
      productId: result.productId,
      newQuantity: result.newQuantity,
    });
  } catch (error) {
    console.error('Error reducing product quantity:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: `Failed to reduce product quantity: ${error.message}`,
    });
  }
};