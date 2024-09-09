import express from 'express';
import { submitReviewController, fetchReviewsController } from '../controllers/reviews_rating_controller/review_controller.js';


const reviewsRouter = express.Router();

reviewsRouter.post('/submit_review', submitReviewController);
reviewsRouter.get('/fetch_review/:productId', fetchReviewsController);


export default reviewsRouter;
