import express from 'express';
import { addItemToCart, clearCartController, listCartItems, removeItemFromCart, updateItemQuantityInCart } from '../controllers/cart_controller/cart_controller.js';

const cartRouter = express.Router();

cartRouter.post('/add_item_to_cart', addItemToCart);
cartRouter.delete('/remove_item_from_cart/:cart_id', removeItemFromCart);
cartRouter.post('/update_item_quantity/:cart_id', updateItemQuantityInCart);
cartRouter.get('/list_cart_items/:user_id', listCartItems);
cartRouter.delete('/clear_cart/:user_id', clearCartController);

export default cartRouter;
