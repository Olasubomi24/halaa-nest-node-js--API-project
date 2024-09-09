import { addHalalItem, updateHalalItem, deleteHalalItem, halalItemList, halalItemDetailsById,ListOfItemOnHalanest} from "../../services/halal_item_service/halal_item_service.js";
import { StatusCodes } from "http-status-codes";

export const addHalalItemController = async (req, res) => {
    try {
      const {   halal_id, halal_nest_item_name,} = req.body;
  
      // Add validation to ensure all required fields are provided
      if (!halal_id || !halal_nest_item_name ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status_code: 1,
          message: 'Missing required fields: halal_id and halal_nest_item_name',
        });
      }
  
      const HalalItemDetails = await addHalalItem({
        halal_id,
        halal_nest_item_name,
      });
  
      if (HalalItemDetails) {
        res.status(StatusCodes.OK).json({
          status_code: 0,
          message: 'HalalItem has been added successfully',
          HalalItems: HalalItemDetails, // Fixed key from result.HalalItemDetails to HalalItemDetails
        });
      } else {
        throw new Error('Cannot add HalalItem');
      }
    } catch (error) {
      console.error('Error in addHalalItemController:', error);
  
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

export const updateHalalItemController = async (req, res) => {
    try {
      const { HalalItemId } = req.params;
      const updates = req.body;
  
      const { affectedRows, updatedFields } = await updateHalalItem(HalalItemId, updates);
  
      if (affectedRows > 0) {
        const message = `${updatedFields.join(', ')} updated successfully`;
        res.status(StatusCodes.OK).json({
          status_code: 0,
          message,
        });
      } else {
        res.status(StatusCodes.OK).json({
          status_code: 1,
          message: 'HalalItem not found or no changes were made',
        });
      }
    } catch (error) {
      console.error('Error in updateHalalItemController:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status_code: 1,
        message: 'Something went wrong, please try again later',
      });
    }
  };
  



// deleteProductController

export const deleteHalalItemController = async (req, res) => {
    try {
      const { HalalItemId } = req.params;
      const success = await deleteHalalItem(HalalItemId);
  
      if (success) {
        res.status(StatusCodes.OK).json({
          status_code: 0,
          message: 'HalalItem deleted successfully',
        });
      } else {
        res.status(StatusCodes.OK).json({
          status_code: 1,
          message: 'HalalItem not found or already deleted',
        });
      }
    } catch (error) {
      console.error('Error in deleteHalalItemController:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status_code: 1,
        message: 'Something went wrong, please try again later',
      });
    }
  };
  



// productListController

export const halalItemListController = async (req, res) => {
    try {
      const HalalItems = await halalItemList();
  
      if (HalalItems.length === 0) {
        return res.status(StatusCodes.OK).json({
          status_code: 1,
          message: 'No HalalItems available',
        });
      }
  
      res.status(StatusCodes.OK).json({
        status_code: 0,
        message: 'HalalItems fetched successfully',
        HalalItems,
      });
    } catch (error) {
      console.error('Error in HalalItemListController:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status_code: 1,
        message: 'Something went wrong, please try again later',
      });
    }
  };

  export const ListOfHalalItemController = async (req, res) => {
    try {
      const HalalItems = await ListOfItemOnHalanest();
  
      if (HalalItems.length === 0) {
        return res.status(StatusCodes.OK).json({
          status_code: 1,
          message: 'No HalalItems available',
        });
      }
  
      res.status(StatusCodes.OK).json({
        status_code: 0,
        message: 'HalalItems fetched successfully',
        HalalItems,
      });
    } catch (error) {
      console.error('Error in HalalItemListController:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status_code: 1,
        message: 'Something went wrong, please try again later',
      });
    }
  };
  



  export const halalItemDetailsByIdController = async (req, res) => {
    try {
      const { HalalItemId } = req.params;
  
      // Log HalalItemId for debugging
      console.log('HalalItemId:', HalalItemId);
  
      // Check if HalalItemId is undefined or null
      if (!HalalItemId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status_code: 1,
          message: 'HalalItemId is required.',
        });
      }
  
      const HalalItemDetails = await halalItemDetailsById(HalalItemId);
  
      res.status(StatusCodes.OK).json({
        status_code: 0,
        message: 'HalalItem details fetched successfully',
        HalalItemDetails,
      });
    } catch (error) {
      console.error('Error in HalalItemDetailsByIdController:', error);
  
      if (error.message === "HalalItem not found in the database") {
        return res.status(StatusCodes.OK).json({
          status_code: 1,
          message: 'HalalItem not found!',
        });
      }
  
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status_code: 1,
        message: 'Something went wrong, please try again later',
      });
    }
  };
  
  



