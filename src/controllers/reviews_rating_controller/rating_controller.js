import { StatusCodes } from "http-status-codes";
import { submitRating, fetchAverageRating } from "../../services/review_rating_service/rating_service.js";


export const submitRatingController = async (req, res) => {
  try {
    // const { productId } = req.params;
    const { body } = req;

    await submitRating( body);

      res.status(StatusCodes.OK).json({
          status_code : 0,
          message: 'Rating submitted successfully'
      });
  } catch (error) {
          if (error.message === 'Product or Merchant does not exist') {
      return res.status(StatusCodes.OK).json({
        status_code: 1,
        message: 'Product or Mechant does not exist or has been deleted',
      });
    }
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      status_code:1,
      message: 'Something went wrong, please try again later'
    });
  }
};



export const fetchAverageRatingController = async (req, res) => {
  try {
    const { productId } = req.params;
      const averageRating = await fetchAverageRating(productId);
      
          if (!averageRating || averageRating.averageRating === 0) {
      return res.status(StatusCodes.OK).json({
        status_code: 1,
        message: 'Product or Merchant have no rating',
      });
    }
      res.status(StatusCodes.OK).json({
          status_code: 0,
          message : 'Avearage Rating fetched successfully',
          result: averageRating
      });
  } catch (error) {
    console.error('Error:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          status_code : 1,
          message: 'Something went wrong, please try again later'
      });
  }
};