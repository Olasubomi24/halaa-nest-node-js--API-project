// order_controller.js

import { createOrder, getOrderDetails, ordersByCustomer, updateOrderStatus, getOrdersByMerchant, getOrderStatus, getOrderStatusHistory, markOrderAsDelivered} from "../../services/order_service/order_service.js";
import { StatusCodes } from "http-status-codes";


export const createOrderController = async (req, res) => {
  try {
    const { body } = req;
    const orderDetails = await createOrder(body);

    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Order created successfully',
      orderDetails
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      error: 'Failed to create order'
    });
  }
};



export const orderDetailsController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderDetails = await getOrderDetails(orderId);

    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Order details fetched successfully',
      orderDetails
    });
  } catch (error) {
    if (error.message.includes('Order not found')) {
      return res.status(StatusCodes.OK).json({
        status_code: 1,
        message: 'Order details not found'
      });
    }

    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      error: 'Failed to fetch order details'
    });
  }
};




export const ordersByCustomerController = async (req, res) => {
  try {
    const { customerId } = req.params;
    const orders = await ordersByCustomer(customerId);

    // Check if no orders found for the customer
    if (!orders || orders.length === 0) {
      return res.status(StatusCodes.OK).json({
        status_code: 1,
        message: 'Customer has no Order History'
      });
    }

    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Orders fetched successfully',
      orders,
    });
  } catch (error) {
    // Handle other errors
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      error: error.message || 'Failed to fetch orders for the customer',
    });
  }
};


export const getOrdersByMerchantController = async (req, res) => {
  try {
    const { merchantId } = req.params;

    // Retrieve orders by merchant ID from the service layer
    const orders = await getOrdersByMerchant(merchantId);

    // Send a success response with the list of orders
    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Orders fetched successfully',
      orders,
    });
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      error: 'Failed to fetch orders by merchant',
    });
  }
};


export const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate request body
    if (!status) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status_code: 1,
        error: 'Status field is required'
      });
    }

    // Update order status
    const message = await updateOrderStatus(orderId, status);

    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: message
    });
  } catch (error) {
    if (error.message === 'Order not found') {
      return res.status(StatusCodes.NOT_FOUND).json({
        status_code: 1,
        error: 'Order not found'
      });
    }
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      error: 'Failed to update order status'
    });
  }
};


export const getOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
  
    const order_status = await getOrderStatus(orderId);

    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Order Status Fetched successfully',
      order_status
    });
  } catch (error) {
    if (error.message === 'Order not found') {
      return res.status(StatusCodes.NOT_FOUND).json({
        status_code: 1,
        error: 'Order not found'
      });
    }
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      error: 'Failed to get order status'
    });
  }
};


export const getOrderStatusHistoryController = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order_history = await getOrderStatusHistory(orderId);

    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Order History Fetched successfully',
      order_history
    });
  } catch (error) {
    if (error.message === 'Order not found') {
      return res.status(StatusCodes.NOT_FOUND).json({
        status_code: 1,
        error: 'Order not found'
      });
    }
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      error: 'Failed to get order status'
    });
  }
};


export const markOrderAsDeliveredController = async (req, res) => {
  try {
    const { orderId } = req.params;

    // const DeliveryStatus = await markOrderAsDelivered(orderId);

    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Order has been delivered successfully',
      
    });
  } catch (error) {
    if (error.message === 'Order not found') {
      return res.status(StatusCodes.NOT_FOUND).json({
        status_code: 1,
        error: 'Order not found'
      });
    }
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      error: 'Failed to get order status'
    });
  }
};


