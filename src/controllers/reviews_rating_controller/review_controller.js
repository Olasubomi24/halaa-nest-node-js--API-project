import { StatusCodes } from "http-status-codes";
import { submitReview, fetchReviews } from "../../services/review_rating_service/review_service.js";


export const submitReviewController = async (req, res) => {
  try {
    const { body } = req;

    await submitReview(body);

    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Review submitted successfully',
    });
  } catch (error) {
    console.error('Error:', error);

    if (error.message === 'Product or Merchant does not exist') {
      return res.status(StatusCodes.OK).json({
        status_code: 1,
        message: 'Product or Mechant does not exist or has been deleted',
      });
    }

    // If the error is not related to the product ID not existing, return a generic error response
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Something went wrong, please try again later',
    });
  }
};



export const fetchReviewsController = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await fetchReviews(productId);

    // Check if reviews is empty, indicating that there are no reviews for the product
    if (!reviews || reviews.length === 0) {
      return res.status(StatusCodes.OK).json({
        status_code: 1,
        message: 'Product or Merchant have no review',
      });
    }

    res.status(StatusCodes.OK).json({
      status_code: 0,
      message: 'Reviews fetched successfully',
      reviews,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: 1,
      message: 'Something went wrong, please try again later',
    });
  }
};
