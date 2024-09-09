
import pool, { beginTransaction, rollbackTransaction } from "../../utils/db.js";

const getOrderItems = async (orderId) => {
  const sql = `
    SELECT 
      oi.order_item_id, 
      oi.order_id, 
      oi.product_id, 
      p.product_name, 
      oi.customer_id, 
      oi.merchant_id, 
      oi.price, 
      oi.ordered_at 
    FROM 
      order_items oi
    JOIN 
      products p 
    ON 
      oi.product_id = p.product_id 
    WHERE 
      oi.order_id = ?
  `;
  const [rows] = await pool.execute(sql, [orderId]);
  return rows;
};



const getOrderSummary = async (orderId) => {
  const sql = `
    SELECT 
      o.order_id,
      o.order_status,
      o.vat,
      o.delivery_fee,
      SUM(oi.price) AS total_amount,
      COUNT(oi.order_item_id) AS order_items_count
    FROM 
      orders o
    JOIN 
      order_items oi 
    ON 
      o.order_id = oi.order_id 
    WHERE 
      o.order_id = ?
    GROUP BY
      o.order_id,
      o.order_status,
      o.vat,
      o.delivery_fee,
      o.order_id
  `;
  const [rows] = await pool.execute(sql, [orderId]);
  return rows[0]; // Assuming there's always one result per orderId
};


export const createOrder = async (body) => {
  const {
    customer_id,
    vat,
    delivery_fee,
    order_items
  } = body;

  const order_status = "pending"; // Set order status to pending
  let total_amount = 0; // Initialize total amount to 0
  let order_items_count = 0; // Initialize order items count to 0

  // Calculate total amount by summing up the prices of all order items
  order_items.forEach(item => {
    total_amount += parseFloat(item.price); // Parse price to number before adding
    order_items_count++;
  });

  const created_at = new Date();
  const updated_at = new Date();

  let connection; // Declare variable to hold the database connection

  try {
    // Start a transaction
    connection = await beginTransaction();

    // Insert main order record
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (customer_id, total_amount, vat, delivery_fee, order_status, created_at, updated_at, order_items_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, total_amount, vat, delivery_fee, order_status, created_at, updated_at, order_items_count]
    );
    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of order_items) {
      const { product_id, merchant_id, price } = item;

      await connection.execute(
        `INSERT INTO order_items (order_id, product_id, customer_id, merchant_id, price, ordered_at) VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, product_id, customer_id, merchant_id, price, created_at]
      );
    }

    // Commit transaction
    await connection.commit();

    return { total_amount, order_items_count };
  } catch (error) {
    // Rollback transaction on error
    if (connection) {
      await rollbackTransaction(connection);
    }
    console.error(error);
    throw new Error('Failed to create order');
  }
};




export const getOrderDetails = async (orderId) => {
  try {
    // Retrieve order details
    const [rows] = await pool.execute(
      `SELECT * FROM orders WHERE order_id = ?`,
      [orderId]
    );

    const orderInfo = rows[0];

    // Retrieve order items using getOrderItems function
    const orderItems = await getOrderItems(orderId);

    // Format order details
    const orderDetails = {
      order_id: orderInfo.order_id,
      customer_id: orderInfo.customer_id,
      total_amount: orderInfo.total_amount,
      vat: orderInfo.vat,
      delivery_fee: orderInfo.delivery_fee,
      order_status: orderInfo.order_status,
      created_at: orderInfo.created_at,
      updated_at: orderInfo.updated_at,
      order_items: orderItems
    };

    return orderDetails;
  } catch (error) {
    // Check if the error is "TypeError: Cannot read properties of undefined"
    if (error instanceof TypeError && error.message.includes('Cannot read properties of undefined')) {
      throw new Error('Order not found');
    }
    console.error(error);
    throw new Error('Failed to fetch order details');
  }
};



export const ordersByCustomer = async (customerId) => {
  try {
    const sql = `
      SELECT 
        DISTINCT order_id 
      FROM 
        order_items 
      WHERE 
        customer_id = ?
    `;
    const [rows] = await pool.execute(sql, [customerId]);

    const orders = [];

    for (const order of rows) {
      const orderSummary = await getOrderSummary(order.order_id);
      const orderItems = await getOrderItems(order.order_id);
      orders.push({ ...orderSummary, orderItems });
    }

    return orders;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch orders for the customer');
  }
};


export const getOrdersByMerchant = async (merchantId) => {
  try {
    // Retrieve orders placed with the specified merchant from the database
    const [rows] = await pool.execute(
      `SELECT * FROM order_items WHERE merchant_id = ?`,
      [merchantId]
    );

    // Return the list of orders
    return rows;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to fetch orders by merchant');
  }
};


export const updateOrderStatus = async (orderId, status) => {

  try {

    const [result] = await pool.execute(
      'UPDATE orders SET order_status = ? WHERE order_id = ?',
      [status, orderId]
    );

    if (result.affectedRows === 0) {
      throw new Error('Order not found');
    }

    await pool.execute(
      'INSERT INTO order_status_history (order_id, status, updated_at) VALUES (?, ?, ?)',
      [orderId, status, new Date()]
    );

    return 'Order status updated successfully';
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update order status');
  } 
};


export const getOrderStatus = async (orderId) => {
  try {

    const [rows] = await pool.execute(
      'SELECT order_status FROM orders WHERE order_id = ?',
      [orderId]
    );

    if (rows.length > 0) {
      return rows[0].order_status;
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to retrieve order status');
  }
};


export const getOrderStatusHistory = async (orderId) => {

  try {

    const [rows] = await pool.execute(
      'SELECT status, updated_at FROM order_status_history WHERE order_id = ? ORDER BY updated_at',
      [orderId]
    );

    return rows;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to retrieve order status history');
  }
};


export const markOrderAsDelivered = async (orderId) => {
  return await updateOrderStatus(orderId, 'Delivered');
};