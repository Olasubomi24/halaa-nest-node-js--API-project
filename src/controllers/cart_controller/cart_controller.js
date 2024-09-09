import { StatusCodes } from 'http-status-codes';
import { addItem, clearCart, getCartItems, removeItem, updateItemQuantity } from '../../services/cart_service/cart_service.js';

export const addItemToCart = async (req, res) => {
    try {
        const { user_id, product_id, merchant_id, quantity } = req.body;

        const result = await addItem(user_id, merchant_id, product_id, quantity);

        res.status(StatusCodes.OK).json({
            status_code: 0,
            message: result.message,
            cart_id: result.cart_id
        });
    } catch (error) {
        console.error("Error adding item to cart:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status_code: 1,
            message: error.message
        });
    }
};


export const removeItemFromCart = async (req, res) => {
    try {
        const { user_id } = req.body;
        const { cart_id } = req.params;


        const result = await removeItem(user_id, cart_id);

        if (result.affectedRows > 0) {
            res.status(StatusCodes.OK).json({
                status_code: 0,
                message: result.message
            });
        } else {
            res.status(StatusCodes.OK).json({
                status_code: 1,
                message: 'Item not found in cart'
            });
        }
    } catch (error) {
        console.error("Error removing item from cart:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status_code: 1,
            message: error.message
        });
    }
};


export const updateItemQuantityInCart = async (req, res) => {
    try {
        const { user_id, quantity } = req.body;
        const { cart_id } = req.params;

        // Check if all required fields are present in the request body
        if (!user_id || !cart_id || quantity === undefined) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status_code: 1,
                message: 'Missing required fields in the request'
            });
        }

        const result = await updateItemQuantity(user_id, cart_id, quantity);

        if (result.affectedRows > 0) {
            res.status(StatusCodes.OK).json({
                status_code: 0,
                message: result.message
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status_code: 1,
                message: 'Item not found in cart'
            });
        }
    } catch (error) {
        console.error("Error updating item quantity in cart:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status_code: 1,
            message: error.message
        });
    }
};


export const listCartItems = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Check if user_id is present in the request parameters
        if (!user_id) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status_code: 1,
                message: 'Missing required parameter: user_id'
            });
        }

        const result = await getCartItems(user_id);

        res.status(StatusCodes.OK).json({
            status_code: 0,
            message: result.message,
            items: result.items
        });
    } catch (error) {
        console.error("Error listing cart items:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status_code: 1,
            message: error.message
        });
    }
};


export const clearCartController = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status_code: 1,
                message: 'Missing required parameter: user_id'
            });
        }

        const result = await clearCart(user_id);

        if (result.affectedRows > 0) {
            res.status(StatusCodes.OK).json({
                status_code: 0,
                message: result.message
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status_code: 1,
                message: 'No items found in cart to clear'
            });
        }
    } catch (error) {
        console.error("Error clearing cart:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status_code: 1,
            message: error.message
        });
    }
};