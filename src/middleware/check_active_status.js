// middleware/checkActiveStatus.js

import pool from '../utils/db';
import { StatusCodes } from 'http-status-codes';

const checkActiveStatus = async (req, res, next) => {
  // Check if req.user and req.user.merchantId exist
  if (!req.user || !req.user.merchantId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status_code: 1,
      message: 'Invalid request. Merchant ID is required.',
    });
  }

  const { merchantId } = req.user;

  try {
    const [rows] = await pool.execute(
      'SELECT active_status FROM merchants WHERE id = ?',
      [merchantId]
    );

    if (rows.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status_code: 1,
        message: 'Seller not found',
      });
    }

    const { active_status } = rows[0];

    if (active_status !== 'active') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status_code: 1,
        message: 'Account is deactivated. Access denied.',
      });
    }

    next();
  } catch (error) {
    console.error('Error checking active status:', error);
    return res.status(500).json({
      status_code: 1,
      message: 'Failed to verify account status',
    });
  }
};

export default checkActiveStatus;
