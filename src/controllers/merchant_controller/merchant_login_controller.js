import { StatusCodes } from 'http-status-codes';
import { merchantLoginService } from '../../services/merchant_service/merchant_login_service.js';

export const merchantLoginController = {
  async login(req, res, next) {
    const { zippy_wallet_number, pin } = req.body;

    try {
      // Call the login method from loginService
      const result = await merchantLoginService.login(zippy_wallet_number, pin);

      // Return appropriate response based on the result
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      // Handle errors and return appropriate response
      let status_code;
      let message;

      if (error.message === 'Merchant not found' || error.message === 'Invalid PIN') {
        status_code = 1;
        message = 'Incorrect wallet_number or PIN';
      } else if (error.message.includes('bcrypt') || error.message.includes('pool')) {
        // Check for errors related to bcrypt or database pool
        status_code = 500;
        message = 'Error during login. Please try again later.';
      } else {
        // Return the original error for unexpected cases
        console.error(error);
        status_code = 500;
        message = error.message;
      }

      // Return error response with informative message
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status_code,
        message,
      });
    }
  },
};
