import { addEndosment, updateEndosment, deleteEndosment, endosmentList, endosmentDetailsById} from "../../services/endosment_service/endosment_service.js";
import { StatusCodes } from "http-status-codes";

export const addEndosmentController = async (req, res) => {
    try {
      const { school_id, name, story, } = req.body;
  
      // Add validation to ensure all required fields are provided
      if (!school_id || !name || !story) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status_code: 1,
          message: 'Missing required fields: story, name, or school name',
        });
      }
  
      const EndosmentDetails = await addEndosment({
        school_id,
        name,
        story,
      });
  
      if (EndosmentDetails) {
        res.status(StatusCodes.OK).json({
          status_code: 0,
          message: 'Endosment has been added successfully',
          Endosments: EndosmentDetails, // Fixed key from result.EndosmentDetails to EndosmentDetails
        });
      } else {
        throw new Error('Cannot add Endosment');
      }
    } catch (error) {
      console.error('Error in addEndosmentController:', error);
  
      if (error.message.includes('File not found')) {
        res.status(StatusCodes.OK).json({
          status_code: 1,
          message: error.message,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          status_code: 1,
          message: 'Something went wrong, please try again later',
        });
      }
    }
  };




// updateProductController.js

export const updateEndosmentController = async (req, res) => {
    try {
      const { EndosmentId } = req.params;
      const updates = req.body;
  
      const { affectedRows, updatedFields } = await updateEndosment(EndosmentId, updates);
  
      if (affectedRows > 0) {
        const message = `${updatedFields.join(', ')} updated successfully`;
        res.status(StatusCodes.OK).json({
          status_code: 0,
          message,
        });
      } else {
        res.status(StatusCodes.OK).json({
          status_code: 1,
          message: 'Endosment not found or no changes were made',
        });
      }
    } catch (error) {
      console.error('Error in updateEndosmentController:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status_code: 1,
        message: 'Something went wrong, please try again later',
      });
    }
  };
  



// deleteProductController

export const deleteEndosmentController = async (req, res) => {
    try {
      const { EndosmentId } = req.params;
      const success = await deleteEndosment(EndosmentId);
  
      if (success) {
        res.status(StatusCodes.OK).json({
          status_code: 0,
          message: 'Endosment deleted successfully',
        });
      } else {
        res.status(StatusCodes.OK).json({
          status_code: 1,
          message: 'Endosment not found or already deleted',
        });
      }
    } catch (error) {
      console.error('Error in deleteEndosmentController:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status_code: 1,
        message: 'Something went wrong, please try again later',
      });
    }
  };
  



// productListController

export const endosmentListController = async (req, res) => {
    try {
      const Endosments = await endosmentList();
  
      if (Endosments.length === 0) {
        return res.status(StatusCodes.OK).json({
          status_code: 1,
          message: 'No Endosments available',
        });
      }
  
      res.status(StatusCodes.OK).json({
        status_code: 0,
        message: 'Endosments fetched successfully',
        Endosments,
      });
    } catch (error) {
      console.error('Error in EndosmentListController:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status_code: 1,
        message: 'Something went wrong, please try again later',
      });
    }
  };
  



  export const endosmentDetailsByIdController = async (req, res) => {
    try {
      const { schoolId } = req.params;
  
      // Log EndosmentId for debugging
      console.log('EndosmentId:', schoolId);
  
      // Check if EndosmentId is undefined or null
      if (!schoolId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status_code: 1,
          message: 'EndosmentId is required.',
        });
      }
  
      const EndosmentDetails = await endosmentDetailsById(schoolId);
  
      res.status(StatusCodes.OK).json({
        status_code: 0,
        message: 'Endosment details fetched successfully',
        EndosmentDetails,
      });
    } catch (error) {
      console.error('Error in EndosmentDetailsByIdController:', error);
  
      if (error.message === "Endosment not found in the database") {
        return res.status(StatusCodes.OK).json({
          status_code: 1,
          message: 'Endosment not found!',
        });
      }
  
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status_code: 1,
        message: 'Something went wrong, please try again later',
      });
    }
  };
  
  



