import pool from "../../utils/db.js";

export const getMerchantOrderStats = async (merchantId, startDate = null, endDate = null) => {
    try {
        console.log('merchantId:', merchantId, 'startDate:', startDate, 'endDate:', endDate);

        // Base query
        let query = `
            SELECT 
                COUNT(DISTINCT customer_id) AS total_customers,
                COUNT(order_item_id) AS total_orders,
                SUM(price) AS total_amount,
                AVG(price) AS average_amount,
                COUNT(DISTINCT CASE WHEN MONTH(ordered_at) = MONTH(CURRENT_DATE()) AND YEAR(ordered_at) = YEAR(CURRENT_DATE()) THEN customer_id END) AS total_customers_month,
                COUNT(CASE WHEN MONTH(ordered_at) = MONTH(CURRENT_DATE()) AND YEAR(ordered_at) = YEAR(CURRENT_DATE()) THEN order_item_id END) AS total_orders_month,
                SUM(CASE WHEN MONTH(ordered_at) = MONTH(CURRENT_DATE()) AND YEAR(ordered_at) = YEAR(CURRENT_DATE()) THEN price END) AS total_amount_month,
                AVG(CASE WHEN MONTH(ordered_at) = MONTH(CURRENT_DATE()) AND YEAR(ordered_at) = YEAR(CURRENT_DATE()) THEN price END) AS average_amount_month
            FROM order_items 
            WHERE merchant_id = ?
        `;

        // Add date filtering if startDate and endDate are provided
        if (startDate && endDate) {
            query += ` AND ordered_at BETWEEN ? AND ?`;
        }

        // Execute query with appropriate parameters
        const params = startDate && endDate ? [merchantId, startDate, endDate] : [merchantId];
        const [result] = await pool.execute(query, params);

        const stats = {
            total_customers: result[0].total_customers,
            total_orders: result[0].total_orders,
            total_amount: result[0].total_amount,
            average_amount: result[0].average_amount,
            total_customers_month: result[0].total_customers_month,
            total_orders_month: result[0].total_orders_month,
            total_amount_month: result[0].total_amount_month,
            average_amount_month: result[0].average_amount_month
        };

        return stats;
    } catch (error) {
        console.error('Error fetching merchant order stats:', error);
        throw new Error('Failed to fetch merchant order stats');
    }
};


export const getProductsByMerchant = async (merchantId) => {
    try {
        const [rows] = await pool.execute(
            `SELECT * FROM products WHERE merchant_id = ?`,
            [merchantId]
        );

        return rows;
    } catch (error) {
        console.error('Error fetching products by merchant:', error);
        throw new Error('Failed to fetch products by merchant');
    }
};


export const getTopSellingProductsByMerchant = async (merchantId) => {
    try {
        const query = `
            SELECT 
                product_id,
                COUNT(product_id) AS total_sales
            FROM order_items
            WHERE merchant_id = ?
            GROUP BY product_id
            ORDER BY total_sales DESC;
        `;


        const [results] = await pool.execute(query, [merchantId]);

        const topSellingProducts = results.map(result => ({
            product_id: result.product_id,
            total_sales: result.total_sales
        }));

        return topSellingProducts;
    } catch (error) {
        console.error('Error fetching top-selling products by merchant:', error);
        throw new Error('Failed to fetch top-selling products by merchant');
    }
};


export const getProductsBelowStockThreshold = async (merchantId, threshold) => {
    try {
        
        const query = `
            SELECT 
                product_id,
                product_quantity
            FROM products
            WHERE merchant_id = ? AND product_quantity < ?
            ORDER BY product_quantity ASC;
        `;

        // Execute the query
        const [results] = await pool.execute(query, [merchantId, threshold]);

        // Process the results
        const productsBelowThreshold = results.map(result => ({
            product_id: result.product_id,
            quantity: result.product_quantity
        }));

        return productsBelowThreshold;
    } catch (error) {
        console.error('Error fetching products below stock threshold:', error);
        throw new Error('Failed to fetch products below stock threshold');
    }
};