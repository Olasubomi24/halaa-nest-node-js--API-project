import { confirmMerchantRegistration, displayMerchantDetails, checkMerchantExists, fetchAllMerchants, deactivateMerchant, activateMerchant } from "../../services/merchant_service/merchant_service.js";
import { StatusCodes } from "http-status-codes";


export const confirmMerchantRegistrationController = async (req, res) => {
  try {
    const { body } = req;
    const { status, zippy_wallet_number, ...merchantDetails } = body;

    // Check if zippy_wallet_number is provided
    if (!zippy_wallet_number) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status_code: 1,
        message: 'Zippy wallet number is required',
      });
    }

    // Check if merchant already exists
    const merchantId = await checkMerchantExists(zippy_wallet_number);
    if (merchantId) {
      return res.status(StatusCodes.OK).json({
        status_code: 1,
        message: 'Merchant already has an account',
        merchantId
      });
    }

    // If status is 1, cancel without saving to the database
    if (status === 1) {
      return res.status(StatusCodes.OK).json({
        status_code: 1,
        message: 'Registration not completed',
      });
    }

    // If status is 0 and merchant does not exist, proceed with registration
    const result = await confirmMerchantRegistration({ zippy_wallet_number, status, ...merchantDetails });

    return res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Registration successful',
      merchantDetails: result, // Wrap the result in an array
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      error: "Something went wrong, please try again later",
    });
  }
};



export const displayMerchantDetailsController = async (req, res) => {
  try {
    const { body } = req;

    const merchantDetails = await displayMerchantDetails(body);

    return res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Merchant details fetched successfully',
      ...merchantDetails,
    });
  } catch (error) {
    console.error("Error:", error);

    if (error.message.includes("Merchant does not have a ZippyWorld account, kindly register on zippworld")) {
      return res.status(StatusCodes.OK).json({
        status_code: 1,
        message: "Merchant does not have a zippyWorld account, kindly register on zippworld!",
      });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status_code: 1,
        message: "Something went wrong, please try again later",
      });
    }
  }
};

export const getAllMerchantController = async (req, res) => {
  try {
    const sellers = await fetchAllMerchants();
    return res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Merchants fetched successfully',
      sellers,
    });
  } catch (error) {
    console.error('Error fetching sellers:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Failed to fetch sellers',
    });
  }
};

export const deactivateSellerController = async (req, res) => {
  const { merchantId } = req.params;

  try {
    const result = await deactivateMerchant(merchantId);
    return res.status(StatusCodes.OK).json({
      status_code: 0,
      message: result.message,
    });
  } catch (error) {
    console.error('Error deactivating seller:', error);
    
    // Check if the error message indicates that the seller has already been deactivated
    if (error.message === 'Seller has already been deactivated') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status_code: 1,
        message: 'Seller has already been deactivated',
      });
    }

    // For any other errors, respond with a generic error message
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Failed to deactivate seller',
    });
  }
};

export const activateSellerController = async (req, res) => {
  const { merchantId } = req.params;

  try {
    const result = await activateMerchant(merchantId);
    return res.status(StatusCodes.OK).json({
      status_code: 0,
      message: result.message,
    });
  } catch (error) {
    console.error('Error activating seller:', error);

    // Check for specific error messages
    if (error.message === 'Seller is already active') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status_code: 1,
        message: 'Seller is already active',
      });
    } else if (error.message === 'Seller not found') {
      return res.status(StatusCodes.NOT_FOUND).json({
        status_code: 1,
        message: 'Seller not found',
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Failed to activate seller',
    });
  }
};







