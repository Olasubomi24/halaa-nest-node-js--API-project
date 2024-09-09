// adminController.js

import { createAdmin, authenticateAdmin } from '../../services/admin_service/admin_login_service.js';
import { StatusCodes } from 'http-status-codes';

export const createAdminController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username, email, and password are provided
    if (!username || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status_code: 1,
        message: 'Username, email, and password are required',
      });
    }

    // Attempt to create the admin
    const adminDetails = await createAdmin(username, email, password);

    // Check if adminId is null, indicating creation failed
    if (adminDetails === null) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status_code: 1,
        message: 'Failed to create admin',
      });
    }

    // Admin created successfully
    res.status(StatusCodes.CREATED).json({
      status_code: 0,
      message: 'Admin created successfully',
      adminDetails,
    });
  } catch (error) {
    // Handle the specific error of duplicate entry
    if (error.message === 'Username or email already exists') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status_code: 1,
        message: 'Username or email already exists',
      });
    }
    // Handle other errors
    console.error('Error creating admin:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Failed to create admin',
    });
  }
};


export const loginAdminController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status_code: 1,
        message: 'Email and password are required',
      });
    }

    // Authenticate the admin
    const admin = await authenticateAdmin(email, password);

    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Admin authenticated successfully',
    });
  } catch (error) {
    console.error('Error authenticating admin:', error);

    // Check specific error messages and respond accordingly
    if (error.message === 'Invalid password') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status_code: 1,
        message: 'Invalid password',
      });
    } else if (error.message === 'Admin not found') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status_code: 1,
        message: 'Admin not found',
      });
    }

    // If the error is not one of the specific cases above, return a generic error message
    res.status(StatusCodes.UNAUTHORIZED).json({
      status_code: 1,
      message: 'Authentication failed',
    });
  }
};
