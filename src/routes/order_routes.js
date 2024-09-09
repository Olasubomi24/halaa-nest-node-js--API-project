import express from 'express';
import { createOrderController, getOrdersByMerchantController, getOrderStatusController, getOrderStatusHistoryController, markOrderAsDeliveredController, orderDetailsController, ordersByCustomerController, updateOrderStatusController } from '../controllers/order_controller/order_controller.js';

const orderRouter = express.Router();

orderRouter.post('/create_order', createOrderController);
orderRouter.get('/order_details/:orderId', orderDetailsController);
orderRouter.post('/update_order_status/:orderId', updateOrderStatusController);
orderRouter.get('/customer_orders/:customerId', ordersByCustomerController);
orderRouter.get('/merchant_orders/:merchantId', getOrdersByMerchantController);
orderRouter.get('/order_status/:orderId', getOrderStatusController);
orderRouter.get('/order_status_history/:orderId', getOrderStatusHistoryController);
orderRouter.post('/delivery_status/:orderId', markOrderAsDeliveredController);

export default orderRouter;
