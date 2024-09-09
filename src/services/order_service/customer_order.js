// order_service.js
import pool from "../../utils/db";
import { generateTransactionalId } from "../../utils/transaction_id";

export const customerOrder = async (body) => {
  const {
    customerId,
    deliveryAddress,
    Vat,
    itemsCount,
    paymentMethod,
    orderDetailsArray,
  } = body;

  const transactionId = generateTransactionalId(); 
  
  const orderDetailsJson = JSON.stringify(orderDetailsArray);

  const sql = `
    INSERT INTO customer_orders 
      (transaction_id, customer_id, delivery_address, vat, items_count, payment_method, order_details)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    transactionId,
    customerId,
    deliveryAddress,
    Vat,
    itemsCount,
    paymentMethod,
    orderDetailsJson,
  ];

  try {
    const [results] = await pool.execute(sql, values);

    return { orderId: results.insertId, transactionId };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create customer order');
  }
};
