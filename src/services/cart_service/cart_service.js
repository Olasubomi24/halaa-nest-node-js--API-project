import pool from '../../utils/db.js';

const safeParseJSON = (data) => {
    try {
        return JSON.parse(data);
    } catch (error) {
        // console.error('Safe parse error:', error);
        return {}; // Return an empty object or a default value if parsing fails
    }
};



export const addItem = async (user_id, merchant_id, product_id, quantity) => {
    try {

        const quantityToAdd = Number(quantity);

        // Check if the item already exists in the cart
        const [existingItems] = await pool.execute(
            `SELECT cart_id, quantity FROM cart WHERE user_id = ? AND merchant_id = ? AND product_id = ?`,
            [user_id, merchant_id, product_id]
        );

        if (existingItems.length > 0) {
            // Item exists, update the quantity
            const existingItem = existingItems[0];
            const newQuantity = Number(existingItem.quantity) + quantityToAdd;

            await pool.execute(
                `UPDATE cart SET quantity = ? WHERE cart_id = ?`,
                [newQuantity, existingItem.cart_id]
            );

            return { message: 'Quantity updated successfully', cart_id: existingItem.cart_id }; // Return the existing item's ID
        } else {
            // Item does not exist, insert a new row
            const [result] = await pool.execute(
                `INSERT INTO cart (user_id, merchant_id, product_id, quantity)
                 VALUES (?, ?, ?, ?)`,
                [user_id, merchant_id, product_id, quantityToAdd]
            );

            return { message: 'Item added to cart successfully', cart_id: result.insertId }; // Return the newly inserted item's ID
        }
    } catch (error) {
        console.error('Error adding item to cart:', error);
        throw new Error('Failed to add item to cart');
    }
};


export const removeItem = async (user_id, cart_id) => {
    try {
        const [result] = await pool.execute(
            `DELETE FROM cart WHERE user_id = ? AND cart_id = ?`,
            [user_id, cart_id]
        );
        return {
            message: 'Item removed from cart successfully',
            affectedRows: result.affectedRows,
        };
    } catch (error) {
        console.error('Error removing item from cart:', error);
        throw new Error('Failed to remove item from cart');
    }
};


export const updateItemQuantity = async (user_id, cart_id, quantity) => {
    try {
        const [result] = await pool.execute(
            `UPDATE cart SET quantity = ? WHERE user_id = ? AND cart_id = ?`,
            [quantity, user_id, cart_id]
        );

        return {
            message: 'Item quantity updated successfully',
            affectedRows: result.affectedRows,
        };
    } catch (error) {
        console.error('Error updating item quantity:', error);
        throw new Error('Failed to update item quantity');
    }
};



export const getCartItems = async (user_id) => {
    try {
        const sql = `
      SELECT 
        c.cart_id,
        c.user_id,
        c.product_id,
        c.quantity,
        p.product_name,
        p.product_picture,
        p.product_price
      FROM 
        cart c
      JOIN 
        products p
      ON 
        c.product_id = p.product_id
      WHERE 
        c.user_id = ?
    `;

        const [rows] = await pool.execute(sql, [user_id]);

        // Safely handle product_picture
        const items = rows.map(item => ({
            ...item,
            product_picture: safeParseJSON(item.product_picture),
        }));

        return {
            message: 'Cart items retrieved successfully',
            items,
        };
    } catch (error) {
        console.error('Error retrieving cart items:', error);
        throw new Error('Failed to retrieve cart items');
    }
};




export const clearCart = async (user_id) => {
    try {
        const [result] = await pool.execute(
            `DELETE FROM cart WHERE user_id = ?`,
            [user_id]
        );
        return {
            message: 'Cart cleared successfully',
            affectedRows: result.affectedRows,
        };
    } catch (error) {
        console.error('Error clearing cart:', error);
        throw new Error('Failed to clear cart');
    }
};

