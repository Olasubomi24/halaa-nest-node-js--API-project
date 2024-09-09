import { addQuote, updateQuote, deleteQuote, quoteList, quoteDetailsById} from "../../services/quote_service/quote_service.js";
import { StatusCodes } from "http-status-codes";

export const addQuoteController = async (req, res) => {
    try {
      const { quote_header, quote_title, quote_content } = req.body;
  
      // Add validation to ensure all required fields are provided
      if (!quote_header || !quote_title || !quote_content) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status_code: 1,
          message: 'Missing required fields: quote_header, quote_title, or quote_content',
        });
      }
  
      const quoteDetails = await addQuote({
        quote_header,
        quote_title,
        quote_content,
      });
  
      if (quoteDetails) {
        res.status(StatusCodes.OK).json({
          status_code: 0,
          message: 'Quote has been added successfully',
          quotes: quoteDetails, // Fixed key from result.quoteDetails to quoteDetails
        });
      } else {
        throw new Error('Cannot add quote');
      }
    } catch (error) {
      console.error('Error in addQuoteController:', error);
  
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

export const updateQuoteController = async (req, res) => {
    try {
      const { quoteId } = req.params;
      const updates = req.body;
  
      const { affectedRows, updatedFields } = await updateQuote(quoteId, updates);
  
      if (affectedRows > 0) {
        const message = `${updatedFields.join(', ')} updated successfully`;
        res.status(StatusCodes.OK).json({
          status_code: 0,
          message,
        });
      } else {
        res.status(StatusCodes.OK).json({
          status_code: 1,
          message: 'Quote not found or no changes were made',
        });
      }
    } catch (error) {
      console.error('Error in updateQuoteController:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status_code: 1,
        message: 'Something went wrong, please try again later',
      });
    }
  };
  



// deleteProductController

export const deleteQuoteController = async (req, res) => {
    try {
      const { quoteId } = req.params;
      const success = await deleteQuote(quoteId);
  
      if (success) {
        res.status(StatusCodes.OK).json({
          status_code: 0,
          message: 'Quote deleted successfully',
        });
      } else {
        res.status(StatusCodes.OK).json({
          status_code: 1,
          message: 'Quote not found or already deleted',
        });
      }
    } catch (error) {
      console.error('Error in deleteQuoteController:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status_code: 1,
        message: 'Something went wrong, please try again later',
      });
    }
  };
  



// productListController

export const quoteListController = async (req, res) => {
    try {
      const quotes = await quoteList();
  
      if (quotes.length === 0) {
        return res.status(StatusCodes.OK).json({
          status_code: 1,
          message: 'No quotes available',
        });
      }
  
      res.status(StatusCodes.OK).json({
        status_code: 0,
        message: 'Quotes fetched successfully',
        quotes,
      });
    } catch (error) {
      console.error('Error in quoteListController:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status_code: 1,
        message: 'Something went wrong, please try again later',
      });
    }
  };
  



  export const quoteDetailsByIdController = async (req, res) => {
    try {
      const { quoteId } = req.params;
  
      const quoteDetails = await quoteDetailsById(quoteId);
  
      res.status(StatusCodes.OK).json({
        status_code: 0,
        message: 'Quote details fetched successfully',
        quoteDetails,
      });
    } catch (error) {
      console.error('Error in quoteDetailsByIdController:', error);
  
      if (error.message === "quote not found in the database") {
        return res.status(StatusCodes.OK).json({
          status_code: 1,
          message: 'Quote not found!',
        });
      }
  
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status_code: 1,
        message: 'Something went wrong, please try again later',
      });
    }
  };
  



