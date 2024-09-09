import { customerOrder } from "../../services/order_service/customer_order";


export const CustomerOrderController = async (req, res) => {
  try {
    const { body } = req;
    const { orderId, transactionId } = await customerOrder(body);

    res.status(StatusCodes.CREATED).json({
      status_code: 0,
      message: 'Customer order created successfully',
      orderId,
      transactionId,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      error: 'Failed to create customer order',
    });
  }
};