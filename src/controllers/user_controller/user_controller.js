// controllers/userController.js

import { StatusCodes } from "http-status-codes";
import { deleteBillingAddress, registerUser, signIn, updateBillingAddress } from "../../services/user_service/user_service.js";
import { validateEmail } from "../../utils/validation.js";
import { addBillingAddress,getBillingAddresses } from "../../services/user_service/user_service.js";

export const registerUserController = async (req, res) => {
  try {
    const { body } = req;
    const { username, phonenumber, email, password } = body;

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(StatusCodes.OK).json({
        status_code: 1,
        message: 'Invalid email format',
      });
    }

    const userDetails = await registerUser({ username, phonenumber, email, password });

    // Respond with success message
    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'User created successfully',
      ...userDetails,
    });
  } catch (error) {
    console.error('Error:', error);
    // Check if the error is due to email already existing
    if (error.message === 'Email already exists') {
      return res.status(StatusCodes.OK).json({
        status_code: 1,
        message: 'User already exists',
       
      });
    }
    // For other errors, respond with a generic error message
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Failed to create user',
      error: error.message,
    });
  }
};


export const signInController = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { user, isValidPassword } = await signIn(email, password);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status_code: 1,
        message: 'Invalid User or Password'
      });
    }
    if (!isValidPassword) {
      return res.status(StatusCodes.FORBIDDEN).json({
        status_code: 1,
        message: 'Invalid User or Password'
      });
    }
    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Login successful',
      user
    });
  } catch (error) {
    next(error);
  }
};


export const addBillingAddressController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const address_details = req.body;

    const result = await addBillingAddress(userId, address_details);
    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Billing Address updated sucessfully',
      billingAddressId: result.billingAddressId
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: error.message
    });
  }
};


export const getBillingAddressesController = async (req, res) => {
  try {
    const userId = req.params.userId;

    const addresses = await getBillingAddresses(userId);
    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Address Fetched Successfully',
      addresses
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: error.message
    });
  }
};


export const updateBillingAddressController = async (req, res) => {
  try {
    const billingAddressId = req.params.billingAddressId;
    const address = req.body;

    const result = await updateBillingAddress(billingAddressId, address);
    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Billing Address Updated Successfully'
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: error.message
    });
  }
};

// Controller to delete a billing address
export const deleteBillingAddressController = async (req, res) => {
  try {
    const billingAddressId = req.params.billingAddressId;

    const result = await deleteBillingAddress(billingAddressId);
    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Billing Address Deleted Successfully'
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: error.message
    });
  }
};


